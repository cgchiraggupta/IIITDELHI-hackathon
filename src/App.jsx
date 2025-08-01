import { useState, useEffect } from 'react'
import './App.css'

// Components
import Header from './components/Header'
import CameraCapture from './components/CameraCapture'
import ImagePreview from './components/ImagePreview'
import TextExtraction from './components/TextExtraction'
import SummarySection from './components/SummarySection'
import PatientForm from './components/PatientForm'
import LanguageSelector from './components/LanguageSelector'
import OfflineIndicator from './components/OfflineIndicator'

// Utils
import { registerServiceWorker, checkOfflineStatus, addOfflineStatusListener } from './utils/registerSW'
import { initTesseractWorker, extractTextFromImage, terminateTesseractWorker } from './utils/textExtraction'
import { availableLanguages, tesseractLanguageMap, getDefaultLanguage } from './utils/languages'
import { generateReport, downloadReport } from './utils/reportGenerator'

function App() {
  // PWA state
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updateSW, setUpdateSW] = useState(null)
  const [isOffline, setIsOffline] = useState(false)

  // App state
  const [language, setLanguage] = useState(getDefaultLanguage())
  const [imageData, setImageData] = useState(null)
  const [extractedText, setExtractedText] = useState(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionError, setExtractionError] = useState(null)
  const [summary, setSummary] = useState(null)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState(null)
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    notes: ''
  })

  // Initialize Tesseract worker
  useEffect(() => {
    const initWorker = async () => {
      try {
        await initTesseractWorker(tesseractLanguageMap[language] || 'eng')
      } catch (error) {
        console.error('Failed to initialize Tesseract worker:', error)
      }
    }

    initWorker()

    return () => {
      terminateTesseractWorker()
    }
  }, [language])

  // Register service worker for PWA
  useEffect(() => {
    const sw = registerServiceWorker({
      onNeedRefresh: () => {
        setUpdateAvailable(true);
      },
      onOfflineReady: () => {
        // Optionally show a confirmation that the app is ready for offline use
        console.log('App is ready for offline use');
      },
      onRegistrationError: (error) => {
        console.error('Service worker registration failed:', error);
      }
    });
    
    setUpdateSW(sw);

    return () => {
      // Clean up update check interval if it exists
      if (window.__updateServiceWorkerInterval) {
        clearInterval(window.__updateServiceWorkerInterval);
      }
    };
  }, [])

  // Check offline status
  useEffect(() => {
    setIsOffline(checkOfflineStatus())
    const unregister = addOfflineStatusListener(setIsOffline)
    return unregister
  }, [])

  // Handle image capture
  const handleCapture = (data) => {
    setImageData(data)
    // Reset extraction and summary when new image is captured
    setExtractedText(null)
    setSummary(null)
    setExtractionError(null)
    setSummaryError(null)
  }

  // Handle image retake
  const handleRetake = () => {
    setImageData(null)
    setExtractedText(null)
    setSummary(null)
    setExtractionError(null)
    setSummaryError(null)
  }

  // Process image with OCR
  const processImage = async () => {
    if (!imageData) return

    setIsExtracting(true)
    setExtractionError(null)
    setSummary(null)
    setSummaryError(null)

    try {
      const text = await extractTextFromImage(imageData, tesseractLanguageMap[language] || 'eng')
      setExtractedText(text)
      generateSummary(text)
    } catch (error) {
      console.error('Error processing image:', error)
      setExtractionError(error.message || 'Failed to extract text from image')
    } finally {
      setIsExtracting(false)
    }
  }

  // Generate summary from extracted text
  // In a real app, this would call an AI service
  const generateSummary = (text) => {
    if (!text) return

    setIsGeneratingSummary(true)
    setSummaryError(null)

    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // Mock summary generation
        // In a real app, this would be replaced with an actual API call
        const mockSummary = {
          interpretation: 'This appears to be a blood test report showing slightly elevated glucose levels (110 mg/dL) and normal hemoglobin (14.2 g/dL). Other parameters are within normal range.',
          actionItems: [
            'Monitor blood glucose levels',
            'Recommend dietary changes to reduce sugar intake',
            'Schedule follow-up appointment in 3 months',
            'Provide patient education on diabetes prevention'
          ]
        }

        setSummary(mockSummary)
      } catch (error) {
        console.error('Error generating summary:', error)
        setSummaryError('Failed to generate summary from text')
      } finally {
        setIsGeneratingSummary(false)
      }
    }, 2000) // Simulate 2 second delay for API call
  }

  // Handle language change
  const handleLanguageChange = (languageCode) => {
    setLanguage(languageCode)
  }

  // Handle patient info update
  const handleUpdatePatientInfo = (info) => {
    setPatientInfo(info)
  }

  // Handle report generation and download
  const handleGenerateReport = () => {
    const reportHtml = generateReport({
      extractedText,
      summary,
      patientInfo,
      imageData
    })

    const fileName = `medical-report-${patientInfo.name ? patientInfo.name.replace(/\s+/g, '-').toLowerCase() : 'patient'}-${new Date().toISOString().split('T')[0]}`
    downloadReport(reportHtml, fileName)
  }

  // Handle PWA update
  const handleUpdate = () => {
    if (updateSW && updateSW.updateServiceWorker) {
      updateSW.updateServiceWorker()
    }
  }

  // Play voice summary (mock implementation)
  const handlePlayVoice = () => {
    if (!summary || !summary.interpretation) return

    // Use the Web Speech API for text-to-speech
    const speech = new SpeechSynthesisUtterance(summary.interpretation)
    speech.lang = language === 'hi' ? 'hi-IN' : 'en-US' // Set language
    window.speechSynthesis.speak(speech)
  }

  return (
    <div className="app-container">
      <OfflineIndicator isOffline={isOffline} />
      
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="flex justify-end mb-4">
          <LanguageSelector 
            currentLanguage={language} 
            onChangeLanguage={handleLanguageChange} 
            languages={availableLanguages} 
          />
        </div>

        {updateAvailable && (
          <div className="bg-primary/10 text-primary p-4 rounded-lg mb-6 flex justify-between items-center">
            <p className="font-medium">A new version is available!</p>
            <button 
              onClick={handleUpdate}
              className="btn btn-primary btn-sm"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Step-based UI flow */}
        <div className="flex flex-col">
          {/* Step 1: Scan Medical Report */}
          {!imageData && (
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-6">Scan Your Medical Report</h2>
              <p className="text-gray-600 mb-8">Take a clear photo of your medical report to get an instant analysis</p>
              <CameraCapture onCapture={handleCapture} />
            </div>
          )}

          {/* Step 2: Preview and Process */}
          {imageData && !extractedText && !isExtracting && (
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-6">Confirm Your Medical Report</h2>
              <p className="text-gray-600 mb-8">Make sure the image is clear and readable</p>
              <ImagePreview 
                imageData={imageData} 
                onRetake={handleRetake} 
                onProcess={processImage} 
              />
            </div>
          )}

          {/* Step 3: Processing Indicator */}
          {isExtracting && (
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-6">Analyzing Your Report</h2>
              <div className="flex flex-col items-center justify-center p-8">
                <div className="spinner mb-4"></div>
                <p className="text-gray-600">Processing your medical report, please wait...</p>
              </div>
            </div>
          )}

          {/* Step 4: Results Display */}
          {extractedText && !extractionError && (
            <div className="results-container">
              <h2 className="text-2xl font-bold mb-6 text-center">Medical Report Analysis</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Original Image and Text */}
                <div className="lg:col-span-5">
                  <div className="original-report-container">
                    <div className="medical-card mb-6">
                      <h3 className="text-lg font-semibold mb-4">Original Report</h3>
                      <div className="relative rounded-lg overflow-hidden shadow-md mb-4">
                        <img 
                          src={imageData} 
                          alt="Medical report" 
                          className="original-report-image w-full" 
                        />
                      </div>
                      <button 
                        onClick={handleRetake} 
                        className="btn btn-secondary w-full flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        Scan Another Report
                      </button>
                    </div>
                    
                    <div className="medical-card">
                      <TextExtraction 
                        extractedText={extractedText} 
                        isLoading={false} 
                        error={extractionError} 
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Summary and Patient Info */}
                <div className="lg:col-span-7 report-summary-container">
                  {/* Summary Section */}
                  <SummarySection 
                    summary={summary} 
                    isLoading={isGeneratingSummary || (!summary && !summaryError)} 
                    error={summaryError} 
                    onPlayVoice={handlePlayVoice} 
                  />

                  {/* Patient Form */}
                  <div className="medical-card mb-6 mt-6">
                    <PatientForm 
                      patientInfo={patientInfo} 
                      onUpdatePatientInfo={handleUpdatePatientInfo} 
                    />
                  </div>

                  {/* Download Report Button */}
                  {summary && (
                    <div className="medical-card p-6 text-center">
                      <button 
                        onClick={handleGenerateReport} 
                        className="btn btn-primary btn-lg w-full max-w-md mx-auto flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                        </svg>
                        Download Medical Report
                      </button>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
        <div className="container mx-auto px-4">
          <p>ASHA Health Assistant &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}

export default App
