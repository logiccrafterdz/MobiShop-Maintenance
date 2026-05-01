import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import { getPrinters } from 'tauri-plugin-printer-v2';

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
  printers: string[];
  settings: Record<string, string>;
  fetchPrinters: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSetting: (key: string, value: string) => Promise<void>;
  fetchRepairs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  updateRepairStatus: (id: number, status: string, actual_cost?: number) => Promise<void>;
  deleteRepair: (id: number) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => {
    set({ language: lang });
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  },
  repairs: [],
  printingRepair: null,
  setPrintingRepair: (repair) => set({ printingRepair: repair }),
  printers: [],
  settings: {},
  fetchPrinters: async () => {
    try {
      const response = await getPrinters();
      const data = JSON.parse(response);
      // data is an array of printer objects, we just need names
      const names = data.map((p: any) => p.name);
      set({ printers: names });
    } catch (e) {
      console.error('Failed to fetch printers:', e);
    }
  },
  fetchSettings: async () => {
    try {
      // Keys to fetch
      const keys = ['receipt_printer', 'sticker_printer'];
      const settings: Record<string, string> = {};
      for (const key of keys) {
        try {
          settings[key] = await invoke<string>('get_setting', { key });
        } catch {
          settings[key] = '';
        }
      }
      set({ settings });
    } catch (e) {
      console.error(e);
    }
  },
  updateSetting: async (key, value) => {
    try {
      await invoke('save_setting', { key, value });
      set({ settings: { ...get().settings, [key]: value } });
    } catch (e) {
      console.error(e);
    }
  },
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
