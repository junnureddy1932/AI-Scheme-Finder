'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Scheme } from '@/lib/types';
import { apiGetSchemes, apiGetSchemeCategories } from '@/lib/api';
import { SchemeCard } from '@/components/SchemeCard';
import {
  Search,
  Filter,
  Layers,
  MapPin,
  Building,
  RotateCcw,
  Sparkles
} from 'lucide-react';

function SchemesCatalogContent() {
  const { t, language } = useApp();
  const searchParams = useSearchParams();
  const isTe = language === 'te';

  const initialCat = searchParams.get('category') || 'All';

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter States
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>(initialCat);
  const [stateScope, setStateScope] = useState<string>('All');
  const [level, setLevel] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'benefit' | 'name'>('default');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [schemesData, catsData] = await Promise.all([
          apiGetSchemes({
            category: category !== 'All' ? category : undefined,
            state: stateScope !== 'All' ? stateScope : undefined,
            search: search.trim() ? search.trim() : undefined,
            government_level: level !== 'All' ? level : undefined,
          }),
          apiGetSchemeCategories(),
        ]);
        setSchemes(schemesData);
        setCategories(catsData);
      } catch (err) {
        console.error('Failed to load schemes catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [category, stateScope, level, search]);

  // Sort
  const sortedSchemes = [...schemes].sort((a, b) => {
    if (sortBy === 'benefit') {
      return (b.estimated_benefit_amount || 0) - (a.estimated_benefit_amount || 0);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setStateScope('All');
    setLevel('All');
    setSortBy('default');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isTe ? 'ప్రభుత్వ సంక్షేమ పథకాల కేటలాగ్' : 'Government Welfare Schemes Discovery'}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          {isTe
            ? 'కేంద్ర మరియు రాష్ట్ర ప్రభుత్వాల ధృవీకరించిన సంక్షేమ పథకాలను అన్వేషించండి.'
            : 'Explore central and state welfare benefits, verify requirements, and access official application portals.'}
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
        {/* Search bar & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isTe ? 'పథకం పేరు, శాఖ లేదా ప్రయోజనం ద్వారా శోధించండి...' : 'Search by scheme name, ministry, or benefit keywords...'}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-900 focus:outline-none bg-white text-slate-700"
            >
              <option value="default">{isTe ? 'డిఫాల్ట్ క్రమం' : 'Sort by: Standard Order'}</option>
              <option value="benefit">{isTe ? 'గరిష్ట ప్రయోజనం' : 'Sort by: Highest Benefit'}</option>
              <option value="name">{isTe ? 'అక్షర క్రమం (A-Z)' : 'Sort by: Name (A-Z)'}</option>
            </select>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          {/* Domain Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-900" />
              {isTe ? 'సంక్షేమ రంగం' : 'Welfare Domain'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none bg-white text-slate-700"
            >
              <option value="All">{isTe ? 'అన్ని రంగాలు' : 'All Categories'}</option>
              {categories.map((c) => (
                <option key={c.category} value={c.category}>
                  {c.category} ({c.count})
                </option>
              ))}
            </select>
          </div>

          {/* State Scope Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-900" />
              {isTe ? 'రాష్ట్ర పరిధి' : 'State Scope'}
            </label>
            <select
              value={stateScope}
              onChange={(e) => setStateScope(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none bg-white text-slate-700"
            >
              <option value="All">{isTe ? 'అన్ని రాష్ట్రాలు / కేంద్ర' : 'All States / Central'}</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
              <option value="All-India">All-India (National)</option>
            </select>
          </div>

          {/* Govt Level Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-blue-900" />
              {isTe ? 'ప్రభుత్వ స్థాయి' : 'Government Level'}
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none bg-white text-slate-700"
            >
              <option value="All">{isTe ? 'కేంద్రం & రాష్ట్రం' : 'Central & State'}</option>
              <option value="Central">{isTe ? 'కేంద్ర ప్రభుత్వం మాత్రమే' : 'Central Government'}</option>
              <option value="State">{isTe ? 'రాష్ట్ర ప్రభుత్వ పథకాలు' : 'State Government'}</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button if active */}
        {(category !== 'All' || stateScope !== 'All' || level !== 'All' || search.trim()) && (
          <div className="pt-1 flex justify-end">
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              {isTe ? 'ఫిల్టర్‌లు తొలగించండి' : 'Clear All Filters'}
            </button>
          </div>
        )}
      </div>

      {/* Schemes Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-bold text-slate-600">
          {isTe ? 'కనుగొనబడిన పథకాలు' : 'Showing'} <span className="text-blue-900 font-extrabold">{sortedSchemes.length}</span> {isTe ? 'పథకాలు' : 'verified schemes'}
        </p>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : sortedSchemes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {isTe ? 'ఎటువంటి పథకాలు కనుగొనబడలేదు' : 'No schemes match your criteria'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {isTe ? 'దయచేసి ఇతర శోధన పదాలను ప్రయత్నించండి.' : 'Try adjusting your search keywords or clearing active state/category filters.'}
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-900 text-white text-xs font-bold rounded-lg"
          >
            {isTe ? 'ఫిల్టర్‌లను రీసెట్ చేయండి' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SchemesCatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-xs text-slate-500">Loading catalog...</div>}>
      <SchemesCatalogContent />
    </Suspense>
  );
}
