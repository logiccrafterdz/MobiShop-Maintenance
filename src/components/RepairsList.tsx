import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

export default function RepairsList() {
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t('common.search')} 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900">
          <option value="">All Statuses</option>
          <option value="Pending">{t('table.statusPending')}</option>
          <option value="In Progress">{t('table.statusInProgress')}</option>
          <option value="Ready">{t('table.statusReady')}</option>
          <option value="Delivered">{t('table.statusDelivered')}</option>
        </select>
      </div>
      
      <div className="flex-1 overflow-auto border border-slate-200 dark:border-slate-700 rounded-lg">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 sticky top-0">
            <tr>
              <th className="p-4 font-medium">{t('table.id')}</th>
              <th className="p-4 font-medium">{t('table.customer')}</th>
              <th className="p-4 font-medium">{t('table.device')}</th>
              <th className="p-4 font-medium">{t('table.status')}</th>
              <th className="p-4 font-medium">{t('table.deposit')}</th>
              <th className="p-4 font-medium">{t('table.estCost')}</th>
              <th className="p-4 font-medium">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="p-4 text-center text-slate-400 dark:text-slate-500" colSpan={7}>
                No repairs found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
