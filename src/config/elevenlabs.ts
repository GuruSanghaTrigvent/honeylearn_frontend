// ElevenLabs Configuration
export const ELEVENLABS_CONFIG = {
  agentId: 'agent_01jvj8dgh5fdtt524zd6r5bffk',
  modelId: 'eleven_monolingual_v1',
  voiceSettings: {
    stability: 0.5,
    similarity_boost: 0.75,
  },
  // Default voices configuration
  defaultVoices: [
    {
      id: '21m00Tcm4TlvDq8ikWAM',
      name: 'Rachel',
      description: 'Clear and professional female voice'
    },
    {
      id: 'AZnzlk1XvdvUeBnXmlld',
      name: 'Domi',
      description: 'Warm and friendly female voice'
    },
    {
      id: 'EXAVITQu4vr4xnSDxMaL',
      name: 'Bella',
      description: 'Soft and gentle female voice'
    },
    {
      id: 'ErXwobaYiN019PkySvjV',
      name: 'Antoni',
      description: 'Deep and authoritative male voice'
    },
    {
      id: 'MF3mGyEYCl7XYWbV9V6O',
      name: 'Elli',
      description: 'Young and energetic female voice'
    }
  ],
  // API endpoints
  endpoints: {
    textToSpeech: (voiceId: string) => `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    user: 'https://api.elevenlabs.io/v1/user',
    voices: (voiceId: string) => `https://api.elevenlabs.io/v1/voices/${voiceId}`,
  }
};

// Helper function to check if ElevenLabs is available in the browser environment
export const isElevenLabsAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         !window.location.hostname.includes('localhost') &&
         navigator.onLine;
};

// Helper functions for ElevenLabs integration
export const loadElevenLabsScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if script is already loaded and component is registered
    if (window.customElements && window.customElements.get('elevenlabs-convai')) {
      console.log("ElevenLabs component is already registered");
      resolve(true);
      return;
    }
    
    // Remove any existing failed scripts
    const existingScripts = document.querySelectorAll('script[data-elevenlabs]');
    existingScripts.forEach(script => {
      document.head.removeChild(script);
    });
    
    // Create and append the script
    const script = document.createElement('script');
    script.src = 'https://cdn.elevenlabs.io/convai/v1/index.js';
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute('data-elevenlabs', 'true');
    
    // Set timeout for script loading
    const timeoutId = setTimeout(() => {
      console.error("ElevenLabs script load timeout");
      resolve(false);
    }, 10000); // 10 seconds timeout
    
    script.onload = () => {
      clearTimeout(timeoutId);
      // Give time for component registration
      setTimeout(() => {
        const isRegistered = !!(window.customElements && 
                               window.customElements.get('elevenlabs-convai'));
        console.log(`ElevenLabs component registered: ${isRegistered}`);
        resolve(isRegistered);
      }, 2000);
    };
    
    script.onerror = () => {
      clearTimeout(timeoutId);
      console.error("Error loading ElevenLabs script");
      resolve(false);
    };
    
    document.head.appendChild(script);
  });
};

// Helper function to validate ElevenLabs API key
export const validateElevenLabsApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch(ELEVENLABS_CONFIG.endpoints.user, {
      headers: {
        'xi-api-key': apiKey
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating ElevenLabs API key:', error);
    return false;
  }
};

// Helper function to convert text to speech
export const textToSpeech = async (
  text: string,
  voiceId: string,
  apiKey: string
): Promise<Blob> => {
  const response = await fetch(ELEVENLABS_CONFIG.endpoints.textToSpeech(voiceId), {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: ELEVENLABS_CONFIG.modelId,
      voice_settings: ELEVENLABS_CONFIG.voiceSettings,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Text-to-speech failed: ${error.detail?.message || 'Unknown error'}`);
  }

  return response.blob();
};

