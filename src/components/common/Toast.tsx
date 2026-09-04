import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useTrading } from '../../context/TradingContext';

export const Toast: React.FC = () => {
  const { toast, showToast } = useTrading();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#F2C94C] shrink-0" />,
    info: <Info className="w-5 h-5 text-gray-300 shrink-0" />
  };

  const borderColors = {
    success: 'border-green-500/40 bg-[#1A1A1A] text-white',
    error: 'border-red-500/40 bg-[#1A1A1A] text-white',
    warning: 'border-[#F2C94C]/40 bg-[#1A1A1A] text-white',
    info: 'border-[#333] bg-[#1A1A1A] text-white'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-2xl shadow-black/80 ${borderColors[toast.type]}`}>
        {icons[toast.type]}
        <div className="flex-1 text-xs font-medium leading-relaxed pr-2">
          {toast.message}
        </div>
        <button
          onClick={() => showToast('', 'info')}
          className="text-gray-400 hover:text-white p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
