import { useState } from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded credentials
    if (email === 'design@litnet.com' && password === 'Litnet2026') {
      localStorage.setItem('admin_authenticated', 'true');
      onLogin();
    } else {
      setError('Неверный логин или пароль');
      setTimeout(() => setError(''), 3000);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4">
      {/* Snowflakes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
              fontSize: `${10 + Math.random() * 20}px`
            }}
          >
            ❄
          </div>
        ))}
      </div>
      
      <div className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full">
            <Lock className="w-10 h-10 text-white" />
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-center mb-2 text-gray-900">
          Вход в админ-панель
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Введите данные для входа
        </p>
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="design@litnet.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Войти
          </button>
        </form>
        
        {/* Decorative elements */}
        <div className="mt-8 flex justify-center gap-2 text-2xl text-blue-200">
          <span>❄</span>
          <span>⭐</span>
          <span>❄</span>
        </div>
      </div>
    </div>
  );
}
