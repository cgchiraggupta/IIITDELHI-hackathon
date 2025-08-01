import { useState, useRef, useEffect } from 'react'

const CameraCapture = ({ onCapture }) => {
  const [hasCamera, setHasCamera] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [facingMode, setFacingMode] = useState('environment') // 'environment' for back camera
  const [uploadMode, setUploadMode] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const fileInputRef = useRef(null)

  // Check if device has camera
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const hasVideoInput = devices.some(device => device.kind === 'videoinput')
        setHasCamera(hasVideoInput)
      } catch (error) {
        console.error('Error checking camera:', error)
        setHasCamera(false)
      }
    }

    checkCamera()
  }, [])

  // Start camera when active
  useEffect(() => {
    if (cameraActive && hasCamera) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [cameraActive, hasCamera, facingMode])

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error starting camera:', error)
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks()
      tracks.forEach(track => track.stop())
      streamRef.current = null
      
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  const toggleCamera = () => {
    setCameraActive(prev => !prev)
    setUploadMode(false)
  }

  const toggleUpload = () => {
    setUploadMode(prev => !prev)
    setCameraActive(false)
  }

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')
  }

  const captureImage = () => {
    if (!videoRef.current) return

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const video = videoRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = canvas.toDataURL('image/jpeg')
    onCapture(imageData)
    setCameraActive(false)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, etc.)')
        return
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        onCapture(event.target.result, true) // true indicates this is an uploaded file
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  if (cameraActive) {
    return (
      <div className="card max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Medical Report Capture</h2>
        
        <div className="camera-container">
          <video 
            ref={videoRef} 
            className="camera-view" 
            autoPlay 
            playsInline 
            muted
          />
          
          {/* Camera overlay with larger controls */}
          <div className="camera-overlay">
            <div className="flex space-x-6 items-center">
              {/* Switch camera button */}
              <button 
                onClick={switchCamera} 
                className="bg-white p-4 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Switch camera"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
              
              {/* Capture button */}
              <div 
                className="capture-button" 
                onClick={captureImage}
                role="button"
                aria-label="Take photo"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    captureImage()
                  }
                }}
              >
                <div className="capture-button-inner"></div>
              </div>
              
              {/* Close camera button */}
              <button 
                onClick={toggleCamera} 
                className="bg-white p-4 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Close camera"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Camera instructions overlay */}
          <div className="absolute top-4 left-4 right-4 bg-black/50 text-white p-4 rounded-lg">
            <p className="text-center font-medium">
              📷 Point camera at medical report • Hold steady • Tap the blue button to capture
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (uploadMode) {
    return (
      <div className="card max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload Medical Report</h2>
        
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
          {/* Upload icon */}
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Image</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Select a medical report image from your device. Supported formats: JPG, PNG, PDF (max 10MB)
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={triggerFileUpload} 
                className="btn btn-primary btn-lg text-lg py-4 px-8"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Choose File
              </button>
              
              <button 
                onClick={toggleUpload} 
                className="btn btn-secondary btn-lg text-lg py-3 px-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Options
              </button>
            </div>
            
            {/* Hidden file input */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*,.pdf" 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>
    )
  }

  // Main selection screen
  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Medical Report Capture</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Camera Option */}
        <div className="upload-option flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50" onClick={toggleCamera}>
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Take Photo</h3>
          <p className="text-gray-600 text-center text-sm">
            Use your camera to capture a photo of the medical report
          </p>
          
          {!hasCamera && (
            <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
              Camera not available
            </div>
          )}
        </div>

        {/* Upload Option */}
        <div className="upload-option flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50" onClick={toggleUpload}>
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Image</h3>
          <p className="text-gray-600 text-center text-sm">
            Select an existing image from your device
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">📋 Instructions:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Ensure the medical report is clearly visible and well-lit</li>
          <li>• Supported formats: JPG, PNG, PDF (max 10MB)</li>
          <li>• For best results, avoid shadows and glare</li>
          <li>• Make sure all text is readable in the image</li>
        </ul>
      </div>
    </div>
  )
}

export default CameraCapture