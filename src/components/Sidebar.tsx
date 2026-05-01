import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { 
  LayoutDashboard, 
  Languages, 
  TrendingUp, 
  Settings as SettingsIcon,
  ShieldCheck
} from 'lucide-react';
import SettingsModal from './SettingsModal';

export default function Sidebar() {
  const { t } = useTranslation();
  const { language, setLanguage, stats } = useAppStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-e border-slate-200/60 dark:border-slate-800/60 flex flex-col shadow-sm z-50">
      {/* Brand Section */}
      <div className="p-8 pb-6">
        <div className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all duration-500"></div>
            <img src="/logo.png" alt="MobiShop" className="w-12 h-12 relative z-10 drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-slate-800 dark:text-white leading-none">
              MOBI<span className="text-primary">SHOP</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase mt-1">Maintenance</p>
          </div>
        </div>
      </div>

      {/* Navigation & Stats Section */}
      <div className="flex-1 px-4 py-2 space-y-6 overflow-y-auto custom-scrollbar">
        <div>
          <h2 className="px-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mb-4">
            {t('dashboard.stats')}
          </h2>
          
          <div className="space-y-3">
            {/* Stat Cards */}
            <StatItem 
              icon={<LayoutDashboard size={18} />} 
              label={t('dashboard.totalToday')} 
              value={stats.total_repairs_today.toString()} 
              color="blue"
            />
            <StatItem 
              icon={<TrendingUp size={18} />} 
              label={t('dashboard.revenue')} 
              value={`${stats.revenue.toLocaleString()} DZD`} 
              color="cyan"
            />
            <StatItem 
              icon={<ShieldCheck size={18} />} 
              label={t('dashboard.netProfit')} 
              value={`${stats.net_profit.toLocaleString()} DZD`} 
              color="orange"
            />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-col gap-1">
          <SidebarAction 
            icon={<SettingsIcon size={20} />} 
            label={t('common.settings')} 
            onClick={() => setIsSettingsOpen(true)} 
          />
          <SidebarAction 
            icon={<Languages size={20} />} 
            label={language === 'en' ? 'العربية' : 'English'} 
            onClick={toggleLanguage} 
          />
        </div>
        
        <div className="mt-6 text-center">
          <div className="inline-block px-3 py-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-full">
            <span className="text-[9px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase">
              DEVLOPED BY <span className="text-primary">LOGICCRAFTERDZ</span>
            </span>
          </div>
          <p className="text-[8px] text-slate-400 mt-2 font-medium">© 2024 ALL RIGHTS RESERVED</p>
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </aside>
  );
}

function StatItem({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: 'blue' | 'cyan' | 'orange' }) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    cyan: "bg-primary/10 text-primary",
    orange: "bg-secondary/10 text-secondary"
  };

  return (
    <div className="group px-4 py-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 hover:border-primary/20">
      <div className={`p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110 ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{label}</p>
        <p className="text-lg font-black tracking-tight text-slate-800 dark:text-white leading-none mt-1">{value}</p>
      </div>
    </div>
  );
}

function SidebarAction({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all duration-200 text-slate-600 dark:text-slate-300 hover:text-primary group"
    >
      <div className="text-slate-400 group-hover:text-primary transition-colors">
        {icon}
      </div>
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </button>
  );
}
