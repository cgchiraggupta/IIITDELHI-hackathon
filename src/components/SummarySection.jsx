import React from 'react'

const SummarySection = ({ summary, isLoading, error, onPlayVoice }) => {
  if (isLoading) {
    return (
      <div className="medical-card">
        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Generating Summary
        </h2>
        <div className="flex flex-col items-center justify-center p-12">
          <div className="spinner-large mb-6"></div>
          <p className="text-xl text-gray-600 text-center">Analyzing medical report, please wait...</p>
          <div className="mt-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Processing...</span>
              <span className="text-sm text-gray-500">Step 2/3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-primary h-3 rounded-full animate-pulse" style={{width: '66%'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="medical-card">
        <h2 className="text-2xl font-bold mb-6 text-error flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Summary Error
        </h2>
        <div className="bg-error/10 border border-error/20 text-error p-6 rounded-xl">
          <p className="text-lg">{error}</p>
        </div>
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="medical-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Medical Report Analysis
        </h2>
        {onPlayVoice && (
          <button 
            onClick={onPlayVoice} 
            className="voice-button"
            aria-label="Play voice summary"
            title="Listen to summary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
        )}
      </div>

      {summary.interpretation && (
        <div className="mb-8">
          <h3 className="font-bold text-xl text-primary mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Medical Interpretation
          </h3>
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 p-6 rounded-xl shadow-sm">
            <p className="text-lg leading-relaxed text-gray-800">{summary.interpretation}</p>
          </div>
        </div>
      )}

      {summary.actionItems && summary.actionItems.length > 0 && (
        <div>
          <h3 className="font-bold text-xl text-primary mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Recommended Actions
          </h3>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-6 rounded-xl shadow-sm">
            <ul className="space-y-4">
              {summary.actionItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="bg-green-500 text-white rounded-full p-2 mr-4 flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg leading-relaxed text-gray-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default SummarySection