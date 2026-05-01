import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ShieldCheck
} from 'lucide-react';

export default function Sidebar() {
  const { t } = useTranslation();
  const { stats } = useAppStore();

  return (
    <aside className="w-[280px] bg-white dark:bg-slate-900 border-e border-slate-200/50 dark:border-slate-800/60 flex flex-col z-50">
      {/* Brand Section */}
      <div className="p-8 pb-10">
        <div className="flex flex-col items-center text-center group">
          <div className="relative mb-6 flex justify-center">
            <img 
              src="/logo.png" 
              alt="MobiShop" 
              className="w-28 h-28 object-contain group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
          <div className="space-y-1">
            <h1 className="font-black text-[1.75rem] tracking-tighter text-slate-800 dark:text-white leading-none flex items-center justify-center">
              MOBI<span className="text-primary">SHOP</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="h-px w-4 bg-secondary/50 rounded-full"></div>
              <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 tracking-[0.4em] uppercase">Maintenance Pro</p>
              <div className="h-px w-4 bg-secondary/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex-1 px-6 py-2 space-y-8 overflow-y-auto custom-scrollbar">
        <div>
          <div className="flex items-center gap-2 px-4 mb-6">
            <div className="w-1.5 h-4 bg-primary/40 rounded-full"></div>
            <h2 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              {t('dashboard.stats')}
            </h2>
          </div>
          
          <div className="space-y-4">
            <StatItem 
              icon={<LayoutDashboard size={20} />} 
              label={t('dashboard.totalToday')} 
              value={stats.total_repairs_today.toString()} 
              color="blue"
            />
            <StatItem 
              icon={<TrendingUp size={20} />} 
              label={t('dashboard.revenue')} 
              value={`${stats.revenue.toLocaleString()} DZD`} 
              color="cyan"
            />
            <StatItem 
              icon={<ShieldCheck size={20} />} 
              label={t('dashboard.netProfit')} 
              value={`${stats.net_profit.toLocaleString()} DZD`} 
              color="orange"
            />
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="p-8 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="text-center">
          <div className="inline-block px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
            <span className="text-[9px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase">
              DEVLOPED BY <span className="text-primary">LOGICCRAFTERDZ</span>
            </span>
          </div>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">© 2024 MobiShop Chlef</p>
        </div>
      </div>
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
    <div className="group px-5 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-[1.5rem] flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5">
      <div className={`p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tight">{label}</p>
        <p className="text-xl font-black tracking-tighter text-slate-800 dark:text-white leading-none mt-1">{value}</p>
      </div>
    </div>
  );
}
