"use server";

import { HfInference } from "@huggingface/inference";
import fs from "fs";
import path from "path";

const hf = new HfInference(process.env.HF_TOKEN);

export async function analyzeSymptoms(symptomsText: string) {
    if (!symptomsText) return { success: false, error: "Symptoms cannot be empty." };

    try {
        const filePath = path.join(process.cwd(), "data", "medical_kb.json");
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const medicalKB = JSON.parse(fileContent);

        const lowerInput = symptomsText.toLowerCase();
        
        const stopWords = new Set(["i", "have", "feel", "with", "and", "my", "a", "the", "for", "is", "itchiness"]);
        const inputTokens = lowerInput.split(/\s+/)
            .map(t => t.replace(/[^a-z_]/g, ""))
            .filter(t => t.length > 1 && !stopWords.has(t));

        if (lowerInput.includes("itch")) {
            inputTokens.push("skin_rash"); 
        }

        // 1. High-Speed Local Retrieval Scan
        let relevantMatches: any[] = [];

        for (const record of medicalKB) {
            let score = 0;
            const diseaseName = record.disease.toLowerCase();

            inputTokens.forEach(token => {
                if (diseaseName.includes(token)) score += 3;
            });

            record.symptoms.forEach((symptom: string) => {
                const cleanSymptom = symptom.toLowerCase().replace(/_/g, " ");
                inputTokens.forEach(token => {
                    if (cleanSymptom.includes(token) || token.includes(cleanSymptom)) {
                        score += 1;
                    }
                });
            });

            if (score > 0) {
                relevantMatches.push({ record, score });
            }
        }

        relevantMatches.sort((a, b) => b.score - a.score);
        const topMatches = relevantMatches.slice(0, 2).map(m => m.record);

        // 2. ENFORCED RESTRICTION: Check if any data matched
        let backgroundKnowledge = "";
        let dataAvailable = true;

        if (topMatches.length > 0) {
            backgroundKnowledge = `Highly Relevant Reference Cases from Dataset:\n${JSON.stringify(topMatches, null, 2)}`;
        } else {
            // Force-set the baseline context string to tell the model there is nothing to match
            backgroundKnowledge = "No data found in the dataset.";
            dataAvailable = false;
        }

        // 3. Formulate the Strict System Prompt with the new guardrails
        const systemInstruction = `You are an expert clinical medical triage assistant supporting SDG 3.
Your task is to analyze the user's input symptoms and map them conceptually to the most accurate disease present within the provided reference context.

DATASET CONTEXT REFERENCE:
${backgroundKnowledge}

STRICT CRITICAL RULES:
1. If the DATASET CONTEXT REFERENCE states "No data found in the dataset.", you MUST ignore your pre-trained medical knowledge. Instead, respond exactly with:
   Predicted Disease: No data found from the dataset.
   Recommended Safety Precautions: No safety precautions available.
2. If data IS available, prioritize mapping the symptoms to the provided reference context and follow the regular output format.

Output format if data is available:
Predicted Disease: [Name of Disease]
Recommended Safety Precautions:
1. [Precaution 1]
2. [Precaution 3]
3. [Precaution 3]`;

        // 4. Execute Chat Completion
        const response = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-7B-Instruct",
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: `User Symptoms: ${symptomsText}` }
            ],
            max_tokens: 250,
            temperature: 0.0, // Set to 0.0 for absolute rule strictness
        });

        const outputText = response.choices[0]?.message?.content || "No response generated.";
        return { success: true, text: outputText };

    } catch (error: any) {
        console.error("RAG Pipeline Error:", error);
        return { success: false, error: `Server Error: ${error.message}` };
    }
}