import api from '@/lib/axios';
import { uploadImage } from '@/lib/cloudinary';
import { Profile, User } from '@/types/user'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { error } from 'console';
import { Cross } from 'lucide-react';
import React, { SetStateAction, useEffect, useState } from 'react'

interface Props {
    user: User,
    setCloseModel: React.Dispatch<SetStateAction<boolean>>
}


interface CitySuggestion {
    properties: {
        osm_id: number;
        name: string;
        city?: string;
        state?: string;
        country?: string;
    };
    geometry: {
        coordinates: [number, number];
    };
}

const UpdateProfileModel: React.FC<Props> = ({ user, setCloseModel }) => {
    const [formData, setFormData] = useState({
        avatar: user.profile?.avatar ?? "",
        name: user.name,
        email: user.email,
        bio: user.profile?.bio ?? "",
        city: user.profile?.city ?? "",
        country: user.profile?.country ?? "",
        latitude: user.profile?.latitude ?? null,
        longitude: user.profile?.longitude ?? null

    });

    const [profileImage, setProfileImage] = useState<File | null>(null)

    const [searchCityQuery, setSearchCityQuery] = useState("");
    const [debouncedSearchCityQuery, setDebouncedSearchCityQuery] = useState("");

    const [cities, setCities] = useState<CitySuggestion[]>([]);

    const queryClient = useQueryClient();



    const searchCities = async (query: string) => {
        if (!query.trim()) return [];

        const res = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(
                query
            )}&limit=5`
        );

        const data = await res.json();
        console.log(data)
        return data.features;
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            return;
        }


        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;

                setFormData(prev => ({ ...prev, latitude: lat, longitude: long }))
                console.log(lat, long)
            },
            (error) => {
                console.log(error)
            }
        )
    }

    useEffect(() => {
        getCurrentLocation();
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchCityQuery(searchCityQuery);
            searchCities(debouncedSearchCityQuery)
        }, 500);

        return () => clearTimeout(timer);
    }, [searchCityQuery]);




    useEffect(() => {
        const fetchCities = async () => {
            if (!debouncedSearchCityQuery.trim()) {
                setCities([]);
                return;
            }

            const results = await searchCities(debouncedSearchCityQuery);
            setCities(results)
        };

        fetchCities();
    }, [debouncedSearchCityQuery])

    const handleUpdateProfileMutation = useMutation({
        mutationKey: ['profile-update'],
        mutationFn: async ({ data }: {
            data: {
                bio: string | null;
                avatar: string | null;
                latitude: number | null;
                longitude: number | null;
                city: string | null;
                country: string | null;
            }
        }) => {
            let imgLink = formData.avatar
            if (profileImage) {
                imgLink = (await uploadImage(profileImage)).secure_url;
                data = {
                    ...data,
                    avatar: imgLink
                }
            }


            const res = await api.patch(`/profile`, {
                data
            })
        },
        onSuccess: async (_, variables) => {
            queryClient.setQueryData<User>(["profile"], (old) => {
                if (!old) return old;

                return {
                    ...old,
                    profile: old.profile
                        ? {
                            ...old.profile,
                            ...variables.data,
                        }
                        : {
                            id: crypto.randomUUID(),
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            bio: variables.data.bio,
                            avatar: variables.data.avatar,
                            latitude: variables.data.latitude,
                            longitude: variables.data.longitude,
                            city: variables.data.city,
                            country: variables.data.country,
                        }
                }
            })
        }

    })





    console.log(cities)
    console.log(formData)

    return (
        <div
            onClick={() => {
                setCloseModel(false)
            }}
            className='bg-black/50 h-screen  flex flex-col  justify-center'>
            <div onClick={(e) => e.stopPropagation()}>
                <div>

                    <span>Update your profile</span>
                    <button
                        onClick={() => {
                            setCloseModel(false)
                        }}
                    >
                        <Cross />
                    </button>
                </div>
                <div>
                    {
                        formData?.avatar ?
                            <img
                                className='w-48 h-48 rounded-full'
                                src={formData.avatar}
                            />
                            :
                            <input
                                onChange={(e) => {
                                    const file = e.target.files?.[0]

                                    if (!file) return;
                                    setProfileImage(file)
                                    setFormData(prev => ({ ...prev, avatar: URL.createObjectURL(file) }))
                                }}
                                type='file'
                                accept='imgage/*'
                            />


                    }
                </div>

                <div>
                    <span>Name</span>
                    <input
                        value={formData.name}
                        type="text"
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, name: e.target.value }))
                        }}
                    />
                </div>
                <div>
                    <span>Bio</span>
                    <input
                        value={formData.bio}
                        type="text"
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, bio: e.target.value }))
                        }}
                    />
                </div>

                <div>
                    <span>City</span>
                    <input
                        value={formData.city}
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, city: e.target.value }))

                            setSearchCityQuery(e.target.value)
                        }}
                        type="text"
                    />
                    {cities.length > 0 && (
                        <div className="border rounded bg-white">
                            {cities.map((city) => (
                                <button
                                    key={city.properties.osm_id}
                                    className="block w-full p-2 text-left hover:bg-gray-100"
                                    onClick={() => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            city: city.properties.city ?? city.properties.name,
                                            country: city.properties.country ?? "",
                                        }));

                                        setSearchCityQuery(
                                            city.properties.city ?? city.properties.name
                                        );

                                        setCities([]);
                                    }}
                                >
                                    <div>{city.properties.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {city.properties.state}, {city.properties.country}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <span>Country</span>
                    <input
                        type='text'
                        value={formData.country}
                    />
                </div>

                <button
                    onClick={() => {
                        handleUpdateProfileMutation.mutate({
                            data: formData,
                        });
                    }}

                    disabled={handleUpdateProfileMutation.isPending}
                >
                    {
                        handleUpdateProfileMutation.isPending ?
                            "Updating..."
                            :

                            "Update Profile"
                    }

                </button>
            </div>




        </div>
    )
}

export default UpdateProfileModel