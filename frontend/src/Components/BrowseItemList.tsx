import type { PublicItemDTO } from "../types";
import ItemCard from "./ItemCard";
import ItemFilterBar from "./ItemFilterBar";

interface BrowseItemListProps {
  items: PublicItemDTO[];
  loading: boolean;
  search: string;
  setSearch: (val: string) => void;
  filter: "all" | "lost" | "found";
  setFilter: (val: "all" | "lost" | "found") => void;
}

export default function BrowseItemList({
  items,
  loading,
  search,
  setSearch,
  filter,
  setFilter,
}: BrowseItemListProps) {
  return (
    <div
      id="board-section"
      className="max-w-7xl mx-auto px-4 pb-16 sm:px-6 lg:px-8 -mt-8 relative z-20"
    >
      <ItemFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-[#ef7d00] rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">
            No items found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
