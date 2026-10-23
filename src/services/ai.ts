// AI service — uses @google/genai (latest SDK, supports all key formats including AQ.)
import { GoogleGenAI } from '@google/genai';
import type { ChatMessage } from '../types';
import { generateId } from '../utils';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';

const SYSTEM_PROMPT = `You are AgroBot, an expert AI agricultural assistant for AgroSentinel AI platform.
You help farmers in India, especially Tamil Nadu, with crop cultivation, soil health, fertilizer recommendations,
pest and disease management, irrigation, market prices, and integrated farming systems.
Guidelines:
- Always provide practical, actionable advice
- Mention when advice should be verified with a local agricultural officer or veterinarian
- Do not recommend restricted pesticides or fabricate specific dosages
- Acknowledge uncertainty when you are not sure
- Support both English and Tamil responses
- Be friendly, simple, and farmer-friendly in language
- Reference ICAR/TNAU recommendations when applicable`;

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  farmContext?: string
): Promise<string> {
  if (!GEMINI_API_KEY) return getDemoResponse(message);

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const historyParts = history.slice(-8).map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }],
    }));

    const chat = ai.chats.create({
      model: 'gemini-3.5-flash',
      config: {
        systemInstruction: `${SYSTEM_PROMPT}\n\nFarm context: ${farmContext ?? 'Not specified'}`,
      },
      history: historyParts,
    });

    const response = await chat.sendMessage({ message });
    return response.text ?? getDemoResponse(message);
  } catch (e: any) {
    console.error('Gemini error:', e?.message ?? e);
    throw e;
  }
}

function getDemoResponse(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes('paddy') || msg.includes('rice')) {
    return '**[DEMO MODE]**\n\nPaddy cultivation tips for Tamil Nadu:\n\n- Best Varieties: ADT 43, ADT 45, CO 51\n- Water: 1200–2000mm; practice AWD to save 30%\n- Basal: DAP 50 kg/acre + MOP 20 kg/acre\n- Tillering: Urea 35 kg/acre\n\n*Configure a valid Gemini API key for live AI responses.*';
  }
  if (msg.includes('banana')) {
    return '**[DEMO MODE]**\n\nBanana cultivation:\n\n- Varieties: Robusta (G9), Grand Naine, Nendran\n- Spacing: 1.8m x 1.8m | Drip: 8–12 L/plant/day\n- N:200g P:60g K:300g per plant (split 4 doses)\n\n*Configure a valid Gemini API key for live AI responses.*';
  }
  if (msg.includes('fertilizer') || msg.includes('npk') || msg.includes('urea')) {
    return '**[DEMO MODE]**\n\nFertilizer tips:\n\n- Always soil test before applying\n- Split applications are more effective\n- N: Urea (46%) | P: DAP (46%) | K: MOP (60%)\n\n*Configure a valid Gemini API key for live AI responses.*';
  }
  if (msg.includes('pest') || msg.includes('disease')) {
    return '**[DEMO MODE]**\n\nIPM approach:\n1. Cultural control (rotation, resistant varieties)\n2. Biological (Trichogramma, Pseudomonas)\n3. Chemical only as last resort\n\n*Configure a valid Gemini API key for live AI responses.*';
  }
  if (msg.includes('soil')) {
    return '**[DEMO MODE]**\n\nSoil health:\n\n- Test every 3 years (TNAU labs)\n- Ideal pH: 6.0–7.5 | OC: >0.5%\n- Add FYM/compost 5–10 t/acre before sowing\n\n*Configure a valid Gemini API key for live AI responses.*';
  }
  if (msg.includes('weather') || msg.includes('rain')) {
    return '**[DEMO MODE]**\n\nWeather tips:\n\n- Avoid fertilizer 24hrs before heavy rain\n- Irrigate early morning when temp >35°C\n- Check Weather page for live Open-Meteo data\n\n*Configure a valid Gemini API key for live AI responses.*';
  }
  return `**[DEMO MODE]**\n\nHello! I am AgroBot — your AI farming assistant.\n\nYou asked: "${message}"\n\nTry asking about: paddy, banana, soil health, fertilizer, pests, or weather.\n\n*Configure a valid Gemini API key in .env for live AI responses.*`;
}

export function createUserMessage(content: string): ChatMessage {
  return { id: generateId(), role: 'user', content, timestamp: new Date().toISOString() };
}

