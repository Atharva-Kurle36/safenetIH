import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Loader2, AlertTriangle, Link as LinkIcon, Mail, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://safenetbacknd.vercel.app';

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default function PhishingDetector() {
  const [emailText, setEmailText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!emailText.trim() && !urlInput.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          email_text: emailText,
          url: urlInput
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setResult({
        status: data.result,
        riskScore: data.risk_score,
        reasons: data.reasons,
        highlightedWords: data.highlight_words
      });
    } catch (requestError) {
      setError('Unable to reach analysis API. Check backend URL and network connectivity.');
      setResult({
        status: 'Safe',
        riskScore: 0,
        reasons: ['Analysis unavailable: backend connection error.'],
        highlightedWords: []
      });
      console.error(requestError);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderHighlightedText = (text) => {
    if (!result) return text;
    
    let highlightedText = escapeHtml(text);
    result.highlightedWords.forEach(word => {
      const escapedWord = escapeRegex(word);
      const regex = new RegExp(`(${escapedWord})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="text-danger font-bold bg-danger/10 px-1 rounded">$1</span>');
    });

    return <div dangerouslySetInnerHTML={{ __html: highlightedText }} className="whitespace-pre-wrap text-slate-300" />;
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Threat Analysis Engine</h1>
        <p className="text-slate-400">Paste email contents or URLs to scan for potential phishing threats using our AI scanner.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="flex flex-col gap-6">
          <div className="cyber-card flex flex-col h-[500px]">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Email Content</h2>
            </div>
            <textarea
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="Paste email headers and body content here..."
              className="flex-1 w-full bg-dark/50 border border-slate-700/50 rounded-lg p-4 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none font-mono text-sm leading-relaxed"
            />
          </div>

          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-4">
              <LinkIcon className="w-5 h-5 text-secondary" />
              <h2 className="text-lg font-semibold text-white">Suspicious URL Target</h2>
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/login"
              className="cyber-input font-mono text-sm"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!emailText.trim() && !urlInput.trim())}
            className="w-full cyber-button flex justify-center items-center py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin mr-3" />
                Analyzing Threat...
              </>
            ) : (
              'Run Threat Analysis'
            )}
          </button>

          {error && (
            <p className="text-sm text-danger text-center">{error}</p>
          )}
        </div>

        <div className="h-full">
          <AnimatePresence mode="wait">
            {!result && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 cyber-card border-dashed border-slate-600 bg-panel/30"
              >
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-xl font-medium text-slate-300 mb-2">Awaiting Target Data</h3>
                <p className="text-slate-500">Provide email text or a URL and click analyze to generate a risk report.</p>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center space-y-8 cyber-card bg-panel/30"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-slate-700 rounded-full"></div>
                  <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                  <ShieldAlert className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl text-primary font-mono mb-2 animate-pulse">Processing Data Signals...</h3>
                  <div className="space-y-1 text-sm text-slate-400 font-mono">
                    <p>Scanning domain history</p>
                    <p>Evaluating NLP threat models</p>
                    <p>Checking cross-site reputation</p>
                  </div>
                </div>
              </motion.div>
            )}

            {result && !isAnalyzing && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "cyber-card h-full flex flex-col relative overflow-hidden",
                  result.status === 'Phishing' ? "border-danger/30" : "border-secondary/30"
                )}
              >
                <div className={cn(
                  "absolute top-0 left-0 w-full h-1",
                  result.status === 'Phishing' ? "bg-danger" : "bg-secondary"
                )} />

                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center",
                      result.status === 'Phishing' ? "bg-danger/10 text-danger" : "bg-secondary/10 text-secondary"
                    )}>
                      {result.status === 'Phishing' ? (
                        <AlertTriangle className="w-8 h-8" />
                      ) : (
                        <ShieldCheck className="w-8 h-8" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-1 uppercase tracking-wider">
                        {result.status}
                      </h2>
                      <p className={cn(
                        "text-sm font-semibold tracking-wide",
                        result.status === 'Phishing' ? "text-danger" : "text-secondary"
                      )}>
                        Risk Score: {result.riskScore}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" /> Key Findings
                    </h3>
                    <ul className="space-y-3 bg-dark/40 rounded-lg p-4 border border-slate-700/50">
                      {result.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className={cn(
                            "mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0",
                            result.status === 'Phishing' ? "bg-danger" : "bg-secondary"
                          )} />
                          <span className="text-slate-300 text-sm leading-relaxed">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {emailText && result.status === 'Phishing' && (
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" /> Highlighted Threats
                      </h3>
                      <div className="flex-1 bg-dark/40 rounded-lg p-4 border border-slate-700/50 overflow-y-auto font-mono text-sm max-h-[250px] custom-scrollbar">
                        {renderHighlightedText(emailText)}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
