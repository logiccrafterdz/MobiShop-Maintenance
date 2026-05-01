import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { invoke } from '@tauri-apps/api/core';
import { 
  User, 
  Phone, 
  Smartphone, 
  Wrench, 
  DollarSign, 
  Clipboard,
  Laptop,
  Tablet,
  DeviceUnknown,
  Plus
} from 'lucide-react';

const BRANDS = {
  Phone: ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Oppo', 'Realme', 'Other'],
  Laptop: ['HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'MacBook', 'Other'],
  Tablet: ['iPad', 'Galaxy Tab', 'Huawei MatePad', 'Lenovo Tab', 'Other'],
  Other: ['Other']
};

export default function NewRepairForm() {
  const { t } = useTranslation();
  const { fetchRepairs, fetchStats } = useAppStore();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    device_type: 'Phone',
    device_brand: 'Apple',
    custom_brand: '',
    device_model: '',
    issue_desc: '',
    deposit_paid: 0,
    est_cost: 0,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalBrand = formData.device_brand === 'Other' ? formData.custom_brand : formData.device_brand;
      await invoke('add_repair', { 
        ...formData,
        device_brand: finalBrand,
        depositPaid: Number(formData.deposit_paid),
        estCost: Number(formData.est_cost)
      });
      setFormData({
        customer_name: '',
        customer_phone: '',
        device_type: 'Phone',
        device_brand: 'Apple',
        custom_brand: '',
        device_model: '',
        issue_desc: '',
        deposit_paid: 0,
        est_cost: 0,
        notes: ''
      });
      fetchRepairs();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const getIconForType = (type: string) => {
    switch(type) {
      case 'Phone': return <Smartphone size={18} />;
      case 'Laptop': return <Laptop size={18} />;
      case 'Tablet': return <Tablet size={18} />;
      default: return <Smartphone size={18} />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white dark:bg-slate-900">
      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        
        {/* Customer Section */}
        <div className="space-y-4">
          <SectionHeader icon={<User size={18} />} title={t('form.customerInfo')} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput 
              icon={<User size={16} />}
              placeholder={t('form.customerName')}
              value={formData.customer_name}
              onChange={(v) => setFormData({...formData, customer_name: v})}
              required
            />
            <FormInput 
              icon={<Phone size={16} />}
              placeholder={t('form.customerPhone')}
              value={formData.customer_phone}
              onChange={(v) => setFormData({...formData, customer_phone: v})}
              required
            />
          </div>
        </div>

        {/* Device Section */}
        <div className="space-y-4">
          <SectionHeader icon={<Smartphone size={18} />} title={t('form.deviceInfo')} />
          
          {/* Type Selector */}
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {Object.keys(BRANDS).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({...formData, device_type: type, device_brand: BRANDS[type as keyof typeof BRANDS][0]})}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
                  formData.device_type === type 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {getIconForType(type)}
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <select
                value={formData.device_brand}
                onChange={(e) => setFormData({...formData, device_brand: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
              >
                {BRANDS[formData.device_type as keyof typeof BRANDS].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            
            <FormInput 
              icon={<Smartphone size={16} />}
              placeholder={t('form.deviceModel')}
              value={formData.device_model}
              onChange={(v) => setFormData({...formData, device_model: v})}
              required
            />
          </div>

          {formData.device_brand === 'Other' && (
             <div className="animate-in slide-in-from-top-2 duration-200">
               <FormInput 
                icon={<Plus size={16} />}
                placeholder="Enter Brand Name"
                value={formData.custom_brand}
                onChange={(v) => setFormData({...formData, custom_brand: v})}
                required
              />
             </div>
          )}
        </div>

        {/* Repair Details */}
        <div className="space-y-4">
          <SectionHeader icon={<Wrench size={18} />} title={t('form.repairDetails')} />
          <div className="relative">
            <textarea
              placeholder={t('form.issueDesc')}
              value={formData.issue_desc}
              onChange={(e) => setFormData({...formData, issue_desc: e.target.value})}
              required
              rows={3}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
            />
            <div className="absolute top-4 right-4 text-slate-300 dark:text-slate-600">
              <Wrench size={18} />
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="space-y-4">
          <SectionHeader icon={<DollarSign size={18} />} title={t('form.costInfo')} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput 
              icon={<DollarSign size={16} />}
              placeholder={t('form.estCost')}
              type="number"
              value={formData.est_cost.toString()}
              onChange={(v) => setFormData({...formData, est_cost: Number(v)})}
              required
            />
            <FormInput 
              icon={<DollarSign size={16} />}
              placeholder={t('form.depositPaid')}
              type="number"
              value={formData.deposit_paid.toString()}
              onChange={(v) => setFormData({...formData, deposit_paid: Number(v)})}
              required
            />
          </div>
        </div>
      </div>

      <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <button
          type="submit"
          className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <PlusCircle size={20} />
          {t('form.submit')}
        </button>
      </div>
    </form>
  );
}

function SectionHeader({ icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="text-primary/60">{icon}</div>
      <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</h3>
    </div>
  );
}

function FormInput({ icon, placeholder, value, onChange, required, type = "text" }: any) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-primary transition-colors">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
      />
    </div>
  );
}

function PlusCircle({ size }: { size: number }) {
  return <Plus size={size} />;
}
