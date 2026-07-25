import { AlertTriangle } from 'lucide-react';
import React, { SetStateAction } from 'react'

const CATEGORIES = ["General", "Nature", "Food", "Traffic", "Alert", "Lost & Found"] as const;
type Category = (typeof CATEGORIES)[number];

interface Props {
    activeCategory : Category
    setActiveCategory : React.Dispatch<SetStateAction<Category>>
}

const CategorySelecter:React.FC<Props> = ({activeCategory, setActiveCategory}) => {
    
    return (
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
    )
}

export default CategorySelecter