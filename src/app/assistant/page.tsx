'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ChatMessage, Scheme } from '@/lib/types';
import { apiChatWithAssistant } from '@/lib/api';
import {
  Bot,
  Send,
  User,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  FileText
} from 'lucide-react';

export default function AssistantPage() {
  const { t, language, user, profile } = useApp();
  const isTe = language === 'te';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial greeting
  useEffect(() => {
    const greeting: ChatMessage = {
      role: 'assistant',
      content: isTe
        ? 'నమస్కారం! నేను జనసహాయక్ AI ప్రభుత్వ సంక్షేమ సహాయకుడిని. స్కాలర్‌షిప్‌లు, రైతు రాయితీలు, ఉచిత ఆరోగ్య బీమా, లేదా పెన్షన్ పథకాల గురించి నన్ను ఏదైనా అడగవచ్చు. మీ విద్యార్హత, రాష్ట్రం, లేదా కుటుంబ పరిస్థితిని చెబితే మీకు సరిపోయే పథకాలను వెతికి అందిస్తాను.'
        : 'Namaste! I am JanSahayak AI, your government benefits discovery assistant. You can ask me about scholarships, farmer subsidies, free healthcare cover, housing assistance, or pensions. How can I assist you or your family today?',
      follow_up_suggestions: t.assistant.suggestedPrompts,
    };
    setMessages([greeting]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiChatWithAssistant(
        textToSend,
        messages,
        language
      );

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cited_schemes: response.cited_schemes,
        follow_up_suggestions: response.follow_up_suggestions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: isTe
          ? 'క్షమించండి, సర్వర్‌లో సాంకేతిక సమస్య ఏర్పడింది. దయచేసి కాసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.'
          : 'I encountered an issue connecting to the verified welfare knowledgebase. Please try again shortly.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              {t.assistant.title}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Grounded RAG
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              {t.assistant.subtitle}
            </p>
          </div>
        </div>

        {profile?.state && (
          <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            Residency: {profile.state}
          </span>
        )}
      </div>

      {/* Official Disclaimer Banner */}
      <div className="bg-amber-50/80 border border-amber-200 p-2.5 rounded-xl my-3 text-[11px] text-amber-900 flex items-center gap-2 shrink-0">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
        <span>{t.assistant.disclaimer}</span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-blue-900 text-white'
                  : 'bg-emerald-600 text-white shadow-sm'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-300" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-900 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Cited Schemes Cards if available */}
              {msg.cited_schemes && msg.cited_schemes.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    {isTe ? 'ధృవీకరించిన అధికారిక పథకాలు:' : 'Verified Cited Schemes:'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.cited_schemes.map((s) => (
                      <div
                        key={s.id}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-colors"
                      >
                        <div className="font-bold text-xs text-blue-950 line-clamp-1">
                          {isTe && s.name_te ? s.name_te : s.name}
                        </div>
                        <div className="text-[11px] text-slate-500 mb-2 line-clamp-1">
                          {s.department}
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <Link
                            href={`/schemes/${s.id}`}
                            className="font-bold text-blue-800 hover:underline flex items-center gap-0.5"
                          >
                            Details <ArrowRight className="w-3 h-3" />
                          </Link>
                          <a
                            href={s.application_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
                          >
                            Portal <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up suggestions */}
              {msg.follow_up_suggestions && msg.follow_up_suggestions.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {msg.follow_up_suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(sug)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-semibold text-left transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-amber-300" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-sm text-xs text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-900" />
              <span>
                {isTe
                  ? 'ప్రభుత్వ మార్గదర్శకాలను విశ్లేషిస్తోంది...'
                  : 'Retrieving official scheme documentation...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      {messages.length <= 2 && (
        <div className="py-2 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {t.assistant.suggestedPrompts.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shrink-0 transition-colors shadow-2xs"
            >
              💡 {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Message Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-2 shrink-0"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.assistant.inputPlaceholder}
            className="w-full pl-4 pr-12 py-3.5 border border-slate-300 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent bg-white shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2.5 p-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 disabled:bg-slate-300 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
