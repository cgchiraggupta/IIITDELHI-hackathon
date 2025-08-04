import express from 'express'
import multer from 'multer'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { SarvamAIClient } from 'sarvamai'
import axios from 'axios'
import FormData from 'form-data'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tdelhi-hackathon.vercel.app', 'https://*.vercel.app', 'https://*.railway.app'] // Allow your Vercel domain
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  maxAge: 86400 // 24 hours
}))
app.use(express.json())
app.use(express.static(join(__dirname, 'dist')))

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

// API Keys - Use environment variables in production
const OCR_API_KEY = process.env.OCR_API_KEY || 'K84125832788957'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyC5CqcZww_dEKXlH4G6seq8H0p-RZC5si0'
const SARVAM_API_KEY = process.env.SARVAM_API_KEY || 'sk_sb5gdo6f_zbutFjWzkn02WwpwkZUmiNy9'

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

// Initialize Sarvam AI client
const sarvamClient = new SarvamAIClient({
  apiSubscriptionKey: SARVAM_API_KEY
})

// OCR API endpoint
app.post('/api/ocr', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    console.log('Processing file:', req.file.originalname, 'Size:', req.file.size)
    console.log('Request origin:', req.get('origin'))
    console.log('Request headers:', req.headers)

    // OCR Step
    const ocrFormData = new FormData()
    ocrFormData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype || 'application/octet-stream'
    })
    ocrFormData.append('apikey', OCR_API_KEY)
    ocrFormData.append('language', req.body.language || 'eng')
    ocrFormData.append('isOverlayRequired', 'false')
    ocrFormData.append('filetype', req.file.originalname.split('.').pop()?.toLowerCase() || 'auto')

    console.log('Sending to OCR API...')
    const ocrResponse = await axios.post(
      'https://api.ocr.space/parse/image',
      ocrFormData,
      {
        headers: {
          ...ocrFormData.getHeaders(),
        },
        timeout: 30000,
      }
    )

    console.log('OCR Response received:', ocrResponse.status)

    if (ocrResponse.data.IsErroredOnProcessing) {
      console.error('OCR Error:', ocrResponse.data.ErrorMessage)
      return res.status(500).json({
        error: `OCR Failed: ${ocrResponse.data.ErrorMessage}`
      })
    }

    if (!ocrResponse.data.ParsedResults || ocrResponse.data.ParsedResults.length === 0) {
      return res.status(500).json({
        error: 'No text could be extracted from the image'
      })
    }

    const extractedText = ocrResponse.data.ParsedResults[0].ParsedText
    console.log('Extracted text length:', extractedText.length)

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(500).json({
        error: 'No text content found in the document'
      })
    }

    res.json({ extractedText })
  } catch (error) {
    console.error('OCR API error:', error)
    res.status(500).json({
      error: `OCR processing failed: ${error.message}`
    })
  }
})

// AI Summary endpoint
app.post('/api/summarize', async (req, res) => {
  try {
    const { text, language = 'en' } = req.body

    if (!text) {
      return res.status(400).json({ error: 'No text provided' })
    }

    // Gemini LLM Step
    const modelNames = ['gemini-1.5-flash', 'gemini-1.5-pro']
    let analysis = ''
    let lastError = null

    for (const modelName of modelNames) {
      try {
        console.log(`Trying Gemini model: ${modelName}`)
        const model = genAI.getGenerativeModel({ model: modelName })

        const prompt = language === 'hi' 
          ? `इस दस्तावेज़ का विश्लेषण और सारांश प्रदान करें। एक व्यापक विश्लेषण शामिल करें:

1. मुख्य विषय और महत्वपूर्ण बिंदु
2. महत्वपूर्ण विवरण और अंतर्दृष्टि
3. दस्तावेज़ के उद्देश्य का सारांश
4. कोई उल्लेखनीय पैटर्न या अवलोकन

दस्तावेज़ पाठ:
${text}

कृपया निम्नलिखित प्रारूप में उत्तर दें:
व्याख्या: [दस्तावेज़ की व्याख्या]
कार्य बिंदु: [कार्य के लिए सुझाव]`
          : `Analyze and summarize this document. Provide a comprehensive analysis including:

1. Main topics and key points
2. Important details and insights
3. Summary of the document's purpose
4. Any notable patterns or observations

Document text:
${text}

Please provide the response in the following format:
Interpretation: [interpretation of the document]
Action Items: [suggestions for action]`

        const geminiResult = await model.generateContent(prompt)
        analysis = await geminiResult.response.text()
        console.log(`Analysis completed with ${modelName}, length:`, analysis.length)
        break
      } catch (error) {
        console.error(`Failed with ${modelName}:`, error.message)
        lastError = error
        continue
      }
    }

    if (!analysis) {
      return res.status(500).json({
        error: 'AI analysis failed for all models'
      })
    }

    // Parse the response to extract interpretation and action items
    const interpretationMatch = analysis.match(/Interpretation:\s*(.*?)(?=\n|$)/i)
    const actionItemsMatch = analysis.match(/Action Items:\s*(.*?)(?=\n|$)/i)

    const interpretation = interpretationMatch ? interpretationMatch[1].trim() : analysis
    const actionItemsText = actionItemsMatch ? actionItemsMatch[1].trim() : ''

    // Split action items if they're separated by commas, semicolons, or newlines
    const actionItems = actionItemsText
      ? actionItemsText.split(/[,;\n]/).map(item => item.trim()).filter(item => item.length > 0)
      : []

    res.json({
      summary: {
        interpretation,
        actionItems: actionItems.length > 0 ? actionItems : [
          language === 'hi' ? 'रिपोर्ट की समीक्षा करें' : 'Review the report',
          language === 'hi' ? 'आवश्यकतानुसार फॉलो-अप करें' : 'Follow up as needed'
        ]
      }
    })
  } catch (error) {
    console.error('AI Summary error:', error)
    res.status(500).json({
      error: `AI summary generation failed: ${error.message}`
    })
  }
})

