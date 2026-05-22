"use client";

import { useState } from "react";

export default function SymptomChecker() {
    const [symptoms, setSymptoms] = useState("");
    const [result, setResult] = useState("");
    
    const handleSubmit = () => {
        if (
            symptoms.toLowerCase().includes("chest pain")
    ) {
        setResult(
            "High urgency. Please visit the nearest hospital immediately."
        );
    } else if (
        symptoms.toLowerCase().includes("fever")
    ) {
        setResult(
            "Medium urgency. Consider visiting a clinic or healthcare center."
        );
    } else {
        setResult(
            "Low urgency. Monitor symptoms and rest."
        );
    }
};

return (
    <main className="min-h-screen p-10">
    <h1 className="text-5xl font-bold mb-8">
        Symptom Checker
    </h1>

    <textarea
        className="w-full border p-4 rounded-lg"
        rows="6"
        placeholder="Enter your symptoms..."
        value={symptoms}
        onChange={(e) =>
            setSymptoms(e.target.value)
        }
    />

    <button
        onClick={handleSubmit}
        className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
    >
        Analyze Symptoms
    </button>

    {result && (
        <div className="mt-8 p-6 border rounded-lg bg-gray-100">
        <h2 className="text-2xl font-semibold mb-2">
            Recommendation
        </h2>

        <p>{result}</p>
        </div>
    )}
    </main>
);
}