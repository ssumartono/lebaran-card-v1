import { NextRequest, NextResponse } from 'next/server';
import { buildEidPrompt, type CardFormData } from '@/lib/prompt';
import { extractGeneratedImage, extractText, getGeminiClient } from '@/lib/gemini';

export const runtime = 'nodejs';
export const maxDuration = 60;

type GeneratePayload = CardFormData & {
  imageBase64: string;
  mimeType: string;
};

function validate(payload: Partial<GeneratePayload>) {
  if (!payload.imageBase64 || !payload.mimeType) {
    return 'Foto sumber wajib diunggah.';
  }

  if (!payload.familyName?.trim()) {
    return 'Nama keluarga / penanda kartu wajib diisi.';
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as GeneratePayload;
    const error = validate(payload);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const ai = getGeminiClient();
    const prompt = buildEidPrompt(payload);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          text: prompt
        },
        {
          inlineData: {
            mimeType: payload.mimeType,
            data: payload.imageBase64
          }
        }
      ],
      config: {
        responseModalities: ['IMAGE', 'TEXT']
      }
    });

    const generatedImageBase64 = extractGeneratedImage(response);
    const modelText = extractText(response);

    if (!generatedImageBase64) {
      return NextResponse.json(
        {
          error: 'Gemini tidak mengembalikan image output. Coba ulangi dengan foto keluarga yang lebih jelas dan prompt yang lebih sederhana.',
          modelText
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      imageBase64: generatedImageBase64,
      mimeType: 'image/png',
      prompt,
      modelText
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Terjadi kegagalan saat generate kartu.'
      },
      { status: 500 }
    );
  }
}
