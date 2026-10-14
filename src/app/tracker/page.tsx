'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { TrackerItem, TrackerStatus } from '@/lib/types';
import { apiGetTrackerItems, apiUpdateTrackerItem, apiDeleteTrackerItem } from '@/lib/api';
import {
  CheckSquare,
  AlertCircle,
  Clock,
  Trash2,
  Edit3,
  ExternalLink,
  Plus,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Save
} from 'lucide-react';

export default function TrackerPage() {
  const { user, t, language } = useApp();
  const isTe = language === 'te';

  const [items, setItems] = useState<TrackerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Edit modal / inline edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editDeadline, setEditDeadline] = useState<string>('');
  const [savingEdit, setSavingEdit] = useState<boolean>(false);

  useEffect(() => {
    async function loadTracker() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await apiGetTrackerItems();
        setItems(data);
      } catch (err) {
        console.error('Failed to load tracker items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTracker();
  }, [user]);

  const handleStatusChange = async (itemId: number, newStatus: TrackerStatus) => {
    try {
      const updated = await apiUpdateTrackerItem(itemId, { status: newStatus });
      setItems((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const startEdit = (item: TrackerItem) => {
    setEditingId(item.id);
    setEditNotes(item.notes || '');
    setEditDeadline(item.target_deadline || '');
  };

  const saveEdit = async (itemId: number) => {
    setSavingEdit(true);
    try {
      const updated = await apiUpdateTrackerItem(itemId, {
        notes: editNotes,
        target_deadline: editDeadline,
      });
      setItems((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
      setEditingId(null);
    } catch (err) {
      alert('Failed to save changes');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (itemId: number) => {
    if (!confirm(isTe ? 'ట్రాకర్ నుండి ఈ పథకాన్ని తొలగించాలా?' : 'Remove this application record from tracker?')) return;
    try {
      await apiDeleteTrackerItem(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const statusOptions: { value: TrackerStatus; label: string; color: string }[] = [
    { value: 'INTERESTED', label: t.tracker.statuses.INTERESTED, color: 'bg-slate-100 text-slate-700' },
    { value: 'CHECKING_ELIGIBILITY', label: t.tracker.statuses.CHECKING_ELIGIBILITY, color: 'bg-blue-100 text-blue-800' },
    { value: 'DOCUMENTS_PREPARED', label: t.tracker.statuses.DOCUMENTS_PREPARED, color: 'bg-amber-100 text-amber-800' },
    { value: 'READY_TO_APPLY', label: t.tracker.statuses.READY_TO_APPLY, color: 'bg-purple-100 text-purple-800' },
    { value: 'APPLIED', label: t.tracker.statuses.APPLIED, color: 'bg-sky-100 text-sky-800' },
    { value: 'APPROVED', label: t.tracker.statuses.APPROVED, color: 'bg-emerald-100 text-emerald-800' },
    { value: 'REJECTED', label: t.tracker.statuses.REJECTED, color: 'bg-rose-100 text-rose-800' },
    { value: 'NEEDS_FOLLOW_UP', label: t.tracker.statuses.NEEDS_FOLLOW_UP, color: 'bg-orange-100 text-orange-800' },
  ];

  const filteredItems = items.filter((item) => {
    if (selectedStatusFilter === 'ALL') return true;
    return item.status === selectedStatusFilter;
  });

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckSquare className="w-12 h-12 text-blue-900 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {isTe ? 'లాగిన్ అవ్వండి' : 'Sign In Required'}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          {isTe
            ? 'మీ దరఖాస్తు పురోగతిని ట్రాక్ చేయడానికి దయచేసి ఖాతాలోకి లాగిన్ అవ్వండి.'
            : 'Sign in to record and track your individual application milestones.'}
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
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.tracker.title}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            {t.tracker.subtitle}
          </p>
        </div>

        <Link
          href="/schemes"
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-900 text-white hover:bg-blue-950 transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {isTe ? 'పథకాన్ని ట్రాకర్‌లో చేర్చండి' : 'Add Scheme to Tracker'}
        </Link>
      </div>

      {/* Public Service Notice */}
      <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 mb-6 flex items-start gap-2.5 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">
            {isTe ? 'పౌరుల సమాచార నోటీస్' : 'Citizen Verification Notice:'}
          </span>
          {isTe
            ? 'ఈ ట్రాకర్ మీ వ్యక్తిగత సౌలభ్యం కోసం మాత్రమే. ఇది ప్రభుత్వ డేటాబేస్‌ల నుండి స్వయంచాలకంగా అప్లికేషన్ స్టేటస్‌ను పొందదు.'
            : 'This tracker records your user-entered milestones. It does not automatically communicate with or query confidential government databases.'}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedStatusFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
            selectedStatusFilter === 'ALL'
              ? 'bg-blue-900 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {isTe ? 'అన్ని' : 'All'} ({items.length})
        </button>
        {statusOptions.map((opt) => {
          const count = items.filter((i) => i.status === opt.value).length;
          return (
            <button
              key={opt.value}
              onClick={() => setSelectedStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                selectedStatusFilter === opt.value
                  ? 'bg-blue-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {opt.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Tracker Items List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {t.tracker.emptyState}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {isTe
              ? 'పథకాల కేటలాగ్ నుండి మీకు ఆసక్తి ఉన్న పథకాలను ఇక్కడకు చేర్చండి.'
              : 'Browse our verified scheme catalog and add schemes to monitor your step-by-step progress.'}
          </p>
          <Link
            href="/schemes"
            className="px-4 py-2 bg-blue-900 text-white text-xs font-bold rounded-lg"
          >
            {isTe ? 'పథకాలను చూడండి' : 'Browse Schemes'}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isEditing = editingId === item.id;
            const currentStatusObj = statusOptions.find((o) => o.value === item.status) || statusOptions[0];

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Scheme info & status */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100 uppercase">
                        {item.scheme.category}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {item.scheme.state_scope} ({item.scheme.government_level})
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      <Link href={`/schemes/${item.scheme.id}`} className="hover:text-blue-900">
                        {isTe && item.scheme.name_te ? item.scheme.name_te : item.scheme.name}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-500 mb-3">
                      {isTe && item.scheme.department_te ? item.scheme.department_te : item.scheme.department}
                    </p>

                    {/* Status dropdown selector */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-700">
                        {isTe ? 'ప్రస్తుత స్థితి:' : 'Status:'}
                      </span>
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as TrackerStatus)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-900 ${currentStatusObj.color} border-slate-300`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      {item.target_deadline && (
                        <span className="text-xs text-slate-600 flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deadline: {item.target_deadline}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Official Link */}
                  <div className="flex items-center md:flex-col items-end gap-2 shrink-0">
                    <a
                      href={item.scheme.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-900 text-white hover:bg-blue-950 flex items-center gap-1 shadow-sm"
                    >
                      {isTe ? 'పోర్టల్ తెరవండి' : 'Apply on Portal'}
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => (isEditing ? setEditingId(null) : startEdit(item))}
                        className="p-1.5 text-slate-500 hover:text-blue-900 rounded-lg hover:bg-slate-100 text-xs flex items-center gap-1"
                        title="Edit notes & deadline"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{isEditing ? 'Cancel' : 'Notes'}</span>
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Remove tracker item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Notes display or editor */}
                {isEditing ? (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 bg-slate-50 p-3 rounded-xl">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {isTe ? 'వ్యక్తిగత నోట్స్ / అప్లికేషన్ రిఫరెన్స్ నంబర్' : 'Private Notes & Reference Number'}
                      </label>
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Application ID: AP1234567, submitted at MeeSeva..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {isTe ? 'లక్ష్య గడువు' : 'Target Deadline'}
                      </label>
                      <input
                        type="date"
                        value={editDeadline}
                        onChange={(e) => setEditDeadline(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(item.id)}
                        disabled={savingEdit}
                        className="px-4 py-1.5 bg-blue-900 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                      >
                        <Save className="w-3 h-3" />
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : item.notes ? (
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-lg">
                    <span className="font-bold text-slate-700 mr-1">Note:</span>
                    {item.notes}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
