import { useState } from 'react';
import { Heart, Mail, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Login() {
  const { login, signup } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        const result = login(email, password);
        if (!result.success) {
          setError(result.error || 'Login failed');
          setLoading(false);
        }
      } else {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        if (password.length < 4) {
          setError('Password must be at least 4 characters');
          setLoading(false);
          return;
        }
        const result = signup(name.trim(), email.trim(), password);
        if (!result.success) {
          setError(result.error || 'Signup failed');
          setLoading(false);
        }
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-primary-50/30 to-secondary-50/30 p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-100/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center mx-auto shadow-glow mb-4">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">CampusCare</h1>
          <p className="text-sm text-slate-400 mt-1">Healthcare support for LPU students</p>
        </div>

        {/* Card */}
        <div className="card p-6 sm:p-8">
          {/* Mode toggle */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white text-primary-700 shadow-soft' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'signup' ? 'bg-white text-primary-700 shadow-soft' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Student Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="input-field pl-11"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@lpu.in"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-11"
                />
              </div>
            </div>

            {error && (
              <div className="bg-danger-50 border border-danger-200 rounded-xl p-3 text-sm text-danger-700 animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Login' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                Demo authentication — your account is stored locally on this device.
                No real data is sent anywhere. Use any email and password to create an account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