// Translation endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLanguage = 'en', targetLanguage = 'hi' } = req.body

    if (!text) {
      return res.status(400).json({ error: 'No text provided' })
    }

    console.log('Translating text:', text.substring(0, 100) + '...')
    console.log('From:', sourceLanguage, 'To:', targetLanguage)

    // Use Gemini AI for translation
    const modelNames = ['gemini-1.5-flash', 'gemini-1.5-pro']
    let translatedText = ''
    let lastError = null

    for (const modelName of modelNames) {
      try {
        console.log(`Trying Gemini model for translation: ${modelName}`)
        const model = genAI.getGenerativeModel({ model: modelName })

        const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. 
        Only provide the translated text without any additional explanations or formatting.

        Text to translate:
        ${text}

        Translated text:`

        const geminiResult = await model.generateContent(prompt)
        translatedText = await geminiResult.response.text()
        console.log(`Translation completed with ${modelName}`)
        break
      } catch (error) {
        console.error(`Translation failed with ${modelName}:`, error.message)
        lastError = error
        continue
      }
    }

    if (!translatedText) {
      return res.status(500).json({
        error: 'Translation failed for all models'
      })
    }

    res.json({
      originalText: text,
      translatedText: translatedText.trim(),
      sourceLanguage,
      targetLanguage
    })
  } catch (error) {
    console.error('Translation error:', error)
    res.status(500).json({
      error: `Translation failed: ${error.message}`
    })
  }
})

// Text-to-Speech endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text, targetLanguageCode = 'hi-IN', options = {} } = req.body

    if (!text) {
      return res.status(400).json({ error: 'No text provided' })
    }

    console.log('Converting text to speech...')
    console.log('Text:', text.substring(0, 100) + '...')
    console.log('Target language:', targetLanguageCode)

    const defaultOptions = {
      speaker: 'anushka',
      pitch: 0,
      pace: 1,
      loudness: 1,
      speech_sample_rate: 22050,
      enable_preprocessing: true,
      model: 'bulbul:v2'
    }

    const response = await sarvamClient.textToSpeech.convert({
      text,
      target_language_code: targetLanguageCode,
      ...defaultOptions,
      ...options
    })

    console.log('Sarvam AI TTS response received')
    res.json({
      audioData: response,
      targetLanguage: targetLanguageCode
    })
  } catch (error) {
    console.error('TTS error:', error)
    res.status(500).json({
      error: `Text-to-speech conversion failed: ${error.message}`
    })
  }
})

// Translate and TTS endpoint
app.post('/api/translate-tts', async (req, res) => {
  try {
    const { text, sourceLanguage = 'en', targetLanguageCode = 'hi-IN', options = {} } = req.body

    if (!text) {
      return res.status(400).json({ error: 'No text provided' })
    }

    console.log('Translating and converting to speech...')
    console.log('Text:', text.substring(0, 100) + '...')
    console.log('From:', sourceLanguage, 'To:', targetLanguageCode)

    // Step 1: Translate the text
    const targetLanguage = targetLanguageCode.split('-')[0]
    const modelNames = ['gemini-1.5-flash', 'gemini-1.5-pro']
    let translatedText = ''

    for (const modelName of modelNames) {
      try {
        console.log(`Trying Gemini model for translation: ${modelName}`)
        const model = genAI.getGenerativeModel({ model: modelName })

        const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. 
        Only provide the translated text without any additional explanations or formatting.

        Text to translate:
        ${text}

        Translated text:`

        const geminiResult = await model.generateContent(prompt)
        translatedText = await geminiResult.response.text()
        console.log(`Translation completed with ${modelName}`)
        break
      } catch (error) {
        console.error(`Translation failed with ${modelName}:`, error.message)
        continue
      }
    }

    if (!translatedText) {
      return res.status(500).json({
        error: 'Translation failed for all models'
      })
    }

    // Step 2: Convert translated text to speech
    const defaultOptions = {
      speaker: 'anushka',
      pitch: 0,
      pace: 1,
      loudness: 1,
      speech_sample_rate: 22050,
      enable_preprocessing: true,
      model: 'bulbul:v2'
    }

    console.log('Converting translated text to speech...')
    console.log('Translated text:', translatedText.trim().substring(0, 100) + '...')
    
    const ttsResponse = await sarvamClient.textToSpeech.convert({
      text: translatedText.trim(),
      target_language_code: targetLanguageCode,
      ...defaultOptions,
      ...options
    })

    console.log('TTS response received:', {
      hasResponse: !!ttsResponse,
      hasAudios: !!(ttsResponse && ttsResponse.audios),
      audioCount: ttsResponse?.audios?.length || 0,
      requestId: ttsResponse?.request_id
    })
    
    // Check if response has audio data
    if (ttsResponse && ttsResponse.audios && ttsResponse.audios.length > 0) {
      const audioData = ttsResponse.audios[0]
      console.log('Audio data received, length:', audioData?.length || 'unknown')
      
      res.json({
        originalText: text,
        translatedText: translatedText.trim(),
        audioData: audioData,
        requestId: ttsResponse.request_id,
        sourceLanguage,
        targetLanguage: targetLanguageCode
      })
    } else {
      console.error('No audio data in TTS response:', ttsResponse)
      res.status(500).json({
        error: 'No audio data received from Sarvam AI',
        response: ttsResponse
      })
    }
  } catch (error) {
    console.error('Translate-TTS error:', error)
    console.error('Error stack:', error.stack)
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code
    })
    res.status(500).json({
      error: `Translation and TTS failed: ${error.message}`,
      details: error.stack
    })
  }
})

