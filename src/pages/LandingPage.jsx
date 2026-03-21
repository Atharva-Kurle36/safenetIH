import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldAlert, Crosshair, BarChart3, ChevronRight, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col pt-20">
      {/* Animated Cyber Grid Background */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20 z-0 mask-image-b" style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }} />
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 text-center">
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

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20"
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
      </div>
    </div>
  );
}
