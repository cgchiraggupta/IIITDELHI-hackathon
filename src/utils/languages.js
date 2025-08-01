/**
 * Available languages for the application
 * Each language has a code (ISO 639-1) and a display name
 */
export const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
]

/**
 * Maps language codes to Tesseract.js language codes
 * Tesseract uses 3-letter codes for some languages
 */
export const tesseractLanguageMap = {
  'en': 'eng',
  'hi': 'hin',
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
      // Header
      'header.title': 'ASHA Health Worker',
      'header.subtitle': 'Your Digital Partner in Healthcare',
      
      // Dashboard
      'dashboard.totalReports': 'Total Reports',
      'dashboard.totalPatients': 'Total Patients',
      'dashboard.quickActions': 'Quick Actions',
      'dashboard.newReport': 'New Report',
      'dashboard.viewPatients': 'View Patients',
      'dashboard.viewReports': 'View Reports',
      
      // Navigation
      'nav.home': 'Home',
      'nav.camera': 'Camera',
      'nav.report': 'Report',
      'nav.patients': 'Patients',
      
      // Camera
      'camera.title': 'Medical Report Capture',
      'camera.open': 'Open Camera',
      'camera.noCamera': 'No camera detected',
      'camera.upload': 'Upload Image',
      'camera.capture': 'Capture Image',
      
      // Preview
      'preview.title': 'Image Preview',
      'preview.retake': 'Retake',
      'preview.process': 'Process Image',
      
      // Text Extraction
      'extraction.title': 'Extracted Text',
      'extraction.loading': 'Processing image, please wait...',
      'extraction.error': 'Error extracting text',
      'extraction.copy': 'Copy Text',
      
      // Summary
      'summary.title': 'Medical Summary',
      'summary.interpretation': 'Medical Interpretation',
      'summary.actions': 'Recommended Actions',
      'summary.loading': 'Analyzing medical report, please wait...',
      'summary.error': 'Error generating summary',
      'summary.voice': 'Listen to Summary',
      
      // Patient
      'patient.title': 'Patient Information',
      'patient.name': 'Patient Name',
      'patient.age': 'Age',
      'patient.gender': 'Gender',
      'patient.location': 'Village/Location',
      'patient.notes': 'Additional Notes',
      'patient.save': 'Save Patient Info',
      
      // Gender
      'gender.select': 'Select gender',
      'gender.male': 'Male',
      'gender.female': 'Female',
      'gender.other': 'Other',
      
      // Report
      'report.generate': 'Generate Report',
      'report.download': 'Download Report',
      
      // Status
      'offline.message': 'You are currently offline. Some features may be limited.',
      'update.available': 'Update Available',
      'update.refresh': 'Refresh',
      
      // Empty states
      'empty.noReports': 'No reports yet',
      'empty.noPatients': 'No patients yet',
      'empty.startCapture': 'Start by capturing a medical report',
      'empty.addPatient': 'Add your first patient',
    },
    'hi': {
      // Header
      'header.title': 'आशा स्वास्थ्य कार्यकर्ता',
      'header.subtitle': 'स्वास्थ्य सेवा में आपका डिजिटल साथी',
      
      // Dashboard
      'dashboard.totalReports': 'कुल रिपोर्ट्स',
      'dashboard.totalPatients': 'कुल मरीज़',
      'dashboard.quickActions': 'तुरंत करें',
      'dashboard.newReport': 'नई रिपोर्ट',
      'dashboard.viewPatients': 'मरीज़ देखें',
      'dashboard.viewReports': 'रिपोर्ट्स',
      
      // Navigation
      'nav.home': 'होम',
      'nav.camera': 'कैमरा',
      'nav.report': 'रिपोर्ट',
      'nav.patients': 'मरीज़',
      
      // Camera
      'camera.title': 'मेडिकल रिपोर्ट कैप्चर',
      'camera.open': 'कैमरा खोलें',
      'camera.noCamera': 'कोई कैमरा नहीं मिला',
      'camera.upload': 'छवि अपलोड करें',
      'camera.capture': 'छवि कैप्चर करें',
      
      // Preview
      'preview.title': 'छवि पूर्वावलोकन',
      'preview.retake': 'फिर से लें',
      'preview.process': 'छवि प्रोसेस करें',
      
      // Text Extraction
      'extraction.title': 'निकाला गया टेक्स्ट',
      'extraction.loading': 'छवि प्रोसेस हो रही है, कृपया प्रतीक्षा करें...',
      'extraction.error': 'टेक्स्ट निकालने में त्रुटि',
      'extraction.copy': 'टेक्स्ट कॉपी करें',
      
      // Summary
      'summary.title': 'मेडिकल सारांश',
      'summary.interpretation': 'मेडिकल व्याख्या',
      'summary.actions': 'अनुशंसित कार्रवाई',
      'summary.loading': 'मेडिकल रिपोर्ट का विश्लेषण हो रहा है, कृपया प्रतीक्षा करें...',
      'summary.error': 'सारांश बनाने में त्रुटि',
      'summary.voice': 'सारांश सुनें',
      
      // Patient
      'patient.title': 'रोगी की जानकारी',
      'patient.name': 'रोगी का नाम',
      'patient.age': 'उम्र',
      'patient.gender': 'लिंग',
      'patient.location': 'गांव/स्थान',
      'patient.notes': 'अतिरिक्त नोट्स',
      'patient.save': 'रोगी की जानकारी सहेजें',
      
      // Gender
      'gender.select': 'लिंग चुनें',
      'gender.male': 'पुरुष',
      'gender.female': 'महिला',
      'gender.other': 'अन्य',
      
      // Report
      'report.generate': 'रिपोर्ट बनाएं',
      'report.download': 'रिपोर्ट डाउनलोड करें',
      
      // Status
      'offline.message': 'आप वर्तमान में ऑफलाइन हैं। कुछ सुविधाएँ सीमित हो सकती हैं।',
      'update.available': 'अपडेट उपलब्ध है',
      'update.refresh': 'रिफ्रेश करें',
      
      // Empty states
      'empty.noReports': 'अभी तक कोई रिपोर्ट नहीं',
      'empty.noPatients': 'अभी तक कोई मरीज़ नहीं',
      'empty.startCapture': 'मेडिकल रिपोर्ट कैप्चर करके शुरू करें',
      'empty.addPatient': 'अपना पहला मरीज़ जोड़ें',
    },
  }

  // Get the translations for the current language, or fall back to English
  const currentTranslations = translations[language] || translations['en']
  
  // Return the translated text or the key itself if no translation is found
  return currentTranslations[key] || key
}