import React from "react";
import type { PublicItemDTO } from "../types";
import { MapPin, Calendar, Tag, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import handleNavigateAndStore from "./../utils/handleNavigateAndStore";
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

interface ItemCardProps {
  item: PublicItemDTO;
  key?: React.Key;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const isFound = item.type === "found";

  const { isLoggedIn } = useAuth();

  const navigate = useNavigate();

  // function handleClick() {
  //   const prevPageLink = localStorage.getItem("prevPageLink");
  //   if (!prevPageLink && !isLoggedIn) {
  //     localStorage.setItem("prevPageLink", `/claim/${item._id}`);
  //   }
  //   navigate(`/claim/${item._id}`);
  // }

  return (
    <div className="group bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div
        className={cn(
          "px-5 py-3 text-xs font-extrabold uppercase tracking-widest shrink-0 flex items-center justify-between",
          isFound
            ? "bg-Linear-to-r from-[#ef7d00] to-[#fbad41] text-white"
            : "bg-slate-100 text-slate-500",
        )}
      >
        <span>{isFound ? "Found Item" : "Lost Item"}</span>
        <div className="w-2 h-2 rounded-full bg-white/50 shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse"></div>
      </div>

      {/* Optional Image Render */}
      {item.pictureLink || item.photoUrl ? (
        <div className="w-full h-48 bg-slate-100 overflow-hidden relative">
          <img
            src={item.pictureLink || item.photoUrl}
            alt={item.itemName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="w-full h-2 bg-slate-50"></div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-1 group-hover:text-[#ef7d00] transition-colors">
          {item.itemName}
        </h3>

        <p className="text-slate-500 text-sm mb-5 line-clamp-2 flex-1 leading-relaxed">
          {item.publicDescription}
        </p>

        <div className="space-y-3 mb-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center text-xs font-semibold text-slate-600">
            <Tag className="w-4 h-4 mr-2.5 text-[#ef7d00]" />
            <span>{item.category}</span>
          </div>
          <div className="flex items-center text-xs font-semibold text-slate-600">
            <MapPin className="w-4 h-4 mr-2.5 text-[#ef7d00]" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center text-xs font-semibold text-slate-600">
            <Calendar className="w-4 h-4 mr-2.5 text-[#ef7d00]" />
            <span>
              {new Date(item.incidentDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {isFound && (
          <button
            // to={`/claim/${item._id}`}
            onClick={() =>
              handleNavigateAndStore(
                navigate,
                `/claim/${item._id}`,
                `/claim/${item._id}`,
                isLoggedIn,
              )
            }
            className="flex items-center justify-center w-full bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-[#ef7d00] hover:shadow-lg hover:shadow-[#ef7d00]/30 transition-all duration-300"
          >
            {isLoggedIn ? " Claim This Item" : "Login to Claim Item"}
            <ChevronRight className="w-4 h-4 ml-1.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
