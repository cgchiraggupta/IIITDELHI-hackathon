import express from 'express'
import multer from 'multer'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'
import axios from 'axios'
import FormData from 'form-data'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(join(__dirname, 'dist')))

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

// API Keys
const OCR_API_KEY = 'K84125832788957'
const GEMINI_API_KEY = 'AIzaSyC5CqcZww_dEKXlH4G6seq8H0p-RZC5si0'

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

// OCR API endpoint
app.post('/api/ocr', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    console.log('Processing file:', req.file.originalname, 'Size:', req.file.size)

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

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 