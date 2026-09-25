import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Item } from '../../types';

interface InventoryTableProps {
  items: Item[];
}

export default function InventoryTable({ items }: InventoryTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">Campus Item Registry</h2>
          <p className="text-xs text-slate-500">
            Catalog of all items registered by students and security across LPU.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-700 outline-none focus:border-[#ef7d00]"
          >
            <option value="all">All Types</option>
            <option value="found">Found Items</option>
            <option value="lost">Lost Items</option>
          </select>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, block..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#ef7d00]"
            />
          </div>
        </div>
      </div>

      {/* Item List */}
      <div className="space-y-2.5">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="p-3.5 border border-slate-200 rounded-lg bg-white text-xs space-y-1.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-sm">{item.title}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 capitalize">{item.type}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500">{item.location}</span>
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                Status: {item.status}
              </span>
            </div>

            <p className="text-slate-600 leading-relaxed">{item.description}</p>

            {item.privateDetails && (
              <div className="text-[11px] text-amber-800 bg-amber-50/60 border border-amber-200/50 rounded px-2.5 py-1">
                <span className="font-semibold">Secret mark: </span>"{item.privateDetails}"
              </div>
            )}
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-10 text-xs text-slate-400">
            No items found matching your filter.
          </div>
        )}
      </div>
    </div>
  );
}
