'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Scheme } from '@/lib/types';
import { apiAdminGetSchemes, apiAdminVerifyScheme } from '@/lib/api';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  ExternalLink,
  Building2,
  Lock,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, t, language } = useApp();
  const isTe = language === 'te';

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Re-verification state
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [verifySourceUrl, setVerifySourceUrl] = useState<string>('');
  const [verifySuccess, setVerifySuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminSchemes() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await apiAdminGetSchemes();
        setSchemes(data);
      } catch (err: any) {
        setError(err.message || 'Administrative access required');
      } finally {
        setLoading(false);
      }
    }
    loadAdminSchemes();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Lock className="w-12 h-12 text-rose-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Administrative Privileges Required
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          This section is restricted to authorized scheme catalog verifiers and administrators.
          You can test using the Admin demo account: <span className="font-mono font-bold text-blue-900">admin@jansahayak.gov.in</span>
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold"
        >
          Sign In as Admin
        </Link>
      </div>
    );
  }

  const handleVerify = async (schemeId: number) => {
    if (!verifySourceUrl.trim()) {
      alert('Please enter an official source URL for verification audit.');
      return;
    }
    try {
      const updated = await apiAdminVerifyScheme(schemeId, verifySourceUrl);
      setSchemes((prev) => prev.map((s) => (s.id === schemeId ? updated : s)));
      setVerifySuccess(`Scheme #${schemeId} successfully certified with verified timestamp.`);
      setVerifyingId(null);
      setVerifySourceUrl('');
      setTimeout(() => setVerifySuccess(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to certify verification');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Catalog Verification Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Scheme Catalog Management & Verification Audit
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Review official ministry sources, recertify application deadlines, and ensure zero hallucinated rules.
          </p>
        </div>
      </div>

      {verifySuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{verifySuccess}</span>
        </div>
      )}

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Total Catalogued Schemes: {schemes.length}
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading catalog records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">ID & Scheme Name</th>
                  <th className="p-4">Department & Level</th>
                  <th className="p-4">State Scope</th>
                  <th className="p-4">Verification Status</th>
                  <th className="p-4">Last Verified</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schemes.map((s) => {
                  const isModal = verifyingId === s.id;
                  return (
                    <React.Fragment key={s.id}>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-semibold text-slate-900 max-w-xs">
                          <Link href={`/schemes/${s.id}`} className="hover:text-blue-900 font-bold block">
                            {s.name}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-mono">slug: {s.slug}</span>
                        </td>
                        <td className="p-4 text-slate-600 max-w-xs">
                          <div className="truncate">{s.department}</div>
                          <span className="text-[10px] font-semibold text-blue-800">{s.government_level}</span>
                        </td>
                        <td className="p-4 text-slate-600">{s.state_scope}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {s.verification_status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 text-[11px]">
                          {new Date(s.last_verified_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setVerifyingId(isModal ? null : s.id);
                              setVerifySourceUrl(s.source_url);
                            }}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-semibold"
                          >
                            {isModal ? 'Cancel' : 'Certify & Re-Verify'}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Re-verification Row */}
                      {isModal && (
                        <tr className="bg-blue-50/40 border-b border-blue-200">
                          <td colSpan={6} className="p-4">
                            <div className="max-w-2xl bg-white p-4 rounded-xl border border-blue-200 shadow-xs space-y-3">
                              <h4 className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                Formally Recertify Guidelines for: {s.name}
                              </h4>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  Verified Source URL (.gov.in Gazette / Official Portal):
                                </label>
                                <input
                                  type="url"
                                  value={verifySourceUrl}
                                  onChange={(e) => setVerifySourceUrl(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                                  placeholder="https://pmkisan.gov.in/Guidelines.pdf"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setVerifyingId(null)}
                                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleVerify(s.id)}
                                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                                >
                                  Certify & Update Timestamp
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