export function createAssistantMessage(content: string): ChatMessage {
  return { id: generateId(), role: 'assistant', content, timestamp: new Date().toISOString() };
}

export const QUICK_PROMPTS = [
  'What crops should I grow in Thanjavur this season?',
  'How much fertilizer does paddy need?',
  'Signs of rice blast disease?',
  'Best time to irrigate banana plants?',
  'How to start vermicomposting?',
  'Groundnut cultivation tips for Tamil Nadu',
  'What is Integrated Farming System?',
  'How to improve soil organic carbon?',
];

// Gemini Vision - Real Disease Detection
export interface DiseaseResult {
  diseaseName: string;
  confidence: string;
  isHealthy: boolean;
  symptoms: string;
  immediateActions: string[];
  prevention: string[];
  ipm: string;
  isDemo: boolean;
}

export async function analyzeDisease(imageBase64: string, cropType: string): Promise<DiseaseResult> {
  if (!GEMINI_API_KEY) return { ...getDemoDiseaseResult(cropType), isDemo: true };
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
            {
              text: `You are an expert plant pathologist. Analyze this ${cropType} plant image.
Return ONLY valid JSON, no markdown fences:
{"diseaseName":"name","confidence":"High/Medium/Low","isHealthy":false,"symptoms":"...","immediateActions":["step1","step2","step3"],"prevention":["tip1","tip2","tip3"],"ipm":"one sentence"}
Set isHealthy true if no disease. No banned pesticides. Practical for Tamil Nadu India. TNAU/ICAR aligned.`,
            },
          ],
        },
      ],
    });
    const text = response.text ?? '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return { ...parsed, isDemo: false };
  } catch (e) {
    console.error('Disease AI error:', e);
    return { ...getDemoDiseaseResult(cropType), isDemo: true };
  }
}

function getDemoDiseaseResult(cropType: string): Omit<DiseaseResult, 'isDemo'> {
  const map: Record<string, Omit<DiseaseResult, 'isDemo'>> = {
    Paddy: {
      diseaseName: 'Rice Blast (Pyricularia oryzae)', confidence: 'Demo', isHealthy: false,
      symptoms: 'Diamond-shaped lesions with grey centers and brown borders on leaves',
      immediateActions: ['Remove infected plant parts', 'Apply Tricyclazole 75WP @ 0.6g/L', 'Improve field drainage'],
      prevention: ['Use resistant variety ADT 43', 'Avoid excess nitrogen', 'Maintain field hygiene'],
      ipm: 'Cultural first, Pseudomonas fluorescens biological spray, fungicide only >5% incidence.',
    },
    Banana: {
      diseaseName: 'Sigatoka Leaf Spot', confidence: 'Demo', isHealthy: false,
      symptoms: 'Yellow streaks turning brown-black on lower leaves',
      immediateActions: ['Remove infected leaves', 'Apply Propiconazole 25EC @ 1ml/L', 'Improve air circulation'],
      prevention: ['Avoid overhead irrigation', 'Maintain plant spacing', 'Adequate potassium'],
      ipm: 'Remove infected leaves, copper-based preventive spray, synthetic fungicide as last resort.',
    },
    Tomato: {
      diseaseName: 'Early Blight (Alternaria solani)', confidence: 'Demo', isHealthy: false,
      symptoms: 'Dark concentric rings on older leaves with yellow halo',
      immediateActions: ['Remove lower infected leaves', 'Apply Mancozeb 75WP @ 2g/L', 'Avoid wetting foliage'],
      prevention: ['3-year crop rotation', 'Mulching to reduce soil splash', 'Balanced NPK'],
      ipm: 'Mulching and pruning first, copper-based sprays, synthetic fungicide after threshold.',
    },
  };
  return map[cropType] ?? {
    diseaseName: 'Nitrogen Deficiency', confidence: 'Demo', isHealthy: false,
    symptoms: 'Yellowing from older leaves upward',
    immediateActions: ['Apply Urea 25 kg/acre', 'Check soil pH (6–7)', 'Ensure soil moisture'],
    prevention: ['Soil test before sowing', 'Balanced NPK application', 'FYM/compost'],
    ipm: 'Correct nutrition through soil amendment; no pesticide needed for nutrient disorders.',
  };
}
