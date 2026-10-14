'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Languages,
  Menu,
  X,
  User as UserIcon,
  Bookmark,
  CheckSquare,
  Bot,
  Search,
  LayoutDashboard,
  FileText,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, setLanguage, t, user, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/schemes', label: t.nav.schemes, icon: <Search className="w-4 h-4 mr-1.5" /> },
    { href: '/assistant', label: t.nav.assistant, icon: <Bot className="w-4 h-4 mr-1.5 text-blue-600" /> },
    { href: '/dashboard', label: t.nav.dashboard, icon: <LayoutDashboard className="w-4 h-4 mr-1.5" /> },
    { href: '/tracker', label: t.nav.tracker, icon: <CheckSquare className="w-4 h-4 mr-1.5" /> },
    { href: '/saved', label: t.nav.saved, icon: <Bookmark className="w-4 h-4 mr-1.5" /> },
    { href: '/documents', label: t.nav.documents, icon: <FileText className="w-4 h-4 mr-1.5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Decorative National Tricolor Accent Bar */}
      <div className="tiranga-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="font-extrabold text-lg sm:text-xl text-blue-950 tracking-tight leading-none flex items-center gap-1.5">
                {t.brandName}
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  Gov Assist
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {language === 'te' ? 'భారత ప్రభుత్వ సంక్షేమ సహాయకుడు' : 'Govt Benefits Portal'}
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-900 font-semibold border-b-2 border-blue-900'
                      : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions: Language switcher & User Auth */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Bilingual Language Switcher */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-blue-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === 'te'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-blue-900'
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* Auth / Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-blue-900" />
                  <span className="font-medium max-w-[120px] truncate">{user.email.split('@')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                        {user.role}
                      </span>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {t.nav.profile}
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-semibold text-blue-900"
                      >
                        {t.nav.admin}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t.nav.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-900 hover:bg-slate-50 transition-colors"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-blue-900 text-white hover:bg-blue-950 shadow-sm transition-colors"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
              className="px-2 py-1 text-xs font-bold rounded border border-slate-200 bg-slate-50 text-blue-900"
            >
              {language === 'en' ? 'తెలుగు' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-blue-900 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2.5 rounded-md text-base font-medium ${
                pathname === link.href ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-base text-slate-700 hover:bg-slate-50 flex items-center"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  {t.nav.profile} ({user.email.split('@')[0]})
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-md text-base text-blue-900 font-bold hover:bg-slate-50"
                  >
                    {t.nav.admin}
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="px-3 py-2 rounded-md text-base text-rose-600 hover:bg-rose-50 text-left flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold shadow-sm"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
