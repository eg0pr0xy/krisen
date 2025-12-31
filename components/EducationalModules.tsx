import React, { useState, useMemo } from 'react';
import { CrisisIndexItem, Language } from '../types';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  objectives: string[];
  interactive: boolean;
}

interface ScenarioExercise {
  id: string;
  crisis: string;
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const EducationalModules: React.FC<{
  crises: CrisisIndexItem[];
  lang: Language;
}> = ({ crises, lang }) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [currentExercise, setCurrentExercise] = useState<ScenarioExercise | null>(null);
  const [exerciseScore, setExerciseScore] = useState<number>(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  // Learning modules
  const modules: LearningModule[] = useMemo(() => [
    {
      id: 'crisis_basics',
      title: lang === 'de' ? 'Grundlagen der Krisenanalyse' : 'Crisis Analysis Fundamentals',
      description: lang === 'de'
        ? 'Einführung in die systematische Analyse von Krisenphänomenen und deren Interkonnektivität.'
        : 'Introduction to systematic analysis of crisis phenomena and their interconnectivity.',
      duration: '45 min',
      level: 'beginner',
      topics: lang === 'de'
        ? ['Krisendefinition', 'Systemtheorie', 'Interkonnektivität', 'Diagnostische Methoden']
        : ['Crisis Definition', 'Systems Theory', 'Interconnectivity', 'Diagnostic Methods'],
      objectives: lang === 'de'
        ? ['Krisen als komplexe Systeme verstehen', 'Interdependenzen erkennen', 'Analytische Ansätze anwenden']
        : ['Understand crises as complex systems', 'Identify interdependencies', 'Apply analytical approaches'],
      interactive: false
    },
    {
      id: 'systemic_thinking',
      title: lang === 'de' ? 'Systemisches Denken' : 'Systemic Thinking',
      description: lang === 'de'
        ? 'Entwicklung systemischer Denkweisen zur Analyse von Krisennetzwerken und Feedback-Schleifen.'
        : 'Developing systemic thinking approaches for analyzing crisis networks and feedback loops.',
      duration: '60 min',
      level: 'intermediate',
      topics: lang === 'de'
        ? ['Feedback-Schleifen', 'Emergenz', 'Netzwerktheorie', 'Komplexität']
        : ['Feedback Loops', 'Emergence', 'Network Theory', 'Complexity'],
      objectives: lang === 'de'
        ? ['Systemische Zusammenhänge erkennen', 'Feedback-Dynamiken analysieren', 'Netzwerkmodelle anwenden']
        : ['Recognize systemic relationships', 'Analyze feedback dynamics', 'Apply network models'],
      interactive: true
    },
    {
      id: 'scenario_simulation',
      title: lang === 'de' ? 'Szenario-Simulationen' : 'Scenario Simulations',
      description: lang === 'de'
        ? 'Interaktive Übungen zur Entscheidungsfindung in Krisensituationen und deren Konsequenzen.'
        : 'Interactive exercises for decision-making in crisis situations and their consequences.',
      duration: '90 min',
      level: 'advanced',
      topics: lang === 'de'
        ? ['Entscheidungsfindung', 'Konsequenzanalyse', 'Risikomanagement', 'Ethik']
        : ['Decision Making', 'Consequence Analysis', 'Risk Management', 'Ethics'],
      objectives: lang === 'de'
        ? ['Krisenentscheidungen treffen', 'Konsequenzen abschätzen', 'Ethische Dilemmata lösen']
        : ['Make crisis decisions', 'Assess consequences', 'Resolve ethical dilemmas'],
      interactive: true
    },
    {
      id: 'media_crisis',
      title: lang === 'de' ? 'Medien und Krisenkommunikation' : 'Media and Crisis Communication',
      description: lang === 'de'
        ? 'Analyse der Rolle von Medien bei der Konstruktion und Kommunikation von Krisen.'
        : 'Analysis of the role of media in constructing and communicating crises.',
      duration: '75 min',
      level: 'intermediate',
      topics: lang === 'de'
        ? ['Krisenrhetorik', 'Medienframes', 'Öffentliche Wahrnehmung', 'Desinformation']
        : ['Crisis Rhetoric', 'Media Frames', 'Public Perception', 'Disinformation'],
      objectives: lang === 'de'
        ? ['Medieneinfluss erkennen', 'Krisenkommunikation analysieren', 'Medienkritik anwenden']
        : ['Recognize media influence', 'Analyze crisis communication', 'Apply media criticism'],
      interactive: false
    }
  ], [lang]);

  // Scenario exercises
  const exercises: ScenarioExercise[] = useMemo(() => [
    {
      id: 'climate_migration',
      crisis: 'climate-change',
      scenario: lang === 'de'
        ? 'Ein 2°C-Anstieg der globalen Temperatur führt zu massiver Migration aus dem globalen Süden. Als EU-Politiker müssen Sie entscheiden, wie viele Menschen aufgenommen werden sollen.'
        : 'A 2°C rise in global temperature leads to massive migration from the Global South. As an EU politician, you must decide how many people should be admitted.',
      question: lang === 'de'
        ? 'Welche Maßnahme hat die höchste Wahrscheinlichkeit, die Krise zu stabilisieren?'
        : 'Which measure has the highest probability of stabilizing the crisis?',
      options: lang === 'de'
        ? [
          'Grenzen vollständig schließen (0% Stabilisierung)',
          'Begrenzte Aufnahme mit Entwicklungshilfe (30% Stabilisierung)',
          'Massive Investitionen in Anpassung und Prävention (70% Stabilisierung)',
          'Militärische Intervention in Herkunftsländern (10% Stabilisierung)'
        ]
        : [
          'Close borders completely (0% stabilization)',
          'Limited admission with development aid (30% stabilization)',
          'Massive investment in adaptation and prevention (70% stabilization)',
          'Military intervention in countries of origin (10% stabilization)'
        ],
      correctAnswer: 2,
      explanation: lang === 'de'
        ? 'Langfristige Investitionen in Anpassung und Prävention adressieren die Ursachen der Krise und schaffen nachhaltige Lösungen.'
        : 'Long-term investments in adaptation and prevention address the causes of the crisis and create sustainable solutions.'
    },
    {
      id: 'ai_ethics',
      crisis: 'ai',
      scenario: lang === 'de'
        ? 'KI-Systeme werden zunehmend in kritischen Infrastrukturen eingesetzt. Ein Fehler könnte Millionen Menschen betreffen. Als Regulierungsbehörde müssen Sie entscheiden.'
        : 'AI systems are increasingly used in critical infrastructure. One error could affect millions of people. As a regulatory authority, you must decide.',
      question: lang === 'de'
        ? 'Wie sollten KI-Systeme reguliert werden?'
        : 'How should AI systems be regulated?',
      options: lang === 'de'
        ? [
          'Vollständiges Verbot aller KI-Anwendungen (20% Sicherheit)',
          'Freiwillige Branchenstandards (40% Sicherheit)',
          'Obligatorische Zertifizierung und Audits (80% Sicherheit)',
          'Keine Regulierung, Markt regelt sich selbst (10% Sicherheit)'
        ]
        : [
          'Complete ban on all AI applications (20% safety)',
          'Voluntary industry standards (40% safety)',
          'Mandatory certification and audits (80% safety)',
          'No regulation, market regulates itself (10% safety)'
        ],
      correctAnswer: 2,
      explanation: lang === 'de'
        ? 'Obligatorische Zertifizierung gewährleistet hohe Sicherheitsstandards ohne Innovation zu blockieren.'
        : 'Mandatory certification ensures high safety standards without blocking innovation.'
    }
  ], [lang]);

  const getLevelColor = (level: LearningModule['level']) => {
    switch (level) {
      case 'beginner': return 'border-green-500 bg-green-500/10 text-green-400';
      case 'intermediate': return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
      case 'advanced': return 'border-red-500 bg-red-500/10 text-red-400';
      default: return 'border-gray-500 bg-gray-500/10 text-gray-400';
    }
  };

  const handleExerciseAnswer = (exercise: ScenarioExercise, selectedIndex: number) => {
    setCurrentExercise(exercise);
    if (selectedIndex === exercise.correctAnswer && !completedExercises.has(exercise.id)) {
      setExerciseScore(prev => prev + 1);
      setCompletedExercises(prev => new Set([...prev, exercise.id]));
    }
  };

  const resetExercise = () => {
    setCurrentExercise(null);
  };

  const solutions = useMemo(() => [
    {
      id: 'collective-mapping',
      label: lang === 'de' ? 'Kollektive Lagekarte' : 'Collective Situation Mapping',
      summary: lang === 'de'
        ? 'Interdisziplinäre Teams entwerfen gemeinsam Karten, um Belastungen, Ressourcen und Kippunkte sichtbar zu machen.'
        : 'Interdisciplinary teams co-design maps that make pressures, resources, and tipping points visible.',
      strategy: lang === 'de'
        ? 'Mapping erhöht das gemeinsame Verständnis, verhindert blinde Flecken und erlaubt abgestimmte Entwicklungsmaßnahmen im Raum.'
        : 'Mapping fosters shared understanding, prevents blind spots, and enables coordinated development interventions in the territory.',
      resources: lang === 'de'
        ? ['Systemisches Mapping-Toolkit', 'GIS + qualitative Beobachtungen', 'Stakeholder-Dialogräume']
        : ['Systemic mapping toolkit', 'GIS + qualitative observations', 'Stakeholder dialogue spaces']
    },
    {
      id: 'diplo-lab',
      label: lang === 'de' ? 'Diplo-Lab' : 'Diplo-Lab',
      summary: lang === 'de'
        ? 'Labor für transnationale Verhandlungssimulationen zwi­schen Kommunen, NGOs und Staats­apparaten.'
        : 'Lab for transnational negotiation simulations between municipalities, NGOs, and state apparatuses.',
      strategy: lang === 'de'
        ? 'Rollenspiele öffnen kreative Lösungen, indem sie bürokratische Logiken überbrücken und neue Kooperationsmuster testen.'
        : 'Role plays unlock creative solutions by bridging bureaucratic logics and testing new cooperation patterns.',
      resources: lang === 'de'
        ? ['Verhandlungsleitfäden', 'Reflexionspanels', 'Outcome-Tracking']
        : ['Negotiation guides', 'Reflection panels', 'Outcome tracking']
    },
    {
      id: 'care-innovation',
      label: lang === 'de' ? 'Care Innovation' : 'Care Innovation',
      summary: lang === 'de'
        ? 'Community-getriebene Projekte, die Sorgearbeit, Gesundheitsversorgung und Wissen teilen.'
        : 'Community-driven projects that share care work, healthcare, and knowledge.',
      strategy: lang === 'de'
        ? 'Care-Teams teilen Ressourcen, dokumentieren Erfahrungen und fördern gemeinsame Selbstorganisation zur Resilienz.'
        : 'Care teams share resources, document experiences, and promote collective self-organisation toward resilience.',
      resources: lang === 'de'
        ? ['Open Care Logs', 'Peer-to-Peer Fortbildung', 'Community Fonds']
        : ['Open care logs', 'Peer-to-peer training', 'Community funds']
    }
  ], [lang]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="mono text-[10px] uppercase tracking-[0.5em] text-white/30">BILDUNG & LERNEN</span>
            <h2 className="text-[4vw] md:text-[2.5vw] font-black uppercase leading-[0.8] tracking-tighter mt-2">
              {lang === 'de' ? 'Krisenkompetenz' : 'Crisis Literacy'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              {lang === 'de' ? 'PUNKTE:' : 'SCORE:'} {exerciseScore}/{exercises.length}
            </div>
            <div className="mono text-[9px] text-white/30">
              {Math.round((exerciseScore / exercises.length) * 100)}%
            </div>
          </div>
        </div>

        <p className="mono text-[12px] leading-relaxed text-white/60 max-w-3xl">
          {lang === 'de'
            ? 'Entwickeln Sie Fähigkeiten zur Analyse komplexer Krisen. Von Grundlagen bis zu fortgeschrittenen Simulationen.'
            : 'Develop skills for analyzing complex crises. From fundamentals to advanced simulations.'
          }
        </p>
      </div>

      {/* Learning Modules */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-white/10 flex-grow" />
          <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">
            {lang === 'de' ? 'LERNEINHEITEN' : 'LEARNING MODULES'}
          </span>
          <div className="h-[1px] bg-white/10 flex-grow" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => (
            <div
              key={module.id}
              className="border border-white/10 p-6 bg-white/[0.01] hover:border-white/20 transition-all cursor-pointer"
              onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`mono text-[8px] uppercase tracking-[0.2em] px-2 py-1 ${getLevelColor(module.level)}`}>
                      {module.level.toUpperCase()}
                    </span>
                    <span className="mono text-[9px] text-white/40">{module.duration}</span>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-2">
                    {module.title}
                  </h3>
                </div>
                {module.interactive && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                )}
              </div>

              <p className="mono text-[11px] text-white/60 leading-relaxed mb-4">
                {module.description}
              </p>

              {selectedModule === module.id && (
                <div className="border-t border-white/10 pt-4 space-y-4">
                  <div>
                    <div className="mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">
                      {lang === 'de' ? 'THEMEN:' : 'TOPICS:'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {module.topics.map((topic, idx) => (
                        <span key={idx} className="mono text-[8px] bg-white/10 px-2 py-1 text-white/80">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">
                      {lang === 'de' ? 'LERnziele:' : 'OBJECTIVES:'}
                    </div>
                    <ul className="mono text-[10px] text-white/70 space-y-1">
                      {module.objectives.map((objective, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-white/40 mt-[-2px]">•</span>
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Solution Tracks */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-white/10 flex-grow" />
          <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">
            {lang === 'de' ? 'LÖSUNGSANGEBOTE' : 'SOLUTION TRACKS'}
          </span>
          <div className="h-[1px] bg-white/10 flex-grow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {solutions.map((solution) => (
            <article key={solution.id} className="border border-white/10 p-6 bg-white/[0.01] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold uppercase tracking-tight">{solution.label}</h4>
                <span className="mono text-[8px] text-white/40 uppercase tracking-[0.4em]">
                  {lang === 'de' ? 'STRATEGIE' : 'STRATEGY'}
                </span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{solution.summary}</p>
              <p className="text-sm text-white/60">
                {lang === 'de' ? 'Wie wirkt es?' : 'How it works?'} {solution.strategy}
              </p>
              <div>
                <div className="mono text-[8px] uppercase tracking-[0.4em] text-white/30 mb-2">
                  {lang === 'de' ? 'RESSOURCEN' : 'RESOURCES'}
                </div>
                <ul className="space-y-1 text-[10px] text-white/50">
                  {solution.resources.map((resource) => (
                    <li key={resource} className="mono uppercase tracking-[0.3em]">
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Exercises */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-white/10 flex-grow" />
          <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">
            {lang === 'de' ? 'INTERAKTIVE ÜBUNGEN' : 'INTERACTIVE EXERCISES'}
          </span>
          <div className="h-[1px] bg-white/10 flex-grow" />
        </div>

        {currentExercise ? (
          <div className="border border-white/10 p-6 bg-white/[0.01]">
            <div className="mb-6">
              <div className="mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">
                {lang === 'de' ? 'SZENARIO:' : 'SCENARIO:'}
              </div>
              <div className="mono text-[11px] text-white/70 leading-relaxed mb-4">
                {currentExercise.scenario}
              </div>

              <div className="mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">
                {lang === 'de' ? 'FRAGE:' : 'QUESTION:'}
              </div>
              <div className="mono text-[12px] text-white/80 font-medium mb-4">
                {currentExercise.question}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-3">
                {lang === 'de' ? 'ERKÄRUNG:' : 'EXPLANATION:'}
              </div>
              <div className="mono text-[11px] text-white/70 leading-relaxed mb-4">
                {currentExercise.explanation}
              </div>

              <button
                onClick={resetExercise}
                className="mono text-[10px] uppercase tracking-[0.2em] border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all"
              >
                {lang === 'de' ? 'NEUE AUFGABE' : 'NEW EXERCISE'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="border border-white/10 p-4 bg-white/[0.01] hover:border-white/20 transition-all cursor-pointer"
                onClick={() => setCurrentExercise(exercise)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="mono text-[8px] uppercase tracking-[0.2em] text-white/40 px-2 py-1 bg-red-500/20 text-red-400">
                    {exercise.crisis.toUpperCase()}
                  </span>
                  {completedExercises.has(exercise.id) && (
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                  )}
                </div>

                <div className="mono text-[11px] text-white/70 leading-relaxed mb-4 line-clamp-3">
                  {exercise.scenario}
                </div>

                <div className="mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  {lang === 'de' ? 'KLICKEN FÜR ÜBUNG' : 'CLICK FOR EXERCISE'}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Educational Resources */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-white/10 flex-grow" />
          <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">
            {lang === 'de' ? 'BILDUNGSRESSOURCEN' : 'EDUCATIONAL RESOURCES'}
          </span>
          <div className="h-[1px] bg-white/10 flex-grow" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-white/10 p-4 bg-white/[0.01]">
            <div className="mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-3">
              {lang === 'de' ? 'LEHRPLAN' : 'CURRICULUM'}
            </div>
            <div className="mono text-[10px] text-white/60 leading-relaxed mb-4">
              {lang === 'de'
                ? 'Strukturierte Lernpfade für Schulen und Universitäten mit Krisenanalyse-Modulen.'
                : 'Structured learning paths for schools and universities with crisis analysis modules.'
              }
            </div>
            <button className="mono text-[9px] uppercase tracking-[0.2em] border border-white/20 px-3 py-1 hover:bg-white hover:text-black transition-all">
              {lang === 'de' ? 'DOWNLOAD' : 'DOWNLOAD'}
            </button>
          </div>

          <div className="border border-white/10 p-4 bg-white/[0.01]">
            <div className="mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-3">
              {lang === 'de' ? 'API FÜR LEHRER' : 'TEACHER API'}
            </div>
            <div className="mono text-[10px] text-white/60 leading-relaxed mb-4">
              {lang === 'de'
                ? 'Integrieren Sie Krisendaten in Ihre Unterrichtsmaterialien und Präsentationen.'
                : 'Integrate crisis data into your teaching materials and presentations.'
              }
            </div>
            <button className="mono text-[9px] uppercase tracking-[0.2em] border border-white/20 px-3 py-1 hover:bg-white hover:text-black transition-all">
              {lang === 'de' ? 'DOKUMENTATION' : 'DOCUMENTATION'}
            </button>
          </div>

          <div className="border border-white/10 p-4 bg-white/[0.01]">
            <div className="mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-3">
              {lang === 'de' ? 'VR ERFAHRUNGEN' : 'VR EXPERIENCES'}
            </div>
            <div className="mono text-[10px] text-white/60 leading-relaxed mb-4">
              {lang === 'de'
                ? 'Immersive Simulationen von Krisensituationen für tiefes Verständnis.'
                : 'Immersive simulations of crisis situations for deep understanding.'
              }
            </div>
            <button className="mono text-[9px] uppercase tracking-[0.2em] border border-white/20 px-3 py-1 hover:bg-white hover:text-black transition-all">
              {lang === 'de' ? 'VORSCHAU' : 'PREVIEW'}
            </button>
          </div>
        </div>
      </section>

      {/* Progress Tracking */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-white/10 flex-grow" />
          <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">
            {lang === 'de' ? 'LERNFORTSCHRITT' : 'LEARNING PROGRESS'}
          </span>
          <div className="h-[1px] bg-white/10 flex-grow" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-white/10 p-4 bg-white/[0.01]">
            <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/40 mb-1">
              {lang === 'de' ? 'MODULE ABGESCHLOSSEN' : 'MODULES COMPLETED'}
            </div>
            <div className="text-2xl font-black">0/{modules.length}</div>
          </div>

          <div className="border border-white/10 p-4 bg-white/[0.01]">
            <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/40 mb-1">
              {lang === 'de' ? 'ÜBUNGEN GESCHAFFT' : 'EXERCISES COMPLETED'}
            </div>
            <div className="text-2xl font-black">{completedExercises.size}/{exercises.length}</div>
          </div>

          <div className="border border-white/10 p-4 bg-white/[0.01]">
            <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/40 mb-1">
              {lang === 'de' ? 'GESAMTPUNKTE' : 'TOTAL SCORE'}
            </div>
            <div className="text-2xl font-black">{exerciseScore}</div>
          </div>

          <div className="border border-white/10 p-4 bg-white/[0.01]">
            <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/40 mb-1">
              {lang === 'de' ? 'NÄCHSTES LEVEL' : 'NEXT LEVEL'}
            </div>
            <div className="text-2xl font-black">
              {exerciseScore >= exercises.length * 0.8 ? '⭐' :
               exerciseScore >= exercises.length * 0.6 ? '🔥' : '📚'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
