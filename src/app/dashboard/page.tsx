'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { SchemeMatchResult, TrackerItem } from '@/lib/types';
import { apiMatchSchemes, apiGetTrackerItems } from '@/lib/api';
import { SchemeCard } from '@/components/SchemeCard';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Bookmark,
  CheckSquare,
  ArrowRight,
  Filter,
  Search,
  AlertCircle,
  HelpCircle,
  User,
  SlidersHorizontal
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile, savedSchemeIds, t, language } = useApp();
  const isTe = language === 'te';

  const [matches, setMatches] = useState<SchemeMatchResult[]>([]);
  const [trackers, setTrackers] = useState<TrackerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Tabs
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        // Evaluate matches against current profile or local storage guest profile
        let evalProfile = profile;
        if (!evalProfile && typeof window !== 'undefined') {
          const guest = localStorage.getItem('jansahayak_guest_profile');
          if (guest) evalProfile = JSON.parse(guest);
        }

        const matchResults = await apiMatchSchemes(evalProfile || undefined);
        setMatches(matchResults);

        if (user) {
          const trackerItems = await apiGetTrackerItems();
          setTrackers(trackerItems);
        }
      } catch (err) {
        console.error('Failed to load dashboard matches:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [profile, user]);

  // Derived counts
  const likelyEligibleCount = matches.filter((m) => m.eligibility_status === 'Likely eligible').length;
  const possiblyEligibleCount = matches.filter((m) => m.eligibility_status === 'Possibly eligible').length;

  // Filtered matches
  const filteredMatches = matches.filter((m) => {
    const s = m.scheme;
    if (selectedCategory !== 'All' && s.category !== selectedCategory) return false;
    if (selectedStatusFilter !== 'All' && m.eligibility_status !== selectedStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q) || (s.name_te && s.name_te.toLowerCase().includes(q));
      const matchDept = s.department.toLowerCase().includes(q);
      const matchBenefit = s.benefit_description.toLowerCase().includes(q);
      if (!matchName && !matchDept && !matchBenefit) return false;
    }
    return true;
  });

  // Calculate profile completion percentage
  let completedFields = 0;
  const totalFields = 8;
  if (profile) {
    if (profile.age) completedFields++;
    if (profile.gender) completedFields++;
    if (profile.state) completedFields++;
    if (profile.occupation) completedFields++;
    if (profile.education_level) completedFields++;
    if (profile.income_range) completedFields++;
    if (profile.social_category) completedFields++;
    if (profile.is_farmer !== undefined || profile.is_student !== undefined) completedFields++;
  }
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  const categories = [
    'All',
    'Scholarships',
    'Agriculture',
    'Healthcare',
    'Housing',
    'Women & Child',
    'Pensions',
    'Employment',
    'Education'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome & Profile Summary Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isTe ? 'వ్యక్తిగత ప్రయోజనాల డ్యాష్‌బోర్డ్' : 'Personalized Benefits Hub'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isTe ? 'నమస్కారం' : 'Namaste'}, {user ? user.email.split('@')[0] : (isTe ? 'పౌరుడా' : 'Citizen')}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-200 max-w-xl leading-relaxed">
              {profile?.state
                ? (isTe
                    ? `${profile.state} రాష్ట్ర నివాసిగా, మీ వివరాల ఆధారంగా పథకాలు సరిపోల్చబడ్డాయి.`
                    : `Based on your residency in ${profile.state} and verified criteria, here are your matching schemes.`)
                : (isTe
                    ? 'మీ ప్రొఫైల్‌ను పూర్తి చేసి మరింత ఖచ్చితమైన అర్హత నిబంధనలను పొందండి.'
                    : 'Complete your onboarding profile to unlock high-accuracy eligibility matching.')}
            </p>
          </div>

          {/* Profile Completion Widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 min-w-[260px]">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span>{isTe ? 'ప్రొఫైల్ పూర్తి స్థితి' : 'Profile Completion'}</span>
              <span className="text-amber-300 font-extrabold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(10, completionPercentage)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-blue-200">
              <span>{completedFields} of {totalFields} fields set</span>
              <Link href="/onboarding" className="font-bold text-amber-300 hover:underline">
                {isTe ? 'సవరించండి' : 'Edit Profile →'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{likelyEligibleCount}</div>
            <div className="text-xs text-slate-500 font-medium">
              {isTe ? 'అర్హత ఉండే అవకాశం' : 'Likely Eligible'}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{possiblyEligibleCount}</div>
            <div className="text-xs text-slate-500 font-medium">
              {isTe ? 'పరిశీలించాల్సిన అర్హత' : 'Possibly Eligible'}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{savedSchemeIds.size}</div>
            <div className="text-xs text-slate-500 font-medium">
              {t.nav.saved}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{trackers.length}</div>
            <div className="text-xs text-slate-500 font-medium">
              {isTe ? 'యాక్టివ్ ట్రాకర్స్' : 'Active Applications'}
            </div>
          </div>
        </div>
      </div>

      {/* Deadlines Alert Box if applications exist */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
        <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950">
          <span className="font-bold block mb-0.5">
            {isTe ? 'సమీపిస్తున్న దరఖాస్తు గడువులు' : 'Application Deadlines & Verification Notice'}
          </span>
          {isTe
            ? 'కేంద్ర స్కాలర్‌షిప్‌లు మరియు రాష్ట్ర ఫీజు రీయింబర్స్‌మెంట్ పోర్టల్స్ కోసం అధికారిక తేదీలను ఎప్పటికప్పుడు గమనించండి. పత్రాల సర్టిఫికేషన్లను ముందుగానే సిద్ధం చేసుకోండి.'
            : 'Post-Matric Scholarships & State Welfare deadlines vary by academic schedule. Ensure your Income Certificate & Caste Certificate are renewed beforehand.'}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isTe ? 'పథకం పేరు లేదా శాఖను శోధించండి...' : 'Search matching schemes by name or department...'}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            {isTe ? 'అర్హత:' : 'Eligibility:'}
          </span>
          {['All', 'Likely eligible', 'Possibly eligible'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                selectedStatusFilter === st
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st === 'All'
                ? (isTe ? 'అన్ని' : 'All')
                : st === 'Likely eligible'
                ? (isTe ? 'అర్హత ఉంది' : 'Likely Eligible')
                : (isTe ? 'పరిశీలన' : 'Possibly Eligible')}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'All' ? (isTe ? 'అన్ని రంగాలు' : 'All Domains') : cat}
          </button>
        ))}
      </div>

      {/* Matching Schemes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {isTe ? 'సరిపోలే పథకాలు కనుగొనబడలేదు' : 'No matching schemes found for this filter'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {isTe
              ? 'దయచేసి మీ ఫిల్టర్‌లను సర్దుబాటు చేయండి లేదా ప్రొఫైల్ వివరాలను నవీకరించండి.'
              : 'Try clearing your filters or update your profile attributes to expand eligible criteria.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedStatusFilter('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-blue-900 text-white text-xs font-bold rounded-lg hover:bg-blue-950"
          >
            {isTe ? 'ఫిల్టర్‌లను రీసెట్ చేయండి' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMatches.map((res) => (
            <SchemeCard
              key={res.scheme.id}
              scheme={res.scheme}
              matchResult={res}
            />
          ))}
        </div>
      )}
    </div>
  );
}
