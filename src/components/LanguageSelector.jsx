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

  // Get current language display name
  const getCurrentLanguageName = () => {
    const language = languages.find(lang => lang.code === currentLanguage)
    if (!language) return 'English'
    
    const languageNames = {
      'en': 'English',
      'hi': 'हिंदी'
    }
    
    return languageNames[language.code] || language.name
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center space-x-3 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-800 to-blue-900 hover:from-indigo-900 hover:to-blue-950 transition-all duration-300 shadow-lg border-2 border-white/20 backdrop-blur-sm transform hover:scale-105 active:scale-95"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Language Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        
        {/* Language Text */}
        <span className="text-lg font-bold text-white">{getCurrentLanguageName()}</span>
        
        {/* Dropdown Arrow */}
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 text-white ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-gray-900 rounded-xl shadow-2xl z-50 py-3 border border-gray-700 transform transition-all duration-200">
          {/* Header */}
          <div className="px-4 py-2 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Select Language
            </h3>
          </div>
          
          {/* Language Options */}
          {languages.map((language) => {
            const languageNames = {
              'en': 'English',
              'hi': 'हिंदी (Hindi)'
            }
            
            return (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`block w-full text-left px-4 py-3 transition-all duration-200 ${
                  currentLanguage === language.code 
                    ? 'bg-gradient-to-r from-green-900 to-emerald-900 border-l-4 border-green-400' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${currentLanguage === language.code ? 'text-green-400' : 'text-gray-200'}`}>
                    {languageNames[language.code] || language.name}
                  </span>
                  {currentLanguage === language.code && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector