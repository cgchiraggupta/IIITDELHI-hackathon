import React from 'react'

const SummarySection = ({ summary, isLoading, error, onPlayVoice }) => {
  if (isLoading) {
    return (
      <div className="medical-card">
        <h2 className="text-xl font-semibold mb-4">Generating Summary</h2>
        <div className="flex flex-col items-center justify-center p-8">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Analyzing medical report, please wait...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="medical-card">
        <h2 className="text-xl font-semibold mb-4">Summary Error</h2>
        <div className="bg-error/10 text-error p-4 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="medical-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-primary">Medical Report Analysis</h2>
        {onPlayVoice && (
          <button 
            onClick={onPlayVoice} 
            className="voice-button"
            aria-label="Play voice summary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
        )}
      </div>

      {summary.interpretation && (
        <div className="mb-6">
          <h3 className="font-semibold text-lg text-primary mb-3">Medical Interpretation</h3>
          <div className="bg-primary/5 p-4 rounded-lg shadow-sm">
            <p className="leading-relaxed">{summary.interpretation}</p>
          </div>
        </div>
      )}

      {summary.actionItems && summary.actionItems.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg text-primary mb-3">Recommended Actions</h3>
          <ul className="bg-primary/5 p-4 rounded-lg shadow-sm">
            {summary.actionItems.map((item, index) => (
              <li key={index} className="mb-3 last:mb-0 flex items-start">
                <div className="bg-primary text-white rounded-full p-1 mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SummarySection