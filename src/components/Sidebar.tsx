import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { LayoutDashboard, Languages, TrendingUp, DollarSign, PenTool } from 'lucide-react';

export default function Sidebar() {
  const { t } = useTranslation();
  const { language, setLanguage, stats } = useAppStore();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-e border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-700">
        <div className="bg-primary/10 text-primary p-2 rounded-lg">
          <PenTool size={24} />
        </div>
        <h1 className="font-bold text-lg leading-tight">{t('dashboard.title')}</h1>
      </div>

      <div className="p-4 flex-1 space-y-4 overflow-y-auto">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('dashboard.stats')}</h2>
        
        {/* Stat Cards Connected to Backend */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-lg">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.totalToday')}</p>
            <p className="text-xl font-bold">{stats.total_repairs_today}</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.revenue')}</p>
            <p className="text-xl font-bold">{stats.revenue.toFixed(2)} DZD</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-lg">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.netProfit')}</p>
            <p className="text-xl font-bold">{stats.net_profit.toFixed(2)} DZD</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
        >
          <Languages size={20} />
          <span className="font-medium">{language === 'en' ? 'العربية' : 'English'}</span>
        </button>
      </div>
    </aside>
  );
}
