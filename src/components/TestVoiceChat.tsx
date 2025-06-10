import React from 'react';
import { VoiceChat } from './voice-chat/VoiceChat';
import { Card } from "@/components/ui/card";

export const TestVoiceChat: React.FC = () => {
  const customVadOptions = {
    silenceThreshold: -25, // Default value - adjust this
    silenceDuration: 1000,  // Default value - adjust this
    minSpeechDuration: 300,
    maxSpeechDuration: 30000,
    energyThreshold: 0.5,
    smoothingFactor: 0.3,
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Voice Chat Test</h1>
      <div className="h-[600px]">
        <VoiceChat
          onMessage={(message) => {
            console.log('New message:', message);
          }}
          openaiApiKey={import.meta.env.VITE_OPENAI_API_KEY}
          elevenlabsApiKey={import.meta.env.VITE_ELEVENLABS_API_KEY}
          vadOptions={customVadOptions}
        />
      </div>
    </Card>
  );
}; 