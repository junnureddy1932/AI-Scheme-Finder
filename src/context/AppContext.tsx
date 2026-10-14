'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile, Language } from '@/lib/types';
import { translations } from '@/lib/translations';
import {
  apiGetMe,
  apiGetProfile,
  apiLogin,
  apiRegister,
  apiUpsertProfile,
  apiGetSavedSchemes,
  apiSaveScheme,
  apiRemoveSavedScheme,
} from '@/lib/api';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  savedSchemeIds: Set<number>;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, lang?: Language) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  toggleSaveScheme: (schemeId: number) => Promise<boolean>;
  refreshUserData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [savedSchemeIds, setSavedSchemeIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('jansahayak_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'te')) {
      setLanguageState(savedLang);
    }
    const storedToken = localStorage.getItem('jansahayak_token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('jansahayak_lang', lang);
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const me = await apiGetMe();
      setUser(me);
      if (me.preferred_language) {
        setLanguageState(me.preferred_language);
      }
      const prof = await apiGetProfile();
      setProfile(prof);

      const saved = await apiGetSavedSchemes();
      setSavedSchemeIds(new Set(saved.map((s) => s.scheme_id)));
    } catch (err) {
      // If token invalid, clear
      localStorage.removeItem('jansahayak_token');
      setToken(null);
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    const res = await apiLogin(email, pass);
    localStorage.setItem('jansahayak_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    await fetchUserData();
  };

  const register = async (email: string, pass: string, lang = 'en' as Language) => {
    const res = await apiRegister(email, pass, lang);
    localStorage.setItem('jansahayak_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    await fetchUserData();
  };

  const logout = () => {
    localStorage.removeItem('jansahayak_token');
    setToken(null);
    setUser(null);
    setProfile(null);
    setSavedSchemeIds(new Set());
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    const updated = await apiUpsertProfile(data);
    setProfile(updated);
  };

  const toggleSaveScheme = async (schemeId: number): Promise<boolean> => {
    if (!user) {
      alert(language === 'te' ? 'దయచేసి పథకాన్ని భద్రపరచడానికి లాగిన్ అవ్వండి' : 'Please sign in to save schemes');
      return false;
    }

    const isSaved = savedSchemeIds.has(schemeId);
    if (isSaved) {
      await apiRemoveSavedScheme(schemeId);
      const next = new Set(savedSchemeIds);
      next.delete(schemeId);
      setSavedSchemeIds(next);
      return false;
    } else {
      await apiSaveScheme(schemeId);
      const next = new Set(savedSchemeIds);
      next.add(schemeId);
      setSavedSchemeIds(next);
      return true;
    }
  };

  const refreshUserData = async () => {
    await fetchUserData();
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        user,
        profile,
        token,
        savedSchemeIds,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        toggleSaveScheme,
        refreshUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
