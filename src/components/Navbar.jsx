import { Link } from 'react-router-dom';
import { Shield, Home, Activity, Target, LayoutDashboard, Info } from 'lucide-react';
import { NavBar } from './ui/tubelight-navbar';

const navItems = [
  { name: 'Home', url: '/', icon: Home },
  { name: 'Detector', url: '/detector', icon: Activity },
  { name: 'Simulator', url: '/simulator', icon: Target },
  { name: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { name: 'About', url: '/about', icon: Info },
];

export default function Navbar() {
  return (
    <>
      {/* SafeNet brand mark — top-left, always visible */}
      <div className="fixed top-5 left-6 z-[60]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-colors">
            <Shield className="w-5 h-5 text-primary" />
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-lg font-bold tracking-wider text-white hidden sm:inline">
            SAFE<span className="text-primary">NET</span>
          </span>
        </Link>
      </div>

      {/* Tubelight Navbar — centered */}
      <NavBar items={navItems} />
    </>
  );
}