// Combined OCR + AI endpoint
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    const language = req.body.language || 'en'
    console.log('Processing file:', req.file.originalname, 'Language:', language)

    // OCR Step
    const ocrFormData = new FormData()
    ocrFormData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype || 'application/octet-stream'
    })
    ocrFormData.append('apikey', OCR_API_KEY)
    ocrFormData.append('language', language === 'hi' ? 'hin' : 'eng')
    ocrFormData.append('isOverlayRequired', 'false')
    ocrFormData.append('filetype', req.file.originalname.split('.').pop()?.toLowerCase() || 'auto')

    console.log('Sending to OCR API...')
    const ocrResponse = await axios.post(
      'https://api.ocr.space/parse/image',
      ocrFormData,
      {
        headers: {
          ...ocrFormData.getHeaders(),
        },
        timeout: 30000,
      }
    )

    if (ocrResponse.data.IsErroredOnProcessing) {
      return res.status(500).json({
        error: `OCR Failed: ${ocrResponse.data.ErrorMessage}`
      })
    }

    if (!ocrResponse.data.ParsedResults || ocrResponse.data.ParsedResults.length === 0) {
      return res.status(500).json({
        error: 'No text could be extracted from the image'
      })
    }

    const extractedText = ocrResponse.data.ParsedResults[0].ParsedText
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(500).json({
        error: 'No text content found in the document'
      })
    }

    // AI Summary Step
    const modelNames = ['gemini-1.5-flash', 'gemini-1.5-pro']
    let analysis = ''

    for (const modelName of modelNames) {
      try {
        console.log(`Trying Gemini model: ${modelName}`)
        const model = genAI.getGenerativeModel({ model: modelName })

        const prompt = language === 'hi' 
          ? `इस दस्तावेज़ का विश्लेषण और सारांश प्रदान करें। एक व्यापक विश्लेषण शामिल करें:

1. मुख्य विषय और महत्वपूर्ण बिंदु
2. महत्वपूर्ण विवरण और अंतर्दृष्टि
3. दस्तावेज़ के उद्देश्य का सारांश
4. कोई उल्लेखनीय पैटर्न या अवलोकन

दस्तावेज़ पाठ:
${extractedText}

कृपया निम्नलिखित प्रारूप में उत्तर दें:
व्याख्या: [दस्तावेज़ की व्याख्या]
कार्य बिंदु: [कार्य के लिए सुझाव]`
          : `Analyze and summarize this document. Provide a comprehensive analysis including:

1. Main topics and key points
2. Important details and insights
3. Summary of the document's purpose
4. Any notable patterns or observations

Document text:
${extractedText}

Please provide the response in the following format:
Interpretation: [interpretation of the document]
Action Items: [suggestions for action]`

        const geminiResult = await model.generateContent(prompt)
        analysis = await geminiResult.response.text()
        console.log(`Analysis completed with ${modelName}, length:`, analysis.length)
        break
      } catch (error) {
        console.error(`Failed with ${modelName}:`, error.message)
        continue
      }
    }

    if (!analysis) {
      return res.status(500).json({
        error: 'AI analysis failed for all models'
      })
    }

    // Parse the response to extract interpretation and action items
    const interpretationMatch = analysis.match(/Interpretation:\s*(.*?)(?=\n|$)/i)
    const actionItemsMatch = analysis.match(/Action Items:\s*(.*?)(?=\n|$)/i)

    const interpretation = interpretationMatch ? interpretationMatch[1].trim() : analysis
    const actionItemsText = actionItemsMatch ? actionItemsMatch[1].trim() : ''

    const actionItems = actionItemsText
      ? actionItemsText.split(/[,;\n]/).map(item => item.trim()).filter(item => item.length > 0)
      : []

    res.json({
      extractedText,
      summary: {
        interpretation,
        actionItems: actionItems.length > 0 ? actionItems : [
          language === 'hi' ? 'रिपोर्ट की समीक्षा करें' : 'Review the report',
          language === 'hi' ? 'आवश्यकतानुसार फॉलो-अप करें' : 'Follow up as needed'
        ]
      }
    })
  } catch (error) {
    console.error('Analysis error:', error)
    res.status(500).json({
      error: `Analysis failed: ${error.message}`
    })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Simple test endpoint for debugging
app.post('/api/test', upload.single('file'), (req, res) => {
  console.log('Test endpoint called')
  console.log('File received:', req.file ? 'Yes' : 'No')
  console.log('File size:', req.file ? req.file.size : 'No file')
  console.log('Origin:', req.get('origin'))
  
  res.json({ 
    message: 'Test successful',
    fileReceived: !!req.file,
    fileSize: req.file ? req.file.size : 0,
    timestamp: new Date().toISOString()
  })
})

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 