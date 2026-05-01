import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import NewRepairForm from './NewRepairForm';
import RepairsList from './RepairsList';
import ReceiptPrint from './ReceiptPrint';
import { 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  ListFilter,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const { fetchRepairs, fetchStats } = useAppStore();
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isListOpen, setIsListOpen] = useState(true);

  useEffect(() => {
    fetchRepairs();
    fetchStats();
  }, [fetchRepairs, fetchStats]);

  return (
    <main className="flex-1 flex overflow-hidden bg-[#f8fafc] dark:bg-[#020617] relative">
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
              <div className="w-2 h-8 bg-primary rounded-full"></div>
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
          
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200/60 dark:border-slate-800/60 overflow-hidden flex flex-col">
            <NewRepairForm />
          </div>
        </section>

        {/* List Section */}
        <section className={`flex flex-col min-h-0 transition-all duration-500 ${
          !isListOpen ? 'hidden' : 'block animate-slide-up'
        }`}>
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-secondary rounded-full"></div>
              <h2 className="text-xl font-black tracking-tight uppercase text-slate-800 dark:text-white">
                {t('dashboard.repairsList')}
              </h2>
            </div>
            <div className="flex gap-2">
               {!isFormOpen && (
                 <button 
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                 >
                   <PlusCircle size={16} />
                   {t('dashboard.newRepair')}
                 </button>
               )}
               <button 
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-500 hover:text-primary transition-all shadow-sm"
              >
                {isFormOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
            <RepairsList />
          </div>
        </section>
      </div>

      <ReceiptPrint />
    </main>
  );
}
