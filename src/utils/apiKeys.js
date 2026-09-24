// Predefined client API keys. The backend identifies a client solely by the
// `x-api-key` header, so these stay fixed to keep earlier tasks matched to a key.
export const API_KEYS = [
  'tek_bdf0d5108adb5ac8',
  'tek_b310153c0c53b25e',
  'tek_389018b03eaa5d2a',
  'tek_5f38764d6bf515e5',
  'tek_6e484bfc3cde0496',
  'tek_590fe9fe0a96ad3c',
  'tek_74af38b7212ff4ed',
  'tek_68ba35a65551ceb1',
  'tek_3e27af392f043a69',
  'tek_ba9e08c5e17afbb1',
];

export const DEFAULT_API_KEY = API_KEYS[0];

export const isKnownApiKey = key => API_KEYS.includes(key);
