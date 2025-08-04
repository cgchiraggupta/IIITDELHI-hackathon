import axios from 'axios'

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

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
    if (error.response) {
      throw new Error(`OCR API error: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`)
    } else if (error.request) {
      throw new Error('OCR API request failed. Please check if the backend server is running.')
    } else {
      throw new Error(`OCR request error: ${error.message}`)
    }
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
    if (error.response) {
      throw new Error(`AI API error: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`)
    } else if (error.request) {
      throw new Error('AI API request failed. Please check if the backend server is running.')
    } else {
      throw new Error(`AI request error: ${error.message}`)
    }
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
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(`Server error: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`)
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check if the backend server is running.')
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Request setup error: ${error.message}`)
    }
  }
} 