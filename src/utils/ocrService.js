import axios from 'axios'

// Backend API base URL
const API_BASE_URL = 'http://localhost:3001'

/**
 * Extract text from image using backend OCR API
 * @param {File|Blob} imageFile - The image file to process
 * @param {string} language - Language code (default: 'eng')
 * @returns {Promise<string>} - Extracted text
 */
export async function extractTextWithOCR(imageFile, language = 'eng') {
  try {
    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('language', language)

    console.log('Sending to backend OCR API...')
    const response = await axios.post(`${API_BASE_URL}/api/ocr`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout
    })

    console.log('OCR Response received:', response.status)
    return response.data.extractedText
  } catch (error) {
    console.error('OCR extraction error:', error)
    throw error
  }
}

/**
 * Generate summary using backend AI API
 * @param {string} text - The text to summarize
 * @param {string} language - Language for the summary (default: 'en')
 * @returns {Promise<Object>} - Summary object with interpretation and action items
 */
export async function generateSummaryWithAI(text, language = 'en') {
  try {
    console.log('Sending to backend AI API...')
    const response = await axios.post(`${API_BASE_URL}/api/summarize`, {
      text,
      language
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    console.log('AI Summary Response received:', response.status)
    return response.data.summary
  } catch (error) {
    console.error('AI summary generation error:', error)
    throw error
  }
}

/**
 * Process image with OCR and AI summarization using backend API
 * @param {File|Blob} imageFile - The image file to process
 * @param {string} language - Language code (default: 'en')
 * @returns {Promise<Object>} - Object containing extracted text and summary
 */
export async function processImageWithOCRAndAI(imageFile, language = 'en') {
  try {
    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('language', language)

    console.log('Sending to backend combined API...')
    const response = await axios.post(`${API_BASE_URL}/api/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 second timeout for combined processing
    })

    console.log('Combined API Response received:', response.status)
    return response.data
  } catch (error) {
    console.error('Image processing error:', error)
    throw error
  }
} 