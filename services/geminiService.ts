import { GoogleGenAI, Type } from "@google/genai";
import { SecurityTip, Incident } from '../types';

// Initialize Gemini Client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Gemini API Key is missing! Please check Vercel Environment Variables for VITE_GEMINI_API_KEY");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const SYSTEM_INSTRUCTION = `You are the AI Security Chief for StaySafe NG, a platform monitoring insecurity in Nigeria. 
Your role is to provide accurate, calm, and actionable security advice for travelers and residents.
Focus on areas like Kaduna, Borno, Abuja highways, and general situational awareness.
When asked about routes, analyze risks based on general knowledge of current Nigerian security trends (kidnapping, banditry).
Always prioritize safety. If a situation sounds life-threatening, advise contacting emergency services (112 or 767) immediately.
Keep responses concise and easy to read on mobile devices.`;

// Persistence Keys
const DB_KEY = 'staysafe_db_v2'; // Updated to v2 to store full dashboard state
const LAST_FETCH_KEY = 'staysafe_last_update';

export interface DashboardData {
  incidents: Incident[];
  trends: { name: string; incidents: number }[];
  distribution: { name: string; value: number }[];
  roadUpdates: any[];
}

// Helper to parse various date formats into sorting-friendly timestamps
const parseIncidentDate = (dateStr: string): number => {
  if (!dateStr) return 0;

  // 1. Try parsing absolute date strings (e.g. "December 5, 2024")
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) return parsed;

  // 2. Parse relative time strings
  const now = Date.now();
  const str = dateStr.toLowerCase().trim();

  if (str === 'just now' || str.includes('moments ago') || str.includes('seconds ago')) return now;
  if (str.includes('today')) return now;
  if (str.includes('yesterday')) return now - 24 * 60 * 60 * 1000;

  const timeMatch = str.match(/(\d+)\s+(min|minute|hour|hr|day|week|month|year)/);
  if (timeMatch) {
    const val = parseInt(timeMatch[1]);
    const unit = timeMatch[2];

    if (unit.startsWith('min')) return now - val * 60 * 1000;
    if (unit.startsWith('hour') || unit === 'hr') return now - val * 60 * 60 * 1000;
    if (unit.startsWith('day')) return now - val * 24 * 60 * 60 * 1000;
    if (unit.startsWith('week')) return now - val * 7 * 24 * 60 * 60 * 1000;
    if (unit.startsWith('month')) return now - val * 30 * 24 * 60 * 60 * 1000;
  }

  // Fallback: if we can't parse it, push it to the bottom or keep as is
  return 0;
};

// Synchronous getter for instant load
export const getStoredData = (): DashboardData | null => {
  try {
    const stored = localStorage.getItem(DB_KEY);
    if (!stored) return null;

    const parsed: DashboardData = JSON.parse(stored);

    // Ensure incidents are sorted descending by timestamp when loaded from cache
    // This fixes legacy unsorted data
    if (parsed.incidents) {
      parsed.incidents.sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));
    }

    return parsed;
  } catch (e) {
    console.error("Failed to load local data", e);
    return null;
  }
};

export const getTravelAdvisory = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 300,
      }
    });
    return response.text || "Unable to generate advisory at this moment. Please check official channels.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Service Unavailable. Please rely on local authorities.";
  }
};

export const fetchRealTimeIntel = async (): Promise<DashboardData> => {
  const now = Date.now();

  // 1. Load Existing Data
  const cachedData = getStoredData(); // This now returns sorted data
  let existingIncidents: Incident[] = cachedData?.incidents || [];

  // BACKFILL: Ensure existing incidents have timestamps for sorting if missing
  existingIncidents = existingIncidents.map(inc => ({
    ...inc,
    timestampMs: inc.timestampMs || parseIncidentDate(inc.timestamp)
  }));

  // Prompt to get NEW data
  const prompt = `
    Perform a Google Search to find confirmed security incidents in Nigeria from the LAST 7 DAYS.
    Aim to find at least 15-20 distinct incidents to help populate a security database.
    
    Focus specifically on:
    1. Kidnappings (e.g., Abuja-Kaduna, FCT, Zamfara).
    2. Banditry attacks in Northern Nigeria.
    3. Major road accidents on federal highways.
    4. Terrorist activities in the North East.

    Based on the search results, generate a valid JSON object.
    
    CRITICAL INSTRUCTION FOR SOURCE URLs:
    - You MUST extract the ACTUAL, ORIGINAL news article URL (e.g., https://punchng.com/incident-details, https://dailypost.ng/2024/...).
    - DO NOT provide homepages (e.g., https://www.legit.ng/, https://punchng.com/).
    - DO NOT use Google redirect links.
    - If a specific article URL is not found, leave the sourceUrl field EMPTY.

    The JSON structure must be exactly as follows:
    {
        "incidents": [
            {
                "id": "string",
                "type": "Kidnapping" | "Banditry" | "Accident" | "Checkpoint" | "Terrorism",
                "location": "string",
                "description": "string (max 15 words)",
                "timestamp": "string (e.g. '2 hours ago', 'Yesterday', 'Dec 5, 2024')",
                "verified": true,
                "severity": "critical" | "high" | "medium",
                "votes": number,
                "sourceUrl": "string"
            }
        ],
        "trends": [{"name": "Day", "incidents": number}],
        "distribution": [{"name": "Type", "value": number}],
        "roadUpdates": [
            {
                "roadId": "string (e.g. F136)",
                "riskLevel": "string",
                "activeIncidents": number,
                "avgSpeed": "string",
                "advisory": "string"
            }
        ]
    }
    
    Check status for: F136 (Abuja-Kaduna), A1 (Lagos-Sokoto), A2 (PH-Kano), A3 (PH-Maiduguri), A122 (Ibadan-Benin).
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let jsonStr = response.text || '{}';
    // Clean markdown code blocks if present
    jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

    const newData = JSON.parse(jsonStr);

    // Collect grounding chunks to potentially recover URLs
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const validUrls = groundingChunks
      .map(chunk => chunk.web?.uri)
      .filter(uri => uri && !uri.includes('vertexaisearch.cloud.google.com'));

    if (newData && newData.incidents && Array.isArray(newData.incidents)) {
      // Fix URLs and Add Timestamps to new incidents
      const processedNewIncidents = newData.incidents.map((inc: Incident) => {
        let url = inc.sourceUrl;

        // Fix Redirect URLs
        if (url && url.includes('vertexaisearch.cloud.google.com')) {
          if (validUrls.length > 0) {
            try {
              const urlObj = new URL(url);
              const realUrl = urlObj.searchParams.get('url');
              url = realUrl || '';
            } catch (e) {
              url = '';
            }
          } else {
            url = '';
          }
        }

        // Filter out root domains (generic homepages)
        // If url is just "https://site.com/" or "https://site.com", kill it
        if (url) {
          try {
            const urlObj = new URL(url);
            // A root path usually has pathname "/" or ""
            if (urlObj.pathname === '/' || urlObj.pathname === '') {
              url = '';
            }
          } catch (e) {
            // invalid url, kill it
            url = '';
          }
        }
        return {
          ...inc,
          sourceUrl: url,
          // Parse timestamp immediately for sorting
          timestampMs: parseIncidentDate(inc.timestamp)
        };
      });

      // 2. Deduplication & Merging
      const newUniqueIncidents = processedNewIncidents.filter((newInc: Incident) => {
        return !existingIncidents.some((existing) => {
          if (newInc.sourceUrl && existing.sourceUrl === newInc.sourceUrl) return true;
          if (newInc.description === existing.description && newInc.location === existing.location) return true;
          return false;
        });
      });

      // Merge
      const combinedIncidents = [...newUniqueIncidents, ...existingIncidents];

      // 3. SORT BY TIMESTAMP (Newest First)
      combinedIncidents.sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));

      // Limit database size
      const trimmedIncidents = combinedIncidents.slice(0, 150);

      // Construct full dashboard payload
      const fullData: DashboardData = {
        incidents: trimmedIncidents,
        trends: newData.trends || cachedData?.trends || [],
        distribution: newData.distribution || cachedData?.distribution || [],
        roadUpdates: newData.roadUpdates || cachedData?.roadUpdates || []
      };

      // 4. Save to Storage
      localStorage.setItem(DB_KEY, JSON.stringify(fullData));
      localStorage.setItem(LAST_FETCH_KEY, now.toString());

      console.log(`Merged ${newUniqueIncidents.length} new incidents. Total in DB: ${trimmedIncidents.length}`);

      return fullData;
    }

    // Return existing if parse failed but wrapped in correct structure
    return cachedData || { incidents: [], trends: [], distribution: [], roadUpdates: [] };

  } catch (error) {
    console.error("Live Intel Error:", error);
    return cachedData || { incidents: [], trends: [], distribution: [], roadUpdates: [] };
  }
}

