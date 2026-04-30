import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "./store";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const { i18n } = useTranslation();
  const language = useAppStore((state) => state.language);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, i18n]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Dashboard />
    </div>
  );
}

export default App;
