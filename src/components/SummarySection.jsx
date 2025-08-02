import React, { useState } from 'react'
import TTSPlayer from './TTSPlayer'
import { sarvamLanguages } from '../utils/sarvamService'

function SummarySection({ summary, onPlayVoice }) {
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN')
  const [showTTSPlayer, setShowTTSPlayer] = useState(false)

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value)
  }

  const handleTTSComplete = (result) => {
    console.log('TTS completed:', result)
  }

  if (!summary || !summary.interpretation) {
    return null
  }

  return (
    <div className="medical-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Medical Report Analysis
        </h2>
        <div className="flex flex-col items-end space-y-2">
          {onPlayVoice && (
            <button 
              onClick={onPlayVoice} 
              className="voice-button"
              aria-label="Play voice summary"
              title="Listen to summary (Basic TTS)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
          )}
          <button
            onClick={() => setShowTTSPlayer(!showTTSPlayer)}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
            title="Advanced TTS with Translation"
          >
            {showTTSPlayer ? 'Hide' : 'Advanced TTS'}
          </button>
        </div>
      </div>

      {summary.interpretation && (
        <div className="space-y-6">
          {/* Language Selection for Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Summary Language Options</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <label htmlFor="summary-language" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Language for Summary:
                </label>
                <select
                  id="summary-language"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sarvamLanguages && sarvamLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-xs text-gray-600">
                <p>• Basic TTS: Uses browser's built-in speech synthesis</p>
                <p>• Advanced TTS: Uses Sarvam AI with translation support</p>
              </div>
            </div>
          </div>

          {/* Advanced TTS Player */}
          {showTTSPlayer && (
            <TTSPlayer
              text={summary.interpretation}
              sourceLanguage="en"
              onTranslationComplete={handleTTSComplete}
            />
          )}

          {/* Summary Content */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Report Interpretation
            </h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {summary.interpretation}
              </p>
            </div>
          </div>

          {/* Action Items */}
          {summary.actionItems && summary.actionItems.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Recommended Actions
              </h3>
              <ul className="space-y-2">
                {summary.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SummarySection