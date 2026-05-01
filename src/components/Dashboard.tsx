import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import NewRepairForm from './NewRepairForm';
import RepairsList from './RepairsList';
import ReceiptPrint from './ReceiptPrint';
import SettingsModal from './SettingsModal';
import { 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  Maximize2,
  Minimize2,
  Settings as SettingsIcon,
  Languages
} from 'lucide-react';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { fetchRepairs, fetchStats, language, setLanguage } = useAppStore();
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isListOpen, setIsListOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    fetchRepairs();
    fetchStats();
  }, [fetchRepairs, fetchStats]);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc] dark:bg-[#020617] relative">
      
      {/* Top Header Bar */}
      <header className="h-16 px-8 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-40">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
            {t('dashboard.title')}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <HeaderAction 
            icon={<Languages size={20} />} 
            onClick={toggleLanguage}
            tooltip={language === 'en' ? 'العربية' : 'English'}
          />
          <HeaderAction 
            icon={<SettingsIcon size={20} />} 
            onClick={() => setIsSettingsOpen(true)}
            tooltip={t('common.settings')}
          />
        </div>
      </header>

      {/* Dynamic Grid Layout */}
      <div className={`flex-1 grid transition-all duration-500 ease-in-out gap-6 p-6 ${
        isFormOpen && isListOpen ? 'grid-cols-1 xl:grid-cols-[450px_1fr]' : 'grid-cols-1'
      }`}>
        
        {/* Form Section */}
        <section className={`flex flex-col min-h-0 transition-all duration-500 ${
          !isFormOpen ? 'hidden' : 'block animate-slide-up'
        }`}>
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
              <h2 className="text-xl font-black tracking-tight uppercase text-slate-800 dark:text-white">
                {t('dashboard.newRepair')}
              </h2>
            </div>
            <button 
              onClick={() => setIsListOpen(!isListOpen)}
              className="hidden xl:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
            >
              {isListOpen ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              {isListOpen ? 'Focus Form' : 'Show List'}
            </button>
          </div>
          
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200/60 dark:border-slate-800/60 overflow-hidden flex flex-col">
            <NewRepairForm />
          </div>
        </section>

        {/* List Section */}
        <section className={`flex flex-col min-h-0 transition-all duration-500 ${
          !isListOpen ? 'hidden' : 'block animate-slide-up'
        }`}>
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-secondary rounded-full shadow-[0_0_15px_rgba(var(--secondary),0.5)]"></div>
              <h2 className="text-xl font-black tracking-tight uppercase text-slate-800 dark:text-white">
                {t('dashboard.repairsList')}
              </h2>
            </div>
            <div className="flex gap-2">
               {!isFormOpen && (
                 <button 
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                 >
                   <PlusCircle size={16} />
                   {t('dashboard.newRepair')}
                 </button>
               )}
               <button 
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-500 hover:text-primary transition-all shadow-sm hover:shadow-md"
              >
                {isFormOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
            <RepairsList />
          </div>
        </section>
      </div>

      <ReceiptPrint />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </main>
  );
}

function HeaderAction({ icon, onClick, tooltip }: { icon: React.ReactNode, onClick: () => void, tooltip: string }) {
  return (
    <button 
      onClick={onClick}
      title={tooltip}
      className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-primary hover:border-primary/50 transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center"
    >
      {icon}
    </button>
  );
}
