'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, UserPlus, Lock } from 'lucide-react';
import { Language } from '@/lib/types';

export default function RegisterPage() {
  const { register, t, language, setLanguage } = useApp();
  const router = useRouter();
  const isTe = language === 'te';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [prefLang, setPrefLang] = useState<Language>(language);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(isTe ? 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు' : 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(isTe ? 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, prefLang);
      setLanguage(prefLang);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-900 rounded-xl text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {isTe ? 'కొత్త పౌరుడి రిజిస్ట్రేషన్' : 'Create Free Account'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {isTe
              ? 'సంక్షేమ పథకాలను సులభంగా కనుగొనడానికి ప్రారంభించండి'
              : 'Discover personalized welfare schemes grounded in official guidelines'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isTe ? 'ఈమెయిల్ చిరునామా' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isTe ? 'ప్రాధాన్యత భాష' : 'Preferred Language'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPrefLang('en')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold ${
                  prefLang === 'en'
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setPrefLang('te')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold ${
                  prefLang === 'te'
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                తెలుగు (Telugu)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isTe ? 'పాస్‌వర్డ్ (కనీసం 6 అక్షరాలు)' : 'Password (min 6 characters)'}
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isTe ? 'పాస్‌వర్డ్ నిర్ధారించండి' : 'Confirm Password'}
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              {isTe
                ? 'గోప్యతా నోటీస్: మేము మీ వివరాలను కేవలం అర్హత నిబంధనలను సరిపోల్చడానికే ఉపయోగిస్తాము. ప్రభుత్వ పాస్‌వర్డ్‌లను ఎప్పుడూ అడగము.'
                : 'Privacy Assurance: We protect sensitive attributes and never ask for government portal OTPs or passwords.'}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-blue-900 hover:bg-blue-950 text-white shadow-md transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? (isTe ? 'ఖాతా సృష్టిస్తోంది...' : 'Creating Account...') : t.nav.register}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          {isTe ? 'ఇప్పటికే ఖాతా ఉందా? ' : 'Already registered? '}
          <Link href="/login" className="font-bold text-blue-900 hover:underline">
            {t.nav.login}
          </Link>
        </div>
      </div>
    </div>
  );
}
