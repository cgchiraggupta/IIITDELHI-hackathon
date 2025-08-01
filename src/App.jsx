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
import ProcessingPopup from './components/ProcessingPopup'
import SuccessNotification from './components/SuccessNotification'

// Utils
import { registerServiceWorker, checkOfflineStatus, addOfflineStatusListener } from './utils/registerSW'
import { initTesseractWorker, extractTextFromImage, processImageWithAI, terminateTesseractWorker } from './utils/textExtraction'
import { availableLanguages, tesseractLanguageMap, getDefaultLanguage, translate } from './utils/languages'
import { generateReport, downloadReport } from './utils/reportGenerator'

function App() {
  // PWA state
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updateSW, setUpdateSW] = useState(null)
  const [isOffline, setIsOffline] = useState(false)

  // App state
  const [language, setLanguage] = useState(getDefaultLanguage())
  const [currentView, setCurrentView] = useState('home')
  const [imageData, setImageData] = useState(null)
  const [isUploaded, setIsUploaded] = useState(false)
  const [extractedText, setExtractedText] = useState(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionError, setExtractionError] = useState(null)
  const [summary, setSummary] = useState(null)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState(null)
  
  // Processing popup state
  const [showProcessingPopup, setShowProcessingPopup] = useState(false)
  const [processingStep, setProcessingStep] = useState('ocr')
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  
  // Data state
  const [patients, setPatients] = useState([])
  const [reports, setReports] = useState([])
  const [currentPatient, setCurrentPatient] = useState(null)
  const [currentReport, setCurrentReport] = useState(null)

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
    return () => terminateTesseractWorker()
  }, [language])

  // Register service worker for PWA
  useEffect(() => {
    const sw = registerServiceWorker({
      onNeedRefresh: () => setUpdateAvailable(true),
      onOfflineReady: () => console.log('App is ready for offline use'),
      onRegistrationError: (error) => console.error('Service worker registration failed:', error)
    })
    setUpdateSW(sw)
    return () => {
      if (window.__updateServiceWorkerInterval) {
        clearInterval(window.__updateServiceWorkerInterval)
      }
    }
  }, [])

  // Check offline status
  useEffect(() => {
    setIsOffline(checkOfflineStatus())
    const unregister = addOfflineStatusListener(setIsOffline)
    return unregister
  }, [])

  // Handle image capture
  const handleCapture = (data, uploaded = false) => {
    setImageData(data)
    setIsUploaded(uploaded)
    setExtractedText(null)
    setSummary(null)
    setExtractionError(null)
    setSummaryError(null)
    setCurrentView('preview')
  }

  // Handle image retake
  const handleRetake = () => {
    setImageData(null)
    setIsUploaded(false)
    setExtractedText(null)
    setSummary(null)
    setExtractionError(null)
    setSummaryError(null)
    setCurrentView('camera')
  }

  // Process image with OCR and AI
  const processImage = async () => {
    if (!imageData) return

    setIsExtracting(true)
    setExtractionError(null)
    setSummary(null)
    setSummaryError(null)
    
    // Show processing popup
    setShowProcessingPopup(true)
    setProcessingStep('ocr')

    try {
      // Simulate OCR step
      await new Promise(resolve => setTimeout(resolve, 2000))
      setProcessingStep('ai')
      
      // Use the new integrated OCR and AI processing
      const result = await processImageWithAI(imageData, language, true)
      
      // Simulate final processing step
      await new Promise(resolve => setTimeout(resolve, 1500))
      setProcessingStep('summary')
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProcessingStep('completed')
      
      setExtractedText(result.extractedText)
      setSummary(result.summary)
      
      // Save report
      const newReport = {
        id: Date.now(),
        imageData,
        extractedText: result.extractedText,
        summary: result.summary,
        patientId: currentPatient?.id,
        createdAt: new Date().toISOString(),
        status: 'completed'
      }
      
      setReports(prev => [newReport, ...prev])
      setCurrentReport(newReport)
      
      // Close popup and navigate to report after a short delay
      setTimeout(() => {
        setShowProcessingPopup(false)
        setShowSuccessNotification(true)
        setCurrentView('report')
      }, 2000)
      
    } catch (error) {
      console.error('Error processing image:', error)
      setExtractionError(error.message || 'Failed to process image')
      setShowProcessingPopup(false)
    } finally {
      setIsExtracting(false)
    }
  }



  // Handle language change
  const handleLanguageChange = (languageCode) => {
    setLanguage(languageCode)
  }

  // Handle patient creation/update
  const handlePatientUpdate = (patientData) => {
    if (patientData.id) {
      setPatients(prev => prev.map(p => p.id === patientData.id ? patientData : p))
    } else {
      const newPatient = {
        ...patientData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      }
      setPatients(prev => [newPatient, ...prev])
    }
    setCurrentPatient(patientData)
  }

  // Handle report generation and download
  const handleGenerateReport = () => {
    const reportHtml = generateReport({
      extractedText,
      summary,
      patientInfo: currentPatient,
      imageData
    })

    const fileName = `medical-report-${currentPatient?.name ? currentPatient.name.replace(/\s+/g, '-').toLowerCase() : 'patient'}-${new Date().toISOString().split('T')[0]}`
    downloadReport(reportHtml, fileName)
  }

  // Handle PWA update
  const handleUpdate = () => {
    if (updateSW && updateSW.updateServiceWorker) {
      updateSW.updateServiceWorker()
    }
  }

  // Play voice summary
  const handlePlayVoice = () => {
    if (!summary || !summary.interpretation) return
    const speech = new SpeechSynthesisUtterance(summary.interpretation)
    speech.lang = language === 'hi' ? 'hi-IN' : 'en-US'
    window.speechSynthesis.speak(speech)
  }

  // Render Home Dashboard
  const renderHomeDashboard = () => (
    <div className="dashboard-container">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon reports-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="stat-number">{reports.length}</div>
          <div className="stat-label">{translate('dashboard.totalReports', language)}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon patients-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div className="stat-number">{patients.length}</div>
          <div className="stat-label">{translate('dashboard.totalPatients', language)}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title">{translate('dashboard.quickActions', language)}</h2>
        
        <div className="action-grid">
          <button 
            className="action-card"
            onClick={() => setCurrentView('camera')}
          >
            <div className="action-icon camera-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="action-content">
              <div className="action-title">{translate('dashboard.newReport', language)}</div>
              <div className="action-subtitle">{translate('camera.title', language)}</div>
            </div>
          </button>

          <button 
            className="action-card"
            onClick={() => setCurrentView('patients')}
          >
            <div className="action-icon patients-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="action-content">
              <div className="action-title">{translate('dashboard.viewPatients', language)}</div>
              <div className="action-subtitle">{translate('patient.title', language)}</div>
            </div>
          </button>

          <button 
            className="action-card"
            onClick={() => setCurrentView('report')}
          >
            <div className="action-icon reports-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="action-content">
              <div className="action-title">{translate('dashboard.viewReports', language)}</div>
              <div className="action-subtitle">{translate('summary.title', language)}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      {reports.length > 0 && (
        <div className="recent-activity">
          <h2 className="section-title">{language === 'hi' ? 'हाल की गतिविधियां' : 'Recent Activity'}</h2>
          <div className="activity-list">
            {reports.slice(0, 3).map(report => (
              <div key={report.id} className="activity-item" onClick={() => {
                setCurrentReport(report)
                setCurrentView('report')
              }}>
                <div className="activity-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="activity-content">
                  <div className="activity-title">{language === 'hi' ? 'मेडिकल रिपोर्ट विश्लेषण' : 'Medical Report Analysis'}</div>
                  <div className="activity-time">{new Date(report.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // Render Camera View
  const renderCameraView = () => (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">{translate('nav.camera', language)}</h2>
        <p className="view-subtitle">{translate('camera.title', language)}</p>
      </div>
      <CameraCapture onCapture={handleCapture} />
    </div>
  )

  // Render Preview View
  const renderPreviewView = () => (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">{translate('preview.title', language)}</h2>
        <p className="view-subtitle">{translate('preview.process', language)}</p>
      </div>
              <ImagePreview 
          imageData={imageData} 
          onRetake={handleRetake} 
          onProcess={processImage}
          isUploaded={isUploaded}
        />
    </div>
  )

  // Render Report View
  const renderReportView = () => {
    if (!currentReport && !imageData) {
      return (
        <div className="view-container">
          <div className="view-header">
            <h2 className="view-title">{translate('nav.report', language)}</h2>
            <p className="view-subtitle">{translate('empty.noReports', language)}</p>
          </div>
          <div className="empty-state">
            <div className="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="empty-text">{translate('empty.startCapture', language)}</p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => setCurrentView('camera')}
            >
              {translate('dashboard.newReport', language)}
            </button>
          </div>
        </div>
      )
    }

    const report = currentReport || { imageData, extractedText, summary }
    
    return (
      <div className="view-container">
        <div className="view-header">
          <h2 className="view-title">{translate('summary.title', language)}</h2>
          <p className="view-subtitle">{translate('summary.interpretation', language)}</p>
        </div>
        
        {isExtracting && (
          <div className="processing-container">
            <div className="spinner-large mb-6"></div>
            <h3 className="text-2xl font-bold mb-4">{translate('extraction.loading', language)}</h3>
            <p className="text-lg text-gray-600">{translate('summary.loading', language)}</p>
          </div>
        )}

        {report.extractedText && !extractionError && (
          <div className="report-content">
            <div className="report-grid">
              <div className="report-section">
                <h3 className="section-title">{translate('preview.title', language)}</h3>
                <div className="image-container">
                  <img src={report.imageData} alt="Medical report" className="report-image" />
                </div>
                <button onClick={handleRetake} className="btn btn-secondary w-full">
                  {translate('preview.retake', language)}
                </button>
              </div>
              
              <div className="report-section">
                <TextExtraction 
                  extractedText={report.extractedText} 
                  isLoading={false} 
                  error={extractionError} 
                />
              </div>
              
              <div className="report-section">
                <SummarySection 
                  summary={report.summary} 
                  isLoading={isGeneratingSummary} 
                  error={summaryError} 
                  onPlayVoice={handlePlayVoice} 
                />
              </div>
              
              <div className="report-section">
                <PatientForm 
                  patientInfo={currentPatient || {}} 
                  onUpdatePatientInfo={handlePatientUpdate} 
                />
              </div>
              
              {report.summary && (
                <div className="report-section">
                  <div className="action-buttons">
                    <button onClick={handleGenerateReport} className="btn btn-primary btn-lg w-full">
                      {translate('report.download', language)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Render Patients View
  const renderPatientsView = () => (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">{translate('nav.patients', language)}</h2>
        <p className="view-subtitle">{translate('patient.title', language)}</p>
      </div>
      
      {patients.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <p className="empty-text">{translate('empty.noPatients', language)}</p>
        </div>
      ) : (
        <div className="patients-list">
          {patients.map(patient => (
            <div key={patient.id} className="patient-card" onClick={() => setCurrentPatient(patient)}>
              <div className="patient-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="patient-info">
                <div className="patient-name">{patient.name || 'Unknown'}</div>
                <div className="patient-details">
                  {patient.age && `${patient.age} years`} • {patient.gender || 'Not specified'}
                </div>
                <div className="patient-location">{patient.location || 'Location not specified'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        className="btn btn-primary btn-lg w-full mt-4"
        onClick={() => setCurrentPatient({})}
      >
        {translate('patient.save', language)}
      </button>
    </div>
  )

  return (
    <div className="app-container">
      <OfflineIndicator isOffline={isOffline} />
      
      <Header language={language} />
      
      <main className="main-content">
        {updateAvailable && (
          <div className="update-notification">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="font-semibold">{translate('update.available', language)}</p>
            </div>
            <button onClick={handleUpdate} className="btn btn-primary btn-sm">
                              {translate('update.refresh', language)}
            </button>
          </div>
        )}

        <div className="language-selector-container">
          <LanguageSelector 
            currentLanguage={language} 
            onChangeLanguage={handleLanguageChange} 
            languages={availableLanguages} 
          />
        </div>

        {/* Main Content */}
        {currentView === 'home' && renderHomeDashboard()}
        {currentView === 'camera' && renderCameraView()}
        {currentView === 'preview' && renderPreviewView()}
        {currentView === 'report' && renderReportView()}
        {currentView === 'patients' && renderPatientsView()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-navigation">
        <button 
          className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentView('home')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>{translate('nav.home', language)}</span>
        </button>
        
        <button 
          className={`nav-item ${currentView === 'camera' ? 'active' : ''}`}
          onClick={() => setCurrentView('camera')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{translate('nav.camera', language)}</span>
        </button>
        
        <button 
          className={`nav-item ${currentView === 'report' ? 'active' : ''}`}
          onClick={() => setCurrentView('report')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{translate('nav.report', language)}</span>
        </button>
        
        <button 
          className={`nav-item ${currentView === 'patients' ? 'active' : ''}`}
          onClick={() => setCurrentView('patients')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <span>{translate('nav.patients', language)}</span>
        </button>
      </nav>
      
      {/* Processing Popup */}
      <ProcessingPopup 
        isVisible={showProcessingPopup}
        currentStep={processingStep}
        onClose={() => {
          setShowProcessingPopup(false)
          if (currentReport) {
            setCurrentView('report')
          }
        }}
      />
      
      {/* Success Notification */}
      <SuccessNotification 
        isVisible={showSuccessNotification}
        onClose={() => setShowSuccessNotification(false)}
      />
    </div>
  )
}

export default App
