"use client"
import { CurrentLocation, LocationPicker } from '@/components/location'
import SearchPlace from '@/components/location/SearchPlace'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { X, ImagePlus, MapPin, Navigation, Trash2, Send, Info, User } from 'lucide-react'
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

    // Purely cosmetic derived values — no logic change
    const charCount = post.caption?.length ?? 0;

    return (
        <main className="flex justify-center items-start md:items-center min-h-screen px-4 md:px-0 py-8 bg-emerald-50/40">
            <div className="bg-white w-full max-w-[640px] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-200 flex flex-col h-full md:max-h-[921px]">

                {/* Header */}
                <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/80 border-b border-emerald-900/10">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Create Post</h1>
                        <p className="text-sm text-gray-500">Share what&apos;s happening around you.</p>
                    </div>
                </header>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* User info */}
                    <section className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                            <User className="text-gray-400" size={22} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">{user?.name ?? "login"}</span>
                            {location.address && (
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs font-medium px-2 py-[2px] bg-blue-50 text-blue-700 rounded-full">
                                        Posting to {location.address}
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Caption */}
                    <section className="relative">
                        <textarea
                            className="w-full min-h-[120px] bg-transparent border-none focus:ring-0 text-lg text-gray-900 placeholder:text-gray-400 resize-none p-0"
                            placeholder="What is happening around you?"
                            value={post.caption}
                            onChange={(e) =>
                                setPost((prev) => ({
                                    ...prev,
                                    caption: e.target.value,
                                }))
                            }
                        />
                        <div className="flex justify-end mt-1">
                            <span className={`text-xs ${charCount > 2000 ? "text-red-500" : "text-gray-400"}`}>
                                {charCount}/2200
                            </span>
                        </div>
                    </section>

                    {/* Categories */}
                    <section className="space-y-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Category</h3>
                        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
                            {categories.map((m) => (
                                <button
                                    key={m}
                                    onClick={() => {
                                        setPost(prev => ({
                                            ...prev,
                                            category: m
                                        }))
                                    }}
                                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                                        post.category === m
                                            ? "bg-emerald-500 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Media */}
                    <section className="space-y-2">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Add to your post</h3>
                            <span className="text-xs font-medium text-emerald-600">{post.image.length}/10 selected</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {post.image.map((image, index) => (
                                <div key={index} className="aspect-square rounded-lg overflow-hidden relative group border border-gray-200">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt=""
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <button
                                        onClick={() => {
                                            setPost((prev) => ({
                                                ...prev,
                                                image: prev.image.filter((_, i) => i !== index)
                                            }))
                                        }}
                                        className="absolute top-1 right-1 bg-black/40 text-white rounded-full p-[2px] backdrop-blur-md"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}

                            <label
                                htmlFor="post-image-input"
                                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors cursor-pointer group"
                            >
                                <ImagePlus className="text-gray-400 group-hover:text-emerald-500 transition-colors" size={22} />
                                <span className="text-xs text-gray-500">Add More</span>
                            </label>
                            <input
                                id="post-image-input"
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
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
                        </div>
                    </section>

                    {/* Location */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tag a location</h3>
                            <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                                <Navigation size={16} />
                                <CurrentLocation onLocationChange={setLocation} />
                            </div>
                        </div>

                        <SearchPlace onLocationChange={setLocation} />

                        {location.address && (
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="text-emerald-600" size={22} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">{location.address}</h4>
                                        <p className="text-xs text-gray-500">
                                            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        setLocation({ address: "", latitude: 28.6139, longitude: 77.209 })
                                    }
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        )}

                        <LocationPicker value={location} onChange={setLocation} />
                    </section>

                    {/* Visibility helper */}
                    <section className="flex items-center gap-2 p-4 bg-emerald-50 rounded-xl">
                        <Info className="text-emerald-600 flex-shrink-0" size={18} />
                        <p className="text-sm text-emerald-900">
                            Your post will be visible to neighbors within 5km.
                        </p>
                    </section>
                </div>

                {/* Footer */}
                <footer className="p-6 bg-white border-t border-gray-200 flex gap-4">
                    <button
                        disabled={handlePostUploadMutation.isPending}
                        onClick={() => { handlePostUploadMutation.mutate() }}
                        className="flex-1 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {handlePostUploadMutation.isPending ? "Creating post..." : "Post to StreetPulse"}
                        {!handlePostUploadMutation.isPending && <Send size={16} />}
                    </button>
                </footer>
            </div>
        </main>
    )
}

export default CreatePost