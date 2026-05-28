"use client";

import { useState } from "react";
import { analyzeSymptoms } from "./action"; // Uses standard relative pathing

export default function Home() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const res = await analyzeSymptoms(symptoms);

    if (res.success && res.text) {
      setResult(res.text);
    } else {
      setResult(res.error || "An unexpected error occurred.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">

        {/* Header Section */}
        <div className="mb-6 text-center">
          <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/20">
            TMS4043 AI Project • SDG 3
          </span>
          <h1 className="text-2xl font-bold text-white mt-3">
            Symptom-to-Precaution Classifier
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Leveraging the pretrained Qwen-2.5 Large Language Model pipeline to evaluate disease triage indicators.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Type or paste user symptoms:
            </label>
            <textarea
              className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-500 shadow-inner resize-none transition"
              rows={4}
              placeholder="e.g., itching, skin rash, nodal skin eruptions"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-xl transition duration-200 disabled:bg-slate-700 disabled:text-slate-500 shadow-md transform active:scale-[0.99]"
          >
            {loading ? "Processing AI Inference..." : "Run AI Diagnostic Match"}
          </button>
        </form>

        {/* Results Window */}
        {result && (
          <div className="mt-8 p-6 bg-slate-950 border border-slate-700 rounded-xl">
            <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
              <span>📊</span> Model Output Matrix
            </h3>
            <p className="text-slate-300 text-sm whitespace-pre-line leading-relaxed font-mono">
              {result}
            </p>
          </div>
        )}

        {/* ⚠️ CLINICAL SAFETY DISCLAIMER */}
        <div className="mt-8 pt-4 border-t border-slate-700/50 flex gap-2.5 items-start">
          <span className="text-amber-500 text-base mt-0.5">⚠️</span>
          <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
            <strong className="text-slate-400 font-semibold">Medical Disclaimer:</strong> This system uses a trial serverless Large Language Model to map user symptom entries to reference dataset cases. It does not provide real clinical diagnoses, medical advice, or treatment plans. Always consult a qualified healthcare professional for medical concerns.
          </p>
        </div>

      </div>
    </main>
  );
}
