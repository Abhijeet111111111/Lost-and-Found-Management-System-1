import { Link } from "react-router-dom";
import { ShieldCheck, PlusCircle, Search } from "lucide-react";
import Button from "./Button";
import bg from "../assets/bg.jpeg";

export default function HeroSection() {
  return (
    <div className="relative bg-slate-900 text-white pt-32 pb-40 sm:pt-40 sm:pb-48 overflow-hidden flex justify-center items-center">
      <img
        src={bg}
        alt="bgimage"
        className=" absolute inset-0 opacity-20 h-full w-full object-center object-cover"
      />

      <div className="absolute inset-0 from-slate-900/20 via-slate-900/70 to-slate-900"></div>

      <div className="relative max-w-5xl mx-auto px-4 text-center z-10">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium text-white mb-6 backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-[#fbad41]" />
          Secure Campus Recovery Platform
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6">
          LOST & FOUND{" "}
          <span className="bg-linear-to-r from-[#fbad41] to-[#ef7d00] bg-clip-text text-transparent">
            SYSTEM
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8 sm:mb-10 px-2">
          Revolutionizing the way student belongings are reported, matched, and
          securely returned across the campus.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/report">
            <Button variant="accent" size="lg" className="w-full sm:w-auto">
              <PlusCircle className="w-5 h-5" /> Report Now
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/20"
            onClick={() => {
              document
                .getElementById("board-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Search className="w-5 h-5" /> Browse Items
          </Button>
        </div>
      </div>
    </div>
  );
}
