"use client"
import { CurrentLocation, LocationPicker } from '@/components/location'
import SearchPlace from '@/components/location/SearchPlace'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { X } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface CreatePost {
    caption?: string,
    category: Category,
    placeName?: string,
    image: File[]
}

type Category = "General" |
    "Nature" |
    "Food" |
    "Traffic" |
    "Alert" |
    "LostFound"

const categories: Category[] = ["General",
    "Nature",
    "Food",
    "Traffic",
    "Alert",
    "LostFound"];

interface SelectedLocation {
    latitude: number
    longitude: number
    address: string,
}

const CreatePost = () => {
    const [post, setPost] = useState<CreatePost>({
        caption: "",
        category: "General",
        placeName: "",
        image: []
    });

    const [location, setLocation] =
        useState<SelectedLocation>({
            address: "",
            latitude: 28.6139,
            longitude: 77.209,
        });
    const { user } = useAuth();


    const uploadImage = async (file: File) => {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!res.ok) {
            throw new Error("Upload failed");
        }

        return res.json();


    }


    const handlePostUploadMutation = useMutation({
        mutationFn: async () => {
            const data = post
            const uploadedImages = await Promise.all(
                post.image.map(async (image) => {
                    const data = await uploadImage(image);
                    return data.secure_url;
                })
            );

            console.log(uploadedImages)

            const res = await api.post(`/post`, {
                caption: post.caption,
                image: uploadedImages,
                category: post.category,
                latitude: location.latitude,
                longitude: location.longitude,
                address: location.address,
            })
        },

        onSuccess: async () => {
            toast.success("Post created successfully")

        },
        onError: async (error) => {
            if (axios.isAxiosError(error)) {
                console.log("Backend response:", error.response?.data);
                console.log("Status:", error.response?.status);

                toast.error(
                    error.response?.data?.message || "Post creation failed"
                );
            } else {
                console.error(error);
                toast.error("Something went wrong");
            }
        }
    })

    console.log(post)



    return (
        <div>
            <div>
                {user?.name ?? "login"}
            </div>
            <div>
                <span>Caption</span>
                <input
                    placeholder='Caption'
                    onChange={(e) =>
                        setPost((prev) => ({
                            ...prev,
                            caption: e.target.value,
                        }))
                    }
                />
            </div>
            <div className='flex flex-row space-x-4'>
                {
                    categories.map((m) => {
                        return (
                            <div className={`space-x-4  `} key={m}>
                                <button
                                    onClick={() => {
                                        setPost(prev => ({
                                            ...prev,
                                            category: m
                                        }))
                                    }}
                                    className={`${post.category === m ? "bg-green-400" : "bg-gray-300"} space-x-4 `}>
                                    {m}
                                </button>

                            </div>
                        )
                    })
                }
            </div>
            <div className=''>
                <input
                    type='file'
                    accept='/image'
                    onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                            setPost((prev) => ({
                                ...prev,
                                image: [...prev.image, ...Array.from(files)]
                            }))
                        }
                    }}
                />
                <div className='flex flex-wrap'>
                    {
                        post.image.map((image, index) => (
                            <div key={index} className='relative'>
                                <button
                                    onClick={() => {
                                        setPost((prev) => ({
                                            ...prev,
                                            image: prev.image.filter((_, i) => i !== index)
                                        }))
                                    }}
                                    className='absolute right-0 bg-gray-500'>
                                    <X />
                                </button>

                                <img

                                    src={URL.createObjectURL(image)}
                                    alt=""
                                    className="w-32 h-32 object-cover rounded "
                                />
                            </div>

                        ))
                    }
                </div>

            </div>

            <div>
                <span>location</span>
                <div className='flex flex-row'>
                    <CurrentLocation onLocationChange={setLocation} />
                    <SearchPlace onLocationChange={setLocation} />
                </div>

                <LocationPicker value={location} onChange={setLocation} />
            </div>

            <button
                disabled={handlePostUploadMutation.isPending}
                onClick={() => { handlePostUploadMutation.mutate() }}
                className='bg-green-400 p-3'>
                {
                    handlePostUploadMutation.isPending ? 'Creating post....' : 'Create Post'
                }

            </button>
        </div>
    )
}

export default CreatePost