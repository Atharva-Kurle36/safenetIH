import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, Target, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Detector', path: '/detector', icon: Activity },
  { name: 'Simulator', path: '/simulator', icon: Target },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-colors">
              <Shield className="w-6 h-6 text-primary" />
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold tracking-wider text-white">
              SAFE<span className="text-primary">NET</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative flex items-center gap-2 text-sm font-medium transition-colors hover:text-white py-2",
                    isActive ? "text-white" : "text-slate-400"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:block">
            <Link to="/simulator" className="cyber-button text-sm px-5 py-2">
              Start Training
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
