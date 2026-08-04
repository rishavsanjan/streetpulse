import api from '@/lib/axios';
import { uploadImage } from '@/lib/cloudinary';
import { Profile, User } from '@/types/user'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, User as UserIcon, X } from 'lucide-react';
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
                ...data
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
            className='fixed inset-0 z-50 flex items-center  bg-slate-950/60 backdrop-blur-sm px-4 py-8'
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className='w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5'
            >
                {/* Header */}
                <div className='flex items-center justify-between border-b border-slate-100 px-6 py-4'>
                    <span className='text-lg font-semibold text-slate-900'>Update your profile</span>
                    <button
                        onClick={() => {
                            setCloseModel(false)
                        }}
                        aria-label="Close"
                        className='rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600'
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className='space-y-5 px-6 py-6'>
                    {/* Avatar */}
                    <div className='flex flex-col items-center gap-3'>
                        {
                            formData?.avatar ?
                                <img
                                    className='h-28 w-28 rounded-full object-cover ring-4 ring-indigo-50'
                                    src={formData.avatar}
                                    alt="Profile avatar"
                                />
                                :
                                <label className='flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-indigo-400 hover:text-indigo-500'>
                                    <UserIcon size={26} />
                                    <span className='text-[11px] font-medium'>Add photo</span>
                                    <input
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]

                                            if (!file) return;
                                            setProfileImage(file)
                                            setFormData(prev => ({ ...prev, avatar: URL.createObjectURL(file) }))
                                        }}
                                        type='file'
                                        accept='image/*'
                                        className='hidden'
                                    />
                                </label>
                        }
                    </div>

                    {/* Name */}
                    <div className='space-y-1.5'>
                        <label className='block text-sm font-medium text-slate-700'>Name</label>
                        <input
                            value={formData.name}
                            type="text"
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, name: e.target.value }))
                            }}
                            className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
                            placeholder="Your name"
                        />
                    </div>

                    {/* Bio */}
                    <div className='space-y-1.5'>
                        <label className='block text-sm font-medium text-slate-700'>Bio</label>
                        <input
                            value={formData.bio}
                            type="text"
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, bio: e.target.value }))
                            }}
                            className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
                            placeholder="Tell your neighborhood a bit about yourself"
                        />
                    </div>

                    {/* City */}
                    <div className='relative space-y-1.5'>
                        <label className='block text-sm font-medium text-slate-700'>City</label>
                        <div className='relative'>
                            <MapPin size={16} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
                            <input
                                value={formData.city}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, city: e.target.value }))

                                    setSearchCityQuery(e.target.value)
                                }}
                                type="text"
                                placeholder="Search for your city"
                                className='w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
                            />
                        </div>
                        {cities.length > 0 && (
                            <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                                {cities.map((city) => (
                                    <button
                                        key={city.properties.osm_id}
                                        className="block w-full px-3 py-2 text-left transition hover:bg-indigo-50"
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
                                            setDebouncedSearchCityQuery("")
                                            setSearchCityQuery("")
                                            
                                        }}
                                    >
                                        <div className='text-sm font-medium text-slate-900'>{city.properties.name}</div>
                                        <div className="text-xs text-slate-500">
                                            {city.properties.state}{city.properties.state && city.properties.country ? ', ' : ''}{city.properties.country}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Country */}
                    <div className='space-y-1.5'>
                        <label className='block text-sm font-medium text-slate-700'>Country</label>
                        <input
                            type='text'
                            value={formData.country}
                            readOnly
                            className='w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none'
                        />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={() => {
                            handleUpdateProfileMutation.mutate({
                                data: formData,
                            });
                        }}

                        disabled={handleUpdateProfileMutation.isPending}
                        className='mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300'
                    >
                        {
                            handleUpdateProfileMutation.isPending ?
                                <>
                                    <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                                    Updating...
                                </>
                                :
                                "Update Profile"
                        }

                    </button>
                </div>
            </div>
        </div>
    )
}

export default UpdateProfileModel