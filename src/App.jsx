import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import PhishingDetector from './pages/PhishingDetector';
import PhishingSimulator from './pages/PhishingSimulator';
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage';

function AppContent() {
  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/detector" element={<PhishingDetector />} />
          <Route path="/simulator" element={<PhishingSimulator />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
