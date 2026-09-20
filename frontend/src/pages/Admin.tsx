import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, Clock, Trash2, KeyRound, Search, FileText, AlertTriangle, Fingerprint } from 'lucide-react';
import Button from '../Components/Button';

interface ClaimData {
  id: string;
  itemId: {
    id: string;
    title: string;
    privateDetails: string;
  };
  claimantName: string;
  claimantContact: string;
  verificationAnswers: string;
  status: string;
  createdAt: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'claims' | 'handover' | 'disposal'>('claims');
  const [pendingClaims, setPendingClaims] = useState<ClaimData[]>([]);

  // Fetch claims from backend
  useEffect(() => {
    fetch('')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filter only pending claims for the queue
          const pending = data.filter((c: ClaimData) => c.status === 'pending');
          setPendingClaims(pending);
        } else {
          console.error('API did not return an array:', data);
          setPendingClaims([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch claims:', err);
        setPendingClaims([]);
      });
  }, []);

  // Handle Approve/Reject
  const handleStatusUpdate = async (claimId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/claims/${claimId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        // Remove it from the pending list on the UI
        setPendingClaims(pendingClaims.filter(c => c.id !== claimId));
        alert(`Claim has been ${newStatus}.`);
      }
    } catch (err) {
      console.error('Error updating claim:', err);
    }
  };

  // Static mock data for other tabs to keep UI populated for demo
  const handoverQueue = [
    { id: 'H-001', claimId: 'C-003', itemTitle: 'Black Leather Wallet', claimant: 'Mike Johnson', status: 'Awaiting Handover', location: 'Security Block A' }
  ];

  const disposalQueue = [
    { id: 'D-001', itemTitle: 'Generic Blue Umbrella', reportedDate: '2026-05-10', daysInCustody: 108, status: 'Ready for Disposal' },
    { id: 'D-002', itemTitle: 'Water Bottle', reportedDate: '2026-06-01', daysInCustody: 86, status: 'Ready for Disposal' }
  ];

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="inline-flex items-center gap-2 bg-[#ef7d00]/10 border border-[#ef7d00]/30 rounded-full px-3 py-1 text-xs font-bold text-[#d67000] mb-2">
          <ShieldCheck className="w-3 h-3" />
          Security Personnel Only
        </div>
        <h1 className="text-2xl sm:text-3xl font-black mb-1 tracking-tight text-slate-900">Security Dashboard</h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">Manage claims, custody chain, and verifications.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mb-12 sm:mb-16">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Return Rate</div>
            <div className="text-2xl font-black text-emerald-600">68.4%</div>
            <div className="text-xs text-slate-400 mt-1">Total: 412 Items Returned</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Pending Claims</div>
            <div className="text-2xl font-black text-[#ef7d00]">{pendingClaims.length}</div>
            <div className="text-xs text-slate-400 mt-1">Awaiting Verification</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Ready for Handover</div>
            <div className="text-2xl font-black text-blue-600">5</div>
            <div className="text-xs text-slate-400 mt-1">Verified Claims</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Disposal Queue</div>
            <div className="text-2xl font-black text-red-600">42</div>
            <div className="text-xs text-slate-400 mt-1">&gt; 90 Days Unclaimed</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-t-xl border-b border-slate-200 overflow-x-auto shadow-sm">
          <button 
            onClick={() => setActiveTab('claims')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'claims' ? 'border-[#ef7d00] text-[#ef7d00]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Search className="w-4 h-4" />
            Verification Queue
          </button>
          <button 
            onClick={() => setActiveTab('handover')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'handover' ? 'border-[#ef7d00] text-[#ef7d00]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <KeyRound className="w-4 h-4" />
            Supervised Handover
          </button>
          <button 
            onClick={() => setActiveTab('disposal')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'disposal' ? 'border-[#ef7d00] text-[#ef7d00]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Trash2 className="w-4 h-4" />
            Ageing & Disposal
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-b-xl shadow-sm border border-t-0 border-slate-200">
          
          {activeTab === 'claims' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Pending Verification Challenges</h2>
                <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded">Action Required</span>
              </div>
              
              <div className="space-y-4">
                {pendingClaims.map(claim => (
                  <div key={claim.id} className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <div>
                          <span className="font-bold text-slate-800">{claim.itemId?.title || 'Unknown Item'}</span>
                          <span className="text-slate-400 text-xs ml-2">Claim ID: {claim.id}</span>
                        </div>
                      </div>
                      <div className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-1 rounded">
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Fingerprint className="w-3 h-3"/> Original Private Details</h4>
                        <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm font-medium text-slate-700 italic">
                          "{claim.itemId?.privateDetails || 'No private details recorded.'}"
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Claimant's Challenge Answer</h4>
                        <div className="bg-orange-50 p-3 rounded border border-orange-100 text-sm font-medium text-slate-700">
                          "{claim.verificationAnswers}"
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-slate-500">Claimant: <span className="font-bold">{claim.claimantName}</span> ({claim.claimantContact})</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(claim.id, 'rejected')}
                      >
                        Reject Claim
                      </Button>
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => handleStatusUpdate(claim.id, 'approved')}
                      >
                        Approve & Generate OTP
                      </Button>
                    </div>
                  </div>
                ))}
                
                {pendingClaims.length === 0 && (
                  <div className="text-center py-10 bg-slate-50 rounded-lg border border-slate-200">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-600">All caught up! No pending claims.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'handover' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Supervised Handovers</h2>
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">Custody Chain</span>
              </div>
              <p className="text-sm text-slate-500 mb-4">Verify the claimant in person and log the secure handover.</p>
              
              <div className="space-y-4">
                {handoverQueue.map(handover => (
                  <div key={handover.id} className="border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{handover.itemTitle}</h3>
                      <div className="flex items-center gap-4 text-xs mt-1">
                        <span className="text-slate-500">Claimant: <span className="font-bold text-slate-700">{handover.claimant}</span></span>
                        <span className="text-slate-500">Location: <span className="font-bold text-slate-700">{handover.location}</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <input 
                        type="text" 
                        placeholder="Enter 6-Digit User OTP" 
                        className="flex-1 md:w-48 px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-[#ef7d00] outline-none font-mono text-center tracking-widest"
                        maxLength={6}
                      />
                      <button className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all whitespace-nowrap flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Execute Handover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'disposal' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Ageing & Disposal Queue</h2>
                <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded">Requires Action</span>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  These items have exceeded the configured retention period (90 days). Review and record their disposal method (Donation, Destruction, or Auction) to maintain the audit log.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-200">
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Item ID</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Reported Date</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Age</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {disposalQueue.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-mono text-slate-500">{item.id}</td>
                        <td className="px-4 py-3 text-sm font-bold text-slate-800">{item.itemTitle}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">{item.reportedDate}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center gap-1 w-max">
                            <Clock className="w-3 h-3" /> {item.daysInCustody} days
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="secondary" size="sm">
                            Log Disposal
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
