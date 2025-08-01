import React, { useState, useRef, useEffect } from 'react'

const LanguageSelector = ({ currentLanguage, onChangeLanguage, languages }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleLanguageSelect = (code) => {
    onChangeLanguage(code)
    setIsOpen(false)
  }

  // Get current language display name and flag
  const getCurrentLanguageInfo = () => {
    const language = languages.find(lang => lang.code === currentLanguage)
    if (!language) return { name: 'English', flag: '🇺🇸', shortName: 'EN' }
    
    const languageInfo = {
      'en': { name: 'English', flag: '🇺🇸', shortName: 'EN' },
      'hi': { name: 'हिंदी (Hindi)', flag: '🇮🇳', shortName: 'हि' }
    }
    
    return languageInfo[language.code] || { name: language.name, flag: '🌐', shortName: language.code.toUpperCase() }
  }

  const currentLang = getCurrentLanguageInfo()

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center space-x-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg border-2 border-white/20 backdrop-blur-sm transform hover:scale-105 active:scale-95"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Language Flag */}
        <div className="text-2xl">{currentLang.flag}</div>
        
        {/* Language Text */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-white/80">Language</span>
          <span className="text-lg font-bold text-white">{currentLang.shortName}</span>
        </div>
        
        {/* Switch Icon */}
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 text-white ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl z-50 py-3 border border-gray-200 transform transition-all duration-200">
          {/* Header */}
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Switch Language
            </h3>
          </div>
          
          {/* Language Options */}
          {languages.map((language) => {
            const langInfo = {
              'en': { flag: '🇺🇸', shortName: 'EN', fullName: 'English' },
              'hi': { flag: '🇮🇳', shortName: 'हि', fullName: 'हिंदी (Hindi)' }
            }[language.code] || { flag: '🌐', shortName: language.code.toUpperCase(), fullName: language.name }
            
            return (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`block w-full text-left px-4 py-3 transition-all duration-200 ${
                  currentLanguage === language.code 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{langInfo.flag}</span>
                    <div className="flex flex-col">
                      <span className={`font-semibold ${currentLanguage === language.code ? 'text-blue-600' : 'text-gray-700'}`}>
                        {langInfo.shortName}
                      </span>
                      <span className={`text-sm ${currentLanguage === language.code ? 'text-blue-500' : 'text-gray-500'}`}>
                        {langInfo.fullName}
                      </span>
                    </div>
                  </div>
                  {currentLanguage === language.code && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
          
          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-100 mt-2">
            <p className="text-xs text-gray-500 text-center">
              Tap to switch between languages
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSelector