import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Search, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://safenetbacknd.vercel.app';

const severityByExplanation = (text) => {
  if (text.toLowerCase().includes('sensitive')) return 'Critical';
  if (text.toLowerCase().includes('suspicious')) return 'High';
  return 'Medium';
};

export default function PhishingSimulator() {
  const [hasClicked, setHasClicked] = useState(false);
  const [userVerdict, setUserVerdict] = useState(null);
  const [isVerdictCorrect, setIsVerdictCorrect] = useState(null);
  const [activeTab, setActiveTab] = useState('email');
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verdictMessage, setVerdictMessage] = useState('');

  const getExpectedVerdict = (sample) => {
    if (!sample) return 'phishing';

    const hasThreatType = ['bank', 'job', 'security'].includes((sample.type || '').toLowerCase());
    const hasThreatExplanation = (sample.explanation || []).length > 0;
    return hasThreatType || hasThreatExplanation ? 'phishing' : 'safe';
  };

  const loadSimulation = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/simulate`);
      if (!response.ok) {
        throw new Error(`Simulation API failed with status ${response.status}`);
      }

      const data = await response.json();
      setSimulation(data);
      setHasClicked(false);
      setUserVerdict(null);
      setIsVerdictCorrect(null);
      setVerdictMessage('');
      setActiveTab('email');
    } catch (requestError) {
      setError('Unable to fetch simulation data. Check backend URL and network connectivity.');
      console.error(requestError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSimulation();
  }, []);

  const handleVerdict = (verdict) => {
    const expectedVerdict = getExpectedVerdict(simulation);
    const isCorrect = verdict === expectedVerdict;

    setUserVerdict(verdict);
    setIsVerdictCorrect(isCorrect);

    if (verdict === 'safe') {
      setVerdictMessage(
        isCorrect
          ? 'You marked this as safe and that matches the simulation result.'
          : 'You marked this as safe, but this simulation is a phishing attempt.'
      );
    } else {
      setVerdictMessage(
        isCorrect
          ? 'You correctly flagged this as phishing.'
          : 'You flagged this as phishing, but this simulation appears safe.'
      );
    }

    setHasClicked(true);
    setActiveTab('feedback');
  };

  const handlePhishingClick = () => {
    handleVerdict('phishing');
  };

  const handleSafeClick = () => {
    handleVerdict('safe');
  };

  const emailBlocks = simulation?.email_text ? simulation.email_text.split('\n\n') : [];

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4 tracking-wide">Interactive Threat Simulator</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Review the email below as if it arrived in your inbox. Check headers, links, and tone. Would you engage?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 flex flex-col items-stretch space-y-6">
          <div className="cyber-card flex-1 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex border-b border-slate-700 pb-4 mb-4 items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-100 mb-2 font-serif">Simulation Inbox Message</div>
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                  <strong>Type:</strong> <span className="text-slate-300 uppercase">{simulation?.type || 'Loading'}</span>
                </div>
                <div className="text-sm text-slate-400">
                  <strong>To:</strong> you@company.com
                </div>
              </div>
            </div>

            <div className="space-y-6 text-slate-100 leading-relaxed font-sans bg-slate-900 border border-slate-700/70 rounded p-6">
              {loading && <p className="text-slate-400">Loading simulated phishing email...</p>}
              {!loading && error && <p className="text-danger">{error}</p>}
              {!loading && !error && emailBlocks.map((block, idx) => (
                <p key={idx} className="whitespace-pre-wrap text-slate-100">{block}</p>
              ))}
            </div>
          </div>

          <div className="relative z-[80] flex justify-center gap-6 mt-6">
            <button
              type="button"
              onClick={handlePhishingClick}
              className={cn(
                "pointer-events-auto px-8 py-3 rounded-full font-bold transition-all border",
                "bg-danger/10 text-danger border-danger/30 hover:bg-danger/20",
                userVerdict === 'phishing' && "ring-2 ring-danger/60 shadow-[0_0_24px_rgba(239,68,68,0.35)]"
              )}
            >
              It's a Phishing Attempt
            </button>
            <button
              type="button"
              onClick={handleSafeClick}
              className={cn(
                "pointer-events-auto px-8 py-3 rounded-full font-bold transition-all border",
                "bg-secondary/10 text-secondary border-secondary/30 hover:bg-secondary/20",
                userVerdict === 'safe' && "ring-2 ring-secondary/60 shadow-[0_0_24px_rgba(59,130,246,0.35)]"
              )}
            >
              It Looks Safe to Click
            </button>
          </div>

          {hasClicked && (
            <div className={cn(
              "rounded-lg border px-4 py-3 text-sm font-medium",
              isVerdictCorrect ? "border-secondary/40 bg-secondary/10 text-secondary" : "border-danger/40 bg-danger/10 text-danger"
            )}>
              {isVerdictCorrect
                ? 'Correct choice. You identified this simulation accurately.'
                : 'Incorrect choice. Review the threat indicators to spot the warning signs.'}
              {verdictMessage && (
                <p className="mt-2 text-xs uppercase tracking-wide opacity-90">
                  {verdictMessage}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 h-full">
          <AnimatePresence mode="wait">
            {!hasClicked ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="cyber-card h-full flex flex-col justify-center items-center text-center p-8 bg-panel/50 border-dashed border-slate-600"
              >
                <Search className="w-16 h-16 text-slate-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Awaiting Decision</h3>
                <p className="text-slate-400 text-sm leading-relaxed pb-4">
                  Analyze the sender address, subject line, urgency, and the call-to-action button before making your verdict.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="cyber-card relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                <h2 className="text-2xl font-bold text-white mb-6">Simulation Results</h2>

                <div className="flex gap-2 border-b border-slate-700/50 mb-6 pb-2">
                  <button
                    onClick={() => setActiveTab('feedback')}
                    className={cn(
                      "px-4 py-2 font-medium transition-colors border-b-2",
                      activeTab === 'feedback' ? "text-primary border-primary" : "text-slate-400 border-transparent hover:text-slate-300"
                    )}
                  >
                    Feedback
                  </button>
                  <button
                    onClick={() => setActiveTab('indicators')}
                    className={cn(
                      "px-4 py-2 font-medium transition-colors border-b-2",
                      activeTab === 'indicators' ? "text-primary border-primary" : "text-slate-400 border-transparent hover:text-slate-300"
                    )}
                  >
                    Threat Indicators
                  </button>
                </div>

                {activeTab === 'feedback' ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        isVerdictCorrect ? "bg-secondary/10 text-secondary" : "bg-danger/10 text-danger"
                      )}>
                        {isVerdictCorrect ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <XCircle className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg mb-1">
                          {isVerdictCorrect ? 'Correct: Your verdict matched the simulation' : 'Not Quite: Your verdict did not match the simulation'}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          {isVerdictCorrect
                            ? 'Great call. You identified the risk correctly. Review indicators to reinforce this detection pattern.'
                            : 'This sample is malicious. Review the warning signs and avoid clicking links or sharing details in similar emails.'}
                        </p>
                        <p className="text-xs text-slate-500 mt-2 uppercase tracking-wide">
                          Your Choice: {userVerdict || 'N/A'} | Expected: {getExpectedVerdict(simulation)}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Best Practice
                      </h4>
                      <p className="text-sm text-slate-300">
                        Verify sender identity, avoid urgent call-to-action links, and visit official sites directly in your browser.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {(simulation?.explanation || []).map((item, idx) => (
                      <div key={idx} className="p-4 border border-slate-700/50 rounded-lg bg-dark/40 hover:bg-dark/60 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-white">Indicator {idx + 1}</h4>
                          <span className={cn(
                            "text-xs px-3 py-1 rounded-full font-bold uppercase",
                            severityByExplanation(item) === 'Critical' ? "bg-danger text-white" :
                            severityByExplanation(item) === 'High' ? "bg-orange-500 text-white" : "bg-yellow-500 text-white"
                          )}>
                            {severityByExplanation(item)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">{item}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
                
                <div className="mt-8 pt-6 border-t border-slate-700/50 text-right">
                  <button 
                    onClick={() => { void loadSimulation(); }}
                    className="text-primary hover:text-white transition-colors text-sm font-semibold flex items-center justify-end gap-2 w-full group"
                  >
                    Next Simulation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
