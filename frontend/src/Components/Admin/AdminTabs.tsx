
export type AdminTabType = 'claims' | 'inventory' | 'handover' | 'disposal';

interface AdminTabsProps {
  activeTab: AdminTabType;
  onTabChange: (tab: AdminTabType) => void;
  pendingClaimsCount: number;
  totalItemsCount: number;
}

export default function AdminTabs({
  activeTab,
  onTabChange,
  pendingClaimsCount,
  totalItemsCount,
}: AdminTabsProps) {
  const tabs = [
    { id: 'claims' as AdminTabType, label: 'Claims Verification', count: pendingClaimsCount },
    { id: 'inventory' as AdminTabType, label: 'Campus Items', count: totalItemsCount },
    { id: 'handover' as AdminTabType, label: 'Physical Handover', count: 2 },
    { id: 'disposal' as AdminTabType, label: 'Retention (90d)', count: 3 },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 border border-slate-300/80 rounded-xl w-full sm:w-fit mb-6">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isActive
                ? 'bg-[#ef7d00] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-300/60 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
