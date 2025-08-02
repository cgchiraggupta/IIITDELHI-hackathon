import { useState, useEffect } from 'react'
import { translate } from '../utils/languages'

function EmergencyAlert({ extractedText, summary, language = 'en' }) {
  const [criticalConditions, setCriticalConditions] = useState([])
  const [isAlertActive, setIsAlertActive] = useState(false)
  const [alertLevel, setAlertLevel] = useState('low')

  // Critical medical keywords to detect
  const criticalKeywords = {
    high: [
      'heart attack', 'cardiac arrest', 'stroke', 'severe bleeding',
      'anaphylaxis', 'severe allergic reaction', 'critical condition',
      'emergency', 'urgent', 'life-threatening', 'severe pain',
      'unconscious', 'coma', 'respiratory failure', 'shock'
    ],
    medium: [
      'high fever', 'dehydration', 'infection', 'inflammation',
      'abnormal', 'elevated', 'increased', 'decreased', 'irregular',
      'swelling', 'pain', 'dizziness', 'nausea', 'vomiting'
    ],
    low: [
      'mild', 'slight', 'minor', 'normal', 'stable', 'improving'
    ]
  }

  useEffect(() => {
    if (extractedText || summary) {
      analyzeForCriticalConditions()
    }
  }, [extractedText, summary])

  const analyzeForCriticalConditions = () => {
    const text = `${extractedText || ''} ${summary?.interpretation || ''}`.toLowerCase()
    const detected = []

    Object.entries(criticalKeywords).forEach(([level, keywords]) => {
      keywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          detected.push({
            keyword,
            level,
            context: extractContext(text, keyword)
          })
        }
      })
    })

    setCriticalConditions(detected)
    
    // Set alert level based on highest severity
    if (detected.some(d => d.level === 'high')) {
      setAlertLevel('high')
      setIsAlertActive(true)
    } else if (detected.some(d => d.level === 'medium')) {
      setAlertLevel('medium')
      setIsAlertActive(true)
    } else if (detected.some(d => d.level === 'low')) {
      setAlertLevel('low')
      setIsAlertActive(false)
    }
  }

  const extractContext = (text, keyword) => {
    const index = text.indexOf(keyword.toLowerCase())
    if (index === -1) return ''
    
    const start = Math.max(0, index - 50)
    const end = Math.min(text.length, index + keyword.length + 50)
    return text.substring(start, end).trim()
  }

  const sendEmergencyAlert = () => {
    const alertData = {
      level: alertLevel,
      conditions: criticalConditions,
      timestamp: new Date().toISOString(),
      patientInfo: 'Patient information available',
      location: 'GPS location would be included'
    }

    // In a real implementation, this would send to emergency services
    console.log('Emergency Alert Sent:', alertData)
    
    // Simulate sending alert
    alert(translate('emergency.alertSent', language))
  }

  const getAlertColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-600'
      case 'medium': return 'bg-yellow-600'
      case 'low': return 'bg-green-600'
      default: return 'bg-gray-600'
    }
  }

  const getAlertIcon = (level) => {
    switch (level) {
      case 'high': return '🚨'
      case 'medium': return '⚠️'
      case 'low': return 'ℹ️'
      default: return '📋'
    }
  }

  if (!isAlertActive && criticalConditions.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-red-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">{getAlertIcon(alertLevel)}</span>
          {translate('emergency.title', language)}
        </h3>
        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getAlertColor(alertLevel)}`}>
          {translate(`emergency.levels.${alertLevel}`, language)}
        </span>
      </div>

      {/* Critical Conditions Detected */}
      {criticalConditions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-700 mb-2">
            {translate('emergency.conditionsDetected', language)}:
          </h4>
          <div className="space-y-2">
            {criticalConditions.map((condition, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-md">
                <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getAlertColor(condition.level)}`}>
                  {translate(`emergency.levels.${condition.level}`, language)}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{condition.keyword}</div>
                  <div className="text-sm text-gray-600">{condition.context}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Actions */}
      <div className="space-y-3">
        {alertLevel === 'high' && (
          <button
            onClick={sendEmergencyAlert}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors duration-200 font-semibold"
          >
            🚨 {translate('emergency.sendAlert', language)}
          </button>
        )}
        
        <div className="text-sm text-gray-600">
          {translate('emergency.recommendation', language)}
        </div>
        
        <div className="flex space-x-2">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
            📞 {translate('emergency.callDoctor', language)}
          </button>
          <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200">
            📋 {translate('emergency.viewDetails', language)}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmergencyAlert 