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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Printer size={20} />
            </div>
            <h2 className="text-xl font-bold">{t('common.settings')}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchPrinters()} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500" title="Refresh Printers">
              <RefreshCw size={18} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {t('settings.receiptPrinter') || 'Receipt Printer (80mm)'}
            </label>
            <select 
              value={settings.receipt_printer || ''}
              onChange={(e) => updateSetting('receipt_printer', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="">Select Printer</option>
              {printers.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {t('settings.stickerPrinter') || 'Sticker Printer'}
            </label>
            <select 
              value={settings.sticker_printer || ''}
              onChange={(e) => updateSetting('sticker_printer', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="">Select Printer</option>
              {printers.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
          >
            <Check size={18} />
            {t('common.done') || 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
