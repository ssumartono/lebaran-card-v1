export type CardFormData = {
  familyName: string;
  headline: string;
  subheadline: string;
  apologyLine: string;
  style: 'classic' | 'modern' | 'minimal' | 'luxury';
  colorTheme: 'gold' | 'green' | 'white' | 'emerald-gold';
  backgroundType: 'islamic-living-room' | 'grand-arch' | 'minimal-studio' | 'mosque-hall';
  ratio: '4:5' | '1:1' | '9:16';
  cardType: 'family' | 'single' | 'couple';
  includeTableProps: boolean;
  includeLanterns: boolean;
  preserveOutfit: boolean;
};

const styleNotes: Record<CardFormData['style'], string> = {
  classic: 'classic festive greeting card with symmetrical family portrait composition, rich texture, and timeless elegance',
  modern: 'modern premium greeting card with clean composition, polished lighting, and contemporary modest fashion styling',
  minimal: 'minimal refined greeting card with uncluttered luxury layout, subtle ornament, and restrained visual balance',
  luxury: 'luxury editorial Eid greeting card with cinematic polish, premium decor, gold details, and sophisticated visual hierarchy'
};

const backgroundNotes: Record<CardFormData['backgroundType'], string> = {
  'islamic-living-room': 'an elegant Islamic living room with carved wall patterns, soft seating, tasteful decor, and realistic home ambience',
  'grand-arch': 'a grand Islamic arch backdrop with intricate arabesque details, stately symmetry, and formal portrait atmosphere',
  'minimal-studio': 'a modern studio-like Eid setting with subtle Islamic ornament, clean backdrop, and premium portrait feel',
  'mosque-hall': 'a majestic mosque-inspired hall with arches, refined geometric motifs, and soft warm depth'
};

const colorNotes: Record<CardFormData['colorTheme'], string> = {
  gold: 'cream, beige, warm gold, and soft ivory',
  green: 'emerald, sage green, ivory, and muted gold',
  white: 'white, champagne, pearl, and soft silver-gold accents',
  'emerald-gold': 'deep emerald, cream, champagne gold, and warm neutral highlights'
};

export function buildEidPrompt(data: CardFormData): string {
  const propsLine = data.includeTableProps
    ? 'Add a tasteful table in the foreground with ketupat, jars of cookies, and elegant Eid snacks. Keep props balanced and premium, not crowded.'
    : 'Do not place any foreground table or snack props.';

  const lanternLine = data.includeLanterns
    ? 'Add hanging lanterns with warm glowing light to enrich the festive atmosphere.'
    : 'Do not add hanging lanterns.';

  const subjectStr = data.cardType === 'single' ? 'person' : data.cardType === 'couple' ? 'couple' : 'family';
  const portraitStr = data.cardType === 'single' ? 'solo portrait' : data.cardType === 'couple' ? 'couple portrait' : 'family portrait';

  const outfitLine = data.preserveOutfit
    ? 'Preserve the original clothing silhouette and modest styling as much as possible while harmonizing textures and festive polish.'
    : `Dress the ${subjectStr} in harmonized modest Eid outfits using the palette ${colorNotes[data.colorTheme]}. Keep the garments elegant and realistic.`;

  return [
    `Create a high-end Indonesian Idul Fitri greeting card from the uploaded ${subjectStr} photo.`,
    `Preserve 100% facial identity, age impression, body proportions, skin tone, and recognizable features of the ${subjectStr} in the source image. No beautification, no face drift, no cartooning, no extra fingers, no anatomy distortion.`,
    `Keep the ${subjectStr} facing camera with warm natural smiles and polite salam gesture.`,
    `Visual style: ${styleNotes[data.style]}.`,
    `Background: ${backgroundNotes[data.backgroundType]}.`,
    `Color direction: ${colorNotes[data.colorTheme]}.`,
    'Lighting: warm, soft, elegant, realistic, flattering, with premium festive atmosphere.',
    `Composition: centered ${portraitStr}, balanced layout, professional greeting-card framing, highly readable top text area, portrait orientation.`,
    propsLine,
    lanternLine,
    outfitLine,
    'Render with realistic details, premium textures, refined typography placement area, and polished family-card aesthetics suitable for WhatsApp, Instagram, and print.',
    'Overlay elegant embossed gold text at the top center with clear spacing and no overlap with faces:',
    `1) "${data.headline}"`,
    `2) "${data.subheadline}"`,
    `3) "${data.apologyLine}"`,
    `4) "${data.familyName}"`,
    'Typography must be luxurious, legible, centered, and naturally integrated into the design.',
    `Output aspect ratio: ${data.ratio}.`,
    'Final output must look like a professionally designed Eid greeting card.'
  ].join(' ');
}
