import { useState } from 'react';

interface HandoverItem {
  id: string;
  claimId: string;
  itemTitle: string;
  claimant: string;
  status: string;
  location: string;
}

export default function HandoverQueue() {
  const [handovers, setHandovers] = useState<HandoverItem[]>([
    {
      id: 'H-001',
      claimId: 'C-003',
      itemTitle: 'Black Leather Wallet',
      claimant: 'Mike Johnson (12408912)',
      status: 'Awaiting Handover',
      location: 'Block 32 Security Office',
    },
    {
      id: 'H-002',
      claimId: 'C-005',
      itemTitle: 'Casio fx-991EX Calculator',
      claimant: 'Aarav Sharma (12401124)',
      status: 'Awaiting Handover',
      location: 'Block 34 Helpdesk',
    },
  ]);

  const [otpInputs, setOtpInputs] = useState<{ [id: string]: string }>({});

  const handleExecute = (id: string) => {
    const otp = otpInputs[id];
    if (!otp || otp.length < 4) {
      alert('Please enter the OTP provided by the claimant.');
      return;
    }
    alert(`Handover verified! Item custody transferred.`);
    setHandovers(handovers.filter(h => h.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="pb-3 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900">In-Person Handover Desk</h2>
        <p className="text-xs text-slate-500">
          Enter the student's 6-digit OTP code to verify and release items at the security counter.
        </p>
      </div>

      <div className="space-y-3">
        {handovers.map(item => (
          <div
            key={item.id}
            className="border border-slate-200 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white text-xs"
          >
            <div>
              <div className="font-semibold text-slate-900 text-sm">{item.itemTitle}</div>
              <div className="text-slate-500 mt-0.5">
                Claimant: <span className="text-slate-700 font-medium">{item.claimant}</span> ·{' '}
                <span>{item.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="6-Digit OTP"
                value={otpInputs[item.id] || ''}
                onChange={e =>
                  setOtpInputs({ ...otpInputs, [item.id]: e.target.value.toUpperCase() })
                }
                className="w-32 px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-mono text-center tracking-wider outline-none focus:border-[#ef7d00]"
                maxLength={6}
              />
              <button
                onClick={() => handleExecute(item.id)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition-colors cursor-pointer"
              >
                Confirm Release
              </button>
            </div>
          </div>
        ))}

        {handovers.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-400">
            No items awaiting physical handover.
          </div>
        )}
      </div>
    </div>
  );
}
