import React from 'react'

const ImagePreview = ({ imageData, onRetake, onProcess }) => {
  if (!imageData) return null

  return (
    <div className="step-container">
      <h2 className="text-2xl font-bold mb-4 text-center">Medical Report Preview</h2>
      <p className="text-center text-gray-600 mb-6">Please verify that the medical report is clearly visible and readable</p>
      
      <div className="mb-6">
        <div className="relative rounded-lg overflow-hidden shadow-md">
          <img 
            src={imageData} 
            alt="Captured medical report" 
            className="image-preview"
          />
          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1">
            <button 
              onClick={onRetake} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Retake photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={onProcess} 
          className="btn btn-primary btn-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
          Analyze Medical Report
        </button>
      </div>
    </div>
  )
}

export default ImagePreview