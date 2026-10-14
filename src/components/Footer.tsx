'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShieldAlert, ExternalLink, Heart, Globe2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useApp();
  const isTe = language === 'te';

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Public Service & Security Disclaimer Banner */}
        <div className="bg-slate-800/80 rounded-xl p-4 sm:p-5 border border-slate-700/80 mb-10 flex items-start space-x-3.5">
          <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <span className="font-bold text-amber-300 block mb-1">
              {isTe ? 'అధికారిక ప్రజాసేవ నోటీస్' : 'Public Service & Verification Notice'}
            </span>
            {t.disclaimer.footerNotice}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-1">
            <div className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              {t.brandName}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {t.brandSubtitle}
            </p>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Available in English & తెలుగు</span>
            </div>
          </div>

          {/* Core Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {isTe ? 'నావిగేషన్' : 'Platform'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/schemes" className="hover:text-white transition-colors">
                  {t.nav.schemes}
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-white transition-colors">
                  {t.nav.assistant}
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-white transition-colors">
                  {isTe ? 'అర్హత తనిఖీ ప్రొఫైల్' : 'Eligibility Wizard'}
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="hover:text-white transition-colors">
                  {t.nav.tracker}
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-white transition-colors">
                  {t.nav.documents}
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Portals Referenced */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {isTe ? 'ధృవీకరించబడిన ప్రభుత్వ పోర్టల్స్' : 'Verified Official Portals'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.myscheme.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 text-slate-400"
                >
                  myScheme Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://scholarships.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 text-slate-400"
                >
                  National Scholarship Portal (NSP) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 text-slate-400"
                >
                  PM-KISAN Samman Nidhi <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmjay.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 text-slate-400"
                >
                  Ayushman Bharat PM-JAY <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Privacy & Trust */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {isTe ? 'గోప్యత & భద్రత' : 'Privacy & Trust'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {isTe
                ? 'మేము ఎప్పుడూ మీ అధికారిక ప్రభుత్వ లాగిన్ వివరాలు, OTPలు లేదా బ్యాంకు పాస్‌వర్డ్‌లను అడగము.'
                : 'We never store identity credentials or portal passwords. Optional profile attributes can be edited or deleted anytime.'}
            </p>
            <Link
              href="/profile"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium underline"
            >
              {isTe ? 'ప్రొఫైల్ & గోప్యతా సెట్టింగ్‌లు' : 'Manage Profile & Privacy'}
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 JanSahayak AI. Built for citizen empowerment in India.</p>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Designed for Bharat with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
