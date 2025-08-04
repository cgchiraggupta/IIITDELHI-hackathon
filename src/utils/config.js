// Configuration for different environments
const config = {
  // API Base URL - changes based on environment
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  
  // API Keys (these should be in environment variables in production)
  ocrApiKey: import.meta.env.VITE_OCR_API_KEY || 'K84125832788957',
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyC5CqcZww_dEKXlH4G6seq8H0p-RZC5si0',
  sarvamApiKey: import.meta.env.VITE_SARVAM_API_KEY || 'sk_sb5gdo6f_zbutFjWzkn02WwpwkZUmiNy9',
  
  // Environment detection
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // API Endpoints
  endpoints: {
    health: '/api/health',
    ocr: '/api/ocr',
    summarize: '/api/summarize',
    analyze: '/api/analyze',
    translateTts: '/api/translate-tts'
  }
}

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${config.apiBaseUrl}${endpoint}`
}

// Helper function to get API key
export const getApiKey = (keyName) => {
  return config[keyName] || ''
}

export default config 