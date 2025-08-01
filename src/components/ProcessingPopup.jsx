import React from 'react'

const ProcessingPopup = ({ isVisible, currentStep, progress, onClose }) => {
  if (!isVisible) return null

  const steps = [
    {
      id: 'ocr',
      title: 'Extracting Text',
      description: 'Using OCR technology to extract text from your medical report',
      icon: '📄'
    },
    {
      id: 'ai',
      title: 'AI Analysis',
      description: 'Analyzing content and generating comprehensive summary',
      icon: '🤖'
    },
    {
      id: 'summary',
      title: 'Generating Report',
      description: 'Creating detailed analysis with actionable insights',
      icon: '📊'
    }
  ]

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep)
  }

  const getProgressPercentage = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex === -1) return 0
    return ((currentIndex + 1) / steps.length) * 100
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in slide-in-from-bottom-4 duration-300 border border-gray-700">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Processing Your Report</h3>
          <p className="text-gray-300">Please wait while we analyze your medical report...</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Progress</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-6">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep
            const isCompleted = getCurrentStepIndex() > index
            const isPending = getCurrentStepIndex() < index

            return (
              <div 
                key={step.id}
                className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-green-900/30 border border-green-500/50' 
                    : isCompleted 
                    ? 'bg-gray-800 border border-gray-600' 
                    : 'bg-gray-800 border border-gray-700'
                }`}
              >
                {/* Step Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
                  isActive 
                    ? 'bg-green-500 text-gray-900 animate-pulse' 
                    : isCompleted 
                    ? 'bg-green-900 text-green-400' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-lg">{step.icon}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <h4 className={`font-semibold text-sm transition-colors duration-300 ${
                    isActive ? 'text-green-400' : isCompleted ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-xs transition-colors duration-300 ${
                    isActive ? 'text-green-300' : isCompleted ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>

                {/* Status Indicator */}
                {isActive && (
                  <div className="ml-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-teal-300">
              <p className="font-medium mb-1">Processing Time</p>
              <p>This usually takes 10-30 seconds depending on the complexity of your medical report.</p>
            </div>
          </div>
        </div>

        {/* Close Button (only show if processing is complete) */}
        {currentStep === 'completed' && (
          <button 
            onClick={onClose}
            className="w-full btn btn-primary"
          >
            View Results
          </button>
        )}
      </div>
    </div>
  )
}

export default ProcessingPopup 