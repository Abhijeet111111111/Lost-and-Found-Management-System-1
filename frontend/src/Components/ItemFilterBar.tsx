import { Search } from 'lucide-react';

interface ItemFilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  filter: 'all' | 'lost' | 'found';
  setFilter: (val: 'all' | 'lost' | 'found') => void;
}

const ItemFilterBar = ({ search, setSearch, filter, setFilter }: ItemFilterBarProps)=> {

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Public Board</h2>
        <p className="text-slate-500 text-sm mt-1.5 font-medium">Browse redacted listings of lost and found items on campus.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#ef7d00] transition-colors" />
          <input 
            type="text" 
            placeholder="Search items..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-[#ef7d00]/10 focus:border-[#ef7d00] outline-none w-full sm:w-72 transition-all"
          />
        </div>
        
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#ef7d00]/10 focus:border-[#ef7d00] outline-none transition-all cursor-pointer"
        >
          <option value="all">All Items</option>
          <option value="lost">Lost Only</option>
          <option value="found">Found Only</option>
        </select>
      </div>
    </div>
  );
}

export default ItemFilterBar;