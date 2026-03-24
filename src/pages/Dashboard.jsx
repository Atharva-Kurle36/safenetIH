import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { ShieldAlert, AlertTriangle, UserCheck, Activity, Target } from 'lucide-react';

const mockActivityData = [
  { name: 'Mon', safe: 400, phishing: 24 },
  { name: 'Tue', safe: 300, phishing: 13 },
  { name: 'Wed', safe: 550, phishing: 98 },
  { name: 'Thu', safe: 278, phishing: 39 },
  { name: 'Fri', safe: 189, phishing: 48 },
  { name: 'Sat', safe: 239, phishing: 38 },
  { name: 'Sun', safe: 349, phishing: 43 },
];

const mockTrainingScores = [
  { name: 'Week 1', score: 65 },
  { name: 'Week 2', score: 72 },
  { name: 'Week 3', score: 85 },
  { name: 'Week 4', score: 91 },
  { name: 'Week 5', score: 94 },
];

const recentThreats = [
  { id: 1, type: 'Email', source: 'billing@netflix-update.com', score: 98, date: '2 hours ago' },
  { id: 2, type: 'URL', source: 'http://bit.ly/login-auth-39', score: 85, date: '5 hours ago' },
  { id: 3, type: 'Email', source: 'hr@company-internal.net', score: 92, date: '1 day ago' },
  { id: 4, type: 'Email', source: 'security@amazon-verify.com', score: 88, date: '2 days ago' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Posture Dashboard</h1>
          <p className="text-slate-400">Overview of organizational threat activity and training performance.</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-primary">System Status: Active</p>
          <p className="text-xs text-slate-500">Last updated: Just now</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Emails Scanned", value: "24,892", icon: Activity, color: "text-blue-500", trend: "+12%" },
          { title: "Threats Blocked", value: "1,402", icon: ShieldAlert, color: "text-danger", trend: "+5%" },
          { title: "Training Completion", value: "89%", icon: UserCheck, color: "text-secondary", trend: "+2%" },
          { title: "Avg. Risk Score", value: "34", icon: Target, color: "text-yellow-500", trend: "-8%" }
        ].map((kpi, idx) => (
          <div key={idx} className="cyber-card flex flex-col justify-between h-36 border-t-2" style={{ borderTopColor: 'inherit' }}>
            <div className="flex justify-between items-start">
              <h3 className="text-slate-400 font-medium text-sm">{kpi.title}</h3>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className="flex items-end justify-between mt-auto">
              <span className="text-3xl font-bold text-white">{kpi.value}</span>
              <span className={`text-sm font-bold ${kpi.trend.startsWith('+') ? 'text-secondary' : 'text-primary'}`}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Threat Analysis Chart */}
        <div className="lg:col-span-2 cyber-card">
          <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-700/50 pb-4">Threat Detection Trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <LineChart data={mockTrainingScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                {recentThreats.map((threat) => (
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
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
