'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserProfile } from '@/lib/types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Info,
  HelpCircle
} from 'lucide-react';

export default function OnboardingPage() {
  const { user, profile, updateProfile, t, language } = useApp();
  const router = useRouter();
  const isTe = language === 'te';

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    age: 24,
    gender: 'male',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    occupation: 'Student',
    education_level: 'Undergraduate',
    income_range: 'Below 1 Lakh',
    annual_income: 90000,
    social_category: 'OBC',
    is_student: true,
    is_farmer: false,
    has_agricultural_land: false,
    is_differently_abled: false,
    family_size: 4,
  });

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        ...profile,
      }));
    }
  }, [profile]);

  const handleChange = (field: keyof UserProfile, val: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      if (user) {
        await updateProfile(formData);
      } else {
        // If guest user, persist to localStorage for inline matching
        localStorage.setItem('jansahayak_guest_profile', JSON.stringify(formData));
      }
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error updating profile. Redirecting to dashboard...');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const statesList = [
    'Andhra Pradesh',
    'Telangana',
    'Karnataka',
    'Tamil Nadu',
    'Maharashtra',
    'Uttar Pradesh',
    'Bihar',
    'Madhya Pradesh',
    'Rajasthan',
    'West Bengal',
    'Gujarat',
    'Other State'
  ];

  const occupationsList = [
    'Student',
    'Farmer',
    'Agricultural Laborer',
    'Unemployed',
    'Self-employed',
    'Small Business / Shopkeeper',
    'Artisan / Craftsman',
    'Private Sector Employee',
    'Daily Wage Worker',
    'Homemaker',
    'Retired'
  ];

  const educationLevels = [
    'Below 10th',
    '10th Pass',
    '12th Pass',
    'Vocational / ITI / Diploma',
    'Undergraduate (Degree / B.Tech / MBBS)',
    'Postgraduate (Master / PhD)'
  ];

  const incomeRanges = [
    { label: 'Below ₹1,00,000 / year', value: 'Below 1 Lakh', num: 90000 },
    { label: '₹1,00,000 – ₹2,50,000 / year', value: '1-2.5 Lakh', num: 200000 },
    { label: '₹2,50,000 – ₹5,00,000 / year', value: '2.5-5 Lakh', num: 400000 },
    { label: '₹5,00,000 – ₹8,00,000 / year', value: '5-8 Lakh', num: 650000 },
    { label: 'Above ₹8,00,000 / year', value: 'Above 8 Lakh', num: 1000000 },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isTe ? 'గోప్యతా హామీ: మీ డేటా సురక్షితం' : 'Privacy Assurance: No sensitive documents stored'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {t.onboarding.title}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          {t.onboarding.subtitle}
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mt-6 space-x-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s
                    ? 'bg-blue-900 text-white ring-4 ring-blue-100'
                    : step > s
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 sm:w-20 h-1 mx-1 rounded ${
                    step > s ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs font-bold text-slate-500 mt-2">
          {step === 1 && t.onboarding.step1}
          {step === 2 && t.onboarding.step2}
          {step === 3 && t.onboarding.step3}
        </p>
      </div>

      {/* Wizard Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* STEP 1: Basic Demographics */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  {t.onboarding.ageLabel} <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Info className="w-3 h-3 text-blue-600" />
                  {isTe ? 'వయోపరిమితి సరిపోల్చడానికి' : 'For age bracket rules'}
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="110"
                value={formData.age || ''}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || null)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none"
                placeholder="24"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {t.onboarding.genderLabel}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['male', 'female', 'other'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleChange('gender', g)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize ${
                      formData.gender === g
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g === 'male' ? (isTe ? 'పురుషుడు' : 'Male') : g === 'female' ? (isTe ? 'మహిళ' : 'Female') : (isTe ? 'ఇతర' : 'Other')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t.onboarding.stateLabel} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.state || ''}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none bg-white"
                >
                  {statesList.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t.onboarding.districtLabel}
                </label>
                <input
                  type="text"
                  value={formData.district || ''}
                  onChange={(e) => handleChange('district', e.target.value)}
                  placeholder="Visakhapatnam"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-950 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                {isTe
                  ? 'రాష్ట్రం వివరాల ఆధారంగా కేంద్ర ప్రభుత్వ పథకాలతో పాటు మీ రాష్ట్రానికి సంబంధించిన ప్రత్యేక సంక్షేమ పథకాలు చూపించబడతాయి.'
                  : 'Your state allows filtering state-specific welfare initiatives (e.g. AP YSR Rythu Bharosa, Jagananna Vidya Deevena) alongside national schemes.'}
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: Occupation & Education & Income */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {t.onboarding.occupationLabel} <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.occupation || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  handleChange('occupation', val);
                  if (val === 'Farmer' || val === 'Agricultural Laborer') {
                    handleChange('is_farmer', true);
                  }
                  if (val === 'Student') {
                    handleChange('is_student', true);
                  }
                }}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none bg-white"
              >
                {occupationsList.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {t.onboarding.educationLabel}
              </label>
              <select
                value={formData.education_level || ''}
                onChange={(e) => handleChange('education_level', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none bg-white"
              >
                {educationLevels.map((edu) => (
                  <option key={edu} value={edu}>
                    {edu}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  {t.onboarding.incomeLabel} <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {isTe ? 'అర్హత పరిమితి తనిఖీకి' : 'Income ceiling check'}
                </span>
              </div>
              <div className="space-y-2">
                {incomeRanges.map((inc) => (
                  <label
                    key={inc.value}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                      formData.income_range === inc.value
                        ? 'bg-blue-50 border-blue-900 text-blue-950 ring-1 ring-blue-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{inc.label}</span>
                    <input
                      type="radio"
                      name="income"
                      checked={formData.income_range === inc.value}
                      onChange={() => {
                        handleChange('income_range', inc.value);
                        handleChange('annual_income', inc.num);
                      }}
                      className="accent-blue-900"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Special Eligibility (Voluntary & Optional) */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                {isTe
                  ? 'ఈ విభాగంలోని సమాచారం పూర్తిగా ఐచ్ఛికం. పథకాల నిబంధనలతో ఖచ్చితంగా సరిపోల్చడానికే ఇది ఉపయోగపడుతుంది.'
                  : 'All questions in this step are voluntary. They help filter targeted grants (e.g. farmer income support, PwD disability allowances, reservation scholarships).'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {t.onboarding.socialCategoryLabel}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {['General', 'OBC', 'SC', 'ST', 'EWS'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleChange('social_category', cat)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold ${
                      formData.social_category === cat
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {/* Farmer Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    {t.onboarding.farmerQuestion}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isTe ? 'పీఎం-కిసాన్, రైతు భరోసా పథకాలకు అవసరం' : 'Unlocks PM-KISAN & agricultural subsidies'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_farmer || false}
                  onChange={(e) => handleChange('is_farmer', e.target.checked)}
                  className="w-5 h-5 accent-blue-900 rounded cursor-pointer"
                />
              </div>

              {/* Land Ownership */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    {t.onboarding.landQuestion}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isTe ? 'పట్టాదారు పాస్‌బుక్ / వెబ్‌ల్యాండ్ రికార్డు' : 'Cultivable agricultural landholding in revenue records'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.has_agricultural_land || false}
                  onChange={(e) => handleChange('has_agricultural_land', e.target.checked)}
                  className="w-5 h-5 accent-blue-900 rounded cursor-pointer"
                />
              </div>

              {/* Student Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    {t.onboarding.studentQuestion}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isTe ? 'స్కాలర్‌షిప్‌లు మరియు ఫీజు రీయింబర్స్‌మెంట్ కోసం' : 'Unlocks NSP post-matric & college scholarships'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_student || false}
                  onChange={(e) => handleChange('is_student', e.target.checked)}
                  className="w-5 h-5 accent-blue-900 rounded cursor-pointer"
                />
              </div>

              {/* Differently Abled Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    {t.onboarding.pwdQuestion}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isTe ? 'దివ్యాంగుల ప్రత్యేక సంక్షేమ పథకాలు' : 'Unlocks special disability welfare allowances'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_differently_abled || false}
                  onChange={(e) => handleChange('is_differently_abled', e.target.checked)}
                  className="w-5 h-5 accent-blue-900 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              {isTe ? 'వెనుకకు' : 'Back'}
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center space-x-2">
            {step === 3 && (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                {t.onboarding.skipOptional}
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all"
            >
              {loading ? (
                isTe ? 'విశ్లేషిస్తోంది...' : 'Evaluating...'
              ) : step === 3 ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {t.onboarding.saveAndContinue}
                </>
              ) : (
                <>
                  {isTe ? 'తదుపరి' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
