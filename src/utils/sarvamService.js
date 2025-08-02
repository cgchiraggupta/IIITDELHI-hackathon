import { SarvamAIClient } from "sarvamai";

// Sarvam AI API configuration
const SARVAM_API_KEY = "sk_sb5gdo6f_zbutFjWzkn02WwpwkZUmiNy9";

// Initialize Sarvam AI client
const sarvamClient = new SarvamAIClient({
  apiSubscriptionKey: SARVAM_API_KEY
});

// Available Indian languages for text-to-speech
export const sarvamLanguages = [
  { code: 'en-IN', name: 'English (India)', speaker: 'anushka' },
  { code: 'hi-IN', name: 'हिंदी (Hindi)', speaker: 'anushka' },
  { code: 'mr-IN', name: 'मराठी (Marathi)', speaker: 'anushka' },
  { code: 'bn-IN', name: 'বাংলা (Bengali)', speaker: 'anushka' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)', speaker: 'anushka' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)', speaker: 'anushka' },
  { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)', speaker: 'anushka' },
  { code: 'ml-IN', name: 'മലയാളം (Malayalam)', speaker: 'anushka' },
  { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)', speaker: 'anushka' },
  { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)', speaker: 'anushka' },
  { code: 'or-IN', name: 'ଓଡ଼ିଆ (Odia)', speaker: 'anushka' },
  { code: 'as-IN', name: 'অসমীয়া (Assamese)', speaker: 'anushka' },
];

/**
 * Convert text to speech using Sarvam AI
 * @param {string} text - The text to convert to speech
 * @param {string} targetLanguageCode - The target language code (e.g., 'mr-IN', 'hi-IN')
 * @param {Object} options - Additional options for speech generation
 * @returns {Promise<Object>} - Response containing audio data
 */
export async function convertTextToSpeech(text, targetLanguageCode = 'en-IN', options = {}) {
  try {
    console.log('Converting text to speech with Sarvam AI...');
    console.log('Text:', text.substring(0, 100) + '...');
    console.log('Target language:', targetLanguageCode);

    const defaultOptions = {
      speaker: 'anushka',
      pitch: 0,
      pace: 1,
      loudness: 1,
      speech_sample_rate: 22050,
      enable_preprocessing: true,
      model: 'bulbul:v2'
    };

    const response = await sarvamClient.textToSpeech.convert({
      text,
      target_language_code: targetLanguageCode,
      ...defaultOptions,
      ...options
    });

    console.log('Sarvam AI TTS response received:', response);
    
    // Check if response has audio data
    if (response && response.audios && response.audios.length > 0) {
      const audioData = response.audios[0]
      
      return {
        success: true,
        audioData: audioData,
        requestId: response.request_id
      }
    } else {
      console.error('No audio data in response:', response)
      return {
        success: false,
        error: 'No audio data received from Sarvam AI'
      }
    }
  } catch (error) {
    console.error('Sarvam AI TTS error:', error);
    return {
      success: false,
      error: error.message || 'Failed to convert text to speech'
    }
  }
}

/**
 * Translate and convert text to speech in one step
 * @param {string} text - The text to translate and convert
 * @param {string} sourceLanguage - The source language code
 * @param {string} targetLanguageCode - The target language code for TTS
 * @param {Object} options - Additional options for speech generation
 * @returns {Promise<Object>} - Response containing translated text and audio data
 */
export async function translateAndConvertToSpeech(text, sourceLanguage = 'en', targetLanguageCode = 'hi-IN', options = {}) {
  try {
    console.log('Translating and converting text to speech...');
    
    // First, translate the text using Gemini AI (we'll use the existing summarization endpoint)
    const translationResponse = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        sourceLanguage,
        targetLanguage: targetLanguageCode.split('-')[0] // Extract language code without country
      })
    });

    if (!translationResponse.ok) {
      throw new Error('Translation failed');
    }

    const { translatedText } = await translationResponse.json();

    // Then convert the translated text to speech
    const ttsResponse = await convertTextToSpeech(translatedText, targetLanguageCode, options);

    if (!ttsResponse.success) {
      throw new Error(ttsResponse.error || 'TTS conversion failed');
    }

    return {
      originalText: text,
      translatedText,
      audioData: ttsResponse.audioData,
      requestId: ttsResponse.requestId,
      targetLanguage: targetLanguageCode
    };
  } catch (error) {
    console.error('Translation and TTS error:', error);
    throw error;
  }
}

/**
 * Get available speakers for a language
 * @param {string} languageCode - The language code
 * @returns {Array} - Array of available speakers
 */
export function getAvailableSpeakers(languageCode) {
  // For now, we're using 'anushka' for all languages
  // This can be expanded based on Sarvam AI's available speakers
  return ['anushka'];
}

/**
 * Validate if a language code is supported
 * @param {string} languageCode - The language code to validate
 * @returns {boolean} - Whether the language is supported
 */
export function isLanguageSupported(languageCode) {
  return sarvamLanguages.some(lang => lang.code === languageCode);
}

/**
 * Get language info by code
 * @param {string} languageCode - The language code
 * @returns {Object|null} - Language information or null if not found
 */
export function getLanguageInfo(languageCode) {
  return sarvamLanguages.find(lang => lang.code === languageCode) || null;
} 