import React, { useState } from 'react'

const TextExtraction = ({ extractedText, isLoading, error }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (isLoading) {
    return (
      <div className="medical-card">
        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Extracting Text
        </h2>
        <div className="flex flex-col items-center justify-center p-12">
          <div className="spinner-large mb-6"></div>
          <p className="text-xl text-gray-600 text-center">Processing image, please wait...</p>
          <div className="mt-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Extracting...</span>
              <span className="text-sm text-gray-500">Step 1/3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-primary h-3 rounded-full animate-pulse" style={{width: '33%'}}></div>
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
          Text Extraction Error
        </h2>
        <div className="bg-error/10 border border-error/20 text-error p-6 rounded-xl">
          <p className="text-lg">{error}</p>
        </div>
      </div>
    )
  }

  if (!extractedText) return null

  return (
    <div className="medical-card">
      <div 
        className="flex justify-between items-center cursor-pointer mb-4 p-4 hover:bg-gray-50 rounded-xl transition-colors" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-2xl font-bold text-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          Extracted Text
        </h2>
        <div className="flex items-center">
          <span className="text-lg text-gray-500 mr-3 font-medium">{isExpanded ? 'Hide Text' : 'View Text'}</span>
          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
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
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl max-h-96 overflow-y-auto border border-gray-200 shadow-inner">
          <div className="bg-white p-4 rounded-lg border border-gray-100">
            <pre className="whitespace-pre-wrap text-base font-mono text-gray-800 leading-relaxed">{extractedText}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default TextExtraction