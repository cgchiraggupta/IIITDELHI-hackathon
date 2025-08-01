import { useState, useRef, useEffect } from 'react'

const CameraCapture = ({ onCapture }) => {
  const [hasCamera, setHasCamera] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [facingMode, setFacingMode] = useState('environment') // 'environment' for back camera
  const videoRef = useRef(null)
  const streamRef = useRef(null)

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

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Medical Report Capture</h2>
      
      {cameraActive ? (
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
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
          {/* Large camera icon */}
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          {hasCamera ? (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Ready to Scan</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Click the button below to open your camera and take a photo of the medical report
              </p>
              <button 
                onClick={toggleCamera} 
                className="btn btn-primary btn-lg text-lg py-4 px-8"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Open Camera
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">No Camera Detected</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Your device doesn't have a camera or camera access is restricted. You can upload an image file instead.
              </p>
              <label className="btn btn-primary btn-lg text-lg py-4 px-8 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Image
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        onCapture(event.target.result)
                      }
                      reader.readAsDataURL(file)
                    }
                  }} 
                />
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CameraCapture