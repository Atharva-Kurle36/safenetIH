import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, Crosshair, BarChart3, ChevronRight, Lock, 
  Mail, Search, Zap, Users, Globe, CheckCircle2, ArrowRight,
  Shield, Brain, Eye, TrendingUp
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative flex flex-col pt-20">
      {/* Animated Cyber Grid Background */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20 z-0" style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }} />
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center px-6">
        {/* ═══════════════════════════════════════════════════════════
            SECTION 1 — HERO (full viewport)
        ═══════════════════════════════════════════════════════════ */}
        <div className="min-h-screen flex flex-col justify-center items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium backdrop-blur-md">
              <Lock className="w-4 h-4" />
              <span>Next-Generation Enterprise Security</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-white leading-tight">
              Detect Phishing.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Stay Secure.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
              AI-powered phishing detection and interactive safety training platform. 
              Empower your team to recognize and block sophisticated cyber threats before they compromise your data.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/detector" className="w-full sm:w-auto cyber-button flex items-center justify-center gap-2 group">
                Analyze Email
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/simulator" className="w-full sm:w-auto px-8 py-3 rounded-full text-white font-semibold border border-slate-700 hover:bg-slate-800 hover:border-slate-500 transition-all duration-300">
                Start Training
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 2 — FEATURE CARDS
        ═══════════════════════════════════════════════════════════ */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20"
        >
          {[
            {
              title: "AI Analysis",
              desc: "Deep-learning models to detect malicious patterns, urgent language, and suspicious sender data.",
              icon: ShieldAlert,
              color: "text-primary",
              bg: "bg-primary/10",
              border: "border-primary/20"
            },
            {
              title: "Live Simulations",
              desc: "Train employees with realistic, interactive phishing scenarios mimicking real-world attacks.",
              icon: Crosshair,
              color: "text-danger",
              bg: "bg-danger/10",
              border: "border-danger/20"
            },
            {
              title: "Analytics Setup",
              desc: "Track company-wide security posture and individual risk scores over time.",
              icon: BarChart3,
              color: "text-secondary",
              bg: "bg-secondary/10",
              border: "border-secondary/20"
            }
          ].map((feature, i) => (
            <div key={i} className="cyber-card group hover:-translate-y-2 transition-transform duration-300">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.bg} ${feature.border} border`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 2.5 — DATA BREACH CHECKER FEATURE
        ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="w-full max-w-6xl mx-auto mt-16 mb-10"
        >
          <div className="cyber-card group hover:-translate-y-2 transition-transform duration-300">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-warning/30 bg-warning/5 text-warning text-sm font-medium backdrop-blur-md">
                  <Shield className="w-4 h-4" />
                  <span>Data Breach Protection</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Check If Your Email Has Been Breached
                </h3>
                <p className="text-slate-400 leading-relaxed mb-6 max-w-lg">
                  Before analyzing suspicious emails, verify if your personal information has already been compromised in known data breaches. Stay one step ahead of attackers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://haveibeenpwned.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cyber-button flex items-center justify-center gap-2 group"
                  >
                    Check Data Breach Status
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <span className="text-xs text-slate-500 self-center sm:self-start">
                    Powered by Have I Been Pwned
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-warning/20 to-warning/5 border border-warning/20 flex items-center justify-center">
                  <Search className="w-16 h-16 text-warning" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3 — TRUST STATISTICS BAR
        ═══════════════════════════════════════════════════════════ */}
        <div className="w-full max-w-6xl mx-auto py-16 border-y border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "1.4M+", label: "Threats Blocked", icon: Shield },
              { value: "50K+", label: "Users Protected", icon: Users },
              { value: "99.7%", label: "Detection Accuracy", icon: Eye },
              { value: "30+", label: "Countries Served", icon: Globe }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group">
                <stat.icon className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 4 — HOW IT WORKS
        ═══════════════════════════════════════════════════════════ */}
        <div className="w-full max-w-6xl mx-auto py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How SafeNet Works</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-16">
            Three simple steps to transform your organization's cybersecurity posture from reactive to proactive.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

            {[
              {
                step: "01",
                title: "Paste & Scan",
                desc: "Copy suspicious email content or URLs directly into our threat analysis engine. No setup required.",
                icon: Mail,
              },
              {
                step: "02",
                title: "AI Detection",
                desc: "Our NLP models analyze language patterns, domain reputation, and sender authenticity in real-time.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Report & Train",
                desc: "Get a detailed threat report with risk scores, indicators, and recommended actions for your team.",
                icon: Zap,
              }
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-panel border-2 border-slate-700 group-hover:border-primary/50 flex items-center justify-center mb-6 transition-colors relative z-10">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary/60 tracking-widest uppercase mb-2">Step {item.step}</span>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 5 — WHY SAFENET
        ═══════════════════════════════════════════════════════════ */}
        <div className="w-full max-w-6xl mx-auto py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why Organizations Trust <span className="text-primary">SafeNet</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Phishing attacks cause over $12 billion in losses annually. Traditional email filters catch less than 60% of sophisticated attacks.
                SafeNet uses advanced AI to detect what conventional tools miss — and trains your people to be the last line of defense.
              </p>
              <div className="space-y-5">
                {[
                  "Real-time NLP analysis with 99.7% accuracy",
                  "Interactive phishing simulations with instant feedback",
                  "Executive risk dashboards with trend analytics",
                  "Zero-setup deployment — works from your browser",
                  "Continuous model updates against emerging threats"
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{point}</span>
                  </div>
                ))}
              </div>
              <Link to="/detector" className="inline-flex items-center gap-2 mt-10 cyber-button group">
                Try It Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Email Threats", value: "91%", sub: "of breaches start with phishing", color: "border-danger/30" },
                { title: "Detection Rate", value: "99.7%", sub: "accuracy with our AI models", color: "border-primary/30" },
                { title: "Response Time", value: "<2s", sub: "average threat analysis speed", color: "border-secondary/30" },
                { title: "Training Impact", value: "74%", sub: "reduction in click-through rates", color: "border-primary/30" }
              ].map((card, i) => (
                <div key={i} className={`cyber-card text-center hover:scale-105 transition-transform duration-300 border-t-2 ${card.color}`}>
                  <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
                  <p className="text-sm font-semibold text-slate-300 mb-2">{card.title}</p>
                  <p className="text-xs text-slate-500">{card.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 6 — RECENT THREAT LANDSCAPE
        ═══════════════════════════════════════════════════════════ */}
        <div className="w-full max-w-6xl mx-auto py-20 border-t border-slate-800">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Threat Landscape Overview</h2>
          <p className="text-slate-400 text-center max-w-xl mx-auto mb-14">
            Understand the real-world attack vectors SafeNet defends against every day.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: "Credential Harvesting", pct: "38%", desc: "Fake login pages designed to steal usernames and passwords.", icon: Search },
              { type: "Business Email Compromise", pct: "27%", desc: "Impersonation of executives or vendors to authorize transactions.", icon: Mail },
              { type: "Malware Delivery", pct: "22%", desc: "Attachments and links that install keyloggers or ransomware.", icon: ShieldAlert },
              { type: "Social Engineering", pct: "13%", desc: "Manipulating trust through urgency, authority, or familiarity.", icon: Users }
            ].map((threat, i) => (
              <div key={i} className="cyber-card group hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <threat.icon className="w-6 h-6 text-primary" />
                  <span className="text-2xl font-bold text-white">{threat.pct}</span>
                </div>
                <h4 className="text-white font-semibold mb-2">{threat.type}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{threat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 7 — CTA FOOTER
        ═══════════════════════════════════════════════════════════ */}
        <div className="w-full max-w-5xl mx-auto py-24 text-center">
          <div className="cyber-card py-20 px-8 bg-gradient-to-br from-panel to-dark relative overflow-hidden">
            <div className="absolute inset-0 bg-cyber-grid opacity-10" />
            <div className="relative z-10">
              <TrendingUp className="w-10 h-10 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Start Protecting Your Organization Today
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto mb-10">
                Join thousands of companies using SafeNet to defend against phishing attacks. 
                No credit card required. No installation needed.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/detector" className="cyber-button flex items-center gap-2 group">
                  Analyze Your First Email
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/about" className="px-8 py-3 rounded-full text-white font-semibold border border-slate-700 hover:bg-slate-800 hover:border-slate-500 transition-all duration-300">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════════════════ */}
        <footer className="w-full max-w-6xl mx-auto py-10 border-t border-slate-800 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>© 2026 SafeNet. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
              <Link to="/detector" className="hover:text-white transition-colors">Detector</Link>
              <Link to="/simulator" className="hover:text-white transition-colors">Simulator</Link>
              <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
