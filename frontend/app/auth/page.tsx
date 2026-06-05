'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Car, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') === 'register' ? 'register' : 'login');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login, register, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '',
    phone: '', userType: 'passenger',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register({
        email: form.email, password: form.password,
        firstName: form.firstName, lastName: form.lastName,
        phone: form.phone, userType: form.userType,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ZA Lift Club</h1>
          <p className="text-gray-500 text-sm">Safe travel across South Africa 🇿🇦</p>
        </div>

        <Card>
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {['login', 'register'].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${tab === t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t === 'login' ? 'Login' : 'Create Account'}
              </button>
            ))}
          </div>

          <CardContent className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                <div className="relative">
                  <Input label="Password" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-8 text-gray-400">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button type="submit" className="w-full" size="lg" loading={isLoading}>Login</Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="First Name" placeholder="John" value={form.firstName} onChange={e => set('firstName', e.target.value)} required />
                  <Input label="Last Name" placeholder="Doe" value={form.lastName} onChange={e => set('lastName', e.target.value)} required />
                </div>
                <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                <Input label="Phone" type="tel" placeholder="+27821234567" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                <div className="relative">
                  <Input label="Password" type={showPass ? 'text' : 'password'} placeholder="Min 8 characters" value={form.password} onChange={e => set('password', e.target.value)} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-8 text-gray-400">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['passenger', 'driver'].map(t => (
                      <button
                        key={t} type="button"
                        onClick={() => set('userType', t)}
                        className={`py-2 px-4 rounded-lg border text-sm font-medium capitalize transition-colors ${form.userType === t ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                      >
                        {t === 'passenger' ? '🧳 Passenger' : '🚗 Driver'}
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" loading={isLoading}>Create Account</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return <Suspense><AuthForm /></Suspense>;
}
