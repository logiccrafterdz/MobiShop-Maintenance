import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { invoke } from '@tauri-apps/api/core';
import { useAppStore } from '../store';

const schema = z.object({
  customerName: z.string().min(1, 'Required'),
  customerPhone: z.string().min(1, 'Required'),
  deviceType: z.string().min(1, 'Required'),
  brand: z.string().min(1, 'Required'),
  customBrand: z.string().optional(),
  deviceModel: z.string().min(1, 'Required'),
  issueDesc: z.string().min(1, 'Required'),
  depositPaid: z.number().min(0),
  estCost: z.number().min(0),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const BRANDS = {
  Phone: ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Realme', 'Vivo', 'Huawei', 'Honor', 'Google Pixel', 'OnePlus'],
  Laptop: ['HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'Apple', 'MSI', 'Microsoft Surface'],
  Tablet: ['Apple (iPad)', 'Samsung', 'Lenovo', 'Huawei', 'Xiaomi'],
};

export default function NewRepairForm() {
  const { t } = useTranslation();
  const { fetchRepairs, fetchStats } = useAppStore();
  
  const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      deviceType: 'Phone',
      depositPaid: 0,
      estCost: 0,
      brand: 'Samsung',
    }
  });

  const selectedType = watch('deviceType') as keyof typeof BRANDS;
  const selectedBrand = watch('brand');

  useEffect(() => {
    const firstBrand = BRANDS[selectedType]?.[0] || 'Other';
    setValue('brand', firstBrand);
  }, [selectedType, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const finalBrand = data.brand === 'Other' ? data.customBrand : data.brand;
      const fullModel = `${finalBrand} ${data.deviceModel}`;

      const repairId = await invoke<string>('add_repair', {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        deviceType: data.deviceType,
        deviceModel: fullModel,
        issueDesc: data.issueDesc,
        depositPaid: data.depositPaid,
        estCost: data.estCost,
        notes: data.notes || null,
      });
      console.log('Created repair:', repairId);
      
      reset();
      await fetchRepairs();
      await fetchStats();
      
      const newRepair = useAppStore.getState().repairs.find(r => r.repair_id === repairId);
      if (newRepair) {
        useAppStore.getState().setPrintingRepair(newRepair);
      }
    } catch (e) {
      console.error('Failed to add repair:', e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('form.customerName')}</label>
        <input {...register('customerName')} type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900" />
        {errors.customerName && <p className="text-xs text-red-500">{errors.customerName.message}</p>}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('form.phone')}</label>
        <input {...register('customerPhone')} type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('form.deviceType')}</label>
        <select {...register('deviceType')} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900">
          <option value="Phone">Phone</option>
          <option value="Laptop">Laptop</option>
          <option value="Tablet">Tablet</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('form.brand')}</label>
        <select {...register('brand')} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900">
          {(BRANDS[selectedType] || []).map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
          <option value="Other">{t('form.other')}</option>
        </select>
      </div>

      {selectedBrand === 'Other' && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('form.other')} ({t('form.brand')})</label>
          <input {...register('customBrand')} type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900" />
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('form.model')}</label>
        <input {...register('deviceModel')} type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900" />
      </div>
      <div className="space-y-1 lg:col-span-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('form.issue')}</label>
        <textarea {...register('issueDesc')} rows={2} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900 resize-none" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('form.deposit')}</label>
        <input {...register('depositPaid', { valueAsNumber: true })} type="number" step="0.01" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('form.estCost')}</label>
        <input {...register('estCost', { valueAsNumber: true })} type="number" step="0.01" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900" />
      </div>
      <div className="lg:col-span-4 flex justify-end mt-2">
        <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm">
          {t('form.savePrint')}
        </button>
      </div>
    </form>
  );
}
