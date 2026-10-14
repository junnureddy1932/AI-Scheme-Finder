'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Scheme } from '@/lib/types';
import { apiGetSchemeById, apiCreateTrackerItem } from '@/lib/api';
import {
  ShieldCheck,
  Building2,
  MapPin,
  ExternalLink,
  Bookmark,
  CheckSquare,
  FileText,
  AlertTriangle,
  HelpCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  Info
} from 'lucide-react';

function SchemeDetailContent() {
  const params = useParams();
  const id = params?.id as string;
  const { t, language, savedSchemeIds, toggleSaveScheme, user } = useApp();
  const isTe = language === 'te';

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Tracker state
  const [addingTracker, setAddingTracker] = useState(false);
  const [trackerSuccess, setTrackerSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    async function loadScheme() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await apiGetSchemeById(id);
        setScheme(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load scheme details');
      } finally {
        setLoading(false);
      }
    }
    loadScheme();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="h-8 w-40 bg-slate-200 rounded animate-pulse mb-6" />
        <div className="h-48 bg-slate-200 rounded-2xl animate-pulse mb-8" />
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Scheme Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">{error || 'The requested scheme could not be located.'}</p>
        <Link
          href="/schemes"
          className="px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-bold"
        >
          Return to Schemes Catalog
        </Link>
      </div>
    );
  }

  const isSaved = savedSchemeIds.has(scheme.id);
  const displayName = isTe && scheme.name_te ? scheme.name_te : scheme.name;
  const displayDept = isTe && scheme.department_te ? scheme.department_te : scheme.department;
  const displayDesc = isTe && scheme.description_te ? scheme.description_te : scheme.description;
  const displayBenefit = isTe && scheme.benefit_description_te ? scheme.benefit_description_te : scheme.benefit_description;

  const handleAddToTracker = async () => {
    if (!user) {
      alert(isTe ? 'దయచేసి దరఖాస్తును ట్రాక్ చేయడానికి లాగిన్ అవ్వండి' : 'Please sign in to add to application tracker');
      return;
    }
    setAddingTracker(true);
    try {
      await apiCreateTrackerItem({
        scheme_id: scheme.id,
        status: 'INTERESTED',
        notes: `Started tracking on ${new Date().toLocaleDateString()}`
      });
      setTrackerSuccess(true);
      setTimeout(() => setTrackerSuccess(false), 3000);
    } catch (err) {
      alert('Failed to add to tracker');
    } finally {
      setAddingTracker(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        href="/schemes"
        className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-blue-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        {isTe ? 'పథకాల కేటలాగ్‌కు తిరిగి వెళ్లండి' : 'Back to Schemes Catalog'}
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            {/* Meta Tags */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wider">
                {scheme.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {scheme.state_scope} ({scheme.government_level})
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {isTe ? 'అధికారికంగా ధృవీకరించబడింది' : 'Verified Official Record'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug mb-3">
              {displayName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-medium">{displayDept}</span>
            </p>

            <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
              {displayDesc}
            </p>
          </div>

          {/* Quick Action Side Buttons */}
          <div className="flex flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => toggleSaveScheme(scheme.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                isSaved
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
              {isSaved ? t.status.saved : t.status.saveScheme}
            </button>

            <button
              onClick={handleAddToTracker}
              disabled={addingTracker}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                trackerSuccess
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-slate-500" />
              {trackerSuccess
                ? (isTe ? 'ట్రాకర్ లో చేర్చబడింది!' : 'Tracked Successfully!')
                : (isTe ? 'దరఖాస్తు ట్రాకర్ లో చేర్చు' : 'Add to Tracker')}
            </button>
          </div>
        </div>

        {/* Highlighted Benefits Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-100">
            <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              {isTe ? 'నిర్ధారించబడిన ప్రయోజనం' : 'Verified Benefit'}
            </div>
            <div className="text-xs text-emerald-950 font-semibold leading-relaxed">
              {displayBenefit}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-100">
            <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              {isTe ? 'దరఖాస్తు కాలపరిమితి' : 'Application Window'}
            </div>
            <div className="text-xs text-blue-950 font-semibold leading-relaxed">
              {scheme.start_date || 'Current Session'} — {scheme.end_date || 'Ongoing Scheme'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-600" />
              {isTe ? 'చివరి ధృవీకరణ తేదీ' : 'Last Verification'}
            </div>
            <div className="text-xs text-slate-700 font-medium">
              {new Date(scheme.last_verified_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Eligibility, Documents & Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Eligibility Criteria Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {isTe ? 'అర్హత నిబంధనల చెక్‌లిస్ట్' : 'Eligibility Conditions Checklist'}
            </h2>

            <div className="space-y-3">
              {/* Age */}
              {(scheme.eligibility_rules.min_age !== undefined || scheme.eligibility_rules.max_age !== undefined) && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">
                      {isTe ? 'వయోపరిమితి:' : 'Age Bracket:'}
                    </span>
                    {scheme.eligibility_rules.min_age || 0} {isTe ? 'సంవత్సరాల నుండి' : 'years to'}{' '}
                    {scheme.eligibility_rules.max_age || (isTe ? 'గరిష్ట పరిమితి లేదు' : 'No upper limit')}
                  </div>
                </div>
              )}

              {/* Income */}
              {scheme.eligibility_rules.max_annual_income !== undefined && scheme.eligibility_rules.max_annual_income !== null && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">
                      {isTe ? 'వార్షిక ఆదాయ పరిమితి:' : 'Income Ceiling:'}
                    </span>
                    {isTe ? 'కుటుంబ వార్షిక ఆదాయం ₹' : 'Household income must not exceed ₹'}
                    {scheme.eligibility_rules.max_annual_income.toLocaleString('en-IN')}{' '}
                    {isTe ? 'మించరాదు' : 'per annum'}
                  </div>
                </div>
              )}

              {/* Occupations */}
              {scheme.eligibility_rules.eligible_occupations && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">
                      {isTe ? 'అర్హులైన వృత్తులు:' : 'Target Occupations:'}
                    </span>
                    {scheme.eligibility_rules.eligible_occupations.join(', ')}
                  </div>
                </div>
              )}

              {/* Special conditions */}
              {scheme.eligibility_rules.special_conditions?.map((sc, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">
                      {isTe ? 'ప్రత్యేక నిబంధన:' : 'Special Verification Criteria:'}
                    </span>
                    {sc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusion Rules */}
          {scheme.exclusion_rules && scheme.exclusion_rules.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                {isTe ? 'అనర్హత నిబంధనలు (Exclusion Criteria)' : 'Exclusion Conditions'}
              </h2>
              <ul className="space-y-2 text-xs text-slate-600">
                {scheme.exclusion_rules.map((ex, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Documents Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {isTe ? 'అవసరమైన అధికారిక పత్రాలు' : 'Required Documents Checklist'}
            </h2>
            <div className="space-y-2.5">
              {scheme.required_documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-800">{doc}</span>
                  <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {isTe ? 'తప్పనిసరి' : 'Mandatory'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs Accordion */}
          {scheme.faqs && scheme.faqs.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                {isTe ? 'తరచుగా అడిగే ప్రశ్నలు (FAQ)' : 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-3">
                {scheme.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-3.5 text-left bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-xs font-bold text-slate-900"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="p-3.5 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-200">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Apply & Verification Source Links */}
        <div className="space-y-6">
          {/* Apply on Official Portal Card */}
          <div className="bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold mb-3 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              {isTe ? 'ధృవీకరించిన అధికారిక లింక్' : 'Verified Application Portal'}
            </div>

            <h3 className="text-lg font-extrabold mb-2">
              {isTe ? 'ప్రభుత్వ పోర్టల్ లో దరఖాస్తు చేసుకోండి' : 'Apply on Official Website'}
            </h3>

            <p className="text-xs text-blue-200 mb-6 leading-relaxed">
              {isTe
                ? 'ఈ లింక్ సంబంధిత ప్రభుత్వ శాఖ యొక్క అధికారిక పోర్టల్‌ను తెరుస్తుంది.'
                : 'Redirects directly to the authorized government portal (.gov.in / .nic.in). JanSahayak never charges fees or collects official passwords.'}
            </p>

            <a
              href={scheme.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>{isTe ? 'అధికారిక వెబ్‌సైట్ తెరవండి' : 'Open Official Portal'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="mt-4 pt-4 border-t border-white/10 text-[11px] text-blue-300 space-y-1">
              <div>
                <span className="font-semibold text-white">Official Portal: </span>
                <a
                  href={scheme.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white truncate block"
                >
                  {scheme.official_url}
                </a>
              </div>
            </div>
          </div>

          {/* Source Verification Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              {isTe ? 'సమాచార వనరుల ధృవీకరణ' : 'Source Verification Audit'}
            </h4>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              {isTe
                ? 'ఈ పథకం యొక్క మార్గదర్శకాలు కేంద్ర/రాష్ట్ర గెజిట్ నోటిఫికేషన్ ద్వారా ధృవీకరించబడ్డాయి.'
                : 'Criteria verified against official department gazettes and public portals.'}
            </p>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] break-all">
              <span className="font-bold text-slate-700 block mb-0.5">Reference Source:</span>
              <a
                href={scheme.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline flex items-center gap-1"
              >
                {scheme.source_url} <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SchemeDetailPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 py-12 text-center text-xs text-slate-500">Loading scheme guidelines...</div>}>
      <SchemeDetailContent />
    </Suspense>
  );
}
