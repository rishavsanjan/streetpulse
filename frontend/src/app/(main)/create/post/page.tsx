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

interface MediaItem {
    id: string;
    src: string;
}

const CATEGORIES = ["General", "Nature", "Food", "Traffic", "Alert", "Lost & Found"] as const;
type Category = (typeof CATEGORIES)[number];

const MAX_CHARS = 2200;


export default function CreatePostCard() {
    const [isMounted, setIsMounted] = useState(false);
    const [postText, setPostText] = useState("");
    const [activeCategory, setActiveCategory] = useState<Category>("General");
    const [media, setMedia] = useState<MediaItem[]>();
    const [locationQuery, setLocationQuery] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const removeMedia = (id: string) => {
        setMedia((prev) => prev.filter((item) => item.id !== id));
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newItems: MediaItem[] = Array.from(files).map((file) => ({
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            src: URL.createObjectURL(file),
        }));

        setMedia((prev) => [...prev, ...newItems]);
        e.target.value = "";
    };

    const handleUseCurrentLocation = () => {
        setLocationQuery("Current Location");
    };

    const handlePost = async () => {
        setIsPosting(true);
        try {
            // Simulate an API call — replace with a real request to your posts endpoint.
            await new Promise((resolve) => setTimeout(resolve, 1200));
            setPostText("");
            setMedia([]);
            setLocationQuery("");
            setActiveCategory("General");
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div
            className={`bg-white rounded-3xl shadow-xl overflow-hidden border border-outline-variant/20 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
        >
            {/* Header Section */}
            <div className="p-lg md:p-xl pb-0">
                <div className="flex items-center justify-between mb-md">
                    <div className="flex items-center gap-sm">
                        <button
                            aria-label="Close"
                            className="p-2 hover:bg-surface-container rounded-full transition-all active:scale-[0.98]"
                        >
                            <X className="w-5 h-5 text-on-surface-variant" />
                        </button>
                        <div>
                            <h1 className="font-headline-md text-headline-md text-on-surface">Create Post</h1>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Share what&apos;s happening around you.
                            </p>
                        </div>
                    </div>
                </div>

                {/* User Identity */}
                <div className="flex items-center gap-md py-md">
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                        <img
                            className="w-full h-full object-cover"
                            alt="Alex Rivera"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVQAVmR-siqiRWc_CSjXVv1b_3utLdj8nHpWTRx_WHk9lwiEf5JW1ODLnqOqLZZ6-Aw9IiSn8DPd-ZI3IVABOP-csuVNyfMOK-xN6n9smQBQkKhiPzI43m-9IM2tJ44yEhNi5FMro7Zv_Drei6EiMAqIMpLGd72IxqCFHMa2U4KsQXv2Wk_i6MmaOgHasPVn2BZg9SYdsio8CG3k-xy8gJPBEV1R9HwZLTcj5PpYAWS_MM_Em_dy_gkA"
                        />
                    </div>
                    <div>
                        <div className="font-label-md text-label-md text-on-surface">Alex Rivera</div>
                        <div className="flex items-center gap-1 bg-surface-container text-primary px-2 py-0.5 rounded-full mt-1">
                            <MapPin className="w-3.5 h-3.5" fill="currentColor" />
                            <span className="text-[12px] font-semibold">Greenwich Village</span>
                        </div>
                    </div>
                </div>
            </div>

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
                <div className="mt-xl">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-md uppercase tracking-widest">
                        Select Category
                    </label>
                    <div className="flex flex-wrap gap-sm">
                        {CATEGORIES.map((category) => {
                            const isActive = activeCategory === category;
                            return (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-md py-2 rounded-full transition-all font-label-md text-label-md flex items-center gap-xs ${isActive
                                            ? "bg-primary text-white"
                                            : "bg-surface-container hover:bg-surface-container-high"
                                        }`}
                                >
                                    {category === "Alert" && <AlertTriangle className="w-[18px] h-[18px]" />}
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Media Upload Area */}
                <div className="mt-xl">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-md uppercase tracking-widest">
                        Media
                    </label>
                    <div className="grid grid-cols-3 gap-md">
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

                        {/* Upload Slot */}
                        <button
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
                        />
                    </div>
                </div>

                {/* Location Action Section */}
                <div className="mt-xl p-md bg-surface-bright rounded-2xl border border-outline-variant/20">
                    <div className="flex flex-col md:flex-row gap-md">
                        <button
                            onClick={handleUseCurrentLocation}
                            className="flex-1 flex items-center justify-center gap-sm bg-white border border-outline-variant/40 hover:border-primary py-3 rounded-xl font-label-md text-label-md transition-all active:scale-[0.98] shadow-sm"
                        >
                            <LocateFixed className="w-5 h-5 text-primary" />
                            Use Current Location
                        </button>
                        <div className="flex-[1.5] relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                            <input
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant/40 focus:border-primary focus:ring-primary/20 font-body-sm text-body-sm bg-white shadow-sm"
                                placeholder="Search location..."
                                type="text"
                            />
                        </div>
                    </div>
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
                        disabled={isPosting || postText.trim().length === 0}
                        className="flex-1 md:flex-none px-3xl py-3 rounded-full bg-primary text-white font-label-md text-label-md shadow-lg shadow-primary/20 hover:bg-on-primary-fixed-variant transition-all active:scale-[0.98] flex items-center justify-center gap-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isPosting ? "Posting..." : "Post"}
                        {!isPosting && <Send className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}