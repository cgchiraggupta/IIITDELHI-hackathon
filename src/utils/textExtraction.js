import { createWorker } from 'tesseract.js'

// Cache for the Tesseract worker to avoid recreating it
let workerCache = null

/**
 * Initializes the Tesseract worker with the specified language
 * @param {string} language The language code to use for OCR (e.g., 'eng', 'hin')
 * @returns {Promise<Object>} The initialized worker
 */
export const initTesseractWorker = async (language = 'eng') => {
  if (workerCache) {
    // If we already have a worker, check if it's using the right language
    const currentLang = await workerCache.getParameters()
    if (currentLang.lang !== language) {
      // If language changed, terminate and create a new worker
      await workerCache.terminate()
      workerCache = null
    } else {
      // If language is the same, reuse the worker
      return workerCache
    }
  }

  // Create a new worker
  const worker = await createWorker()
  await worker.loadLanguage(language)
  await worker.initialize(language)
  
  // Cache the worker for future use
  workerCache = worker
  return worker
}

/**
 * Extracts text from an image using Tesseract OCR
 * @param {string} imageData The image data URL
 * @param {string} language The language code to use for OCR
 * @returns {Promise<string>} The extracted text
 */
export const extractTextFromImage = async (imageData, language = 'eng') => {
  try {
    const worker = await initTesseractWorker(language)
    const result = await worker.recognize(imageData)
    return result.data.text
  } catch (error) {
    console.error('Error extracting text:', error)
    throw new Error('Failed to extract text from image')
  }
}

/**
 * Terminates the Tesseract worker to free up resources
 * Should be called when the app is unmounted or when OCR is no longer needed
 */
export const terminateTesseractWorker = async () => {
  if (workerCache) {
    await workerCache.terminate()
    workerCache = null
  }
}