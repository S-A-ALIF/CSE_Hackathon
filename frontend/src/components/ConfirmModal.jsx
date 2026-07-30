import React, { useState, useEffect } from 'react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // 'danger' | 'warning' | 'info'
  loading = false,
  requireInput = false,
  requireInputText = "delete"
}) {
  const [inputVal, setInputVal] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputVal('');
      setInternalLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfirmDisabled = loading || internalLoading || (requireInput && inputVal.trim().toLowerCase() !== requireInputText.toLowerCase());

  const handleConfirm = async () => {
    setInternalLoading(true);
    try {
      await onConfirm();
    } finally {
      setInternalLoading(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          iconBg: 'bg-amber-100 text-amber-600',
          confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100 text-blue-600',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'danger':
      default:
        return {
          iconBg: 'bg-rose-100 text-rose-600',
          confirmBtn: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 relative border border-slate-100 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${styles.iconBg}`}>
            {styles.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-black text-slate-900 leading-tight">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {requireInput && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Please type <span className="text-rose-600 font-mono font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 select-all">{requireInputText}</span> to confirm.
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={requireInputText}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium text-slate-900"
            />
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            type="button"
            disabled={loading || internalLoading}
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isConfirmDisabled}
            onClick={handleConfirm}
            className={`w-full sm:w-auto px-5 py-2.5 font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${styles.confirmBtn}`}
          >
            {(loading || internalLoading) && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
