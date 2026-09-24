import { useState } from 'react';

interface DisposalItem {
  id: string;
  itemTitle: string;
  reportedDate: string;
  daysInCustody: number;
  status: string;
}

export default function DisposalQueue() {
  const [queue, setQueue] = useState<DisposalItem[]>([
    {
      id: 'D-001',
      itemTitle: 'Generic Blue Umbrella',
      reportedDate: '2026-05-10',
      daysInCustody: 108,
      status: 'Ready for Disposal',
    },
    {
      id: 'D-002',
      itemTitle: 'Stainless Steel Water Bottle',
      reportedDate: '2026-06-01',
      daysInCustody: 86,
      status: 'Ready for Disposal',
    },
    {
      id: 'D-003',
      itemTitle: 'Black Notebook / Spiral Register',
      reportedDate: '2026-05-18',
      daysInCustody: 99,
      status: 'Ready for Disposal',
    },
  ]);

  const handleAction = (id: string, action: string) => {
    alert(`Item ${id} logged as: ${action}`);
    setQueue(queue.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="pb-3 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900">Overdue Items (90+ Days)</h2>
        <p className="text-xs text-slate-500">
          Items that have exceeded university custody policy retention. Select an action to clear the record.
        </p>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <th className="px-3.5 py-2.5 font-medium">Item</th>
              <th className="px-3.5 py-2.5 font-medium">Reported Date</th>
              <th className="px-3.5 py-2.5 font-medium">Days in Custody</th>
              <th className="px-3.5 py-2.5 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {queue.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-3.5 py-2.5 font-semibold text-slate-800">{item.itemTitle}</td>
                <td className="px-3.5 py-2.5 text-slate-500">{item.reportedDate}</td>
                <td className="px-3.5 py-2.5 text-rose-600 font-medium">{item.daysInCustody} days</td>
                <td className="px-3.5 py-2.5 text-right space-x-1.5">
                  <button
                    onClick={() => handleAction(item.id, 'Donated')}
                    className="px-2 py-1 text-slate-600 hover:text-slate-900 border border-slate-200 rounded text-[11px] cursor-pointer"
                  >
                    Donate
                  </button>
                  <button
                    onClick={() => handleAction(item.id, 'Scrapped')}
                    className="px-2 py-1 text-slate-600 hover:text-slate-900 border border-slate-200 rounded text-[11px] cursor-pointer"
                  >
                    Scrap
                  </button>
                </td>
              </tr>
            ))}

            {queue.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-slate-400">
                  No items currently overdue for retention disposal.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
