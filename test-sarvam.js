// Test script for Sarvam AI integration
import { SarvamAIClient } from "sarvamai";

const SARVAM_API_KEY = "sk_sb5gdo6f_zbutFjWzkn02WwpwkZUmiNy9";

async function testSarvamIntegration() {
  try {
    console.log('Testing Sarvam AI integration...');
    
    // Initialize Sarvam AI client
    const sarvamClient = new SarvamAIClient({
      apiSubscriptionKey: SARVAM_API_KEY
    });

    console.log('✅ Sarvam AI client initialized successfully');

    // Test text for translation and TTS
    const testText = "Hello, this is a test of the medical report summarization system.";
    const targetLanguage = "hi-IN";

    console.log(`📝 Test text: ${testText}`);
    console.log(`🌍 Target language: ${targetLanguage}`);

    // Test TTS conversion
    console.log('🔄 Converting text to speech...');
    
    const response = await sarvamClient.textToSpeech.convert({
      text: testText,
      target_language_code: targetLanguage,
      speaker: "anushka",
      pitch: 0,
      pace: 1,
      loudness: 1,
      speech_sample_rate: 22050,
      enable_preprocessing: true,
      model: "bulbul:v2"
    });

    console.log('✅ TTS conversion successful!');
    console.log('📊 Full response structure:');
    console.log(JSON.stringify(response, null, 2));
    
    console.log('📊 Response details:');
    console.log('- Response type:', typeof response);
    console.log('- Response keys:', Object.keys(response));
    console.log('- Has audio data:', !!response.audio);
    console.log('- Audio length:', response.audio ? response.audio.length : 'N/A');

    // Test with Hindi text
    const hindiText = "नमस्ते, यह चिकित्सा रिपोर्ट सारांश प्रणाली का परीक्षण है।";
    console.log(`📝 Hindi test text: ${hindiText}`);
    
    const hindiResponse = await sarvamClient.textToSpeech.convert({
      text: hindiText,
      target_language_code: "hi-IN",
      speaker: "anushka",
      pitch: 0,
      pace: 1,
      loudness: 1,
      speech_sample_rate: 22050,
      enable_preprocessing: true,
      model: "bulbul:v2"
    });

    console.log('✅ Hindi TTS conversion successful!');
    console.log('- Hindi response keys:', Object.keys(hindiResponse));
    console.log('- Hindi audio length:', hindiResponse.audio ? hindiResponse.audio.length : 'N/A');

    console.log('\n🎉 All tests passed! Sarvam AI integration is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testSarvamIntegration(); 