import { GoogleGenAI, Type } from '@google/genai';
//npm install @google/genai

export interface AIAnalysisResult {
  matchPercentage: number;
  verdict: 'RECOMMENDED_APPROVE' | 'SUSPICIOUS_DISCREPANCY' | 'INSUFFICIENT_PROOF' | 'DEFINITE_REJECT';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  summary: string;
  matchingPoints: string[];
  discrepancies: string[];
  recommendationAction: string;
  engine: 'gemini-3.8-flash' | 'heuristic-fallback';
}

export async function analyzeClaimMatch(data: {
  itemTitle: string;
  itemDescription?: string;
  privateDetails?: string;
  itemCategory?: string;
  itemLocation?: string;
  claimantName: string;
  claimantContact?: string;
  verificationAnswers: string;
}): Promise<AIAnalysisResult> {
  const {
    itemTitle,
    itemDescription = '',
    privateDetails = '',
    itemCategory = '',
    itemLocation = '',
    claimantName,
    verificationAnswers
  } = data;

  // Check if GEMINI_API_KEY is available
  if (process.env.GEMINI_API_KEY) {
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    const ai = new GoogleGenAI();
    const prompt = `
You are an assistant helping campus security officers at Lovely Professional University (LPU) verify lost and found items.
Write your analysis in VERY SIMPLE, CLEAR, EVERYDAY ENGLISH so anyone can understand it in 5 seconds. Avoid academic or technical jargon.

ITEM DETAILS:
- Item: ${itemTitle} (${itemCategory})
- Where Found/Lost: ${itemLocation}
- Public Description (anyone could see this): ${itemDescription}
- Secret Clue (hidden notes only the real owner should know): "${privateDetails}"

STUDENT'S CLAIM:
- Student Name: ${claimantName}
- What the Student Said to Prove Ownership: "${verificationAnswers}"

YOUR TASK:
1. Check if what the student said matches the secret clue.
2. Give a match score from 0% to 100%.
3. Write a simple 1-sentence verdict in plain English (e.g. "Great match! The student correctly described the secret markings." or "Low match. The student only gave a very basic guess.").
4. List 1-3 simple matched points (e.g. "Mentioned the NASA logo", "Knew there was a red key").
5. List any missing details or doubts in simple words.
6. Give a 1-sentence simple instruction for the security officer at the desk.
`;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                matchPercentage: {
                  type: Type.INTEGER,
                  description: 'Score from 0 to 100',
                },
                verdict: {
                  type: Type.STRING,
                  enum: ['RECOMMENDED_APPROVE', 'SUSPICIOUS_DISCREPANCY', 'INSUFFICIENT_PROOF', 'DEFINITE_REJECT'],
                },
                confidence: {
                  type: Type.STRING,
                  enum: ['HIGH', 'MEDIUM', 'LOW'],
                },
                summary: {
                  type: Type.STRING,
                  description: 'Simple 1-sentence summary in plain English',
                },
                matchingPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Simple points that matched',
                },
                discrepancies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Simple points that are missing or different',
                },
                recommendationAction: {
                  type: Type.STRING,
                  description: 'Simple instruction for security guard',
                },
              },
              required: [
                'matchPercentage',
                'verdict',
                'confidence',
                'summary',
                'matchingPoints',
                'discrepancies',
                'recommendationAction',
              ],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return {
            ...parsed,
            matchPercentage: Math.max(0, Math.min(100, Number(parsed.matchPercentage) || 0)),
            engine: model,
          };
        }
      } catch (err: any) {
        // If 503 (high demand) or 429, try the next model candidate
        const errMsg = err?.message || String(err);
        if (errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE')) {
          console.warn(`Model ${model} is at high demand (503), attempting next candidate model...`);
          continue;
        }
        console.warn(`Model ${model} call encountered an error: ${errMsg}`);
      }
    }
  }

  // Seamless intelligent fallback if remote models are unavailable or experiencing high demand
  return computeHeuristicAnalysis(itemTitle, itemDescription, privateDetails, verificationAnswers);
}

function computeHeuristicAnalysis(
  itemTitle: string,
  itemDescription: string,
  privateDetails: string,
  verificationAnswers: string
): AIAnalysisResult {
  const normAnswers = (verificationAnswers || '').toLowerCase();
  const normPrivate = (privateDetails || '').toLowerCase();
  const normDesc = (itemDescription || '').toLowerCase();

  const matchingPoints: string[] = [];
  const discrepancies: string[] = [];
  let score = 35;

  // Extract key keywords from private details
  const privateKeywords = normPrivate
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['with', 'there', 'small', 'from', 'none', 'provided'].includes(w));

  let matchedPrivateCount = 0;
  for (const kw of privateKeywords) {
    if (normAnswers.includes(kw)) {
      matchedPrivateCount++;
      matchingPoints.push(`Correctly mentioned secret detail: "${kw}"`);
    }
  }

  if (privateKeywords.length > 0) {
    const ratio = matchedPrivateCount / privateKeywords.length;
    score += Math.round(ratio * 55);
  } else if (normAnswers.length > 20) {
    score += 40;
    matchingPoints.push('Provided a good detailed description');
  }

  // Check description overlap
  const descKeywords = normDesc
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['found', 'lost', 'near'].includes(w));

  let matchedDesc = 0;
  for (const kw of descKeywords) {
    if (normAnswers.includes(kw)) {
      matchedDesc++;
    }
  }
  if (matchedDesc > 0) {
    matchingPoints.push(`Matches general item description`);
    score += Math.min(15, matchedDesc * 5);
  }

  if (normAnswers.length < 15) {
    discrepancies.push('Description is too short and has few details');
    score = Math.min(score, 45);
  }

  if (privateKeywords.length > 0 && matchedPrivateCount === 0) {
    discrepancies.push('Did not mention the hidden secret marks logged by finder');
    score = Math.min(score, 40);
  }

  const finalScore = Math.max(10, Math.min(96, score));
  let verdict: AIAnalysisResult['verdict'] = 'INSUFFICIENT_PROOF';
  let confidence: AIAnalysisResult['confidence'] = 'MEDIUM';

  if (finalScore >= 75) {
    verdict = 'RECOMMENDED_APPROVE';
    confidence = 'HIGH';
  } else if (finalScore >= 50) {
    verdict = 'INSUFFICIENT_PROOF';
    confidence = 'MEDIUM';
  } else {
    verdict = 'SUSPICIOUS_DISCREPANCY';
    confidence = 'HIGH';
  }

  return {
    matchPercentage: finalScore,
    verdict,
    confidence,
    summary:
      finalScore >= 75
        ? `High match! The student accurately described the hidden details. Looks genuine.`
        : `Moderate match. The student knows basic details but missed some secret marks. Please verify ID.`,
    matchingPoints: matchingPoints.length ? matchingPoints : ['Student identified the basic item type'],
    discrepancies: discrepancies.length ? discrepancies : ['No conflicting details found'],
    recommendationAction:
      finalScore >= 75
        ? 'Ask for student ID card, verify OTP, and hand over the item.'
        : 'Ask the student to describe the item more clearly or show a photo before handing over.',
    engine: 'heuristic-fallback',
  };
}