export const generateSecurityTips = async (category: string): Promise<SecurityTip[]> => {
  const prompt = `Generate 3 concise security tips for the category: ${category} in the context of Nigeria. 
  Return ONLY a JSON array where each object has 'title' and 'content' keys.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return [];

    const parsed = JSON.parse(text);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return parsed.map((item: any, index: number) => ({
      id: `gen-${Date.now()}-${index}`,
      title: item.title,
      content: item.content,
      category: category
    }));
  } catch (error) {
    console.error("Gemini Tips Error:", error);
    return [
      {
        id: 'fallback-1',
        title: 'Share Your Itinerary',
        content: 'Always let a trusted contact know your route and expected arrival time.',
        category: 'Travel'
      }
    ] as SecurityTip[];
  }
};

export const generateArticleContent = async (title: string): Promise<string> => {
  const prompt = `Write a comprehensive security guide/article for Nigerians titled: "${title}".
  Structure it with clear headings (Risks, Prevention Steps, Emergency Protocol).
  Keep it practical, local to Nigeria (mention relevant authorities or locations if applicable), and easy to read.
  Limit to 400 words.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });
    return response.text || "Content currently unavailable. Please check back later.";
  } catch (error) {
    console.error("Article Gen Error:", error);
    return "Error retrieving article content. Please check your internet connection.";
  }
};

export const streamChatResponse = async (history: { role: string, parts: { text: string }[] }[], newMessage: string) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction: SYSTEM_INSTRUCTION },
      history: history
    });

    return await chat.sendMessageStream({ message: newMessage });
  } catch (error) {
    console.error("Chat Stream Error", error);
    throw error;
  }
}