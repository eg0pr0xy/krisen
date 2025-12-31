
import React, { useEffect, useState, useRef } from 'react';
import { KeywordArchetype, Language } from '../types';
import { getArchetypeAnalysis, generateCrisisImage } from '../services/geminiService';
import gsap from 'gsap';
import { LoadingProgressBar } from './LoadingProgressBar';

interface KeywordDetailProps {
  keyword: string;
  lang: Language;
  onBack: () => void;
}

export const KeywordDetail: React.FC<KeywordDetailProps> = ({ keyword, lang, onBack }) => {
  const [data, setData] = useState<KeywordArchetype | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setProgress(5);
      setImageUrl(null);
      try {
        setProgress(20);
        const analysis = await getArchetypeAnalysis(keyword, lang);
        if (!mounted) return;
        
        setData(analysis);
        setProgress(50);
        
        // Load image as a secondary step but still on loading screen
        setImageLoading(true);
        setProgress(65);
        const img = await generateCrisisImage(analysis.visualPrompt);
        if (mounted && img) {
          setImageUrl(img);
        }
        setProgress(100);
        
        // Minimal kinetic entrance for content after a brief pause
        setTimeout(() => {
          if (mounted) {
            setLoading(false);
            setTimeout(() => {
              if (containerRef.current) {
                gsap.fromTo(containerRef.current.children, 
                  { opacity: 0, y: 10 }, 
                  { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power2.out" }
                );
              }
            }, 50);
          }
        }, 400);

      } catch (e) {
        console.error("Glossary retrieval failure", e);
        if (mounted) setLoading(false);
      } finally {
        if (mounted) setImageLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [keyword, lang]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center">
        <div className="w-full max-w-3xl">
          <LoadingProgressBar
            progress={progress}
            label={`EXTRACTING_ARCHETYPE // ${keyword.toUpperCase()}`}
            subtitle={imageLoading ? "Generating visual data" : "Compiling manifesto data"}
            stages={["analysis", "visual"]}
          />
        </div>
      </div>
    );
  }

  if (!data) return (
    <div className="p-20 text-center flex flex-col items-center justify-center h-full">
      <div className="mono text-[10px] text-white/20 mb-8">ARCHIVE_ERROR: DATA_CORRUPT</div>
      <button onClick={onBack} className="mono text-[10px] uppercase border border-white/10 px-6 py-3 hover:bg-white hover:text-black transition-all">Return_to_Safe_State</button>
    </div>
  );

  return (
    <div className="p-8 md:p-16 min-h-full flex flex-col" ref={containerRef}>
      <div className="flex justify-between items-center mb-24">
        <div className="mono text-[8px] uppercase tracking-[0.5em] text-white/20">GLOSSARY_ENTRY // 2025_EDITION</div>
        <button 
          onClick={onBack} 
          className="group flex items-center gap-4 border border-white/10 px-6 py-3 hover:bg-white hover:text-black transition-all"
        >
          <span className="mono text-[10px] uppercase tracking-[0.3em] font-medium">Close_Archive</span>
          <span className="text-xl group-hover:rotate-90 transition-transform">×</span>
        </button>
      </div>

      <div className="mb-20">
        <span className="mono text-[10px] text-accent uppercase tracking-[0.6em] mb-4 block font-medium">ARCHETYPE_STUDY</span>
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">{data.title}</h2>
        <div className="h-[1px] bg-accent/30 w-full mb-8" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-16">
           <section className="border-l border-white/10 pl-8">
             <h4 className="mono text-[11px] uppercase text-white/20 mb-6 tracking-widest font-medium">Etymological Origin</h4>
             <p className="text-xl font-light italic leading-relaxed text-white/60">{data.etymology}</p>
           </section>

           <section>
             <h4 className="mono text-[11px] uppercase text-white/20 mb-8 tracking-widest font-medium">Socio-Cultural Lens</h4>
             <p className="text-2xl md:text-3xl font-light leading-tight tracking-tight text-white/80">{data.socioCulturalLens}</p>
           </section>

           <section className="p-10 border border-white/5 bg-white/[0.01]">
             <h4 className="mono text-[11px] uppercase text-white/20 mb-8 tracking-widest font-medium">Scientific Perspective</h4>
             <p className="text-base font-light leading-relaxed text-white/50 italic">{data.scientificPerspective}</p>
           </section>
        </div>

        <div className="space-y-12">
           <div className="border border-white/10 p-2 grayscale contrast-[1.2] shadow-2xl bg-white/[0.02] relative min-h-[300px] flex items-center justify-center">
             {imageUrl ? (
               <img src={imageUrl} className="w-full aspect-square object-cover animate-fade-in" alt={data.title} />
             ) : (
               <div className="mono text-[8px] uppercase text-white/10 animate-pulse tracking-widest">
                 {imageLoading ? 'GENERATING_VISUAL_DATA...' : 'NO_VISUAL_DATA'}
               </div>
             )}
           </div>
           
           <div className="p-10 border border-white/5 bg-white/[0.02]">
             <h4 className="mono text-[9px] uppercase text-white/30 mb-6 font-medium tracking-[0.4em]">Morphological Manifestation</h4>
             <p className="text-base font-light italic text-white/40 leading-relaxed border-t border-white/5 pt-6">{data.manifestation}</p>
           </div>
        </div>
      </div>

      <footer className="mt-auto pt-40 border-t border-white/5 opacity-20 mono text-[8px] uppercase tracking-[0.5em] flex justify-between">
        <span>ARCHIVAL_ID // {keyword.toUpperCase()}</span>
        <span>ENCRYPTED_SIGNAL // 2025</span>
      </footer>
    </div>
  );
};
