'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Scheme, SchemeMatchResult, TrackerStatus } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { EligibilityBadge } from './EligibilityBadge';
import { apiCreateTrackerItem } from '@/lib/api';
import {
  ExternalLink,
  Bookmark,
  CheckSquare,
  FileText,
  Building2,
  MapPin,
  IndianRupee,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
  matchResult?: SchemeMatchResult;
  onTrackerAdded?: () => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  matchResult,
  onTrackerAdded,
}) => {
  const { language, t, savedSchemeIds, toggleSaveScheme, user } = useApp();
  const isTe = language === 'te';
  const isSaved = savedSchemeIds.has(scheme.id);
  const [saving, setSaving] = useState(false);
  const [addingTracker, setAddingTracker] = useState(false);
  const [trackerSuccess, setTrackerSuccess] = useState(false);

  const displayName = isTe && scheme.name_te ? scheme.name_te : scheme.name;
  const displayDept = isTe && scheme.department_te ? scheme.department_te : scheme.department;
  const displayBenefit = isTe && scheme.benefit_description_te ? scheme.benefit_description_te : scheme.benefit_description;

  const handleToggleSave = async () => {
    setSaving(true);
    await toggleSaveScheme(scheme.id);
    setSaving(false);
  };

  const handleAddToTracker = async () => {
    if (!user) {
      alert(isTe ? 'దయచేసి దరఖాస్తును ట్రాక్ చేయడానికి లాగిన్ అవ్వండి' : 'Please sign in to add to your application tracker');
      return;
    }
    setAddingTracker(true);
    try {
      await apiCreateTrackerItem({
        scheme_id: scheme.id,
        status: 'INTERESTED',
        notes: `Added from catalog on ${new Date().toLocaleDateString()}`
      });
      setTrackerSuccess(true);
      if (onTrackerAdded) onTrackerAdded();
      setTimeout(() => setTrackerSuccess(false), 3000);
    } catch (err) {
      alert('Failed to add to tracker');
    } finally {
      setAddingTracker(false);
    }
  };

  return (
    <div className="gov-card flex flex-col justify-between p-5 relative overflow-hidden group">
      {/* Category & State Banner */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100">
              {scheme.category}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {scheme.state_scope} ({scheme.government_level})
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleToggleSave}
              disabled={saving}
              className={`p-1.5 rounded-full text-xs transition-colors ${
                isSaved
                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
              }`}
              title={isSaved ? t.status.saved : t.status.saveScheme}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 mb-1.5">
          <Link href={`/schemes/${scheme.id}`}>
            {displayName}
          </Link>
        </h3>

        {/* Department */}
        <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3 line-clamp-1">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{displayDept}</span>
        </p>

        {/* Match / Eligibility Result */}
        {matchResult && (
          <div className="mb-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <EligibilityBadge
              status={matchResult.eligibility_status}
              score={matchResult.relevance_score}
            />
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {matchResult.summary_explanation}
            </p>
          </div>
        )}

        {/* Benefit Highlight Box */}
        <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 mb-3.5 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="line-clamp-2 leading-relaxed font-medium">
            {displayBenefit}
          </div>
        </div>

        {/* Required Documents snippet */}
        {scheme.required_documents && scheme.required_documents.length > 0 && (
          <div className="mb-4 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              {isTe ? 'ముఖ్యమైన పత్రాలు:' : 'Key Documents:'}
            </span>
            <div className="flex flex-wrap gap-1">
              {scheme.required_documents.slice(0, 2).map((doc, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 truncate max-w-[200px]"
                >
                  {doc}
                </span>
              ))}
              {scheme.required_documents.length > 2 && (
                <span className="px-1.5 py-0.5 text-[11px] text-slate-400 font-semibold">
                  +{scheme.required_documents.length - 2} {isTe ? 'ఇతర పత్రాలు' : 'more'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        <Link
          href={`/schemes/${scheme.id}`}
          className="inline-flex items-center text-xs font-bold text-blue-900 hover:text-blue-700"
        >
          {isTe ? 'పూర్తి వివరాలు' : 'Full Guidelines'}
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleAddToTracker}
            disabled={addingTracker}
            className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              trackerSuccess
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 mr-1 text-slate-500" />
            {trackerSuccess
              ? (isTe ? 'చేర్చబడింది!' : 'Tracked!')
              : (isTe ? 'ట్రాకర్ లో చేర్చు' : '+ Tracker')}
          </button>

          <a
            href={scheme.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-900 text-white hover:bg-blue-950 transition-colors shadow-sm"
            title="Opens official government portal"
          >
            {isTe ? 'దరఖాస్తు లింక్' : 'Apply'}
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};
