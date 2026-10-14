'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, LogIn, Sparkles, UserCheck, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const { login, t, language } = useApp();
  const router = useRouter();
  const isTe = language === 'te';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCitizen = () => {
    setEmail('citizen@jansahayak.in');
    setPassword('Citizen@2026');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@jansahayak.gov.in');
    setPassword('Admin@JanSahayak2026');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-900 rounded-xl text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {isTe ? 'పౌరుల లాగిన్' : 'Citizen Sign In'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {isTe
              ? 'మీ వ్యక్తిగత ప్రయోజనాల డ్యాష్‌బోర్డ్‌ను యాక్సెస్ చేయండి'
              : 'Access your personalized benefits dashboard & application tracker'}
          </p>
        </div>

        {/* Quick Demo Logins for instant evaluation */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <p className="font-bold text-slate-700 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {isTe ? 'తక్షణ టెస్టింగ్ కోసం డెమో ఖాతాలు:' : 'Instant Demo Credentials:'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoCitizen}
              className="py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold hover:border-blue-400 hover:text-blue-900 transition-colors text-left flex items-center justify-between"
            >
              <span>Citizen Demo</span>
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold hover:border-blue-400 hover:text-blue-900 transition-colors text-left flex items-center justify-between"
            >
              <span>Admin Demo</span>
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isTe ? 'ఈమెయిల్ చిరునామా' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="citizen@jansahayak.in"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isTe ? 'పాస్‌వర్డ్' : 'Password'}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-blue-900 hover:bg-blue-950 text-white shadow-md transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? (isTe ? 'ధృవీకరిస్తోంది...' : 'Signing in...') : t.nav.login}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          {isTe ? 'ఖాతా లేదా? ' : "Don't have an account? "}
          <Link href="/register" className="font-bold text-blue-900 hover:underline">
            {isTe ? 'ఇప్పుడే ఉచితంగా నమోదు చేసుకోండి' : 'Register for free'}
          </Link>
        </div>
      </div>
    </div>
  );
}
