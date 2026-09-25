import { useState, useEffect } from 'react';
import { ShieldCheck, Building2, CheckCircle } from 'lucide-react';
import type { Item } from '../types';
import AdminStats from '../Components/Admin/AdminStats';
import AdminTabs from '../Components/Admin/AdminTabs';
import type { AdminTabType } from '../Components/Admin/AdminTabs';
import ClaimVerificationCard, { type ClaimData } from '../Components/Admin/ClaimVerificationCard.tsx';
import InventoryTable from '../Components/Admin/InventoryTable';
import HandoverQueue from '../Components/Admin/HandOverQueue';
import DisposalQueue from '../Components/Admin/DisposalQueue';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTabType>('claims');
  const [pendingClaims, setPendingClaims] = useState<ClaimData[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch claims and reported items
  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    // 1. Fetch claims
    fetch('/api/claims', { headers })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPendingClaims(data.filter((c: ClaimData) => c.status === 'pending'));
        } else {
          setPendingClaims([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch claims:', err);
        setPendingClaims([]);
        setLoading(false);
      });

    // 2. Fetch all inventory items
    fetch('/api/items/admin/all')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllItems(data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch inventory:', err);
      });
  }, []);

  // Handle Approve
  const handleApprove = async (claimId: string) => {
    try {
      const res = await fetch(`/api/claims/${claimId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token')
            ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
            : {}),
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (res.ok) {
        setPendingClaims(prev => prev.filter(c => c.id !== claimId));
        alert('Claim approved. Handover OTP has been generated for the student.');
      }
    } catch (err) {
      console.error('Error approving claim:', err);
    }
  };

  // Handle Reject
  const handleReject = async (claimId: string) => {
    if (!confirm('Reject this ownership claim?')) return;
    try {
      const res = await fetch(`/api/claims/${claimId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token')
            ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
            : {}),
        },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (res.ok) {
        setPendingClaims(prev => prev.filter(c => c.id !== claimId));
      }
    } catch (err) {
      console.error('Error rejecting claim:', err);
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-[#f8fafc]">
      {/* LPU Institutional Top Stripe */}
      <div className="h-1.5 w-full bg-linear-to-r from-[#ef7d00] via-[#f37021] to-[#e65c00]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* LPU University Portal Header */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 mb-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {/* LPU Emblem & Badge */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200/70 text-[11px] font-bold text-[#d67000] mb-2.5">
                <Building2 className="w-3.5 h-3.5 text-[#ef7d00]" />
                <span>Lovely Professional University • Security & Custody UMS</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Campus Custody & Verification Desk
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                Compare student claims with finder notes, review the instant AI match score in simple words, and authorize physical handovers.
              </p>
            </div>

            {/* Quick Status Tag */}
            <div className="shrink-0 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Desk Station</span>
                <strong className="text-slate-800 font-bold">Block 32 Security Office</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 1. LPU-Styled Stats Overview */}
        <AdminStats
          pendingClaimsCount={pendingClaims.length}
          totalItemsCount={allItems.length}
          handoverCount={2}
        />

        {/* 2. LPU Orange Segmented Navigation Tabs */}
        <AdminTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingClaimsCount={pendingClaims.length}
          totalItemsCount={allItems.length}
        />

        {/* 3. Tab Contents */}
        {activeTab === 'claims' && (
          <div className="space-y-4">
            {pendingClaims.map(claim => (
              <ClaimVerificationCard
                key={claim.id}
                claim={claim}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}

            {pendingClaims.length === 0 && !loading && (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 shadow-2xs">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h3 className="font-bold text-slate-800 text-sm">All verification claims cleared</h3>
                <p className="text-slate-400 mt-0.5">New student claims will appear here automatically.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-2xs">
            <InventoryTable items={allItems} />
          </div>
        )}

        {activeTab === 'handover' && (
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-2xs">
            <HandoverQueue />
          </div>
        )}

        {activeTab === 'disposal' && (
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-2xs">
            <DisposalQueue />
          </div>
        )}

      </div>
    </div>
  );
}
