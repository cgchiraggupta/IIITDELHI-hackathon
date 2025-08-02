import { useState, useRef } from 'react'
import { sarvamLanguages, convertTextToSpeech, translateAndConvertToSpeech } from '../utils/sarvamService'

// Fallback languages in case import fails
const fallbackLanguages = [
  { code: 'en-IN', name: 'English (India)', speaker: 'anushka' },
  { code: 'hi-IN', name: 'हिंदी (Hindi)', speaker: 'anushka' },
  { code: 'mr-IN', name: 'मराठी (Marathi)', speaker: 'anushka' },
  { code: 'bn-IN', name: 'বাংলা (Bengali)', speaker: 'anushka' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)', speaker: 'anushka' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)', speaker: 'anushka' },
  { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)', speaker: 'anushka' },
  { code: 'ml-IN', name: 'മലയാളം (Malayalam)', speaker: 'anushka' },
  { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)', speaker: 'anushka' },
  { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)', speaker: 'anushka' },
  { code: 'or-IN', name: 'ଓଡ଼ିଆ (Odia)', speaker: 'anushka' },
  { code: 'as-IN', name: 'অসমীয়া (Assamese)', speaker: 'anushka' },
]

// Use fallback if import fails
const languages = sarvamLanguages || fallbackLanguages

function TTSPlayer({ text, sourceLanguage = 'en', onTranslationComplete }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [translatedText, setTranslatedText] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN')
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const handleTranslateAndPlay = async () => {
    if (!text || !text.trim()) {
      setError('No text to translate')
      return
    }

    setIsLoading(true)
    setError(null)
    setTranslatedText('')
    setAudioUrl(null)

    try {
      console.log('Starting translation and TTS...')
      console.log('Text:', text.substring(0, 100) + '...')
      console.log('Target language:', selectedLanguage)
      
      const response = await fetch('/api/translate-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          sourceLanguage,
          targetLanguageCode: selectedLanguage,
          options: {
            speaker: 'anushka',
            pitch: 0,
            pace: 1,
            loudness: 1,
            speech_sample_rate: 22050,
            enable_preprocessing: true,
            model: 'bulbul:v2'
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('TTS response received:', result)
      
      if (!result.audioData) {
        throw new Error('No audio data received from server')
      }

      setTranslatedText(result.translatedText || 'Translation completed')
      
      // Convert base64 audio data to blob URL
      try {
        const binaryString = atob(result.audioData)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const audioBlob = new Blob([bytes], { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        console.log('Audio URL created successfully')
      } catch (audioError) {
        console.error('Error creating audio blob:', audioError)
        throw new Error('Failed to process audio data')
      }

      // Notify parent component
      if (onTranslationComplete) {
        onTranslationComplete({
          originalText: result.originalText,
          translatedText: result.translatedText,
          targetLanguage: result.targetLanguage
        })
      }

    } catch (err) {
      console.error('Translation and TTS error:', err)
      setError(err.message || 'Failed to translate and convert to speech')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err)
          setError('Failed to play audio: ' + err.message)
        })
        setIsPlaying(true)
      }
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const handleAudioError = (event) => {
    console.error('Audio playback error:', event)
    setError('Audio playback failed. Please try again.')
    setIsPlaying(false)
  }

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value)
    setTranslatedText('')
    setAudioUrl(null)
    setError(null)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Translate & Listen to Summary
      </h3>
      
      {/* Language Selection */}
      <div className="mb-4">
        <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Language for Translation & Speech:
        </label>
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {languages && Array.isArray(languages) ? (
            languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))
          ) : (
            <option value="">No languages available</option>
          )}
        </select>
      </div>

      {/* Action Button */}
      <button
        onClick={handleTranslateAndPlay}
        disabled={isLoading || !text}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 mb-4"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Translating & Converting...
          </div>
        ) : (
          'Translate & Listen'
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Translated Text Display */}
      {translatedText && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Translated Text:</h4>
          <div className="bg-gray-50 p-3 rounded-md text-gray-800 text-sm">
            {translatedText}
          </div>
        </div>
      )}

      {/* Audio Player */}
      {audioUrl && (
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePlayAudio}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center"
          >
            {isPlaying ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play
              </>
            )}
          </button>
          
          <span className="text-sm text-gray-600">
            {getLanguageInfo(selectedLanguage)?.name || selectedLanguage}
          </span>
        </div>
      )}

      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnded}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onError={handleAudioError}
          className="hidden"
        />
      )}
    </div>
  )
}

// Helper function to get language info
function getLanguageInfo(languageCode) {
  return languages.find(lang => lang.code === languageCode) || null
}

export default TTSPlayer 