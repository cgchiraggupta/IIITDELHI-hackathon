# Sarvam AI Integration for Text-to-Speech Translation

## Overview

This project now includes integration with Sarvam AI for advanced text-to-speech translation capabilities. The integration allows users to translate medical report summaries into various Indian languages and listen to them using high-quality AI-generated speech.

## Features Added

### 1. Multi-Language Support
- **12 Indian Languages**: Hindi, Marathi, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Odia, Assamese, and English (India)
- **Language Selection**: Users can choose their preferred language for translation and speech
- **Native Script Support**: All languages display in their native scripts

### 2. Text-to-Speech Translation
- **AI-Powered Translation**: Uses Google Gemini AI for accurate text translation
- **High-Quality Speech**: Sarvam AI's Bulbul v2 model for natural-sounding speech
- **Voice Customization**: Configurable pitch, pace, and loudness settings
- **Real-time Processing**: Instant translation and speech generation

### 3. User Interface Enhancements
- **TTS Player Component**: Dedicated component for translation and speech functionality
- **Audio Controls**: Play/pause functionality with visual feedback
- **Language Dropdown**: Easy language selection interface
- **Translated Text Display**: Shows both original and translated text

## Technical Implementation

### Backend Endpoints

#### 1. Translation Endpoint
```
POST /api/translate
```
- Translates text using Google Gemini AI
- Supports multiple source and target languages
- Returns original and translated text

#### 2. Text-to-Speech Endpoint
```
POST /api/tts
```
- Converts text to speech using Sarvam AI
- Supports all Indian languages
- Returns audio data in WAV format

#### 3. Combined Translation & TTS Endpoint
```
POST /api/translate-tts
```
- Performs translation and TTS in one request
- Optimized for better performance
- Returns complete result with audio

### Frontend Components

#### TTSPlayer Component
- **Location**: `src/components/TTSPlayer.jsx`
- **Features**:
  - Language selection dropdown
  - Translation and TTS processing
  - Audio playback controls
  - Error handling and loading states
  - Translated text display

#### Updated Language Support
- **File**: `src/utils/languages.js`
- **Added Languages**: 10 new Indian languages
- **Tesseract Mapping**: Updated OCR language codes
- **Translations**: Added Marathi translations as example

### Configuration

#### Sarvam AI Setup
```javascript
// API Key Configuration
const SARVAM_API_KEY = "sk_sb5gdo6f_zbutFjWzkn02WwpwkZUmiNy9"

// Client Initialization
const sarvamClient = new SarvamAIClient({
  apiSubscriptionKey: SARVAM_API_KEY
})
```

#### Default TTS Settings
```javascript
const defaultOptions = {
  speaker: 'anushka',
  pitch: 0,
  pace: 1,
  loudness: 1,
  speech_sample_rate: 22050,
  enable_preprocessing: true,
  model: 'bulbul:v2'
}
```

## Usage

### For Users

1. **Process a Medical Report**: Upload or capture a medical report image
2. **Generate Summary**: Wait for OCR and AI analysis to complete
3. **Access TTS Feature**: Scroll to the "Translate & Listen to Summary" section
4. **Select Language**: Choose your preferred Indian language from the dropdown
5. **Translate & Listen**: Click "Translate & Listen" button
6. **Play Audio**: Use the play/pause button to listen to the translated summary

### For Developers

#### Adding New Languages
1. Update `sarvamLanguages` array in `src/utils/sarvamService.js`
2. Add language code to `availableLanguages` in `src/utils/languages.js`
3. Add Tesseract mapping in `tesseractLanguageMap`
4. Add translations to the `translations` object

#### Customizing TTS Settings
```javascript
const customOptions = {
  speaker: 'anushka',
  pitch: 0.5,        // -1 to 1
  pace: 1.2,         // 0.5 to 2
  loudness: 1.5,     // 0.5 to 2
  speech_sample_rate: 22050,
  enable_preprocessing: true,
  model: 'bulbul:v2'
}
```

## API Response Format

### Translation Response
```json
{
  "originalText": "Original English text",
  "translatedText": "Translated text in target language",
  "sourceLanguage": "en",
  "targetLanguage": "hi"
}
```

### TTS Response
```json
{
  "audioData": {
    "audio": "base64_encoded_audio_data",
    "format": "wav",
    "sample_rate": 22050
  },
  "targetLanguage": "hi-IN"
}
```

### Combined Response
```json
{
  "originalText": "Original English text",
  "translatedText": "Translated text in target language",
  "audioData": {
    "audio": "base64_encoded_audio_data"
  },
  "sourceLanguage": "en",
  "targetLanguage": "hi-IN"
}
```

## Error Handling

The integration includes comprehensive error handling:

- **API Failures**: Graceful fallback with user-friendly error messages
- **Network Issues**: Retry mechanisms and offline detection
- **Invalid Input**: Input validation and sanitization
- **Audio Playback**: Browser compatibility checks

## Performance Considerations

- **Caching**: Audio data is cached to avoid redundant API calls
- **Optimization**: Combined endpoints reduce network requests
- **Loading States**: Visual feedback during processing
- **Memory Management**: Proper cleanup of audio resources

## Security

- **API Key Protection**: Keys are stored server-side only
- **Input Validation**: All user inputs are validated and sanitized
- **Rate Limiting**: Implemented to prevent abuse
- **HTTPS**: All API calls use secure connections

## Future Enhancements

1. **Voice Selection**: Multiple speaker voices per language
2. **Batch Processing**: Translate multiple reports at once
3. **Offline Support**: Download audio for offline listening
4. **Voice Commands**: Speech-to-text for hands-free operation
5. **Custom Voices**: User-specific voice training

## Troubleshooting

### Common Issues

1. **Audio Not Playing**: Check browser autoplay settings
2. **Translation Errors**: Verify internet connection and API status
3. **Language Not Available**: Ensure language is in supported list
4. **Slow Processing**: Check network speed and API response times

### Debug Information

Enable console logging for debugging:
```javascript
console.log('Translation and TTS debug info:', {
  text: text.substring(0, 100),
  targetLanguage: selectedLanguage,
  response: result
})
```

## Dependencies

- `sarvamai`: Sarvam AI SDK for text-to-speech
- `@google/generative-ai`: Google Gemini AI for translation
- `axios`: HTTP client for API requests
- `react`: Frontend framework

## License

This integration follows the same license as the main project. Please refer to the main LICENSE file for details. 