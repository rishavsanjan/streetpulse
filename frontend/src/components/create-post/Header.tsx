import { MapPin, X } from 'lucide-react'
import React from 'react'

interface Props {
    name? : string,
    address : string,

}

const Header:React.FC<Props> = ({name, address}) => {
    return (
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
                    <div className="font-label-md text-label-md text-on-surface">{name}</div>
                    <div className="flex items-center gap-1 bg-surface-container text-primary px-2 py-0.5 rounded-full mt-1">
                        <MapPin className="w-3.5 h-3.5" fill="currentColor" />
                        <span className="text-[12px] font-semibold">{address}</span>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Header