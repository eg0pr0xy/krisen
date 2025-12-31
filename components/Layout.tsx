
import React from 'react';
import { Language } from '../types';
import { getContentVersion } from '../src/content/loadCrises';
import { EntropyClock } from './EntropyClock';
import { SystemicRiskMatrix } from './SystemicRiskMatrix';

interface LayoutProps {
  children: React.ReactNode;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, lang, onLangChange }) => {
  const contentVersion = getContentVersion();
  const resetView = () => {
    window.location.hash = 'alle';
  };

  const t = {
    de: {
      doc: "DOKUMENTATION",
      title: "KRISEN",
      status: `Archivstatus: Offline // Build ${contentVersion || 'local'}`,
      footerMsg: "Quellen liegen in /content, offline lesbar, deterministisch."
    },
    en: {
      doc: "DOCUMENTATION",
      title: "CRISES",
      status: `Archival Status: Offline // Build ${contentVersion || 'local'}`,
      footerMsg: "Sources live in /content, offline readable, deterministic."
    }
  }[lang];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black grain">
      <header className="fixed top-0 left-0 w-full border-b border-white/10 bg-black/95 backdrop-blur-xl z-50 px-6 py-4 flex items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="flex flex-col cursor-pointer group" onClick={() => window.location.hash = ''}>
            <span className="text-[9px] mono tracking-[0.3em] text-white/40 uppercase group-hover:text-white transition-colors">
              {t.doc} // {lang.toUpperCase()}
            </span>
            <h1 className="text-lg font-black tracking-tight uppercase leading-none mt-1">
              <span className="text-white">{t.title}</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <EntropyClock />
          <div className="flex items-center gap-3 border-x border-white/10 px-6">
            <button
              onClick={() => onLangChange('de')}
              className={`text-[10px] mono font-bold transition-all ${lang === 'de' ? 'text-white underline underline-offset-4' : 'text-white/30 hover:text-white'}`}
            >
              DE
            </button>
            <span className="text-white/10 text-[8px]">/</span>
            <button
              onClick={() => onLangChange('en')}
              className={`text-[10px] mono font-bold transition-all ${lang === 'en' ? 'text-white underline underline-offset-4' : 'text-white/30 hover:text-white'}`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-24">{children}</main>

      <footer className="px-6 py-16 border-t border-white/5 text-white/30 text-[9px] mono uppercase flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-3">
          <p className="tracking-widest">© 2024—2025 ARCHIVAL PROTOCOL</p>
          <p className="font-light italic lowercase opacity-50">{t.footerMsg}</p>
          <p className="mono text-[8px] uppercase tracking-[0.5em] text-white/50">
            KRISEN — Neue Episteme
          </p>
        </div>
        <div className="text-left md:text-right space-y-1">
          <p className="tracking-tighter">{t.status}</p>
          <p className="text-white/10">Systemintegrität: Files + Local Cache</p>
        </div>
      </footer>
      <SystemicRiskMatrix />
    </div>
  );
};
