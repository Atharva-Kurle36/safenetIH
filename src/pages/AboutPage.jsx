import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Users, Cpu, Globe, Github, Linkedin, Mail, ArrowRight, Sparkles, Lock, Eye } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      {/* Background Glows */}
      <div className="fixed top-1/3 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            About Us
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Building a Safer <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Digital World</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            SafeNet combines advanced AI with intuitive design to protect organizations from the ever-evolving landscape of phishing attacks.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="cyber-card mb-12 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Phishing remains the #1 attack vector in cybersecurity, responsible for over 90% of data breaches. 
                SafeNet was created to close that gap by making real-time threat detection accessible and training people to think like security analysts.
              </p>
              <p className="text-slate-400 leading-relaxed">
                We believe that security is not just a product — it's a mindset. Our platform combines machine learning models with gamified training 
                to build a culture of cybersecurity awareness across your entire organization.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Threats Blocked", value: "1.4M+", icon: Shield },
                { label: "Users Protected", value: "50K+", icon: Users },
                { label: "AI Models Active", value: "12", icon: Cpu },
                { label: "Countries Served", value: "30+", icon: Globe }
              ].map((stat, idx) => (
                <div key={idx} className="bg-dark/60 border border-slate-700/50 rounded-xl p-5 text-center hover:border-primary/30 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-10">How SafeNet Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Analyze",
                desc: "Paste suspicious email content or URLs into our AI-powered scanner for instant threat assessment.",
                icon: Eye,
                color: "text-primary",
                borderColor: "border-primary/20"
              },
              {
                step: "02",
                title: "Learn",
                desc: "Interact with realistic phishing simulations and learn to spot red flags like spoofed domains and urgency tactics.",
                icon: Sparkles,
                color: "text-secondary",
                borderColor: "border-secondary/20"
              },
              {
                step: "03",
                title: "Protect",
                desc: "Monitor your organization's security posture through real-time dashboards and risk trend analytics.",
                icon: Lock,
                color: "text-danger",
                borderColor: "border-danger/20"
              }
            ].map((item, idx) => (
              <div key={idx} className={`cyber-card group hover:-translate-y-1 transition-transform duration-300 border-t-2 ${item.borderColor}`}>
                <span className={`text-4xl font-black ${item.color} opacity-20 block mb-4`}>{item.step}</span>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-slate-800 border border-slate-700`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-10">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Atharva Kurle", role: "Lead Developer", avatar: "AK" },
              { name: "Team Member 2", role: "AI / ML Engineer", avatar: "TM" },
              { name: "Team Member 3", role: "UI / UX Designer", avatar: "TM" }
            ].map((member, idx) => (
              <div key={idx} className="cyber-card text-center group hover:border-primary/30 transition-colors">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white border-2 border-slate-700 group-hover:border-primary/40 transition-colors">
                  {member.avatar}
                </div>
                <h3 className="text-lg font-bold text-white">{member.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{member.role}</p>
                <div className="flex items-center justify-center gap-4 mt-4 text-slate-500">
                  <Github className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
                  <Linkedin className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
                  <Mail className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="cyber-card text-center py-16 bg-gradient-to-br from-panel to-dark overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-cyber-grid opacity-10" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Secure Your Organization?</h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">
              Start scanning emails and training your team today. SafeNet makes enterprise-grade cybersecurity accessible to everyone.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/detector" className="cyber-button flex items-center gap-2 group">
                Try the Detector
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/simulator" className="px-8 py-3 rounded-full text-white font-semibold border border-slate-700 hover:bg-slate-800 hover:border-slate-500 transition-all duration-300">
                Launch Simulator
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
