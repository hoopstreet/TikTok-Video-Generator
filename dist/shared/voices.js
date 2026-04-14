"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_VOICES = exports.KOKORO_VOICES = exports.PHILIPPINES_VOICES = void 0;
exports.PHILIPPINES_VOICES = [
    { id: 'fish_ate_budol', name: 'Ate (Fish: Realistic Taglish)', lang: 'fil-PH', engine: 'fish-speech' },
    { id: 'fish_kuya_tech', name: 'Kuya (Fish: Energetic Pinoy)', lang: 'fil-PH', engine: 'fish-speech' }
];
exports.KOKORO_VOICES = [
    { id: 'af_heart', name: 'Heart (Kokoro)', lang: 'en-US', engine: 'kokoro' },
    { id: 'af_bella', name: 'Bella (Kokoro)', lang: 'en-US', engine: 'kokoro' },
    { id: 'am_adam', name: 'Adam (Kokoro)', lang: 'en-US', engine: 'kokoro' }
];
exports.ALL_VOICES = [...exports.PHILIPPINES_VOICES, ...exports.KOKORO_VOICES];
