'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Landmark,
  Building,
  Lock
} from 'lucide-react';

interface DocumentGuide {
  id: string;
  name: string;
  name_te: string;
  category: string;
  description: string;
  whereToObtain: string;
  officialPortalUrl?: string;
  typicalSchemes: string[];
}

export default function DocumentChecklistPage() {
  const { t, language } = useApp();
  const isTe = language === 'te';

  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set(['aadhaar', 'bank']));

  const toggleCheck = (id: string) => {
    const next = new Set(checkedDocs);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedDocs(next);
  };

  const documentGuides: DocumentGuide[] = [
    {
      id: 'aadhaar',
      name: 'Aadhaar Card (UIDAI)',
      name_te: 'ఆధార్ కార్డు',
      category: 'Identity Proof',
      description: 'Mandatory primary identity document across all DBT schemes. Must have your active mobile number linked for e-KYC OTP verification.',
      whereToObtain: 'UIDAI Aadhaar Seva Kendra, nearest Post Office, or download e-Aadhaar from uidai.gov.in',
      officialPortalUrl: 'https://myaadhaar.uidai.gov.in',
      typicalSchemes: ['PM-KISAN', 'Ayushman Bharat PM-JAY', 'Post-Matric Scholarships', 'Atal Pension Yojana', 'AP YSR Rythu Bharosa']
    },
    {
      id: 'income',
      name: 'Income Certificate (Annual Household)',
      name_te: 'వార్షిక ఆదాయ ధృవీకరణ పత్రం',
      category: 'Financial Eligibility',
      description: 'Certified document issued by the local revenue administration confirming total gross household income from all sources. Typically valid for 1 year.',
      whereToObtain: 'MeeSeva Centers (AP/Telangana), Tehsil / Taluk Office, or State e-District portal',
      typicalSchemes: ['Post-Matric Scholarships (< ₹2.5L)', 'AP Jagananna Vidya Deevena', 'Ayushman Bharat', 'PMAY-G Housing']
    },
    {
      id: 'land',
      name: 'Agricultural Land Records / RoR / 1-B / Patta Passbook',
      name_te: 'పట్టాదారు పాస్‌బుక్ / 1-B నమూనా / భూ రికార్డులు',
      category: 'Farmer & Land Ownership',
      description: 'Official revenue document verifying cultivable landholding, survey number, and khata ownership in state digital land records.',
      whereToObtain: 'MeeSeva / MeeBhoomi portal (AP), Dharani portal (Telangana), or local Village Revenue Officer (VRO)',
      typicalSchemes: ['PM-KISAN Samman Nidhi', 'AP YSR Rythu Bharosa', 'Telangana Rythu Bandhu']
    },
    {
      id: 'caste',
      name: 'Integrated Caste / Community Certificate',
      name_te: 'కుల ధృవీకరణ పత్రం (ఎస్సీ/ఎస్టీ/బీసీ)',
      category: 'Social Category Proof',
      description: 'Statutory certificate issued by the competent revenue authority (Tahsildar / RDO) confirming SC, ST, OBC, or EWS status.',
      whereToObtain: 'MeeSeva Centers, MeeSeva Online portal, or State Social Welfare Department',
      typicalSchemes: ['Post-Matric Scholarship for SC/ST/OBC', 'AP Jagananna Vidya Deevena', 'Special Entrepreneurship Subsidies']
    },
    {
      id: 'bank',
      name: 'Bank Passbook / Aadhaar-Seeded Bank Account',
      name_te: 'ఆధార్ అనుసంధాన బ్యాంక్ ఖాతా పాస్‌బుక్',
      category: 'Direct Benefit Transfer (DBT)',
      description: 'Active savings bank account with NPCI Aadhaar seeding enabled so government DBT installments credit automatically.',
      whereToObtain: 'Any scheduled commercial bank or India Post Payments Bank (IPPB) branch',
      typicalSchemes: ['All Direct Benefit Transfer (DBT) central & state welfare schemes']
    },
    {
      id: 'bonafide',
      name: 'College Bonafide & Previous Exam Marks Memo',
      name_te: 'కాలేజీ బోనఫైడ్ మరియు మార్కుల మెమో',
      category: 'Education Proof',
      description: 'Institutional certificate certifying regular enrolment, semester details, and academic standing with CET allotment order.',
      whereToObtain: 'College registrar or principal administration office',
      typicalSchemes: ['National Scholarship Portal (NSP)', 'AP Jagananna Vidya Deevena', 'PM YASASVI']
    },
    {
      id: 'ration',
      name: 'Ration Card / Rice Card (NFSA / Food Security)',
      name_te: 'రేషన్ కార్డు / బియ్యం కార్డు',
      category: 'Food Security & Deprivation Proof',
      description: 'State civil supplies ration card establishing household identity and economic vulnerability status.',
      whereToObtain: 'MeeSeva, Grama / Ward Sachivalayam (AP), or District Food & Civil Supplies office',
      typicalSchemes: ['Ayushman Bharat PM-JAY', 'PM Awas Yojana (PMAY-G)', 'AP State Welfare Schemes']
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isTe ? 'పత్రాల తయారీ సహాయకుడు' : 'Official Document Readiness Helper'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isTe ? 'అవసరమైన పత్రాల మార్గదర్శిని' : 'Government Benefits Document Checklist'}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
          {isTe
            ? 'ప్రభుత్వ పథకాలకు దరఖాస్తు చేసేటప్పుడు తిరస్కరణకు గురికాకుండా ఉండటానికి అవసరమైన పత్రాలను ముందుగానే సిద్ధం చేసుకోండి.'
            : 'Review mandatory certificates required across welfare schemes, understand where to obtain them, and track your personal document readiness.'}
        </p>
      </div>

      {/* Privacy Notice on Document Uploads */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl mb-8 flex items-start gap-3.5 shadow-sm">
        <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-amber-300 block mb-1">
            {isTe ? 'గోప్యతా హామీ: ఎటువంటి పత్రాల అప్‌లోడ్ అవసరం లేదు' : 'Zero Document Upload Policy (Privacy-First)'}
          </span>
          {isTe
            ? 'జనసహాయక్ AI మీ వ్యక్తిగత పత్రాలను లేదా గుర్తింపు కార్డులను సర్వర్‌లో నిల్వ చేయదు. ఈ చెక్‌లిస్ట్ కేవలం మీ వ్యక్తిగత సన్నాహాల కోసమే. పత్రాలను నేరుగా అధికారిక ప్రభుత్వ పోర్టల్స్ లోనే అప్‌లోడ్ చేయండి.'
            : 'JanSahayak AI never requires or stores scanned identity proofs on our servers. Use this checklist as an offline readiness tool before submitting documents directly on verified official portals.'}
        </div>
      </div>

      {/* Checklist Progress Meter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-800 block">
            {isTe ? 'మీ పత్రాల సంసిద్ధత' : 'Your Document Readiness Progress'}
          </span>
          <span className="text-[11px] text-slate-500">
            {checkedDocs.size} of {documentGuides.length} {isTe ? 'పత్రాలు సిద్ధంగా ఉన్నాయి' : 'documents marked prepared'}
          </span>
        </div>
        <div className="w-36 bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-2.5 rounded-full transition-all"
            style={{ width: `${(checkedDocs.size / documentGuides.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Document Cards List */}
      <div className="space-y-4">
        {documentGuides.map((doc) => {
          const isChecked = checkedDocs.has(doc.id);
          return (
            <div
              key={doc.id}
              className={`p-5 rounded-2xl border transition-all ${
                isChecked
                  ? 'bg-white border-emerald-300 shadow-xs'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCheck(doc.id)}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-base font-bold text-slate-900">
                        {isTe ? doc.name_te : doc.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {doc.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      {doc.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800 block mb-0.5 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-blue-900" />
                          {isTe ? 'ఎక్కడ పొందాలి:' : 'Where to Obtain / Issue Authority:'}
                        </span>
                        <span className="text-slate-600">{doc.whereToObtain}</span>
                      </div>

                      <div>
                        <span className="font-bold text-slate-800 block mb-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {isTe ? 'అవసరమైన పథకాలు:' : 'Mandatory in Schemes:'}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {doc.typicalSchemes.map((ts, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700"
                            >
                              {ts}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {doc.officialPortalUrl && (
                  <a
                    href={doc.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1 shrink-0 p-2 rounded-lg hover:bg-slate-50"
                  >
                    <span>Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
