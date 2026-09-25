import { ShieldCheck, Package, Clock, CheckCircle } from 'lucide-react';

interface AdminStatsProps {
  pendingClaimsCount: number;
  totalItemsCount: number;
  handoverCount: number;
}

const AdminStats = ({
  pendingClaimsCount,
  totalItemsCount,
  handoverCount,
}: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Stat 1: Pending Claims */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-orange-200/80 shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-bl from-orange-100/60 to-transparent rounded-bl-full pointer-events-none" />
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
          <Clock className="w-3.5 h-3.5 text-[#ef7d00]" />
          <span>Pending Review</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#ef7d00]">{pendingClaimsCount}</span>
          <span className="text-[11px] font-medium text-slate-500">claims to verify</span>
        </div>
      </div>

      {/* Stat 2: Total Items */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
          <Package className="w-3.5 h-3.5 text-blue-600" />
          <span>Total Registry</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-800">{totalItemsCount}</span>
          <span className="text-[11px] font-medium text-slate-500">items logged</span>
        </div>
      </div>

      {/* Stat 3: Awaiting Handover */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Awaiting Handover</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-800">{handoverCount}</span>
          <span className="text-[11px] font-medium text-slate-500">at Block 32 desk</span>
        </div>
      </div>

      {/* Stat 4: Recovery Rate */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-emerald-200/80 shadow-2xs">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Recovery Rate</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-700">68.4%</span>
          <span className="text-[11px] font-medium text-emerald-800">returned to owner</span>
        </div>
      </div>
    </div>
  );
}


export default AdminStats;