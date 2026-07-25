"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
    X,
    MapPin,
    AlertTriangle,
    ImagePlus,
    LocateFixed,
    Search,
    Globe,
    Send,
} from "lucide-react";
import { CurrentLocation, LocationPicker, SelectedLocation } from "@/components/location";
import SearchPlace from "@/components/location/SearchPlace";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { handleCreatePost } from "@/service/post";
import { toast } from "sonner";
import Header from "@/components/create-post/Header";
import CategorySelecter from "@/components/create-post/CategorySelecter";
import ImageSelect from "@/components/create-post/ImageSelect";

interface MediaItem {
    id: string;
    file: File; // current file — either original or cropped
    previewUrl: string;
    originalSrc: string; // untouched source, used if user re-crops
}

const CATEGORIES = ["General", "Nature", "Food", "Traffic", "Alert", "Lost & Found"] as const;
type Category = (typeof CATEGORIES)[number];

const MAX_CHARS = 2200;


export default function CreatePostCard() {
    const [isMounted, setIsMounted] = useState(false);
    const [postText, setPostText] = useState("");
    const [activeCategory, setActiveCategory] = useState<Category>("General");
    const [media, setMedia] = useState<File[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [location, setLocation] =
        useState<SelectedLocation>({
            address: "",
            latitude: 28.6139,
            longitude: 77.209,
        });
    const { user } = useAuth();
    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // const removeMedia = (id: string) => {

    //     setMedia((prev) => prev.filter((item) => item.id !== id));
    // };

    // const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    //     const files = e.target.files;
    //     if (!files) return;

    //     const newItems: MediaItem[] = Array.from(files).map((file) => ({
    //         id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    //         src: URL.createObjectURL(file),
    //     }));

    //     setMedia((prev) => [...prev, ...newItems]);
    //     e.target.value = "";
    // };



    const handleSubmit = () => {
        console.log(location);

        /*
        Send to backend:
    
        {
          caption,
          images,
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude
        }
        */
    };

    const handlePost = async () => {
        try {
            // Simulate an API call — replace with a real request to your posts endpoint.
            await new Promise((resolve) => setTimeout(resolve, 1200));
            setPostText("");
            setMedia([]);
            setActiveCategory("General");
        } finally {
        }
    };

    const handleCreatePostMutation = useMutation({
        mutationFn: handleCreatePost,
        onSuccess: () => {
            toast.success("Post created successfully!");
            setPostText("");
            setMedia([]);
            setActiveCategory("General");
        },
        onError: async (error) => {
            toast.error("Something went wrong!");
        }
    })

    return (
        <div
            className={`bg-white rounded-3xl shadow-xl overflow-hidden border border-outline-variant/20 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
        >
             <ImageSelect
                    aspect={4 / 3}
                    maxImages={6}
                    onChange={setMedia} // just keeps files in state, no upload yet
                />
            {/* Header Section */}
            <Header name={user?.name} address={location.address} />

            {/* Composer Content */}
            <div className="px-lg md:px-xl pb-xl">
                {/* Text Area */}
                <div className="relative group">
                    <textarea
                        value={postText}
                        onChange={(e) => setPostText(e.target.value.slice(0, MAX_CHARS))}
                        maxLength={MAX_CHARS}
                        className="w-full h-40 border-none focus:ring-0 text-body-lg font-body-lg text-on-surface placeholder-on-surface-variant/40 resize-none custom-scrollbar p-0"
                        placeholder="Share something with your community..."
                    />
                    <div className="absolute bottom-2 right-2 font-label-sm text-label-sm text-outline-variant">
                        {postText.length} / {MAX_CHARS}
                    </div>
                </div>

                {/* Category Selector */}
                <CategorySelecter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

                {/* Media Upload Area */}
                <div className="mt-xl">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-md uppercase tracking-widest">
                        Media
                    </label>

                    <div className="grid grid-cols-3 gap-md">

                        {
                            media?.length > 0 &&
                            <>
                                {media?.map((item) => (
                                    <div
                                        key={item.id}
                                        className="relative aspect-square rounded-2xl overflow-hidden group border border-outline-variant/20 shadow-sm"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img className="w-full h-full object-cover" alt="Post media preview" src={item.src} />
                                        <button
                                            aria-label="Remove media"
                                            onClick={() => removeMedia(item.id)}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-[18px] h-[18px]" />
                                        </button>
                                    </div>
                                ))}
                            </>

                        }




                        {/* Upload Slot */}
                        {/* <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant/50 hover:border-primary/50 hover:bg-primary-container/5 cursor-pointer transition-all flex flex-col items-center justify-center text-on-surface-variant"
                        >
                            <ImagePlus className="w-8 h-8 mb-2" />
                            <span className="font-label-sm text-label-sm">Add More</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileSelect}
                        /> */}
                    </div>
                </div>


               

                {/* Location Action Section */}
                <div className="mt-xl p-md bg-surface-bright rounded-2xl border border-outline-variant/20">
                    <div className="flex flex-col md:flex-row gap-md">
                        <CurrentLocation onLocationChange={setLocation} />

                        <div className="flex-[1.5] relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                            <SearchPlace onLocationChange={setLocation} />
                        </div>
                    </div>
                </div>
                <div className="mx-auto max-w-full space-y-6 p-6">

                    <LocationPicker
                        value={location}
                        onChange={setLocation}
                    />

                    <button
                        onClick={handleSubmit}
                        className="rounded-lg bg-green-600 px-5 py-3 text-white"
                    >
                        Create Post
                    </button>
                </div>
            </div>

            {/* Action Bar */}
            <div className="px-lg md:px-xl py-lg bg-surface-container/30 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-md">
                <div className="flex items-center gap-sm text-on-surface-variant">
                    <Globe className="w-5 h-5 text-primary-container" fill="currentColor" />
                    <span className="font-body-sm text-body-sm">Your post will be visible to nearby users.</span>
                </div>
                <div className="flex items-center gap-md w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-xl py-3 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-all">
                        Drafts
                    </button>
                    <button
                        onClick={handlePost}
                        disabled={handleCreatePostMutation.isPending || postText.trim().length === 0}
                        className="flex-1 md:flex-none px-3xl py-3 rounded-full bg-primary text-white font-label-md text-label-md shadow-lg shadow-primary/20 hover:bg-on-primary-fixed-variant transition-all active:scale-[0.98] flex items-center justify-center gap-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {handleCreatePostMutation.isPending ? "Posting..." : "Post"}
                        {!handleCreatePostMutation.isPending && <Send className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}