"use server";

import { HfInference } from "@huggingface/inference";
import medicalKB from "../../data/medical_kb.json";

const hf = new HfInference(process.env.HF_TOKEN);

export async function analyzeSymptoms(symptomsText: string) {
    if (!symptomsText) return { success: false, error: "Symptoms cannot be empty." };

    const lowerInput = symptomsText.toLowerCase();

    // 1. Scan your Kaggle-derived JSON dataset for a match
    let matchedRecord = medicalKB.find((record) =>
        record.symptoms.some((symptom: string) => lowerInput.includes(symptom))
    );

    // 2. Build the background knowledge context string
    let backgroundKnowledge = "";
    if (matchedRecord) {
        backgroundKnowledge = `Reference Case from Dataset:\n- Known Symptoms: ${matchedRecord.symptoms.join(", ")}\n- Expected Target Disease: ${matchedRecord.disease}\n- Standard Precautions: ${matchedRecord.precautions.join(", ")}`;
    } else {
        backgroundKnowledge = `Reference Case from Dataset:\n- Standard medical matching procedures for generalized general wellness symptoms.`;
    }

    // 3. Create the prompt instruction
    const prompt = `Task: Act as a clinical medical triage assistant. Analyze the user's input symptoms based on the provided structural dataset reference context, identify the probable disease, and output exact step-by-step safety precautions.

${backgroundKnowledge}

User Input Symptoms: ${symptomsText}

Output strictly in this format:
Predicted Disease: [Name of Disease]
Recommended Safety Precautions:
1. [Precaution 1]
2. [Precaution 2]
3. [Precaution 3]`;

    try {
        // Using the stable chatCompletion engine with the warm Qwen model cluster
        const response = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-7B-Instruct",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 200,
            temperature: 0.1,
        });

        // Extract the text output from the chat array structure
        const outputText = response.choices[0]?.message?.content || "No output returned.";
        return { success: true, text: outputText };

    } catch (error: any) {
        console.error("Hugging Face API Error:", error);
        return {
            success: false,
            error: `API Server Error: ${error?.message || "Please try again."}`
        };
    }
}