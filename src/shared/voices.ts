export const PHILIPPINES_VOICES = [
  // --- FISH SPEECH (SOTA Taglish) ---
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
  
  // --- KOKORO (Fast & Smooth) ---
  { 
    id: 'af_bella', 
    name: 'Bella (Kokoro: Smooth Female)', 
    lang: 'en-US', 
    engine: 'kokoro' 
  },
  { 
    id: 'am_adam', 
    name: 'Adam (Kokoro: Deep Male)', 
    lang: 'en-US', 
    engine: 'kokoro' 
  },

  // --- GOOGLE (Legacy Fallback) ---
  { 
    id: 'fil-PH-Wavenet-A', 
    name: 'Google Ate (Fallback)', 
    lang: 'fil-PH', 
    engine: 'gtts' 
  }
];
