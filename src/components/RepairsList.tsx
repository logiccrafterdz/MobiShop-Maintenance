import { useTranslation } from 'react-i18next';
import { Search, Edit, Trash2, CheckCircle } from 'lucide-react';
import { useAppStore, Repair } from '../store';
import { useState } from 'react';

export default function RepairsList() {
  const { t } = useTranslation();
  const { repairs, updateRepairStatus, deleteRepair } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredRepairs = repairs.filter((r) => {
    const matchesSearch = r.repair_id.toLowerCase().includes(search.toLowerCase()) ||
                          r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
                          r.customer_phone.includes(search);
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t('common.search')} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900"
        >
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
              <th className="p-4 font-medium text-center">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredRepairs.length === 0 ? (
              <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 text-center text-slate-400 dark:text-slate-500" colSpan={7}>
                  No repairs found.
                </td>
              </tr>
            ) : (
              filteredRepairs.map((repair: Repair) => (
                <tr key={repair.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-medium text-slate-900 dark:text-slate-100">{repair.repair_id}</td>
                  <td className="p-4">
                    <div>{repair.customer_name}</div>
                    <div className="text-xs text-slate-400">{repair.customer_phone}</div>
                  </td>
                  <td className="p-4">
                    <div>{repair.device_type}</div>
                    <div className="text-xs text-slate-400">{repair.device_model}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${repair.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                      ${repair.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                      ${repair.status === 'Ready' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                      ${repair.status === 'Delivered' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' : ''}
                    `}>
                      {repair.status === 'Pending' ? t('table.statusPending') :
                       repair.status === 'In Progress' ? t('table.statusInProgress') :
                       repair.status === 'Ready' ? t('table.statusReady') :
                       t('table.statusDelivered')}
                    </span>
                  </td>
                  <td className="p-4">${repair.deposit_paid.toFixed(2)}</td>
                  <td className="p-4">${repair.est_cost.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      {repair.status !== 'Delivered' && (
                        <button 
                          onClick={() => {
                            const newStatus = repair.status === 'Pending' ? 'In Progress' : repair.status === 'In Progress' ? 'Ready' : 'Delivered';
                            const finalCost = newStatus === 'Delivered' ? Number(prompt('Final actual cost:', repair.est_cost.toString())) || repair.est_cost : undefined;
                            updateRepairStatus(repair.id, newStatus, finalCost);
                          }}
                          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-md transition-colors"
                          title="Advance Status"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this record?')) {
                            deleteRepair(repair.id);
                          }
                        }}
                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
