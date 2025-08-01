import { createWorker } from 'tesseract.js'
import { extractTextWithOCR, generateSummaryWithAI, processImageWithOCRAndAI } from './ocrService.js'

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
 * Converts image data URL to File object for OCR API
 * @param {string} imageData The image data URL
 * @returns {File} The file object
 */
const dataURLtoFile = (imageData) => {
  const arr = imageData.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], 'image.jpg', { type: mime })
}

/**
 * Extracts text from an image using OCR API (with Tesseract fallback)
 * @param {string} imageData The image data URL
 * @param {string} language The language code to use for OCR
 * @param {boolean} useOCRAPI Whether to use OCR API (default: true)
 * @returns {Promise<string>} The extracted text
 */
export const extractTextFromImage = async (imageData, language = 'eng', useOCRAPI = true) => {
  try {
    if (useOCRAPI) {
      try {
        // Try OCR API first
        const imageFile = dataURLtoFile(imageData)
        const extractedText = await extractTextWithOCR(imageFile, language)
        return extractedText
      } catch (ocrError) {
        console.warn('OCR API failed, falling back to Tesseract:', ocrError.message)
        // Fall back to Tesseract if OCR API fails
      }
    }

    // Use Tesseract as fallback or primary method
    const worker = await initTesseractWorker(language)
    const result = await worker.recognize(imageData)
    return result.data.text
  } catch (error) {
    console.error('Error extracting text:', error)
    throw new Error('Failed to extract text from image')
  }
}

/**
 * Process image with OCR and AI summarization
 * @param {string} imageData The image data URL
 * @param {string} language The language code to use for OCR
 * @param {boolean} useOCRAPI Whether to use OCR API (default: true)
 * @returns {Promise<Object>} Object containing extracted text and summary
 */
export const processImageWithAI = async (imageData, language = 'eng', useOCRAPI = true) => {
  try {
    if (useOCRAPI) {
      try {
        // Try OCR API + AI first
        const imageFile = dataURLtoFile(imageData)
        const result = await processImageWithOCRAndAI(imageFile, language)
        return result
      } catch (apiError) {
        console.warn('OCR API + AI failed, falling back to Tesseract + AI:', apiError.message)
        // Fall back to Tesseract + AI if API fails
      }
    }

    // Use Tesseract + AI as fallback or primary method
    const extractedText = await extractTextFromImage(imageData, language, false)
    const summary = await generateSummaryWithAI(extractedText, language)
    
    return {
      extractedText,
      summary
    }
  } catch (error) {
    console.error('Error processing image with AI:', error)
    throw new Error('Failed to process image with AI')
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