import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import NewRepairForm from './NewRepairForm';
import RepairsList from './RepairsList';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <main className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
        {/* Top Collapsible Form */}
        <section className={`transition-all duration-300 ease-in-out flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${isFormOpen ? 'h-[35%]' : 'h-14'}`}>
          <div 
            className="flex items-center justify-between p-4 cursor-pointer select-none"
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            <h2 className="text-lg font-semibold">{t('dashboard.newRepair')}</h2>
            <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
              {isFormOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          {isFormOpen && (
            <div className="p-4 pt-0 flex-1 overflow-y-auto">
              <NewRepairForm />
            </div>
          )}
        </section>

        {/* Bottom Data Table */}
        <section className={`transition-all duration-300 ease-in-out flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden`}>
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold">{t('dashboard.records')}</h2>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <RepairsList />
          </div>
        </section>
      </main>
    </div>
  );
}
