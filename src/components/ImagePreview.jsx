import React from 'react'

const ImagePreview = ({ imageData, onRetake, onProcess, isUploaded = false }) => {
  if (!imageData) return null

  return (
    <div className="card max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Medical Report Preview</h2>
      <p className="text-center text-gray-600 mb-8 text-lg">
        Please verify that the medical report is clearly visible and readable before proceeding
      </p>
      
      <div className="mb-8">
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <img 
            src={imageData} 
            alt="Medical report" 
            className="image-preview"
          />
          
          {/* Retake/Change button overlay */}
          <div className="absolute top-4 right-4">
            <button 
              onClick={onRetake} 
              className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors shadow-lg"
              title={isUploaded ? "Change image" : "Retake photo"}
              aria-label={isUploaded ? "Change image" : "Retake photo"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Image status indicator */}
          <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {isUploaded ? "✓ Image Uploaded" : "✓ Image Captured"}
          </div>
        </div>
      </div>
      
      {/* Quality check list */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Quality Check
        </h3>
        <ul className="text-blue-700 space-y-2">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">✓</span>
            All text is clearly visible and readable
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">✓</span>
            No shadows or glare obscuring the text
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">✓</span>
            The entire document is captured within the frame
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">✓</span>
            Image quality is sufficient for OCR processing
          </li>
        </ul>
      </div>
      
      {/* Processing information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          What happens next?
        </h3>
        <div className="text-yellow-700 space-y-2">
          <p className="flex items-start">
            <span className="text-yellow-600 mr-2">1.</span>
            <span>OCR technology will extract text from your medical report</span>
          </p>
          <p className="flex items-start">
            <span className="text-yellow-600 mr-2">2.</span>
            <span>AI will analyze the content and generate a comprehensive summary</span>
          </p>
          <p className="flex items-start">
            <span className="text-yellow-600 mr-2">3.</span>
            <span>You'll receive actionable insights and recommendations</span>
          </p>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={onRetake} 
          className="btn btn-secondary btn-lg flex items-center justify-center text-lg py-4 px-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          {isUploaded ? "Change Image" : "Retake Photo"}
        </button>
        
        <button 
          onClick={onProcess} 
          className="btn btn-primary btn-lg flex items-center justify-center text-lg py-4 px-8 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 relative z-10" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
          <span className="relative z-10">Start Analysis</span>
        </button>
      </div>
    </div>
  )
}

export default ImagePreview