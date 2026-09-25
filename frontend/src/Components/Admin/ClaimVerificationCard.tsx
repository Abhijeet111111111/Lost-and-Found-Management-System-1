import { Check, X } from "lucide-react";
import AIAnalysisCard from "./AiAnalysisCard";

export interface ClaimData {
  id: string;
  itemId?: string;
  claimantName: string;
  claimantContact: string;
  verificationAnswers: string;
  status: "pending" | "approved" | "rejected";
  dateSubmitted: string;
  item?: {
    itemName?: string;
    publicDescription?: string;
    privateDetails?: string;
    category?: string;
    location?: string;
  };
}

interface ClaimVerificationCardProps {
  claim: ClaimData;
  onApprove: (claimId: string) => void;
  onReject: (claimId: string) => void;
}

export default function ClaimVerificationCard({
  claim,
  onApprove,
  onReject,
}: ClaimVerificationCardProps) {
  return (
    <article className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider font-bold text-[#ef7d00]">
            Ownership claim
          </p>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            {claim.item?.itemName ?? "Reported item"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Submitted by {claim.claimantName} ({claim.claimantContact})
          </p>
        </div>
        <time className="text-[11px] text-slate-400" dateTime={claim.dateSubmitted}>
          {new Date(claim.dateSubmitted).toLocaleDateString()}
        </time>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <p className="text-[11px] uppercase font-bold text-slate-400 mb-1">Student answer</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{claim.verificationAnswers}</p>
        </div>
        <div className="bg-orange-50/60 border border-orange-100 rounded-lg p-3">
          <p className="text-[11px] uppercase font-bold text-orange-700 mb-1">Finder's private details</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {claim.item?.privateDetails ?? "Not available"}
          </p>
        </div>
      </div>

      <AIAnalysisCard
        claimId={claim.id}
        itemDetails={{
          title: claim.item?.itemName ?? "Reported item",
          description: claim.item?.publicDescription,
          privateDetails: claim.item?.privateDetails,
          category: claim.item?.category,
          location: claim.item?.location,
        }}
        claimantDetails={{
          name: claim.claimantName,
          contact: claim.claimantContact,
          verificationAnswers: claim.verificationAnswers,
        }}
      />

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => onReject(claim.id)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50"
        >
          <X className="h-3.5 w-3.5" /> Reject
        </button>
        <button
          type="button"
          onClick={() => onApprove(claim.id)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
        >
          <Check className="h-3.5 w-3.5" /> Approve
        </button>
      </div>
    </article>
  );
}
