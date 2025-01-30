// src/lib/config.ts
const API_URL = import.meta.env.VITE_API_URL || '';
// const AUTH_HEADER = import.meta.env.VITE_AUTH_HEADER || '';

if (!API_URL) throw new Error('API_URL not found.');
// if (!AUTH_HEADER) throw new Error('AUTH_HEADER not found.');

const config = {
  API_URL,
  // AUTH_HEADER,
};

export default config;
