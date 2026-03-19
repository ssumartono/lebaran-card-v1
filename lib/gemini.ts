import { GoogleGenAI } from '@google/genai';

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY environment variable.');
  }

  return new GoogleGenAI({ apiKey });
}

export function extractGeneratedImage(response: any): string | null {
  const candidates = response?.candidates ?? [];

  for (const candidate of candidates) {
    const parts = candidate?.content?.parts ?? [];
    for (const part of parts) {
      if (part?.inlineData?.data) {
        return part.inlineData.data as string;
      }
    }
  }

  const directParts = response?.parts ?? [];
  for (const part of directParts) {
    if (part?.inlineData?.data) {
      return part.inlineData.data as string;
    }
  }

  return null;
}

export function extractText(response: any): string {
  const snippets: string[] = [];
  const candidates = response?.candidates ?? [];

  for (const candidate of candidates) {
    const parts = candidate?.content?.parts ?? [];
    for (const part of parts) {
      if (part?.text) {
        snippets.push(part.text);
      }
    }
  }

  if (!snippets.length && typeof response?.text === 'string') {
    snippets.push(response.text);
  }

  return snippets.join('\n').trim();
}
