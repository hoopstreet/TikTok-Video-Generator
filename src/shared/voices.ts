export const PHILIPPINES_VOICES = [
  // --- FISH SPEECH (New SOTA Taglish) ---
  { 
    id: 'fish-ate-budol', 
    name: 'Ate (Fish: Realistic Taglish)', 
    lang: 'fil-PH', 
    engine: 'fish-speech',
    tags: '[excited] [clear voice]'
  },
  { 
    id: 'fish-kuya-tech', 
    name: 'Kuya (Fish: Energetic Pinoy)', 
    lang: 'fil-PH', 
    engine: 'fish-speech',
    tags: '[professional broadcast tone]'
  },
  
  // --- KOKORO (Existing Smooth English) ---
  { id: 'af_heart', name: 'Heart (Kokoro)', lang: 'en-US', engine: 'kokoro' },
  { id: 'af_bella', name: 'Bella (Kokoro)', lang: 'en-US', engine: 'kokoro' },
  { id: 'af_nicole', name: 'Nicole (Kokoro)', lang: 'en-US', engine: 'kokoro' },
  { id: 'am_adam', name: 'Adam (Kokoro)', lang: 'en-US', engine: 'kokoro' },
  { id: 'am_onyx', name: 'Onyx (Kokoro)', lang: 'en-US', engine: 'kokoro' },

  // --- GOOGLE (Fallback) ---
  { id: 'fil-PH-Standard-A', name: 'Standard Ate (Google)', lang: 'fil-PH', engine: 'gtts' }
];
