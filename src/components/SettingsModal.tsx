import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { X, Printer, Check, RefreshCw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { t } = useTranslation();
  const { printers, settings, fetchPrinters, fetchSettings, updateSetting } = useAppStore();

  useEffect(() => {
    if (isOpen) {
      fetchPrinters();
      fetchSettings();
    }
  }, [isOpen, fetchPrinters, fetchSettings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-2xl">
              <Printer size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white leading-none">
                {t('common.settings')}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">System Configuration</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Printer Setup</h3>
            <button 
              onClick={() => fetchPrinters()} 
              className="flex items-center gap-2 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase"
            >
              <RefreshCw size={12} />
              Refresh List
            </button>
          </div>

          <div className="space-y-6">
            <PrinterSelector 
              label={t('settings.receiptPrinter')}
              value={settings.receipt_printer || ''}
              onChange={(val) => updateSetting('receipt_printer', val)}
              printers={printers}
            />

            <PrinterSelector 
              label={t('settings.stickerPrinter')}
              value={settings.sticker_printer || ''}
              onChange={(val) => updateSetting('sticker_printer', val)}
              printers={printers}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50/80 dark:bg-slate-800/50 flex justify-end">
          <button 
            onClick={onClose}
            className="group flex items-center gap-3 bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-xl"
          >
            <Check size={18} className="group-hover:scale-125 transition-transform" />
            {t('common.done')}
          </button>
        </div>
      </div>
    </div>
  );
}

function PrinterSelector({ label, value, onChange, printers }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">
        {label}
      </label>
      <div className="relative">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer hover:border-primary/50 transition-all"
        >
          <option value="">-- No Printer Selected --</option>
          {printers.map((p: string) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
}

function ChevronDown({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
