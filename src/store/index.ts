import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

export interface Repair {
  id: number;
  repair_id: string;
  customer_name: string;
  customer_phone: string;
  device_type: string;
  device_model: string;
  issue_desc: string;
  deposit_paid: number;
  est_cost: number;
  actual_cost: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_repairs_today: number;
  total_repairs_month: number;
  revenue: number;
  costs: number;
  net_profit: number;
}

interface AppState {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  repairs: Repair[];
  stats: DashboardStats;
  printingRepair: Repair | null;
  setPrintingRepair: (repair: Repair | null) => void;
  fetchRepairs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  updateRepairStatus: (id: number, status: string, actual_cost?: number) => Promise<void>;
  deleteRepair: (id: number) => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'en',
  setLanguage: (lang) => {
    set({ language: lang });
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  },
  repairs: [],
  printingRepair: null,
  setPrintingRepair: (repair) => set({ printingRepair: repair }),
  stats: {
    total_repairs_today: 0,
    total_repairs_month: 0,
    revenue: 0,
    costs: 0,
    net_profit: 0,
  },
  fetchRepairs: async () => {
    try {
      const data = await invoke<Repair[]>('get_repairs');
      set({ repairs: data });
    } catch (e) {
      console.error(e);
    }
  },
  fetchStats: async () => {
    try {
      const data = await invoke<DashboardStats>('get_dashboard_stats');
      set({ stats: data });
    } catch (e) {
      console.error(e);
    }
  },
  updateRepairStatus: async (id, status, actual_cost) => {
    try {
      await invoke('update_repair_status', { id, status, actualCost: actual_cost });
      useAppStore.getState().fetchRepairs();
      useAppStore.getState().fetchStats();
    } catch (e) {
      console.error(e);
    }
  },
  deleteRepair: async (id) => {
    try {
      await invoke('delete_repair', { id });
      useAppStore.getState().fetchRepairs();
      useAppStore.getState().fetchStats();
    } catch (e) {
      console.error(e);
    }
  }
}));
