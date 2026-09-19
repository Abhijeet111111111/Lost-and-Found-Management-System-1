import { ShieldCheck, Search, MapPin } from "lucide-react";

export default function StatsGrid() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 sm:-mt-24 mb-12 sm:mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-linear-to-br from-[#3B9CFF] to-[#2072F5] rounded-xl p-8 text-white shadow-xl flex flex-col items-center text-center transition-transform hover:-translate-y-1">
          <div className="bg-white/20 p-3 rounded-full mb-4 backdrop-blur-sm border border-white/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-black mb-2">100%</h3>
          <p className="text-sm font-medium uppercase tracking-wide opacity-90">
            Secure Verification & Custody
          </p>
        </div>
        <div className="bg-linear-to-br from-[#FCA62B] to-[#F27E00] rounded-xl p-8 text-white shadow-xl flex flex-col items-center text-center transition-transform hover:-translate-y-1">
          <div className="bg-white/20 p-3 rounded-full mb-4 backdrop-blur-sm border border-white/30">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-black mb-2">24/7</h3>
          <p className="text-sm font-medium uppercase tracking-wide opacity-90">
            Automated Smart Matching
          </p>
        </div>
        <div className="bg-linear-to-br from-[#27D08E] to-[#06A567] rounded-xl p-8 text-white shadow-xl flex flex-col items-center text-center transition-transform hover:-translate-y-1">
          <div className="bg-white/20 p-3 rounded-full mb-4 backdrop-blur-sm border border-white/30">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-black mb-2">6+</h3>
          <p className="text-sm font-medium uppercase tracking-wide opacity-90">
            Campus Zones Covered
          </p>
        </div>
      </div>
    </div>
  );
}
