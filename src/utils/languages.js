/**
 * Available languages for the application
 * Each language has a code (ISO 639-1) and a display name
 */
export const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
]

/**
 * Maps language codes to Tesseract.js language codes
 * Tesseract uses 3-letter codes for some languages
 */
export const tesseractLanguageMap = {
  'en': 'eng',
  'hi': 'hin',
  'mr': 'mar',
  'bn': 'ben',
  'ta': 'tam',
  'te': 'tel',
  'kn': 'kan',
  'ml': 'mal',
  'gu': 'guj',
  'pa': 'pan',
  'or': 'ori',
  'as': 'asm',
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
      
      // Collaboration
      'collaboration.title': 'Collaboration & Sharing',
      'collaboration.shareReport': 'Share Report',
      'collaboration.generateLink': 'Generate Share Link',
      'collaboration.copy': 'Copy',
      'collaboration.close': 'Close',
      'collaboration.addCollaborators': 'Add Collaborators',
      'collaboration.emailPlaceholder': 'Enter email address',
      'collaboration.add': 'Add',
      'collaboration.remove': 'Remove',
      'collaboration.role': 'Role',
      'collaboration.roles.viewer': 'Viewer',
      'collaboration.roles.editor': 'Editor',
      'collaboration.chat': 'Real-time Chat',
      'collaboration.chatComingSoon': 'Chat feature coming soon!',
      
      // Emergency
      'emergency.title': 'Emergency Alert System',
      'emergency.conditionsDetected': 'Critical Conditions Detected',
      'emergency.sendAlert': 'Send Emergency Alert',
      'emergency.callDoctor': 'Call Doctor',
      'emergency.viewDetails': 'View Details',
      'emergency.alertSent': 'Emergency alert sent successfully!',
      'emergency.recommendation': 'Immediate medical attention recommended',
      'emergency.levels.high': 'High Priority',
      'emergency.levels.medium': 'Medium Priority',
      'emergency.levels.low': 'Low Priority',
      
      // Analytics
      'analytics.title': 'Analytics Dashboard',
      'analytics.timeRanges.week': 'This Week',
      'analytics.timeRanges.month': 'This Month',
      'analytics.timeRanges.quarter': 'This Quarter',
      'analytics.timeRanges.all': 'All Time',
      'analytics.totalReports': 'Total Reports',
      'analytics.totalPatients': 'Total Patients',
      'analytics.criticalCases': 'Critical Cases',
      'analytics.avgProcessingTime': 'Avg Processing Time',
      'analytics.commonConditions': 'Common Conditions',
      'analytics.monthlyTrend': 'Monthly Trend',
      'analytics.languageUsage': 'Language Usage',
      'analytics.insights': 'Performance Insights',
      'analytics.insights.trend': 'Reports increased by 15% this month',
      'analytics.insights.efficiency': 'Average processing time improved by 20%',
      'analytics.insights.critical': '3 critical cases detected this week',
      
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
    'mr': {
      // Header
      'header.title': 'आशा आरोग्य कार्यकर्ता',
      'header.subtitle': 'आरोग्य सेवेत तुमचा डिजिटल साथीदार',
      
      // Dashboard
      'dashboard.totalReports': 'एकूण अहवाल',
      'dashboard.totalPatients': 'एकूण रुग्ण',
      'dashboard.quickActions': 'त्वरित कृती',
      'dashboard.newReport': 'नवीन अहवाल',
      'dashboard.viewPatients': 'रुग्ण पहा',
      'dashboard.viewReports': 'अहवाल पहा',
      
      // Navigation
      'nav.home': 'मुख्यपृष्ठ',
      'nav.camera': 'कॅमेरा',
      'nav.report': 'अहवाल',
      'nav.patients': 'रुग्ण',
      
      // Camera
      'camera.title': 'वैद्यकीय अहवाल कॅप्चर',
      'camera.open': 'कॅमेरा उघडा',
      'camera.noCamera': 'कॅमेरा सापडला नाही',
      'camera.upload': 'प्रतिमा अपलोड करा',
      'camera.capture': 'प्रतिमा कॅप्चर करा',
      
      // Preview
      'preview.title': 'प्रतिमा पूर्वावलोकन',
      'preview.retake': 'पुन्हा घ्या',
      'preview.process': 'प्रतिमा प्रक्रिया करा',
      
      // Text Extraction
      'extraction.title': 'काढलेला मजकूर',
      'extraction.loading': 'प्रतिमा प्रक्रिया होत आहे, कृपया प्रतीक्षा करा...',
      'extraction.error': 'मजकूर काढण्यात त्रुटी',
      'extraction.copy': 'मजकूर कॉपी करा',
      
      // Summary
      'summary.title': 'वैद्यकीय सारांश',
      'summary.interpretation': 'वैद्यकीय व्याख्या',
      'summary.actions': 'शिफारस केलेल्या कृती',
      'summary.loading': 'वैद्यकीय अहवाल विश्लेषण होत आहे, कृपया प्रतीक्षा करा...',
      'summary.error': 'सारांश तयार करण्यात त्रुटी',
      'summary.voice': 'सारांश ऐका',
      
      // Patient
      'patient.title': 'रुग्णाची माहिती',
      'patient.name': 'रुग्णाचे नाव',
      'patient.age': 'वय',
      'patient.gender': 'लिंग',
      'patient.location': 'गाव/स्थान',
      'patient.notes': 'अतिरिक्त नोट्स',
      'patient.save': 'रुग्णाची माहिती जतन करा',
      
      // Gender
      'gender.select': 'लिंग निवडा',
      'gender.male': 'पुरुष',
      'gender.female': 'स्त्री',
      'gender.other': 'इतर',
      
      // Report
      'report.generate': 'अहवाल तयार करा',
      'report.download': 'अहवाल डाउनलोड करा',
      
      // Status
      'offline.message': 'तुम्ही सध्या ऑफलाइन आहात. काही सुविधा मर्यादित असू शकतात.',
      'update.available': 'अपडेट उपलब्ध आहे',
      'update.refresh': 'रिफ्रेश करा',
      
      // Empty states
      'empty.noReports': 'अद्याप कोणतेही अहवाल नाहीत',
      'empty.noPatients': 'अद्याप कोणतेही रुग्ण नाहीत',
      'empty.startCapture': 'वैद्यकीय अहवाल कॅप्चर करून सुरुवात करा',
      'empty.addPatient': 'तुमचा पहिला रुग्ण जोडा',
    },
    'ml': {
      // Header
      'header.title': 'ആശാ ആരോഗ്യ പ്രവർത്തക',
      'header.subtitle': 'ആരോഗ്യ സേവയിൽ നിങ്ങളുടെ ഡിജിറ്റൽ കൂട്ടാളി',
      
      // Dashboard
      'dashboard.totalReports': 'ആകെ റിപ്പോർട്ടുകൾ',
      'dashboard.totalPatients': 'ആകെ രോഗികൾ',
      'dashboard.quickActions': 'വേഗ പ്രവർത്തനങ്ങൾ',
      'dashboard.newReport': 'പുതിയ റിപ്പോർട്ട്',
      'dashboard.viewPatients': 'രോഗികളെ കാണുക',
      'dashboard.viewReports': 'റിപ്പോർട്ടുകൾ കാണുക',
      
      // Navigation
      'nav.home': 'ഹോം',
      'nav.camera': 'ക്യാമറ',
      'nav.report': 'റിപ്പോർട്ട്',
      'nav.patients': 'രോഗികൾ',
      
      // Camera
      'camera.title': 'മെഡിക്കൽ റിപ്പോർട്ട് കാപ്ചർ',
      'camera.open': 'ക്യാമറ തുറക്കുക',
      'camera.noCamera': 'ക്യാമറ കണ്ടെത്തിയില്ല',
      'camera.upload': 'ചിത്രം അപ്‌ലോഡ് ചെയ്യുക',
      'camera.capture': 'ചിത്രം എടുക്കുക',
      
      // Preview
      'preview.title': 'ചിത്ര പ്രിവ്യൂ',
      'preview.retake': 'വീണ്ടും എടുക്കുക',
      'preview.process': 'ചിത്രം പ്രോസസ് ചെയ്യുക',
      
      // Text Extraction
      'extraction.title': 'വേർതിരിച്ച ടെക്സ്റ്റ്',
      'extraction.loading': 'ചിത്രം പ്രോസസ് ചെയ്യുന്നു, ദയവായ കാത്തിരിക്കുക...',
      'extraction.error': 'ടെക്സ്റ്റ് വേർതിരിക്കുന്നതിൽ പിശക്',
      'extraction.copy': 'ടെക്സ്റ്റ് കോപ്പി ചെയ്യുക',
      
      // Summary
      'summary.title': 'മെഡിക്കൽ സംഗ്രഹം',
      'summary.interpretation': 'മെഡിക്കൽ വ്യാഖ്യാനം',
      'summary.actions': 'ശുപാർശ ചെയ്ത പ്രവർത്തനങ്ങൾ',
      'summary.loading': 'മെഡിക്കൽ റിപ്പോർട്ട് വിശകലനം ചെയ്യുന്നു, ദയവായ കാത്തിരിക്കുക...',
      'summary.error': 'സംഗ്രഹം ഉണ്ടാക്കുന്നതിൽ പിശക്',
      'summary.voice': 'സംഗ്രഹം കേൾക്കുക',
      
      // Patient
      'patient.title': 'രോഗിയുടെ വിവരങ്ങൾ',
      'patient.name': 'രോഗിയുടെ പേര്',
      'patient.age': 'വയസ്സ്',
      'patient.gender': 'ലിംഗഭേദം',
      'patient.location': 'ഗ്രാമം/സ്ഥലം',
      'patient.notes': 'കൂടുതൽ കുറിപ്പുകൾ',
      'patient.save': 'രോഗിയുടെ വിവരങ്ങൾ സേവ് ചെയ്യുക',
      
      // Gender
      'gender.select': 'ലിംഗഭേദം തിരഞ്ഞെടുക്കുക',
      'gender.male': 'പുരുഷൻ',
      'gender.female': 'സ്ത്രീ',
      'gender.other': 'മറ്റുള്ളവർ',
      
      // Report
      'report.generate': 'റിപ്പോർട്ട് ഉണ്ടാക്കുക',
      'report.download': 'റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്യുക',
      
      // Status
      'offline.message': 'നിങ്ങൾ ഇപ്പോൾ ഓഫ്‌ലൈനിലാണ്. ചില സവിശേഷതകൾ പരിമിതമായിരിക്കാം.',
      'update.available': 'അപ്‌ഡേറ്റ് ലഭ്യമാണ്',
      'update.refresh': 'റിഫ്രഷ് ചെയ്യുക',
      
      // Empty states
      'empty.noReports': 'ഇതുവരെ റിപ്പോർട്ടുകളില്ല',
      'empty.noPatients': 'ഇതുവരെ രോഗികളില്ല',
      'empty.startCapture': 'മെഡിക്കൽ റിപ്പോർട്ട് കാപ്ചർ ചെയ്ത് ആരംഭിക്കുക',
      'empty.addPatient': 'നിങ്ങളുടെ ആദ്യ രോഗിയെ ചേർക്കുക',
    },
    'ta': {
      // Header
      'header.title': 'ஆசா சுகாதார பணியாளர்',
      'header.subtitle': 'சுகாதார சேவையில் உங்கள் டிஜிட்டல் துணை',
      
      // Dashboard
      'dashboard.totalReports': 'மொத்த அறிக்கைகள்',
      'dashboard.totalPatients': 'மொத்த நோயாளிகள்',
      'dashboard.quickActions': 'விரைவு செயல்கள்',
      'dashboard.newReport': 'புதிய அறிக்கை',
      'dashboard.viewPatients': 'நோயாளிகளைக் காண்க',
      'dashboard.viewReports': 'அறிக்கைகளைக் காண்க',
      
      // Navigation
      'nav.home': 'முகப்பு',
      'nav.camera': 'கேமரா',
      'nav.report': 'அறிக்கை',
      'nav.patients': 'நோயாளிகள்',
      
      // Camera
      'camera.title': 'மருத்துவ அறிக்கை பிடிப்பு',
      'camera.open': 'கேமராவைத் திறக்கவும்',
      'camera.noCamera': 'கேமரா கண்டுபிடிக்கப்படவில்லை',
      'camera.upload': 'படத்தைப் பதிவேற்றவும்',
      'camera.capture': 'படத்தைப் பிடிக்கவும்',
      
      // Preview
      'preview.title': 'பட முன்னோட்டம்',
      'preview.retake': 'மீண்டும் எடுக்கவும்',
      'preview.process': 'படத்தைச் செயலாக்கவும்',
      
      // Text Extraction
      'extraction.title': 'பிரித்தெடுக்கப்பட்ட உரை',
      'extraction.loading': 'படம் செயலாக்கப்படுகிறது, தயவுசெய்து காத்திருக்கவும்...',
      'extraction.error': 'உரையைப் பிரித்தெடுப்பதில் பிழை',
      'extraction.copy': 'உரையை நகலெடுக்கவும்',
      
      // Summary
      'summary.title': 'மருத்துவ சுருக்கம்',
      'summary.interpretation': 'மருத்துவ விளக்கம்',
      'summary.actions': 'பரிந்துரைக்கப்பட்ட செயல்கள்',
      'summary.loading': 'மருத்துவ அறிக்கை பகுப்பாய்வு செய்யப்படுகிறது, தயவுசெய்து காத்திருக்கவும்...',
      'summary.error': 'சுருக்கத்தை உருவாக்குவதில் பிழை',
      'summary.voice': 'சுருக்கத்தைக் கேள்விப்படவும்',
      
      // Patient
      'patient.title': 'நோயாளி தகவல்',
      'patient.name': 'நோயாளி பெயர்',
      'patient.age': 'வயது',
      'patient.gender': 'பாலினம்',
      'patient.location': 'கிராமம்/இடம்',
      'patient.notes': 'கூடுதல் குறிப்புகள்',
      'patient.save': 'நோயாளி தகவலைச் சேமிக்கவும்',
      
      // Gender
      'gender.select': 'பாலினத்தைத் தேர்ந்தெடுக்கவும்',
      'gender.male': 'ஆண்',
      'gender.female': 'பெண்',
      'gender.other': 'மற்றவர்கள்',
      
      // Report
      'report.generate': 'அறிக்கையை உருவாக்கவும்',
      'report.download': 'அறிக்கையைப் பதிவிறக்கவும்',
      
      // Status
      'offline.message': 'நீங்கள் தற்போது ஆஃப்லைனில் உள்ளீர்கள். சில அம்சங்கள் கட்டுப்படுத்தப்பட்டிருக்கலாம்.',
      'update.available': 'புதுப்பிப்பு கிடைக்கிறது',
      'update.refresh': 'புதுப்பிக்கவும்',
      
      // Empty states
      'empty.noReports': 'இதுவரை அறிக்கைகள் இல்லை',
      'empty.noPatients': 'இதுவரை நோயாளிகள் இல்லை',
      'empty.startCapture': 'మెడికల్ రిపోర్ట్ క్యాప్చర్ చేసి ప్రారంభించండి',
      'empty.addPatient': 'మీ మొదటి రోగిని జోడించండి',
    },
    'te': {
      // Header
      'header.title': 'ఆశా ఆరోగ్య కార్యకర్త',
      'header.subtitle': 'ఆరోగ్య సేవలో మీ డిజిటల్ భాగస్వామి',
      
      // Dashboard
      'dashboard.totalReports': 'మొత్తం నివేదికలు',
      'dashboard.totalPatients': 'మొత్తం రోగులు',
      'dashboard.quickActions': 'త్వరిత చర్యలు',
      'dashboard.newReport': 'కొత్త నివేదిక',
      'dashboard.viewPatients': 'రోగులను చూడండి',
      'dashboard.viewReports': 'నివేదికలను చూడండి',
      
      // Navigation
      'nav.home': 'హోమ్',
      'nav.camera': 'కెమెరా',
      'nav.report': 'నివేదిక',
      'nav.patients': 'రోగులు',
      
      // Camera
      'camera.title': 'మెడికల్ రిపోర్ట్ క్యాప్చర్',
      'camera.open': 'కెమెరాను తెరవండి',
      'camera.noCamera': 'కెమెరా కనుగొనబడలేదు',
      'camera.upload': 'చిత్రాన్ని అప్‌లోడ్ చేయండి',
      'camera.capture': 'చిత్రాన్ని క్యాప్చర్ చేయండి',
      
      // Preview
      'preview.title': 'చిత్ర మునుజూపు',
      'preview.retake': 'మళ్లీ తీయండి',
      'preview.process': 'చిత్రాన్ని ప్రాసెస్ చేయండి',
      
      // Text Extraction
      'extraction.title': 'వేరుచేసిన టెక్స్ట్',
      'extraction.loading': 'చిత్రం ప్రాసెస్ అవుతోంది, దయచేసి వేచి ఉండండి...',
      'extraction.error': 'టెక్స్ట్ వేరుచేయడంలో లోపం',
      'extraction.copy': 'టెక్స్ట్ కాపీ చేయండి',
      
      // Summary
      'summary.title': 'మెడికల్ సారాంశం',
      'summary.interpretation': 'మెడికల్ వివరణ',
      'summary.actions': 'సిఫార్సు చేసిన చర్యలు',
      'summary.loading': 'మెడికల్ రిపోర్ట్ విశ్లేషించబడుతోంది, దయచేసి వేచి ఉండండి...',
      'summary.error': 'సారాంశం సృష్టించడంలో లోపం',
      'summary.voice': 'సారాంశాన్ని వినండి',
      
      // Patient
      'patient.title': 'రోగి సమాచారం',
      'patient.name': 'రోగి పేరు',
      'patient.age': 'వయస్సు',
      'patient.gender': 'లింగం',
      'patient.location': 'గ్రామం/స్థానం',
      'patient.notes': 'అదనపు గమనికలు',
      'patient.save': 'రోగి సమాచారాన్ని సేవ్ చేయండి',
      
      // Gender
      'gender.select': 'లింగాన్ని ఎంచుకోండి',
      'gender.male': 'పురుషుడు',
      'gender.female': 'స్త్రీ',
      'gender.other': 'ఇతరులు',
      
      // Report
      'report.generate': 'నివేదికను సృష్టించండి',
      'report.download': 'నివేదికను డౌన్‌లోడ్ చేయండి',
      
      // Status
      'offline.message': 'మీరు ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉన్నారు. కొన్ని లక్షణాలు పరిమితం కావచ్చు.',
      'update.available': 'నవీకరణ అందుబాటులో ఉంది',
      'update.refresh': 'రిఫ్రెష్ చేయండి',
      
      // Empty states
      'empty.noReports': 'ఇంకా నివేదికలు లేవు',
      'empty.noPatients': 'ఇంకా రోగులు లేరు',
      'empty.startCapture': 'మెడికల్ రిపోర్ట్ క్యాప్చర్ చేసి ప్రారంభించండి',
      'empty.addPatient': 'మీ మొదటి రోగిని జోడించండి',
    },
    'kn': {
      // Header
      'header.title': 'ಆಶಾ ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತ',
      'header.subtitle': 'ಆರೋಗ್ಯ ಸೇವೆಯಲ್ಲಿ ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಸಂಗಾತಿ',
      
      // Dashboard
      'dashboard.totalReports': 'ಒಟ್ಟು ವರದಿಗಳು',
      'dashboard.totalPatients': 'ಒಟ್ಟು ರೋಗಿಗಳು',
      'dashboard.quickActions': 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',
      'dashboard.newReport': 'ಹೊಸ ವರದಿ',
      'dashboard.viewPatients': 'ರೋಗಿಗಳನ್ನು ನೋಡಿ',
      'dashboard.viewReports': 'ವರದಿಗಳನ್ನು ನೋಡಿ',
      
      // Navigation
      'nav.home': 'ಮುಖಪುಟ',
      'nav.camera': 'ಕ್ಯಾಮೆರಾ',
      'nav.report': 'ವರದಿ',
      'nav.patients': 'ರೋಗಿಗಳು',
      
      // Camera
      'camera.title': 'ವೈದ್ಯಕೀಯ ವರದಿ ಕ್ಯಾಪ್ಚರ್',
      'camera.open': 'ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ',
      'camera.noCamera': 'ಕ್ಯಾಮೆರಾ ಕಂಡುಬಂದಿಲ್ಲ',
      'camera.upload': 'ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      'camera.capture': 'ಚಿತ್ರವನ್ನು ಕ್ಯಾಪ್ಚರ್ ಮಾಡಿ',
      
      // Preview
      'preview.title': 'ಚಿತ್ರ ಮುನ್ನೋಟ',
      'preview.retake': 'ಮತ್ತೆ ತೆಗೆದುಕೊಳ್ಳಿ',
      'preview.process': 'ಚಿತ್ರವನ್ನು ಪ್ರಕ್ರಿಯೆ ಮಾಡಿ',
      
      // Text Extraction
      'extraction.title': 'ಹೊರತೆಗೆದ ಪಠ್ಯ',
      'extraction.loading': 'ಚಿತ್ರವನ್ನು ಪ್ರಕ್ರಿಯೆ ಮಾಡಲಾಗುತ್ತಿದೆ, ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...',
      'extraction.error': 'ಪಠ್ಯವನ್ನು ಹೊರತೆಗೆಯುವಲ್ಲಿ ದೋಷ',
      'extraction.copy': 'ಪಠ್ಯವನ್ನು ನಕಲಿಸಿ',
      
      // Summary
      'summary.title': 'ವೈದ್ಯಕೀಯ ಸಾರಾಂಶ',
      'summary.interpretation': 'ವೈದ್ಯಕೀಯ ವ್ಯಾಖ್ಯಾನ',
      'summary.actions': 'ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಿಯೆಗಳು',
      'summary.loading': 'ವೈದ್ಯಕೀಯ ವರದಿಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ, ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...',
      'summary.error': 'ಸಾರಾಂಶವನ್ನು ರಚಿಸುವಲ್ಲಿ ದೋಷ',
      'summary.voice': 'ಸಾರಾಂಶವನ್ನು ಕೇಳಿ',
      
      // Patient
      'patient.title': 'ರೋಗಿಯ ಮಾಹಿತಿ',
      'patient.name': 'ರೋಗಿಯ ಹೆಸರು',
      'patient.age': 'ವಯಸ್ಸು',
      'patient.gender': 'ಲಿಂಗ',
      'patient.location': 'ಗ್ರಾಮ/ಸ್ಥಳ',
      'patient.notes': 'ಹೆಚ್ಚುವರಿ ಟಿಪ್ಪಣಿಗಳು',
      'patient.save': 'ರೋಗಿಯ ಮಾಹಿತಿಯನ್ನು ಉಳಿಸಿ',
      
      // Gender
      'gender.select': 'ಲಿಂಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      'gender.male': 'ಪುರುಷ',
      'gender.female': 'ಮಹಿಳೆ',
      'gender.other': 'ಇತರರು',
      
      // Report
      'report.generate': 'ವರದಿಯನ್ನು ರಚಿಸಿ',
      'report.download': 'ವರದಿಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
      
      // Status
      'offline.message': 'ನೀವು ಪ್ರಸ್ತುತ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದೀರಿ. ಕೆಲವು ವೈಶಿಷ್ಟ್ಯಗಳು ಸೀಮಿತವಾಗಿರಬಹುದು.',
      'update.available': 'ನವೀಕರಣ ಲಭ್ಯವಿದೆ',
      'update.refresh': 'ರಿಫ್ರೆಶ್ ಮಾಡಿ',
      
      // Empty states
      'empty.noReports': 'ಇನ್ನೂ ವರದಿಗಳಿಲ್ಲ',
      'empty.noPatients': 'ಇನ್ನೂ ರೋಗಿಗಳಿಲ್ಲ',
      'empty.startCapture': 'ವೈದ್ಯಕೀಯ ವರದಿಯನ್ನು ಕ್ಯಾಪ್ಚರ್ ಮಾಡಿ ಪ್ರಾರಂಭಿಸಿ',
      'empty.addPatient': 'ನಿಮ್ಮ ಮೊದಲ ರೋಗಿಯನ್ನು ಸೇರಿಸಿ',
    },
    'bn': {
      // Header
      'header.title': 'আশা স্বাস্থ্য কর্মী',
      'header.subtitle': 'স্বাস্থ্য সেবায় আপনার ডিজিটাল সঙ্গী',
      
      // Dashboard
      'dashboard.totalReports': 'মোট রিপোর্ট',
      'dashboard.totalPatients': 'মোট রোগী',
      'dashboard.quickActions': 'দ্রুত কাজ',
      'dashboard.newReport': 'নতুন রিপোর্ট',
      'dashboard.viewPatients': 'রোগীদের দেখুন',
      'dashboard.viewReports': 'রিপোর্ট দেখুন',
      
      // Navigation
      'nav.home': 'হোম',
      'nav.camera': 'ক্যামেরা',
      'nav.report': 'রিপোর্ট',
      'nav.patients': 'রোগী',
      
      // Camera
      'camera.title': 'মেডিকেল রিপোর্ট ক্যাপচার',
      'camera.open': 'ক্যামেরা খুলুন',
      'camera.noCamera': 'ক্যামেরা পাওয়া যায়নি',
      'camera.upload': 'ছবি আপলোড করুন',
      'camera.capture': 'ছবি তুলুন',
      
      // Preview
      'preview.title': 'ছবির প্রিভিউ',
      'preview.retake': 'আবার তুলুন',
      'preview.process': 'ছবি প্রক্রিয়া করুন',
      
      // Text Extraction
      'extraction.title': 'নিষ্কাশিত পাঠ্য',
      'extraction.loading': 'ছবি প্রক্রিয়া হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...',
      'extraction.error': 'পাঠ্য নিষ্কাশনে ত্রুটি',
      'extraction.copy': 'পাঠ্য কপি করুন',
      
      // Summary
      'summary.title': 'মেডিকেল সারসংক্ষেপ',
      'summary.interpretation': 'মেডিকেল ব্যাখ্যা',
      'summary.actions': 'সুপারিশকৃত কাজ',
      'summary.loading': 'মেডিকেল রিপোর্ট বিশ্লেষণ হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...',
      'summary.error': 'সারসংক্ষেপ তৈরি করতে ত্রুটি',
      'summary.voice': 'সারসংক্ষেপ শুনুন',
      
      // Patient
      'patient.title': 'রোগীর তথ্য',
      'patient.name': 'রোগীর নাম',
      'patient.age': 'বয়স',
      'patient.gender': 'লিঙ্গ',
      'patient.location': 'গ্রাম/স্থান',
      'patient.notes': 'অতিরিক্ত নোট',
      'patient.save': 'রোগীর তথ্য সংরক্ষণ করুন',
      
      // Gender
      'gender.select': 'লিঙ্গ নির্বাচন করুন',
      'gender.male': 'পুরুষ',
      'gender.female': 'মহিলা',
      'gender.other': 'অন্যান্য',
      
      // Report
      'report.generate': 'রিপোর্ট তৈরি করুন',
      'report.download': 'রিপোর্ট ডাউনলোড করুন',
      
      // Status
      'offline.message': 'আপনি বর্তমানে অফলাইনে আছেন। কিছু বৈশিষ্ট্য সীমিত হতে পারে।',
      'update.available': 'আপডেট উপলব্ধ',
      'update.refresh': 'রিফ্রেশ করুন',
      
      // Empty states
      'empty.noReports': 'এখনও কোন রিপোর্ট নেই',
      'empty.noPatients': 'এখনও কোন রোগী নেই',
      'empty.startCapture': 'মেডিকেল রিপোর্ট ক্যাপচার করে শুরু করুন',
      'empty.addPatient': 'আপনার প্রথম রোগী যোগ করুন',
    },
    'gu': {
      // Header
      'header.title': 'આશા સ્વાસ્થ્ય કાર્યકર્તા',
      'header.subtitle': 'સ્વાસ્થ્ય સેવામાં તમારો ડિજિટલ સાથી',
      
      // Dashboard
      'dashboard.totalReports': 'કુલ રિપોર્ટ્સ',
      'dashboard.totalPatients': 'કુલ દર્દી',
      'dashboard.quickActions': 'ઝડપી ક્રિયાઓ',
      'dashboard.newReport': 'નવી રિપોર્ટ',
      'dashboard.viewPatients': 'દર્દીઓ જુઓ',
      'dashboard.viewReports': 'રિપોર્ટ્સ જુઓ',
      
      // Navigation
      'nav.home': 'હોમ',
      'nav.camera': 'કેમેરા',
      'nav.report': 'રિપોર્ટ',
      'nav.patients': 'દર્દી',
      
      // Camera
      'camera.title': 'મેડિકલ રિપોર્ટ કેપ્ચર',
      'camera.open': 'કેમેરા ખોલો',
      'camera.noCamera': 'કેમેરા મળ્યો નથી',
      'camera.upload': 'ચિત્ર અપલોડ કરો',
      'camera.capture': 'ચિત્ર કેપ્ચર કરો',
      
      // Preview
      'preview.title': 'ચિત્ર પૂર્વાવલોકન',
      'preview.retake': 'ફરીથી લો',
      'preview.process': 'ચિત્ર પ્રક્રિયા કરો',
      
      // Text Extraction
      'extraction.title': 'કાઢેલો ટેક્સ્ટ',
      'extraction.loading': 'ચિત્ર પ્રક્રિયા થઈ રહ્યું છે, કૃપા કરી રાહ જુઓ...',
      'extraction.error': 'ટેક્સ્ટ કાઢવામાં ભૂલ',
      'extraction.copy': 'ટેક્સ્ટ કોપી કરો',
      
      // Summary
      'summary.title': 'મેડિકલ સારાંશ',
      'summary.interpretation': 'મેડિકલ વ્યાખ્યા',
      'summary.actions': 'ભલામણ કરેલી ક્રિયાઓ',
      'summary.loading': 'મેડિકલ રિપોર્ટ વિશ્લેષણ થઈ રહ્યું છે, કૃપા કરી રાહ જુઓ...',
      'summary.error': 'સારાંશ બનાવવામાં ભૂલ',
      'summary.voice': 'સારાંશ સાંભળો',
      
      // Patient
      'patient.title': 'દર્દીની માહિતી',
      'patient.name': 'દર્દીનું નામ',
      'patient.age': 'ઉંમર',
      'patient.gender': 'લિંગ',
      'patient.location': 'ગામ/સ્થાન',
      'patient.notes': 'વધારાની નોંધો',
      'patient.save': 'દર્દીની માહિતી સેવ કરો',
      
      // Gender
      'gender.select': 'લિંગ પસંદ કરો',
      'gender.male': 'પુરુષ',
      'gender.female': 'સ્ત્રી',
      'gender.other': 'અન્ય',
      
      // Report
      'report.generate': 'રિપોર્ટ બનાવો',
      'report.download': 'રિપોર્ટ ડાઉનલોડ કરો',
      
      // Status
      'offline.message': 'તમે હાલમાં ઓફલાઇન છો. કેટલીક સુવિધાઓ મર્યાદિત હોઈ શકે છે.',
      'update.available': 'અપડેટ ઉપલબ્ધ છે',
      'update.refresh': 'રિફ્રેશ કરો',
      
      // Empty states
      'empty.noReports': 'હજુ કોઈ રિપોર્ટ્સ નથી',
      'empty.noPatients': 'હજુ કોઈ દર્દી નથી',
      'empty.startCapture': 'મેડિકલ રિપોર્ટ કેપ્ચર કરી શરૂ કરો',
      'empty.addPatient': 'તમારો પહેલો દર્દી ઉમેરો',
    },
    'pa': {
      // Header
      'header.title': 'ਆਸ਼ਾ ਸਿਹਤ ਕਰਮਚਾਰੀ',
      'header.subtitle': 'ਸਿਹਤ ਸੇਵਾ ਵਿੱਚ ਤੁਹਾਡਾ ਡਿਜੀਟਲ ਸਾਥੀ',
      
      // Dashboard
      'dashboard.totalReports': 'ਕੁੱਲ ਰਿਪੋਰਟਾਂ',
      'dashboard.totalPatients': 'ਕੁੱਲ ਮਰੀਜ਼',
      'dashboard.quickActions': 'ਤੇਜ਼ ਕਾਰਵਾਈਆਂ',
      'dashboard.newReport': 'ਨਵੀਂ ਰਿਪੋਰਟ',
      'dashboard.viewPatients': 'ਮਰੀਜ਼ਾਂ ਨੂੰ ਦੇਖੋ',
      'dashboard.viewReports': 'ਰਿਪੋਰਟਾਂ ਨੂੰ ਦੇਖੋ',
      
      // Navigation
      'nav.home': 'ਹੋਮ',
      'nav.camera': 'ਕੈਮਰਾ',
      'nav.report': 'ਰਿਪੋਰਟ',
      'nav.patients': 'ਮਰੀਜ਼',
      
      // Camera
      'camera.title': 'ਮੈਡੀਕਲ ਰਿਪੋਰਟ ਕੈਪਚਰ',
      'camera.open': 'ਕੈਮਰਾ ਖੋਲ੍ਹੋ',
      'camera.noCamera': 'ਕੈਮਰਾ ਨਹੀਂ ਮਿਲਿਆ',
      'camera.upload': 'ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ',
      'camera.capture': 'ਤਸਵੀਰ ਕੈਪਚਰ ਕਰੋ',
      
      // Preview
      'preview.title': 'ਤਸਵੀਰ ਪੂਰਵਾਵਲੋਕਨ',
      'preview.retake': 'ਦੁਬਾਰਾ ਲਓ',
      'preview.process': 'ਤਸਵੀਰ ਪ੍ਰਕਿਰਿਆ ਕਰੋ',
      
      // Text Extraction
      'extraction.title': 'ਕੱਢਿਆ ਗਿਆ ਟੈਕਸਟ',
      'extraction.loading': 'ਤਸਵੀਰ ਪ੍ਰਕਿਰਿਆ ਹੋ ਰਹੀ ਹੈ, ਕਿਰਪਾ ਉਡੀਕ ਕਰੋ...',
      'extraction.error': 'ਟੈਕਸਟ ਕੱਢਣ ਵਿੱਚ ਗਲਤੀ',
      'extraction.copy': 'ਟੈਕਸਟ ਕਾਪੀ ਕਰੋ',
      
      // Summary
      'summary.title': 'ਮੈਡੀਕਲ ਸਾਰਾਂਸ਼',
      'summary.interpretation': 'ਮੈਡੀਕਲ ਵਿਆਖਿਆ',
      'summary.actions': 'ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਕਾਰਵਾਈਆਂ',
      'summary.loading': 'ਮੈਡੀਕਲ ਰਿਪੋਰਟ ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ, ਕਿਰਪਾ ਉਡੀਕ ਕਰੋ...',
      'summary.error': 'ਸਾਰਾਂਸ਼ ਬਣਾਉਣ ਵਿੱਚ ਗਲਤੀ',
      'summary.voice': 'ਸਾਰਾਂਸ਼ ਸੁਣੋ',
      
      // Patient
      'patient.title': 'ਮਰੀਜ਼ ਦੀ ਜਾਣਕਾਰੀ',
      'patient.name': 'ਮਰੀਜ਼ ਦਾ ਨਾਮ',
      'patient.age': 'ਉਮਰ',
      'patient.gender': 'ਲਿੰਗ',
      'patient.location': 'ਪਿੰਡ/ਸਥਾਨ',
      'patient.notes': 'ਵਾਧੂ ਨੋਟਸ',
      'patient.save': 'ਮਰੀਜ਼ ਦੀ ਜਾਣਕਾਰੀ ਸੇਵ ਕਰੋ',
      
      // Gender
      'gender.select': 'ਲਿੰਗ ਚੁਣੋ',
      'gender.male': 'ਮਰਦ',
      'gender.female': 'ਔਰਤ',
      'gender.other': 'ਹੋਰ',
      
      // Report
      'report.generate': 'ਰਿਪੋਰਟ ਬਣਾਓ',
      'report.download': 'ਰਿਪੋਰਟ ਡਾਊਨਲੋਡ ਕਰੋ',
      
      // Status
      'offline.message': 'ਤੁਸੀਂ ਹੁਣ ਆਫਲਾਈਨ ਹੋ। ਕੁਝ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਸੀਮਿਤ ਹੋ ਸਕਦੀਆਂ ਹਨ।',
      'update.available': 'ਅਪਡੇਟ ਉਪਲਬਧ ਹੈ',
      'update.refresh': 'ਰਿਫਰੈਸ਼ ਕਰੋ',
      
      // Empty states
      'empty.noReports': 'ਹਾਲੇ ਕੋਈ ਰਿਪੋਰਟਾਂ ਨਹੀਂ',
      'empty.noPatients': 'ਹਾਲੇ ਕੋਈ ਮਰੀਜ਼ ਨਹੀਂ',
      'empty.startCapture': 'ਮੈਡੀਕਲ ਰਿਪੋਰਟ ਕੈਪਚਰ ਕਰਕੇ ਸ਼ੁਰੂ ਕਰੋ',
      'empty.addPatient': 'ਆਪਣਾ ਪਹਿਲਾ ਮਰੀਜ਼ ਜੋੜੋ',
    },
  }

  // Get the translations for the current language, or fall back to English
  const currentTranslations = translations[language] || translations['en']
  
  // Return the translated text or the key itself if no translation is found
  return currentTranslations[key] || key
}