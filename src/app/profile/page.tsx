'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserProfile, Language } from '@/lib/types';
import { apiDeleteAccount } from '@/lib/api';
import {
  User,
  ShieldCheck,
  Save,
  Trash2,
  Download,
  AlertTriangle,
  Lock,
  Globe2,
  CheckCircle2
} from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user, profile, updateProfile, logout, language, setLanguage, t } = useApp();
  const router = useRouter();
  const isTe = language === 'te';

  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <User className="w-12 h-12 text-blue-900 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {isTe ? 'లాగిన్ అవ్వండి' : 'Sign In Required'}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          {isTe
            ? 'మీ ప్రొఫైల్ మరియు గోప్యతా సెట్టింగ్‌లను నిర్వహించడానికి లాగిన్ అవ్వండి.'
            : 'Sign in to edit your profile and manage privacy settings.'}
        </p>
      </div>
    );
  }

  const handleChange = (field: keyof UserProfile, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ user, profile: formData }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `jansahayak_profile_${user.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = async () => {
    try {
      await apiDeleteAccount();
      logout();
      router.push('/');
    } catch (err) {
      alert('Failed to delete account');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isTe ? 'ప్రొఫైల్ & గోప్యతా సెట్టింగ్‌లు' : 'Profile & Privacy Settings'}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          {isTe
            ? 'మీ వ్యక్తిగత వివరాలను సవరించండి, భాషను ఎంచుకోండి, లేదా ఖాతా డేటాను డౌన్‌లోడ్ చేసుకోండి.'
            : 'Update your criteria, change language preferences, or purge your account records.'}
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{isTe ? 'ప్రొఫైల్ విజయవంతంగా నవీకరించబడింది!' : 'Profile updated successfully!'}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Account Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-900" />
            {isTe ? 'ఖాతా వివరాలు' : 'Account Identifier'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-700 block mb-1">Email:</span>
              <span className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg block text-slate-600 font-mono">
                {user.email}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block mb-1">Role:</span>
              <span className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg block text-slate-600 uppercase font-semibold">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Language Preference */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-blue-900" />
            {isTe ? 'భాషా ప్రాధాన్యత' : 'Interface Language'}
          </h2>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('te')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                language === 'te'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              తెలుగు (Telugu)
            </button>
          </div>
        </div>

        {/* Demographic & Eligibility Attributes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-900" />
            {isTe ? 'అర్హత కొలమానాలు' : 'Eligibility Attributes'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || null)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
              <input
                type="text"
                value={formData.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
              <input
                type="text"
                value={formData.district || ''}
                onChange={(e) => handleChange('district', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Occupation</label>
              <input
                type="text"
                value={formData.occupation || ''}
                onChange={(e) => handleChange('occupation', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Education Level</label>
              <input
                type="text"
                value={formData.education_level || ''}
                onChange={(e) => handleChange('education_level', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Income Range</label>
              <input
                type="text"
                value={formData.income_range || ''}
                onChange={(e) => handleChange('income_range', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Social Category</label>
              <input
                type="text"
                value={formData.social_category || ''}
                onChange={(e) => handleChange('social_category', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-950 flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

      {/* Data Export & Account Deletion Controls */}
      <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          {isTe ? 'డేటా నియంత్రణ & తొలగింపు హక్కులు' : 'Data Portability & Permanent Deletion'}
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          {isTe
            ? 'మీరు మీ పూర్తి ప్రొఫైల్ డేటాను JSON ఫైల్ రూపంలో డౌన్‌లోడ్ చేసుకోవచ్చు లేదా ఖాతాను శాశ్వతంగా తొలగించవచ్చు.'
            : 'Download a full copy of your registered profile criteria or purge all records completely from our servers.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            {isTe ? 'నా డేటాను డౌన్‌లోడ్ చేయండి (JSON)' : 'Export My Profile Data (JSON)'}
          </button>

          <button
            type="button"
            onClick={() => setDeleteConfirmOpen(true)}
            className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold hover:bg-rose-100 flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isTe ? 'ఖాతాను శాశ్వతంగా తొలగించండి' : 'Delete Account & Purge Data'}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                {isTe ? 'ఖాతాను ఖచ్చితంగా తొలగించాలా?' : 'Permanently Delete Account?'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isTe
                  ? 'ఈ చర్య మీ ఖాతా, ప్రొఫైల్ వివరాలు, భద్రపరిచిన పథకాలు, మరియు దరఖాస్తు ట్రాకర్ రికార్డులను శాశ్వతంగా తొలగిస్తుంది. ఈ చర్యను వెనక్కి తీసుకోలేము.'
                  : 'This will immediately purge your user profile, saved schemes, and application progress history. This action cannot be reversed.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="py-2 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="py-2 px-3 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-sm"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
