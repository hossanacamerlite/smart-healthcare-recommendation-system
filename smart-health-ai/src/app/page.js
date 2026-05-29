"use client";

import { useState } from "react";
import { analyzeSymptoms } from "./action";

export default function Home() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    const res = await analyzeSymptoms(symptoms);
    setResult(res.success && res.text ? res.text : res.error || "An unexpected error occurred.");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl">

        {/* Header */}
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 text-[11px] font-medium px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-wider">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            TMS4043 · LeCun Learners
          </span>
          <h1 className="text-xl font-semibold text-white mt-3">Symptom-to-Precaution Classifier</h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Powered by Qwen-2.5 · Maps symptoms to triage indicators via LLM inference
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
              Enter symptoms
            </label>
            <textarea
              className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-100 placeholder-slate-600 resize-none transition text-sm leading-relaxed"
              rows={4}
              placeholder="e.g., itching, skin rash, nodal skin eruptions, high fever…"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium py-3 px-4 rounded-xl transition duration-200 text-sm active:scale-[0.99]"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing inference…
              </>
            ) : (
              "Run AI Diagnostic Match"
            )}
          </button>
        </form>

        {/* Skeleton or Result */}
        {(loading || result) && (
          <div className="mt-6 p-5 bg-slate-950 border border-slate-800 rounded-xl">
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-medium mb-3">
              Model output
            </p>
            {loading ? (
              <div className="space-y-2.5 animate-pulse">
                <div className="h-3 bg-slate-800 rounded w-[90%]" />
                <div className="h-3 bg-slate-800 rounded w-[70%]" />
                <div className="h-3 bg-slate-800 rounded w-[82%]" />
                <div className="h-3 bg-slate-800 rounded w-[55%]" />
              </div>
            ) : (
              <p className="text-slate-300 text-sm font-mono whitespace-pre-line leading-relaxed">
                {result}
              </p>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex gap-2.5 items-start">
          <span className="text-amber-500 text-sm mt-0.5">⚠</span>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong className="text-slate-500 font-medium">Medical disclaimer:</strong> This tool uses a serverless LLM to map symptom entries to reference dataset cases. It does not provide clinical diagnoses, medical advice, or treatment plans. Always consult a qualified healthcare professional.
          </p>
        </div>
      </div>
    </main>
  );
}