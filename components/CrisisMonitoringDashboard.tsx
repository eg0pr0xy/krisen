import React, { useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { CrisisIndexItem, Language } from '../types';
import { fetchExternalData, getDataSources } from '../services/externalDataService';

interface MonitoringData {
  crisis: string;
  metric: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  timestamp: string;
  source: string;
}

interface Alert {
  id: string;
  crisis: string;
  type: 'escalation' | 'threshold' | 'trend';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, number>;
  projection: MonitoringData[];
}

export const CrisisMonitoringDashboard: React.FC<{
  crises: CrisisIndexItem[];
  lang: Language;
}> = ({ crises, lang }) => {
  const [monitoringData, setMonitoringData] = useState<MonitoringData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [isLoading, setIsLoading] = useState(false);

  // Generate mock monitoring data for demonstration
  const generateMockData = () => {
    const mockData: MonitoringData[] = [];
    const sources = getDataSources();

    crises.forEach(crisis => {
      // Generate 10 data points per crisis
      for (let i = 0; i < 10; i++) {
        const timestamp = new Date(Date.now() - i * 3600000).toISOString(); // Hourly intervals
        mockData.push({
          crisis: crisis.slug,
          metric: ['severity', 'volatility', 'mentions', 'sentiment'][Math.floor(Math.random() * 4)],
          value: Math.random() * 100,
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any,
          timestamp,
          source: sources[Math.floor(Math.random() * sources.length)].name
        });
      }
    });

    return mockData;
  };

  // Generate mock alerts
  const generateMockAlerts = (): Alert[] => {
    const alertTypes = [
      { type: 'escalation', message: 'Schnelle Eskalation in Social Media' },
      { type: 'threshold', message: 'Grenzwert für politische Instabilität überschritten' },
      { type: 'trend', message: 'Negativer Trend in Wirtschaftsdaten' }
    ];

    return crises.slice(0, 3).map((crisis, idx) => ({
      id: `alert_${idx}`,
      crisis: crisis.slug,
      type: alertTypes[idx].type as any,
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
      message: alertTypes[idx].message,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
    }));
  };

  // Load data on mount and periodically
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load mock data for demonstration
        const mockData = generateMockData();
        setMonitoringData(mockData);
        setAlerts(generateMockAlerts());
      } catch (error) {
        console.error('Failed to load monitoring data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Set up periodic refresh (every 30 seconds for demo)
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [crises]);

  // Aggregate data by crisis
  const aggregatedData = useMemo(() => {
    const aggregated: Record<string, { metrics: Record<string, number>, alerts: number }> = {};

    crises.forEach(crisis => {
      aggregated[crisis.slug] = {
        metrics: {
          severity: crisis.severity,
          volatility: crisis.volatility,
          mentions: Math.floor(Math.random() * 1000),
          sentiment: Math.random() * 2 - 1 // -1 to 1
        },
        alerts: alerts.filter(a => a.crisis === crisis.slug).length
      };
    });

    return aggregated;
  }, [crises, alerts]);

  // Get severity color
  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10 text-red-400';
      case 'high': return 'border-orange-500 bg-orange-500/10 text-orange-400';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
      case 'low': return 'border-blue-500 bg-blue-500/10 text-blue-400';
      default: return 'border-gray-500 bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="mono text-[10px] uppercase tracking-[0.5em] text-white/30">KRISEN MONITORING</span>
            <h2 className="text-[4vw] md:text-[2.5vw] font-black uppercase leading-[0.8] tracking-tighter mt-2">
              Echtzeit-Überwachung
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="mono text-[11px] bg-black border border-white/20 px-3 py-1 text-white"
            >
              <option value="1h">Letzte Stunde</option>
              <option value="24h">Letzte 24h</option>
              <option value="7d">Letzte Woche</option>
              <option value="30d">Letzter Monat</option>
            </select>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="mono text-[9px] text-white/40">LIVE</span>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="border border-white/10 p-4 bg-white/[0.01]">
            <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/40 mb-1">AKTIVE KRISEN</div>
            <div className="text-2xl font-black">{crises.length}</div>
          </div>
          <div className="border border-white/10 p-4 bg-white/[0.01]">
            <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/40 mb-1">ALERTS</div>
            <div className="text-2xl font-black text-red-400">{alerts.length}</div>
          </div>
          <div className="border border-white/10 p-4 bg-white/[0.01]">
            <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/40 mb-1">DATENPUNKTE</div>
            <div className="text-2xl font-black">{monitoringData.length}</div>
          </div>
          <div className="border border-white/10 p-4 bg-white/[0.01]">
            <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/40 mb-1">QUELLEN</div>
            <div className="text-2xl font-black">{getDataSources().length}</div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] bg-white/10 flex-grow" />
            <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">AKTUELLE ALERTS</span>
            <div className="h-[1px] bg-white/10 flex-grow" />
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 border ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="mono text-[8px] uppercase tracking-[0.2em] px-2 py-1 bg-current/20 text-current">
                        {alert.type.toUpperCase()}
                      </span>
                      <span className="mono text-[9px] text-white/60">
                        {crises.find(c => c.slug === alert.crisis)?.title || alert.crisis}
                      </span>
                    </div>
                    <p className="mono text-[11px] leading-relaxed">{alert.message}</p>
                  </div>
                  <div className="mono text-[8px] text-white/40 ml-4">
                    {new Date(alert.timestamp).toLocaleTimeString('de-DE')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Crisis Overview Grid */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-white/10 flex-grow" />
          <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">KRISEN-ÜBERSICHT</span>
          <div className="h-[1px] bg-white/10 flex-grow" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crises.map((crisis) => {
            const data = aggregatedData[crisis.slug];
            return (
              <div key={crisis.slug} className="border border-white/10 p-4 bg-white/[0.01] hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="mono text-[10px] uppercase tracking-[0.2em] text-white/60 truncate">
                    {crisis.title}
                  </h3>
                  {data?.alerts > 0 && (
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="mono text-[8px] text-white/40">SEVERITY</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-white/10">
                        <div
                          className="h-full bg-white"
                          style={{ width: `${crisis.severity}%` }}
                        />
                      </div>
                      <span className="mono text-[9px] text-white/60 w-8 text-right">
                        {crisis.severity}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="mono text-[8px] text-white/40">VOLATILITY</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-white/10">
                        <div
                          className="h-full bg-orange-400"
                          style={{ width: `${crisis.volatility}%` }}
                        />
                      </div>
                      <span className="mono text-[9px] text-white/60 w-8 text-right">
                        {crisis.volatility}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="mono text-[8px] text-white/40">MENTIONS</span>
                    <span className="mono text-[9px] text-white/60">
                      {data?.metrics.mentions || 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="mono text-[8px] text-white/40">SENTIMENT</span>
                    <div className="flex items-center gap-1">
                      <span className="mono text-[9px] text-white/60">
                        {(data?.metrics.sentiment || 0).toFixed(2)}
                      </span>
                      <div className="w-2 h-2 rounded-full"
                           style={{
                             backgroundColor: (data?.metrics.sentiment || 0) > 0 ? '#22c55e' :
                                           (data?.metrics.sentiment || 0) < -0.5 ? '#ef4444' : '#eab308'
                           }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trend Analysis */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-white/10 flex-grow" />
          <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">TRENDANALYSE</span>
          <div className="h-[1px] bg-white/10 flex-grow" />
        </div>

        <div className="border border-white/10 p-6 bg-white/[0.01]">
          <div className="mb-4">
            <span className="mono text-[10px] uppercase tracking-[0.4em] text-white/40">
              DATENQUELLEN & AKTUALISIERUNG
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getDataSources().map((source) => (
              <div key={source.name} className="border border-white/5 p-3 bg-black/20">
                <div className="mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-1">
                  {source.name}
                </div>
                <div className="mono text-[8px] text-white/40 leading-tight">
                  {source.description}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="mono text-[7px] text-white/50">LIVE</span>
                </div>
              </div>
            ))}
          </div>

          {isLoading && (
            <div className="mt-4 flex items-center gap-3">
              <div className="w-4 h-4 border border-white/20 border-t-white/60 rounded-full animate-spin"></div>
              <span className="mono text-[10px] text-white/40">Aktualisiere Daten...</span>
            </div>
          )}
        </div>
      </section>

      {/* Scenario Modeling */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-white/10 flex-grow" />
          <span className="mono text-[9px] uppercase tracking-[0.4em] text-white/30">SZENARIO-MODELLIERUNG</span>
          <div className="h-[1px] bg-white/10 flex-grow" />
        </div>

        <div className="border border-white/10 p-6 bg-white/[0.01]">
          <div className="mb-4">
            <span className="mono text-[10px] uppercase tracking-[0.4em] text-white/40">
              HYPOTHETISCHE PROJEKTIONEN
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-white/5 p-4 bg-black/20">
              <div className="mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-2">
                KLIMAWANDEL + MIGRATION
              </div>
              <div className="mono text-[8px] text-white/40 leading-tight mb-3">
                Eskalation um 40% bei Überschreitung von 2°C globaler Erwärmung
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="mono text-[8px] text-red-400">KRITISCH</span>
              </div>
            </div>

            <div className="border border-white/5 p-4 bg-black/20">
              <div className="mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-2">
                DESINFORMATION + DEMOKRATIE
              </div>
              <div className="mono text-[8px] text-white/40 leading-tight mb-3">
                Vertrauensverlust um 25% bei anhaltender Polarisierung
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="mono text-[8px] text-yellow-400">MITTEL</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
