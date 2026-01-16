import { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import BackgroundFixed from '../components/BackgroundFixed';
import { SnowEffect } from '../components/SnowEffect';
import Logo from '../imports/Логотипы';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { getSettings } from '../utils/settings';
import { FontPreload } from '../components/FontPreload';
import { YandexMetrika } from '../components/YandexMetrika';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const settings = getSettings();

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === 'design@litnet.com' && password === 'Litnet2026') {
      localStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Неверный email или пароль');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  const handleBackToSite = () => {
    window.history.pushState({}, '', '/advent');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} onBack={handleBackToSite} />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Font Preload */}
      <FontPreload />
      
      {/* Fixed Background */}
      <BackgroundFixed />
      
      {/* Snow Effect */}
      {settings.snowEnabled && <SnowEffect intensity={settings.snowIntensity} />}
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {/* Затемнение по центру */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.6) 0%, transparent 70%)'
          }}
        />
        
        <div className="relative z-10 w-full max-w-md">
          {/* Back button */}
          <button
            onClick={handleBackToSite}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Вернуться на сайт
          </button>
          
          {/* Login form */}
          <div 
            className="p-8 rounded-3xl backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.3) 0%, rgba(100, 116, 139, 0.25) 50%, rgba(148, 163, 184, 0.3) 100%)',
              boxShadow: 'inset 0 0 0 1pt rgba(255, 255, 255, 0.3)'
            }}
          >
            {/* Title */}
            <h1 
              className="text-white text-center mb-2"
              style={{ 
                fontFamily: 'Argent CF, sans-serif', 
                fontWeight: 400, 
                fontStyle: 'italic', 
                fontSize: '32pt', 
                lineHeight: '0.9' 
              }}
            >
              Админ-панель
            </h1>
            
            <p 
              className="text-white/70 text-center mb-8"
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt' }}
            >
              Войдите для управления календарем
            </p>
            
            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label 
                  className="block text-white mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors backdrop-blur-sm"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', userSelect: 'text', borderRadius: '12px' }}
                  placeholder="Введите email"
                  required
                />
              </div>
              
              {/* Password */}
              <div>
                <label 
                  className="block text-white mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', fontWeight: 600 }}
                >
                  Пароль
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition-colors backdrop-blur-sm"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12pt', userSelect: 'text', borderRadius: '12px' }}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {/* Error */}
              {error && (
                <div 
                  className="text-red-300 text-center p-3 rounded-xl bg-red-500/20 border border-red-400/30"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt', borderRadius: '12px' }}
                >
                  {error}
                </div>
              )}
              
              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white rounded-xl hover:from-red-700 hover:via-orange-700 hover:to-red-700 transition-all duration-300 border border-white/30"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif', 
                  fontSize: '14pt', 
                  fontWeight: 700,
                  boxShadow: '0 0 20px rgba(234, 88, 12, 0.5)',
                  borderRadius: '12px'
                }}
              >
                Войти
              </button>
            </form>
          </div>
          
          {/* Logo at bottom of screen */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
            <div className="w-32 h-10">
              <Logo />
            </div>
          </div>
        </div>
      </div>
      <YandexMetrika />
    </div>
  );
}