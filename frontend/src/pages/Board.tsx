import { useEffect, useState } from "react";
import type { PublicItemDTO } from "../types";
import HeroSection from "../Components/HeroSection";
import StatsGrid from "../Components/StatsGrid";
import BrowseItemList from "../Components/BrowseItemList";

export default function Board() {
  const [items, setItems] = useState<PublicItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/items")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error("API did not return an array:", data);
          setItems([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch items:", err);
        setItems([]);
        setLoading(false);
      });
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch =
      item.itemName?.toLowerCase().includes(search.toLowerCase()) ||
      item.publicDescription?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <HeroSection />
      <StatsGrid />
      <BrowseItemList
        items={filteredItems}
        loading={loading}
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />
    </>
  );
}
