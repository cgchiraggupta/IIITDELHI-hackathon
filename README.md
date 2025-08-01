# Health Report Summarizer

A comprehensive health report analysis application that uses OCR (Optical Character Recognition) and AI to extract text from medical reports and generate intelligent summaries.

## Features

- **OCR Text Extraction**: Extract text from medical report images using OCR.space API
- **AI-Powered Summarization**: Generate intelligent summaries using Google Gemini AI
- **Multi-language Support**: Support for English and Hindi
- **PWA Support**: Progressive Web App with offline capabilities
- **Patient Management**: Store and manage patient information
- **Report Generation**: Download comprehensive medical reports
- **Camera Integration**: Capture images directly from the app
- **Offline Mode**: Works offline with Tesseract.js fallback

## Technology Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Tesseract.js (offline OCR fallback)
- PWA with service workers

### Backend
- Express.js
- OCR.space API for text extraction
- Google Gemini AI for summarization
- Multer for file uploads
- CORS enabled

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd IIITDELHI-hackathon
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
Create a `.env` file in the root directory:
```env
OCR_API_KEY=your_ocr_api_key
GEMINI_API_KEY=your_gemini_api_key
```

## Usage

### Development Mode

Run both frontend and backend simultaneously:
```bash
npm run dev:full
```

Or run them separately:

Frontend only:
```bash
npm run dev
```

Backend only:
```bash
npm run server
```

### Production Build

1. Build the frontend:
```bash
npm run build
```

2. Start the production server:
```bash
npm run server
```

The app will be available at `http://localhost:3001`

## API Endpoints

### OCR Text Extraction
- **POST** `/api/ocr`
- Extracts text from uploaded image files
- Supports multiple image formats (JPG, PNG, PDF)

### AI Summarization
- **POST** `/api/summarize`
- Generates AI-powered summaries from text
- Supports multiple languages

### Combined Analysis
- **POST** `/api/analyze`
- Performs both OCR and AI summarization in one request
- Returns extracted text and summary

## How It Works

1. **Image Capture**: Users can capture medical report images using the camera or upload existing files
2. **OCR Processing**: The app uses OCR.space API to extract text from images
3. **AI Analysis**: Google Gemini AI analyzes the extracted text and generates summaries
4. **Report Generation**: Users can download comprehensive reports with patient information
5. **Fallback Mode**: If API calls fail, the app falls back to Tesseract.js for offline OCR

## Features in Detail

### OCR Integration
- Primary: OCR.space API for high-accuracy text extraction
- Fallback: Tesseract.js for offline processing
- Support for multiple languages (English, Hindi)
- Handles various image formats and qualities

### AI Summarization
- Uses Google Gemini 1.5 models for intelligent analysis
- Generates structured summaries with interpretations and action items
- Multi-language support for summaries
- Fallback mechanisms for API failures

### Patient Management
- Store patient information (name, age, gender, location)
- Link reports to specific patients
- View patient history and reports

### Report Generation
- Download comprehensive PDF reports
- Include patient information, extracted text, and AI summary
- Professional formatting for medical use

## Configuration

### API Keys
The app uses the following API keys (configured in `server.js`):
- OCR.space API Key: `K84125832788957`
- Google Gemini API Key: `AIzaSyC5CqcZww_dEKXlH4G6seq8H0p-RZC5si0`

### Language Support
- English (en)
- Hindi (hi)

### File Formats
- Images: JPG, JPEG, PNG
- Documents: PDF
- Maximum file size: 10MB

## Troubleshooting

### Common Issues

1. **OCR API Failures**: The app automatically falls back to Tesseract.js
2. **AI API Failures**: Check your internet connection and API key validity
3. **File Upload Issues**: Ensure files are under 10MB and in supported formats
4. **CORS Issues**: The backend is configured with CORS for localhost development

### Performance Tips

1. Use high-quality images for better OCR accuracy
2. Ensure good lighting when capturing images
3. Keep text in images clear and readable
4. Use stable internet connection for API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- OCR.space for OCR API
- Google Gemini for AI summarization
- Tesseract.js for offline OCR capabilities
- React and Vite for the development framework
