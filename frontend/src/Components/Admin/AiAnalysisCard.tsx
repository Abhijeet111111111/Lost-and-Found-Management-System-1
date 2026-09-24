import { useState } from 'react';
import { Loader2, ChevronDown, ChevronUp, RefreshCw, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export interface AIAnalysisData {
  matchPercentage: number;
  verdict: 'RECOMMENDED_APPROVE' | 'SUSPICIOUS_DISCREPANCY' | 'INSUFFICIENT_PROOF' | 'DEFINITE_REJECT';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  summary: string;
  matchingPoints: string[];
  discrepancies: string[];
  recommendationAction: string;
  engine?: string;
}

interface AIAnalysisCardProps {
  claimId: string;
  itemDetails: {
    title: string;
    description?: string;
    privateDetails?: string;
    category?: string;
    location?: string;
  };
  claimantDetails: {
    name: string;
    contact?: string;
    verificationAnswers: string;
  };
}

export default function AIAnalysisCard({
  claimId,
  itemDetails,
  claimantDetails,
}: AIAnalysisCardProps) {
  const [analysis, setAnalysis] = useState<AIAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/claims/${claimId}/ai-analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token')
            ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
            : {}),
        },
        body: JSON.stringify({
          itemTitle: itemDetails.title,
          itemDescription: itemDetails.description,
          privateDetails: itemDetails.privateDetails,
          itemCategory: itemDetails.category,
          itemLocation: itemDetails.location,
          claimantName: claimantDetails.name,
          claimantContact: claimantDetails.contact,
          verificationAnswers: claimantDetails.verificationAnswers,
        }),
      });

      if (!res.ok) {
        throw new Error('Analysis request failed');
      }

      const data = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      setError('Could not calculate match. Please click retry.');
    } finally {
      setLoading(false);
    }
  };

  const getMatchBadge = (score: number) => {
    if (score >= 75) {
      return {
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        dot: 'bg-emerald-500',
        label: 'Strong Match',
      };
    }
    if (score >= 50) {
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-800',
        dot: 'bg-amber-500',
        label: 'Moderate Match',
      };
    }
    return {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      dot: 'bg-rose-500',
      label: 'Low Match',
    };
  };

  return (
    <div className="mt-3 p-3 sm:p-3.5 bg-orange-50/40 border border-orange-200/80 rounded-xl text-xs">
      
      {/* State 1: Idle (Not analyzed yet) */}
      {!analysis && !loading && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#ef7d00]/10 text-[#ef7d00] rounded-md">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-slate-800 text-xs">AI Match Check</div>
              <div className="text-slate-500 text-[11px]">
                Compares the student's answer with hidden custody clues to give you a quick match %
              </div>
            </div>
          </div>

          <button
            onClick={runAnalysis}
            className="self-start sm:self-center px-3 py-1.5 bg-[#ef7d00] hover:bg-[#d67000] text-white font-bold rounded-lg shadow-2xs transition-colors cursor-pointer text-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Check Match Score
          </button>
        </div>
      )}

      {/* State 2: Loading */}
      {loading && (
        <div className="flex items-center gap-2.5 py-1 text-slate-600">
          <Loader2 className="w-4 h-4 text-[#ef7d00] animate-spin" />
          <span className="font-medium">
            Checking student description against private custody clues...
          </span>
        </div>
      )}

      {/* State 3: Error */}
      {error && (
        <div className="flex items-center justify-between text-rose-600 py-1">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <button
            onClick={runAnalysis}
            className="font-bold underline text-xs ml-2 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* State 4: Result Display in Simple Everyday Language */}
      {analysis && !loading && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            
            {/* Score & Simple Verdict */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-extrabold text-xs ${
                  getMatchBadge(analysis.matchPercentage).bg
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    getMatchBadge(analysis.matchPercentage).dot
                  }`}
                />
                <span>{analysis.matchPercentage}% Match</span>
                <span className="text-[11px] font-semibold opacity-80">
                  ({getMatchBadge(analysis.matchPercentage).label})
                </span>
              </div>

              {/* Simple 1-sentence verdict */}
              <span className="text-slate-800 font-medium text-xs leading-snug">
                {analysis.summary}
              </span>
            </div>

            {/* Toggle Details & Re-run */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              <button
                onClick={() => setExpanded(!expanded)}
                className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{expanded ? 'Hide Details' : 'Show Details'}</span>
                {expanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={runAnalysis}
                title="Re-run Check"
                className="p-1 text-slate-500 hover:text-[#ef7d00] bg-white border border-slate-300 rounded-md cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Simple breakdown if expanded */}
          {expanded && (
            <div className="pt-2.5 border-t border-orange-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* What matched */}
              <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200">
                <span className="font-bold text-emerald-800 block mb-1">
                  What Matched Correctly:
                </span>
                <ul className="space-y-1 text-slate-700">
                  {analysis.matchingPoints.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What to check / missing */}
              <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200">
                <span className="font-bold text-amber-800 block mb-1">
                  Things to Keep in Mind:
                </span>
                <ul className="space-y-1 text-slate-700">
                  {analysis.discrepancies.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-black">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Security Officer Next Step */}
              <div className="sm:col-span-2 bg-orange-100/60 p-2.5 rounded-lg border border-orange-200 text-slate-800">
                <strong className="text-orange-950 font-bold">Recommended Step for Officer: </strong>
                <span>{analysis.recommendationAction}</span>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
