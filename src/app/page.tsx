'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Scheme } from '@/lib/types';
import { apiGetSchemes } from '@/lib/api';
import { SchemeCard } from '@/components/SchemeCard';
import {
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Tractor,
  HeartPulse,
  Home,
  Baby,
  Coins,
  Briefcase,
  Layers,
  CheckCircle2,
  Lock,
  ExternalLink,
  Bot
} from 'lucide-react';

export default function HomePage() {
  const { t, language } = useApp();
  const isTe = language === 'te';

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Quick preview state
  const [quickState, setQuickState] = useState<string>('All-India');
  const [quickCategory, setQuickCategory] = useState<string>('all');

  useEffect(() => {
    async function loadInitialSchemes() {
      try {
        const data = await apiGetSchemes();
        setSchemes(data);
      } catch (err) {
        console.error('Failed to load schemes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialSchemes();
  }, []);

  const categoryIcons: Record<string, React.ReactNode> = {
    Scholarships: <GraduationCap className="w-5 h-5 text-indigo-600" />,
    Agriculture: <Tractor className="w-5 h-5 text-emerald-600" />,
    Education: <GraduationCap className="w-5 h-5 text-blue-600" />,
    Healthcare: <HeartPulse className="w-5 h-5 text-rose-600" />,
    Housing: <Home className="w-5 h-5 text-amber-600" />,
    'Women & Child': <Baby className="w-5 h-5 text-pink-600" />,
    Pensions: <Coins className="w-5 h-5 text-amber-700" />,
    Employment: <Briefcase className="w-5 h-5 text-teal-600" />,
  };

  const categories = [
    { key: 'Scholarships', label: t.categories.Scholarships, count: '10th, 12th & College' },
    { key: 'Agriculture', label: t.categories.Agriculture, count: 'PM-KISAN, Subsidies' },
    { key: 'Healthcare', label: t.categories.Healthcare, count: 'Up to ₹5 Lakh cover' },
    { key: 'Housing', label: t.categories.Housing, count: 'Pucca House assistance' },
    { key: 'Women & Child', label: t.categories['Women & Child'], count: 'Sukanya, Maternity' },
    { key: 'Pensions', label: t.categories.Pensions, count: 'Guaranteed old-age cover' },
    { key: 'Employment', label: t.categories.Employment, count: 'Mudra, Skill India' },
    { key: 'Education', label: t.categories.Education, count: 'Fee Reimbursement' },
  ];

  const featuredSchemes = schemes.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 text-white overflow-hidden py-16 sm:py-24">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* National emblem trust pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 mb-6">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{isTe ? 'అధికారిక మార్గదర్శకాల ఆధారంగా ప్రత్యక్ష సహాయం' : 'Verified Against Official Government Guidelines'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              {t.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed mb-8 max-w-2xl">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5 mr-2 text-slate-950" />
                {t.hero.findSchemesCTA}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>

              <Link
                href="/schemes"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-colors"
              >
                <Search className="w-4 h-4 mr-2" />
                {t.hero.browseCatalogCTA}
              </Link>

              <Link
                href="/assistant"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
              >
                <Bot className="w-5 h-5 mr-2" />
                {t.hero.chatAssistantCTA}
              </Link>
            </div>

            {/* Verification & Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-xs text-blue-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isTe ? 'కేంద్ర & రాష్ట్ర పథకాలు' : 'Central & State Scope'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isTe ? 'నిబంధనల ఖచ్చితత్వం' : 'Deterministic Rules'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isTe ? 'అధికారిక పోర్టల్ లింకులు' : 'Direct .gov.in Links'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isTe ? 'సురక్షితం & ఉచితం' : 'Privacy-First & Free'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              {isTe ? 'సంక్షేమ పథకాల రంగాలు' : 'Explore by Welfare Domain'}
            </h2>
            <p className="text-sm text-slate-600">
              {isTe
                ? 'మీ అవసరాలకు తగిన సంక్షేమ వర్గాన్ని ఎంచుకుని అందుబాటులో ఉన్న పథకాలను తనిఖీ చేయండి.'
                : 'Browse verified schemes across scholarships, agricultural aid, housing grants, and health assurance.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/schemes?category=${encodeURIComponent(cat.key)}`}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                    {categoryIcons[cat.key] || <Layers className="w-5 h-5 text-blue-600" />}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-900 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-900">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {cat.count}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Recently Verified Schemes */}
      <section className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                {isTe ? 'తాజా ధృవీకరించిన పథకాలు' : 'Verified Welfare Schemes'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {isTe ? 'ప్రముఖ ప్రభుత్వ సంక్షేమ పథకాలు' : 'Popular National & State Schemes'}
              </h2>
            </div>
            <Link
              href="/schemes"
              className="mt-3 sm:mt-0 text-sm font-bold text-blue-900 hover:text-blue-700 flex items-center"
            >
              {isTe ? 'అన్ని పథకాలను చూడండి' : 'View Full Catalog'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-64 rounded-xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredSchemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How JanSahayak AI Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              {isTe ? 'జనసహాయక్ AI ఎలా పనిచేస్తుంది?' : 'How JanSahayak AI Works'}
            </h2>
            <p className="text-sm text-slate-600">
              {isTe
                ? 'నాలుగు సాధారణ దశల్లో మీ హక్కులను తెలుసుకోండి మరియు దరఖాస్తు చేసుకోండి.'
                : 'A transparent, reliable 4-step workflow designed for Indian citizens.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 relative">
              <span className="w-8 h-8 rounded-full bg-blue-900 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                1
              </span>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                {isTe ? 'వివరాలు నమోదు చేయండి' : 'Share Profile Basics'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isTe
                  ? 'మీ వయస్సు, రాష్ట్రం, విద్యార్హత, మరియు ఆదాయాన్ని సురక్షితంగా నమోదు చేయండి.'
                  : 'Enter simple details like age, education, state, and income range. Sensitive details are optional.'}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 relative">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                2
              </span>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                {isTe ? 'అర్హత విశ్లేషణ' : 'Deterministic Matching'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isTe
                  ? 'మా నిబంధనల ఇంజిన్ మీ వివరాలను అధికారిక జీవోలతో సరిపోల్చి అర్హతను లెక్కిస్తుంది.'
                  : 'Rules evaluate exact age boundaries, income limits, and state criteria. No AI hallucinations.'}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 relative">
              <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                3
              </span>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                {isTe ? 'పత్రాల చెక్‌లిస్ట్' : 'Document Checklist'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isTe
                  ? 'ఆధార్, ఆదాయ ధృవీకరణ పత్రం మొదలైన అవసరమైన పత్రాల జాబితాను చూసి సిద్ధం చేసుకోండి.'
                  : 'Review exact certificates required by each department so your application is never rejected.'}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 relative">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                4
              </span>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                {isTe ? 'అధికారిక దరఖాస్తు' : 'Apply on Official Portals'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isTe
                  ? 'ధృవీకరించబడిన ప్రభుత్వ .gov.in పోర్టల్ లో సురక్షితంగా దరఖాస్తు చేసుకోండి.'
                  : 'One-click redirection to official .gov.in and .nic.in portals with milestone tracking.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-14 bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
            {isTe ? 'మీ సంక్షేమ హక్కులను ఇప్పుడే కనుగొనండి' : 'Check Your Benefits in Under 2 Minutes'}
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto mb-8">
            {isTe
              ? 'రిజిస్ట్రేషన్ ఉచితం. ఎటువంటి అధికారిక పత్రాల అప్‌లోడ్ అవసరం లేకుండా పథకాలను బ్రౌజ్ చేయండి.'
              : 'Zero document uploads required to browse. Simple language, verified criteria, and clear next steps.'}
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl transition-all transform hover:scale-105"
          >
            {t.hero.findSchemesCTA}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
