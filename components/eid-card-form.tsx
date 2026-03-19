'use client';

import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { Download, ImagePlus, LoaderCircle, Sparkles } from 'lucide-react';
import type { CardFormData } from '@/lib/prompt';

const initialForm: CardFormData = {
  familyName: 'misteraans & Keluarga',
  headline: 'Selamat Hari Raya Idul Fitri',
  subheadline: '1 Syawal 1447H',
  apologyLine: 'Minal Aidzin Walfaidzin • Mohon Maaf Lahir dan Batin',
  style: 'luxury',
  colorTheme: 'gold',
  backgroundType: 'grand-arch',
  ratio: '4:5',
  cardType: 'family',
  includeTableProps: true,
  includeLanterns: true,
  preserveOutfit: false
};

type GenerateState = {
  loading: boolean;
  error: string;
  resultImage: string;
  sourceImage: string;
  mimeType: string;
  promptUsed: string;
};

async function fileToBase64(file: File) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;

  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }

  return btoa(binary);
}

export function EidCardForm() {
  const [form, setForm] = useState<CardFormData>(initialForm);
  const [state, setState] = useState<GenerateState>({
    loading: false,
    error: '',
    resultImage: '',
    sourceImage: '',
    mimeType: '',
    promptUsed: ''
  });

  const canGenerate = useMemo(() => Boolean(state.sourceImage && form.familyName.trim()), [state.sourceImage, form.familyName]);

  const handleInput = <K extends keyof CardFormData>(key: K, value: CardFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);
    const localUrl = URL.createObjectURL(file);

    setState((prev) => ({
      ...prev,
      sourceImage: base64,
      mimeType: file.type || 'image/jpeg',
      error: '',
      resultImage: ''
    }));

    const img = document.getElementById('source-preview') as HTMLImageElement | null;
    if (img) {
      img.src = localUrl;
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canGenerate) return;

    setState((prev) => ({ ...prev, loading: true, error: '', resultImage: '' }));

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          imageBase64: state.sourceImage,
          mimeType: state.mimeType
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Generate gagal.');
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        resultImage: `data:${data.mimeType};base64,${data.imageBase64}`,
        promptUsed: data.prompt || ''
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Terjadi error tak dikenal.'
      }));
    }
  };

  const downloadResult = () => {
    if (!state.resultImage) return;

    const anchor = document.createElement('a');
    anchor.href = state.resultImage;
    anchor.download = `eid-card-${Date.now()}.png`;
    anchor.click();
  };

  return (
    <div className="studio-shell">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Gemini AI • Eid Card Studio</span>
          <h1>Kartu Lebaran premium dari satu foto</h1>
          <p>
            Upload foto, isi nama, pilih tipe kartu dan gaya visual, lalu Gemini menyulapnya menjadi kartu Idul Fitri
            siap kirim. Rapi, hangat, dan berkilau seperti ruang tamu yang baru selesai disetrika.
          </p>
        </div>
        <div className="hero-badge">
          <Sparkles size={18} />
          Production-ready Next.js build
        </div>
      </section>

      <div className="main-grid">
        <form className="panel" onSubmit={handleSubmit}>
          <div className="panel-header">
            <h2>Pengaturan Kartu</h2>
            <p>Sesuaikan teks, gaya, dan nuansa visual.</p>
          </div>

          <label className="upload-box">
            <input type="file" accept="image/*" onChange={handleFile} hidden />
            <div className="upload-inner">
              <ImagePlus size={22} />
              <span>Upload foto {form.cardType === 'single' ? 'sendiri' : form.cardType === 'couple' ? 'berdua' : 'keluarga'}</span>
              <small>JPG, PNG, WEBP. Foto frontal paling stabil.</small>
            </div>
          </label>

          <div className="field-grid two">
            <label>
              <span>Tipe Kartu</span>
              <select value={form.cardType} onChange={(e) => handleInput('cardType', e.target.value as CardFormData['cardType'])}>
                <option value="family">Keluarga</option>
                <option value="couple">Dua Orang</option>
                <option value="single">Satu Orang</option>
              </select>
            </label>
            <label>
              <span>{form.cardType === 'single' ? 'Nama Anda / Pengirim' : form.cardType === 'couple' ? 'Nama Pasangan / Kalian' : 'Nama keluarga'}</span>
              <input value={form.familyName} onChange={(e) => handleInput('familyName', e.target.value)} />
            </label>
          </div>

          <div className="field-grid">
            <label>
              <span>Rasio output</span>
              <select value={form.ratio} onChange={(e) => handleInput('ratio', e.target.value as CardFormData['ratio'])}>
                <option value="4:5">4:5</option>
                <option value="1:1">1:1</option>
                <option value="9:16">9:16</option>
              </select>
            </label>
          </div>

          <div className="field-grid">
            <label>
              <span>Judul utama</span>
              <input value={form.headline} onChange={(e) => handleInput('headline', e.target.value)} />
            </label>
            <label>
              <span>Subjudul</span>
              <input value={form.subheadline} onChange={(e) => handleInput('subheadline', e.target.value)} />
            </label>
            <label>
              <span>Baris ucapan</span>
              <textarea rows={3} value={form.apologyLine} onChange={(e) => handleInput('apologyLine', e.target.value)} />
            </label>
          </div>

          <div className="field-grid two">
            <label>
              <span>Style</span>
              <select value={form.style} onChange={(e) => handleInput('style', e.target.value as CardFormData['style'])}>
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
                <option value="luxury">Luxury</option>
              </select>
            </label>
            <label>
              <span>Color theme</span>
              <select value={form.colorTheme} onChange={(e) => handleInput('colorTheme', e.target.value as CardFormData['colorTheme'])}>
                <option value="gold">Gold</option>
                <option value="green">Green</option>
                <option value="white">White</option>
                <option value="emerald-gold">Emerald Gold</option>
              </select>
            </label>
            <label>
              <span>Background</span>
              <select value={form.backgroundType} onChange={(e) => handleInput('backgroundType', e.target.value as CardFormData['backgroundType'])}>
                <option value="grand-arch">Grand Arch</option>
                <option value="islamic-living-room">Islamic Living Room</option>
                <option value="minimal-studio">Minimal Studio</option>
                <option value="mosque-hall">Mosque Hall</option>
              </select>
            </label>
          </div>

          <div className="switches">
            <label><input type="checkbox" checked={form.includeTableProps} onChange={(e) => handleInput('includeTableProps', e.target.checked)} /> Props meja Eid</label>
            <label><input type="checkbox" checked={form.includeLanterns} onChange={(e) => handleInput('includeLanterns', e.target.checked)} /> Lantern gantung</label>
            <label><input type="checkbox" checked={form.preserveOutfit} onChange={(e) => handleInput('preserveOutfit', e.target.checked)} /> Pertahankan outfit asli</label>
          </div>

          <button className="primary-button" type="submit" disabled={!canGenerate || state.loading}>
            {state.loading ? <LoaderCircle className="spin" size={18} /> : <Sparkles size={18} />}
            {state.loading ? 'Generating...' : 'Generate kartu lebaran'}
          </button>

          {state.error ? <div className="error-box">{state.error}</div> : null}
        </form>

        <section className="preview-column">
          <div className="panel preview-panel">
            <div className="panel-header">
              <h2>Preview</h2>
              <p>Kiri: foto sumber. Kanan: hasil Gemini.</p>
            </div>
            <div className="preview-grid">
              <div className="preview-frame">
                <span>Source</span>
                {state.sourceImage ? (
                  <img
                    id="source-preview"
                    alt="Source preview"
                    src={`data:${state.mimeType};base64,${state.sourceImage}`}
                  />
                ) : (
                  <div className="empty-state">Belum ada foto.</div>
                )}
              </div>
              <div className="preview-frame">
                <span>Generated</span>
                {state.resultImage ? (
                  <img alt="Generated Eid card" src={state.resultImage} />
                ) : (
                  <div className="empty-state">Hasil generate akan muncul di sini.</div>
                )}
              </div>
            </div>
            <button className="secondary-button" type="button" onClick={downloadResult} disabled={!state.resultImage}>
              <Download size={18} /> Download hasil
            </button>
          </div>

          <div className="panel prompt-panel">
            <div className="panel-header">
              <h2>Prompt yang dipakai</h2>
              <p>Bisa kamu tweak untuk eksperimen batch.</p>
            </div>
            <pre>{state.promptUsed || 'Prompt final akan tampil di sini setelah generate.'}</pre>
          </div>
        </section>
      </div>
    </div>
  );
}
