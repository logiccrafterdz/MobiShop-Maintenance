import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { format } from 'date-fns';
import { 
  Search, 
  Printer, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle
} from 'lucide-react';

export default function RepairsList() {
  const { t } = useTranslation();
  const { repairs, updateRepairStatus, deleteRepair, setPrintingRepair } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRepairs = repairs.filter(r => {
    const matchesSearch = 
      r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      r.repair_id.toLowerCase().includes(search.toLowerCase()) ||
      r.device_model.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'Pending': return { 
        color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', 
        icon: <Clock size={14} />,
        label: t('status.pending') || 'Pending'
      };
      case 'In Progress': return { 
        color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', 
        icon: <Clock size={14} />,
        label: t('status.inProgress') || 'In Progress'
      };
      case 'Completed': return { 
        color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', 
        icon: <CheckCircle2 size={14} />,
        label: t('status.completed') || 'Completed'
      };
      case 'Delivered': return { 
        color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', 
        icon: <CheckCircle2 size={14} />,
        label: t('status.delivered') || 'Delivered'
      };
      default: return { 
        color: 'bg-slate-100 text-slate-600', 
        icon: <AlertCircle size={14} />,
        label: status
      };
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* Search & Filter Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'Pending', 'In Progress', 'Completed', 'Delivered'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === s 
                ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {s === 'all' ? (t('status.all') || 'All') : s}
            </button>
          ))}
        </div>
      </div>

      {/* Repairs Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-md z-10">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('status.repairId') || 'Repair ID'}</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('form.customerInfo')}</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('form.deviceInfo')}</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('common.status')}</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('common.date')}</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredRepairs.map((repair) => {
              const status = getStatusInfo(repair.status);
              return (
                <tr key={repair.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-5">
                    <span className="font-black text-primary tracking-tighter">{repair.repair_id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{repair.customer_name}</span>
                      <span className="text-xs text-slate-400 font-medium mt-0.5">{repair.customer_phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{repair.device_model}</span>
                      <span className="text-xs text-slate-400 font-medium mt-0.5">{repair.device_type} • {repair.issue_desc.substring(0, 20)}...</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tight ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-400">{format(new Date(repair.created_at), 'MMM dd, HH:mm')}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionBtn 
                        icon={<Printer size={16} />} 
                        onClick={() => setPrintingRepair(repair)} 
                        color="primary"
                        tooltip="Print Receipt"
                      />
                      <ActionBtn 
                        icon={<CheckCircle2 size={16} />} 
                        onClick={() => updateRepairStatus(repair.id, 'Completed')} 
                        color="success"
                        tooltip="Mark Completed"
                      />
                      <ActionBtn 
                        icon={<Trash2 size={16} />} 
                        onClick={() => deleteRepair(repair.id)} 
                        color="danger"
                        tooltip="Delete"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredRepairs.length === 0 && (
          <div className="p-20 text-center">
            <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Repairs Found</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ActionBtnProps {
  icon: React.ReactNode;
  onClick: () => void;
  color: 'primary' | 'success' | 'danger';
  tooltip: string;
}

function ActionBtn({ icon, onClick, color, tooltip }: ActionBtnProps) {
  const colors = {
    primary: "hover:bg-primary/10 hover:text-primary",
    success: "hover:bg-emerald-500/10 hover:text-emerald-500",
    danger: "hover:bg-rose-500/10 hover:text-rose-500"
  };
  
  return (
    <button 
      onClick={onClick}
      title={tooltip}
      className={`p-2.5 rounded-xl text-slate-400 transition-all active:scale-90 ${colors[color]}`}
    >
      {icon}
    </button>
  );
}
