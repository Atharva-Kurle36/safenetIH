import { useEffect, useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { ShieldAlert, AlertTriangle, UserCheck, Activity, Target } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://safenetbacknd.vercel.app';

const fallbackData = {
  kpis: [
    { title: 'Total Emails Scanned', value: '0', trend: '+0%', color: 'text-blue-500', kind: 'scans' },
    { title: 'Threats Blocked', value: '0', trend: '+0%', color: 'text-danger', kind: 'blocked' },
    { title: 'Training Completion', value: '40%', trend: '+0%', color: 'text-secondary', kind: 'training' },
    { title: 'Avg. Risk Score', value: '0', trend: '+0%', color: 'text-yellow-500', kind: 'risk' },
  ],
  activity_data: [
    { name: 'Mon', safe: 0, phishing: 0 },
    { name: 'Tue', safe: 0, phishing: 0 },
    { name: 'Wed', safe: 0, phishing: 0 },
    { name: 'Thu', safe: 0, phishing: 0 },
    { name: 'Fri', safe: 0, phishing: 0 },
    { name: 'Sat', safe: 0, phishing: 0 },
    { name: 'Sun', safe: 0, phishing: 0 },
  ],
  training_scores: [
    { name: 'Week 1', score: 60 },
    { name: 'Week 2', score: 60 },
    { name: 'Week 3', score: 60 },
    { name: 'Week 4', score: 60 },
    { name: 'Week 5', score: 60 },
  ],
  recent_threats: [],
  last_updated: null,
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(fallbackData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE_URL}/dashboard/metrics`, {
          headers: {}
        });
        if (!response.ok) {
          throw new Error(`Dashboard metrics failed with status ${response.status}`);
        }

        const data = await response.json();
        if (mounted) {
          setDashboardData({
            ...fallbackData,
            ...data,
          });
        }
      } catch (requestError) {
        if (mounted) {
          setError('Unable to load live dashboard metrics. Showing fallback values.');
          setDashboardData(fallbackData);
        }
        console.error(requestError);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboard();
    const refreshId = setInterval(() => {
      void loadDashboard();
    }, 12000);

    return () => {
      mounted = false;
      clearInterval(refreshId);
    };
  }, []);

  const iconByKind = useMemo(
    () => ({
      scans: Activity,
      blocked: ShieldAlert,
      training: UserCheck,
      risk: Target,
    }),
    []
  );

  const updatedAtText = dashboardData.last_updated
    ? new Date(dashboardData.last_updated).toLocaleTimeString()
    : 'N/A';

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Posture Dashboard</h1>
          <p className="text-slate-400">Overview of organizational threat activity and training performance.</p>
          {error && <p className="text-danger text-sm mt-2">{error}</p>}
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-primary">System Status: Active</p>
          <p className="text-xs text-slate-500">Last updated: {isLoading ? 'Updating...' : updatedAtText}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardData.kpis.map((kpi, idx) => {
          const Icon = iconByKind[kpi.kind] || Activity;
          return (
          <div key={idx} className="cyber-card flex flex-col justify-between h-36 border-t-2" style={{ borderTopColor: 'inherit' }}>
            <div className="flex justify-between items-start">
              <h3 className="text-slate-400 font-medium text-sm">{kpi.title}</h3>
              <Icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className="flex items-end justify-between mt-auto">
              <span className="text-3xl font-bold text-white">{kpi.value}</span>
              <span className={`text-sm font-bold ${kpi.trend.startsWith('+') ? 'text-secondary' : 'text-primary'}`}>
                {kpi.trend}
              </span>
            </div>
          </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Threat Analysis Chart */}
        <div className="lg:col-span-2 cyber-card">
          <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-700/50 pb-4">Threat Detection Trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.activity_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="safe" stackId="a" fill="#0ea5e9" name="Safe Traffic" radius={[0, 0, 4, 4]} />
                <Bar dataKey="phishing" stackId="a" fill="#ef4444" name="Phishing Blocked" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Training Progress Chart */}
        <div className="cyber-card">
          <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-700/50 pb-4">Employee Readiness</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.training_scores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={['dataMin - 10', 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#00f0ff" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#00f0ff', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#fff', stroke: '#00f0ff' }}
                  name="Avg. Readiness Score" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Threats Table */}
        <div className="lg:col-span-3 cyber-card mt-2">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700/50">
            <h3 className="text-lg font-bold text-white">Recent Blocked High-Risk Threats</h3>
            <button className="text-primary text-sm font-semibold hover:underline">View All Logs</button>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-sm tracking-wide border-b border-slate-700/50">
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Source / Subject</th>
                  <th className="pb-3 font-medium">Risk Score</th>
                  <th className="pb-3 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {dashboardData.recent_threats.map((threat) => (
                  <tr key={threat.id} className="border-b border-slate-700/50 hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1.5 bg-danger/10 text-danger px-2.5 py-1 rounded text-xs font-bold uppercase">
                        <AlertTriangle className="w-3 h-3" /> {threat.type}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-slate-300 group-hover:text-primary transition-colors truncate max-w-xs">{threat.source}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-800 rounded-full h-1.5 max-w-[100px]">
                          <div className="bg-danger h-1.5 rounded-full" style={{ width: `${threat.score}%` }}></div>
                        </div>
                        <span className="text-danger font-bold text-xs">{threat.score}%</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-500">{threat.date}</td>
                  </tr>
                ))}
                {dashboardData.recent_threats.length === 0 && (
                  <tr>
                    <td className="py-6 text-slate-500" colSpan={4}>
                      No high-risk threats logged yet. Run detector scans to populate this table.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
