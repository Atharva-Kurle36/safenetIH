import { Link, useNavigate } from 'react-router-dom';
import { Shield, Home, Activity, Target, LayoutDashboard, Info, LogOut, User } from 'lucide-react';
import { NavBar } from './ui/tubelight-navbar';
import { useState, useEffect } from 'react';

const navItems = [
  { name: 'Home', url: '/', icon: Home },
  { name: 'Detector', url: '/detector', icon: Activity },
  { name: 'Simulator', url: '/simulator', icon: Target },
  { name: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { name: 'About', url: '/about', icon: Info },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    setUserEmail('');
    navigate('/login');
  };

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

      {/* Auth Buttons or User Menu — top-right */}
      <div className="fixed top-5 right-6 z-[60]">
        {userEmail ? (
          // Authenticated: Show user menu
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white transition-all"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">{userEmail}</span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700 flex items-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Unauthenticated: Show Login/Signup buttons
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-blue-400 border border-blue-500 hover:bg-blue-500 hover:text-white transition-all"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Tubelight Navbar — centered */}
      <NavBar items={navItems} />
    </>
  );
}
