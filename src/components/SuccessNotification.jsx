import React, { useEffect, useState } from 'react'

const SuccessNotification = ({ isVisible, onClose }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 px-6 py-4 rounded-lg shadow-lg max-w-sm border border-green-400/50">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">
              Report Analysis Complete!
            </p>
            <p className="text-xs opacity-90">
              Your medical report has been successfully analyzed.
            </p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={() => {
                setShow(false)
                setTimeout(onClose, 300)
              }}
              className="inline-flex text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessNotification 