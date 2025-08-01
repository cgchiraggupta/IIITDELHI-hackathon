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
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Medical Report Capture</h2>
      
      {cameraActive ? (
        <div className="camera-container">
          <video 
            ref={videoRef} 
            className="camera-view" 
            autoPlay 
            playsInline 
            muted
          />
          <div className="camera-overlay">
            <div className="flex space-x-4">
              <button 
                onClick={switchCamera} 
                className="bg-white p-2 rounded-full shadow-md"
                aria-label="Switch camera"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
              <div 
                className="capture-button" 
                onClick={captureImage}
                role="button"
                aria-label="Take photo"
              >
                <div className="capture-button-inner"></div>
              </div>
              <button 
                onClick={toggleCamera} 
                className="bg-white p-2 rounded-full shadow-md"
                aria-label="Close camera"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          
          {hasCamera ? (
            <button 
              onClick={toggleCamera} 
              className="btn btn-primary"
            >
              Open Camera
            </button>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 mb-2">No camera detected</p>
              <label className="btn btn-primary cursor-pointer">
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