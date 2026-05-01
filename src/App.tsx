import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "./store";
import Dashboard from "./components/Dashboard.tsx";
import ReceiptPrint from "./components/ReceiptPrint.tsx";
import "./App.css";

function App() {
  const { i18n } = useTranslation();
  const language = useAppStore((state) => state.language);
  const fetchSettings = useAppStore((state) => state.fetchSettings);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    fetchSettings();
  }, [language, i18n, fetchSettings]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Dashboard />
      <ReceiptPrint />
    </div>
  );
}

export default App;
