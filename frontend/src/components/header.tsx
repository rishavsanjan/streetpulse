import { Activity } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="w-full sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-sm">
      <div className="flex justify-between items-center w-full px-lg py-sm max-w-container-max mx-auto">
        <div className="flex items-center gap-2">
          <Activity className="text-primary w-7 h-7" strokeWidth={2.5} />
          <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
            StreetPulse
          </span>
        </div>
        <a
          className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
          href="#"
        >
          Help Center
        </a>
      </div>
    </header>
  );
}