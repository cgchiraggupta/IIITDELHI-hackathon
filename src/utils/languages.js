/**
 * Available languages for the application
 * Each language has a code (ISO 639-1) and a display name
 */
export const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
]

/**
 * Maps language codes to Tesseract.js language codes
 * Tesseract uses 3-letter codes for some languages
 */
export const tesseractLanguageMap = {
  'en': 'eng',
  'hi': 'hin',
  'bn': 'ben',
  'te': 'tel',
  'ta': 'tam',
  'mr': 'mar',
  'gu': 'guj',
  'kn': 'kan',
  'ml': 'mal',
  'pa': 'pan',
  'or': 'ori',
}

/**
 * Gets the default language based on browser settings
 * Falls back to English if no match is found
 * @returns {string} The language code to use
 */
export const getDefaultLanguage = () => {
  const browserLang = navigator.language.split('-')[0]
  const isSupported = availableLanguages.some(lang => lang.code === browserLang)
  return isSupported ? browserLang : 'en'
}

/**
 * Translates a key to the current language
 * This is a simple implementation - in a real app, you would use a proper i18n library
 * @param {string} key The translation key
 * @param {string} language The current language code
 * @returns {string} The translated text
 */
export const translate = (key, language = 'en') => {
  const translations = {
    'en': {
      'app.title': 'ASHA Health Assistant',
      'camera.title': 'Medical Report Capture',
      'camera.open': 'Open Camera',
      'camera.noCamera': 'No camera detected',
      'camera.upload': 'Upload Image',
      'preview.title': 'Image Preview',
      'preview.retake': 'Retake',
      'preview.process': 'Process Image',
      'extraction.title': 'Extracted Text',
      'extraction.loading': 'Processing image, please wait...',
      'extraction.error': 'Error extracting text',
      'summary.title': 'Medical Summary',
      'summary.interpretation': 'Medical Interpretation',
      'summary.actions': 'Recommended Actions',
      'summary.loading': 'Analyzing medical report, please wait...',
      'summary.error': 'Error generating summary',
      'patient.title': 'Patient Information',
      'patient.name': 'Patient Name',
      'patient.age': 'Age',
      'patient.gender': 'Gender',
      'patient.location': 'Village/Location',
      'patient.notes': 'Additional Notes',
      'gender.select': 'Select gender',
      'gender.male': 'Male',
      'gender.female': 'Female',
      'gender.other': 'Other',
      'offline.message': 'You are currently offline. Some features may be limited.',
      'report.generate': 'Generate Report',
      'report.download': 'Download Report',
      'update.available': 'Update Available',
      'update.refresh': 'Refresh',
    },
    'hi': {
      'app.title': 'आशा स्वास्थ्य सहायक',
      'camera.title': 'मेडिकल रिपोर्ट कैप्चर',
      'camera.open': 'कैमरा खोलें',
      'camera.noCamera': 'कोई कैमरा नहीं मिला',
      'camera.upload': 'छवि अपलोड करें',
      'preview.title': 'छवि पूर्वावलोकन',
      'preview.retake': 'फिर से लें',
      'preview.process': 'छवि प्रोसेस करें',
      'extraction.title': 'निकाला गया टेक्स्ट',
      'extraction.loading': 'छवि प्रोसेस हो रही है, कृपया प्रतीक्षा करें...',
      'extraction.error': 'टेक्स्ट निकालने में त्रुटि',
      'summary.title': 'मेडिकल सारांश',
      'summary.interpretation': 'मेडिकल व्याख्या',
      'summary.actions': 'अनुशंसित कार्रवाई',
      'summary.loading': 'मेडिकल रिपोर्ट का विश्लेषण हो रहा है, कृपया प्रतीक्षा करें...',
      'summary.error': 'सारांश बनाने में त्रुटि',
      'patient.title': 'रोगी की जानकारी',
      'patient.name': 'रोगी का नाम',
      'patient.age': 'उम्र',
      'patient.gender': 'लिंग',
      'patient.location': 'गांव/स्थान',
      'patient.notes': 'अतिरिक्त नोट्स',
      'gender.select': 'लिंग चुनें',
      'gender.male': 'पुरुष',
      'gender.female': 'महिला',
      'gender.other': 'अन्य',
      'offline.message': 'आप वर्तमान में ऑफलाइन हैं। कुछ सुविधाएँ सीमित हो सकती हैं।',
      'report.generate': 'रिपोर्ट बनाएं',
      'report.download': 'रिपोर्ट डाउनलोड करें',
      'update.available': 'अपडेट उपलब्ध है',
      'update.refresh': 'रिफ्रेश करें',
    },
    // Add more languages as needed
  }

  // Get the translations for the current language, or fall back to English
  const currentTranslations = translations[language] || translations['en']
  
  // Return the translated text or the key itself if no translation is found
  return currentTranslations[key] || key
}