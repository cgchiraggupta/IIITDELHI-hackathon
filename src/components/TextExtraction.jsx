import React, { useState } from 'react'

const TextExtraction = ({ extractedText, isLoading, error }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (isLoading) {
    return (
      <div className="medical-card">
        <h2 className="text-xl font-semibold mb-4 text-primary">Extracting Text</h2>
        <div className="flex flex-col items-center justify-center p-8">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Processing image, please wait...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="medical-card">
        <h2 className="text-xl font-semibold mb-4 text-primary">Text Extraction Error</h2>
        <div className="bg-error/10 text-error p-4 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!extractedText) return null

  return (
    <div className="medical-card">
      <div 
        className="flex justify-between items-center cursor-pointer mb-2 p-2 hover:bg-gray-50 rounded-lg transition-colors" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold text-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          Extracted Text
        </h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">{isExpanded ? 'Hide' : 'Show'}</span>
          <button className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="bg-gray-50 p-4 rounded-lg max-h-80 overflow-y-auto mt-2 border border-gray-100 shadow-inner">
          <pre className="whitespace-pre-wrap text-sm font-mono">{extractedText}</pre>
        </div>
      )}
    </div>
  )
}

export default TextExtraction