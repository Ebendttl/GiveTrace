import { GoogleGenerativeAI } from '@google/generative-ai';
import { Cause, MatchResult } from './types';

const apiKey = process.env.GEMINI_API_KEY || '';

export async function matchCausesWithGemini(
  query: string,
  causes: Cause[]
): Promise<MatchResult[]> {
  if (!apiKey) {
    console.warn('GEMINI_API_KEY missing. Falling back to default mock cause ranking.');
    return causes.map((c) => ({
      causeId: c.id,
      reason: `Matches interest in ${c.category} & community impact in ${c.location}.`,
    }));
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are an AI cause matcher for GiveTrace, a micro-giving platform.
Donor Interest: "${query}"

Available Causes:
${JSON.stringify(
  causes.map((c) => ({ id: c.id, name: c.name, category: c.category, location: c.location, description: c.description })),
  null,
  2
)}

Task: Select and rank the top 3 most relevant causes for the donor's interest. Provide a clear, compelling 1-sentence reason why each cause matches their prompt.

Return ONLY a strict JSON object with this exact structure (no markdown formatting, no code block syntax):
{
  "results": [
    { "causeId": "cause-id-here", "reason": "One sentence personalized matching reason here." }
  ]
}`;

  const executeCall = async () => {
    const response = await model.generateContent(prompt);
    const rawText = response.response.text().trim();
    // Clean potential markdown fencing if present
    const jsonStr = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(jsonStr);
    if (!parsed || !Array.isArray(parsed.results)) {
      throw new Error('Invalid JSON schema returned by Gemini');
    }
    return parsed.results as MatchResult[];
  };

  try {
    return await executeCall();
  } catch (err1) {
    console.warn('First Gemini match call failed or invalid JSON, retrying once...', err1);
    try {
      return await executeCall();
    } catch (err2) {
      console.error('Gemini match failed after retry. Using fallback ranking:', err2);
      return causes.map((c) => ({
        causeId: c.id,
        reason: `Shares key alignment with your request for ${c.category} initiatives.`,
      }));
    }
  }
}

export async function generateThankYouNarrative(
  causeName: string,
  amountSol: number
): Promise<string> {
  const fallback = `Your generous gift of ${amountSol} SOL is directly empowering ${causeName}. On behalf of the entire community, thank you for making a verifiable, lasting impact!`;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY missing. Using fallback thank-you narrative.');
    return fallback;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Write a short, warm, personalized thank-you message for a donor who just donated ${amountSol} SOL on Solana devnet to the cause: "${causeName}".
Requirements:
- Exactly 2 to 3 warm sentences.
- Specific to the cause and amount.
- Under 60 words total.
- Avoid generic corporate clichés.
- Return ONLY the plain text narrative. No quotes, no markdown.`;

    const response = await model.generateContent(prompt);
    const text = response.response.text().trim();
    return text || fallback;
  } catch (error) {
    console.error('Error generating Gemini thank-you narrative:', error);
    return fallback;
  }
}
