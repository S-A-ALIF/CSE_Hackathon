import { useState, useEffect } from 'react';

const PREDEFINED_REASONS = [
  "Plagiarism / Cheating",
  "Inappropriate Conduct",
  "Spam / Abuse",
  "Violation of Hackathon Rules",
  "Invalid Team Composition",
  "Batch/Session Discrepancy (Seniority Rule Violation)",
  "Other (Custom)"
];

export default function BanModal({ isOpen, onClose, onConfirm, entityName, isBanning }) {
  const [reasonType, setReasonType] = useState(PREDEFINED_REASONS[0]);
  const [customReason, setCustomReason] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setReasonType(PREDEFINED_REASONS[0]);
      setCustomReason("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalReason = null;
    if (isBanning) {
      finalReason = reasonType === "Other (Custom)" ? customReason.trim() : reasonType;
    }
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 border-b ${isBanning ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
          <div className="flex justify-between items-center">
            <h3 className={`text-xl font-bold ${isBanning ? 'text-red-700' : 'text-green-700'}`}>
              {isBanning ? `Ban ${entityName}` : `Unban ${entityName}`}
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-slate-600 mb-4">
            {isBanning 
              ? `Are you sure you want to ban ${entityName}? They will be locked out of participation.`
              : `Are you sure you want to unban ${entityName}? They will regain full access.`}
          </p>

          {isBanning && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Select Reason</label>
                <select
                  value={reasonType}
                  onChange={(e) => setReasonType(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required={isBanning}
                >
                  {PREDEFINED_REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {reasonType === "Other (Custom)" && (
                <div className="animate-in slide-in-from-top-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Custom Reason</label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[80px]"
                    placeholder="Enter explicit reason..."
                    required={isBanning && reasonType === "Other (Custom)"}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 font-bold text-white rounded-lg transition-colors ${
                isBanning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isBanning ? 'Ban Now' : 'Unban'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
