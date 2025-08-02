import { useState, useEffect, useRef } from 'react'
import { translate } from '../utils/languages'

function VoiceCommands({ onCommand, language = 'en' }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US'
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        setTranscript(finalTranscript + interimTranscript)
        
        if (finalTranscript) {
          processCommand(finalTranscript.toLowerCase())
        }
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [language])

  const processCommand = (command) => {
    const commands = {
      'new report': () => onCommand('newReport'),
      'capture image': () => onCommand('captureImage'),
      'take photo': () => onCommand('captureImage'),
      'process report': () => onCommand('processReport'),
      'analyze': () => onCommand('analyze'),
      'go home': () => onCommand('goHome'),
      'show patients': () => onCommand('showPatients'),
      'show reports': () => onCommand('showReports'),
      'emergency': () => onCommand('emergency'),
      'help': () => onCommand('help'),
      'stop listening': () => stopListening(),
      'pause': () => stopListening(),
      'cancel': () => stopListening()
    }

    // Check for exact matches first
    if (commands[command]) {
      commands[command]()
      return
    }

    // Check for partial matches
    for (const [key, action] of Object.entries(commands)) {
      if (command.includes(key)) {
        action()
        return
      }
    }

    // No command found
    console.log('Command not recognized:', command)
  }

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      recognitionRef.current.start()
      setIsListening(true)
      setTranscript('')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <span className="mr-2">⚠️</span>
          <span className="text-yellow-800">
            {translate('voiceCommands.notSupported', language)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          🎤 {translate('voiceCommands.title', language)}
        </h3>
        <button
          onClick={toggleListening}
          className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
            isListening 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isListening ? (
            <>
              <span className="animate-pulse mr-2">🔴</span>
              {translate('voiceCommands.stop', language)}
            </>
          ) : (
            <>
              <span className="mr-2">🎤</span>
              {translate('voiceCommands.start', language)}
            </>
          )}
        </button>
      </div>

      {/* Status */}
      <div className="mb-4">
        <div className={`text-sm font-medium ${
          isListening ? 'text-green-600' : 'text-gray-600'
        }`}>
          {isListening 
            ? translate('voiceCommands.listening', language)
            : translate('voiceCommands.notListening', language)
          }
        </div>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {translate('voiceCommands.transcript', language)}:
          </h4>
          <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-800">
            "{transcript}"
          </div>
        </div>
      )}

      {/* Available Commands */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          {translate('voiceCommands.availableCommands', language)}:
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-blue-50 p-2 rounded">
            <span className="font-medium">"New report"</span>
            <div className="text-blue-600">{translate('voiceCommands.commands.newReport', language)}</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <span className="font-medium">"Capture image"</span>
            <div className="text-green-600">{translate('voiceCommands.commands.captureImage', language)}</div>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <span className="font-medium">"Process report"</span>
            <div className="text-purple-600">{translate('voiceCommands.commands.processReport', language)}</div>
          </div>
          <div className="bg-yellow-50 p-2 rounded">
            <span className="font-medium">"Show patients"</span>
            <div className="text-yellow-600">{translate('voiceCommands.commands.showPatients', language)}</div>
          </div>
          <div className="bg-red-50 p-2 rounded">
            <span className="font-medium">"Emergency"</span>
            <div className="text-red-600">{translate('voiceCommands.commands.emergency', language)}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="font-medium">"Stop listening"</span>
            <div className="text-gray-600">{translate('voiceCommands.commands.stopListening', language)}</div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <div className="text-sm text-blue-800">
          <div className="font-medium mb-1">{translate('voiceCommands.tips.title', language)}:</div>
          <ul className="space-y-1 text-xs">
            <li>• {translate('voiceCommands.tips.speak', language)}</li>
            <li>• {translate('voiceCommands.tips.quiet', language)}</li>
            <li>• {translate('voiceCommands.tips.pause', language)}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default VoiceCommands 