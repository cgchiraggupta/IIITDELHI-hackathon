import React, { useState } from 'react'

const PatientForm = ({ patientInfo, onUpdatePatientInfo }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    onUpdatePatientInfo({
      ...patientInfo,
      [name]: value
    })
  }

  return (
    <div className="medical-card">
      <div 
        className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-800 rounded-xl transition-colors" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-2xl font-bold text-green-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          Patient Information
        </h2>
        <div className="flex items-center">
          <span className="text-lg text-gray-400 mr-3 font-medium">{isExpanded ? 'Hide Details' : 'Add Details'}</span>
          <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <div>
            <label htmlFor="name" className="block text-lg font-semibold text-gray-200 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Patient Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={patientInfo.name || ''}
              onChange={handleChange}
              className="input w-full text-lg py-4 focus:ring-2 focus:ring-green-500/20 transition-shadow"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-lg font-semibold text-gray-200 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Age (Years) *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={patientInfo.age || ''}
              onChange={handleChange}
              className="input w-full text-lg py-4 focus:ring-2 focus:ring-green-500/20 transition-shadow"
              placeholder="Enter age in years"
              min="0"
              max="120"
              required
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-lg font-semibold text-gray-200 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={patientInfo.gender || ''}
              onChange={handleChange}
              className="input w-full text-lg py-4 focus:ring-2 focus:ring-green-500/20 transition-shadow"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-lg font-semibold text-gray-200 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Village/Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={patientInfo.location || ''}
              onChange={handleChange}
              className="input w-full text-lg py-4 focus:ring-2 focus:ring-green-500/20 transition-shadow"
              placeholder="Enter village or area name"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-lg font-semibold text-gray-200 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={patientInfo.notes || ''}
              onChange={handleChange}
              className="input w-full text-lg py-4 focus:ring-2 focus:ring-green-500/20 transition-shadow"
              rows="4"
              placeholder="Any additional information about the patient (optional)"
            ></textarea>
          </div>

          <div className="md:col-span-2 mt-6">
            <button 
              type="button" 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-gray-900 font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center w-full text-lg transform hover:scale-105"
              onClick={() => {
                // Show success message
                const message = document.createElement('div')
                message.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 px-6 py-4 rounded-lg shadow-lg z-50 border border-green-400/50'
                message.textContent = 'Patient information saved successfully!'
                document.body.appendChild(message)
                setTimeout(() => document.body.removeChild(message), 3000)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Save Patient Information
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientForm