'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { SavedScheme } from '@/lib/types';
import { apiGetSavedSchemes } from '@/lib/api';
import { SchemeCard } from '@/components/SchemeCard';
import { Bookmark, Sparkles, ArrowRight, Layers } from 'lucide-react';

export default function SavedSchemesPage() {
  const { user, t, language, savedSchemeIds } = useApp();
  const isTe = language === 'te';

  const [savedList, setSavedList] = useState<SavedScheme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadSaved() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await apiGetSavedSchemes();
        setSavedList(data);
      } catch (err) {
        console.error('Failed to load saved schemes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSaved();
  }, [user, savedSchemeIds]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Bookmark className="w-12 h-12 text-blue-900 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {isTe ? 'లాగిన్ అవ్వండి' : 'Sign In Required'}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          {isTe
            ? 'మీరు భద్రపరిచిన పథకాలను చూడటానికి దయచేసి లాగిన్ అవ్వండి.'
            : 'Sign in to access your bookmarked schemes from any mobile or desktop device.'}
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold"
        >
          {t.nav.login}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.nav.saved}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            {isTe
              ? 'మీరు భద్రపరిచిన ప్రభుత్వ పథకాల జాబితా మరియు అధికారిక దరఖాస్తు లింకులు.'
              : 'Schemes you have bookmarked for offline review or upcoming application cycles.'}
          </p>
        </div>

        <Link
          href="/schemes"
          className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
        >
          {isTe ? 'మరిన్ని పథకాలు శోధించండి' : 'Explore More Schemes'}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-64 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : savedList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {isTe ? 'భద్రపరిచిన పథకాలు ఏవీ లేవు' : 'No saved schemes yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {isTe
              ? 'కేటలాగ్ లేదా డ్యాష్‌బోర్డ్ నుండి పథకాలను బుక్‌మార్క్ చేయండి.'
              : 'When browsing welfare schemes, click the bookmark icon to save them to this list.'}
          </p>
          <Link
            href="/schemes"
            className="px-4 py-2 bg-blue-900 text-white text-xs font-bold rounded-lg"
          >
            {isTe ? 'కేటలాగ్ చూడండి' : 'Browse Scheme Catalog'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedList.map((item) => (
            <SchemeCard key={item.id} scheme={item.scheme} />
          ))}
        </div>
      )}
    </div>
  );
}
