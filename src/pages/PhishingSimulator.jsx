import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Search, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function PhishingSimulator() {
  const [hasClicked, setHasClicked] = useState(false);
  const [activeTab, setActiveTab] = useState('email');

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
                <div className="text-2xl font-bold text-slate-100 mb-2 font-serif">Action Required: Verify Account Activity</div>
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                  <strong>From:</strong> <span className="text-slate-300">security@paypa1-support.com</span>
                </div>
                <div className="text-sm text-slate-400">
                  <strong>To:</strong> you@company.com
                </div>
              </div>
            </div>

            <div className="space-y-6 text-slate-200 leading-relaxed font-sans bg-slate-100 dark:bg-slate-900 rounded p-6">
              <p>Dear Customer,</p>
              
              <p>We recently noticed suspicious activity on your account. For your protection, your account has been temporarily restricted.</p>
              
              <p>To restore full access and prevent permanent suspension, please verify your identity immediately by logging in below.</p>
              
              <div className="text-center py-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95">
                  Verify Account Now
                </button>
              </div>
              
              <p>If you do not complete this verification within 24 hours, your account will be permanently closed.</p>
              
              <div className="pt-6 border-t border-slate-700/50 text-sm text-slate-500">
                <p>Sincerely,</p>
                <p>The Security Team</p>
                <p>Ref ID: #9832104-SEC</p>
              </div>
            </div>
          </div>

          {!hasClicked && (
            <div className="flex justify-center gap-6 mt-6">
              <button 
                onClick={() => { setHasClicked(true); setActiveTab('feedback'); }}
                className="bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 px-8 py-3 rounded-lg font-bold transition-all"
              >
                It's a Phishing Attempt
              </button>
              <button 
                onClick={() => { setHasClicked(true); setActiveTab('feedback'); }}
                className="bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary/20 px-8 py-3 rounded-lg font-bold transition-all"
              >
                It Looks Safe to Click
              </button>
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
                      <div className="w-10 h-10 rounded-full bg-danger/10 text-danger flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg mb-1">This was Phishing</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          This email was designed to steal credentials. While the design looks convincing, multiple red flags indicate it's malicious.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Best Practice
                      </h4>
                      <p className="text-sm text-slate-300">
                        Never click links in unexpected emails. Always navigate directly to the service provider's official website in your browser.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {[
                      {
                        title: "Spoofed Domain",
                        desc: "Sender address uses 'paypa1-support.com' instead of official 'paypal.com'.",
                        severity: "High"
                      },
                      {
                        title: "Urgent Language",
                        desc: "Uses threats ('permanently closed', 'immediately') to force quick action.",
                        severity: "Medium"
                      },
                      {
                        title: "Generic Greeting",
                        desc: "Uses 'Dear Customer' instead of your actual name, typical of bulk phishing.",
                        severity: "Medium"
                      },
                      {
                        title: "Malicious Link",
                        desc: "Button redirects to a credential harvesting site rather than the official login.",
                        severity: "Critical"
                      }
                    ].map((indicator, idx) => (
                      <div key={idx} className="p-4 border border-slate-700/50 rounded-lg bg-dark/40 hover:bg-dark/60 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-white">{indicator.title}</h4>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded font-bold uppercase",
                            indicator.severity === 'Critical' ? "bg-danger text-white" :
                            indicator.severity === 'High' ? "bg-orange-500 text-white" : "bg-yellow-500 text-white"
                          )}>
                            {indicator.severity}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">{indicator.desc}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
                
                <div className="mt-8 pt-6 border-t border-slate-700/50 text-right">
                  <button 
                    onClick={() => { setHasClicked(false); setActiveTab('email'); }}
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
