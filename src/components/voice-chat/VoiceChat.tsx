import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send } from "lucide-react";
import toast from 'react-hot-toast';
import { VoiceRecorder } from './VoiceRecorder';
import { VoicePlayer } from './VoicePlayer';
import { ChatMessages } from './ChatMessages';
import { VoiceSelector } from './VoiceSelector';
import type { Message, VoiceChatProps, VoiceConfig } from './types';
import { ELEVENLABS_CONFIG, validateElevenLabsApiKey, textToSpeech } from '@/config/elevenlabs';

// Default voice configurations
const DEFAULT_VOICES: VoiceConfig[] = [
  {
    id: '21m00Tcm4TlvDq8ikWAM', // Rachel
    name: 'Rachel',
    description: 'Clear and professional female voice'
  },
  {
    id: 'AZnzlk1XvdvUeBnXmlld', // Domi
    name: 'Domi',
    description: 'Warm and friendly female voice'
  },
  {
    id: 'EXAVITQu4vr4xnSDxMaL', // Bella
    name: 'Bella',
    description: 'Soft and gentle female voice'
  },
  {
    id: 'ErXwobaYiN019PkySvjV', // Antoni
    name: 'Antoni',
    description: 'Deep and authoritative male voice'
  },
  {
    id: 'MF3mGyEYCl7XYWbV9V6O', // Elli
    name: 'Elli',
    description: 'Young and energetic female voice'
  }
];

export const VoiceChat: React.FC<VoiceChatProps> = ({
  onMessage,
  className = '',
  initialMessages = [],
  openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY,
  elevenlabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY,
  voiceConfig = ELEVENLABS_CONFIG.defaultVoices[0],
  systemPrompt = 'You are a helpful AI learning assistant. Provide clear, concise, and educational responses.',
  vadOptions = {
    silenceThreshold: -45, // More sensitive to silence (lower value)
    silenceDuration: 1500, // Longer silence duration (1.5 seconds)
    minSpeechDuration: 500, // Minimum speech duration (0.5 seconds)
    maxSpeechDuration: 30000, // Maximum speech duration (30 seconds)
    energyThreshold: 0.3, // Higher energy threshold to reduce background noise
    smoothingFactor: 0.2, // Smoother transitions
  }
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceConfig>(voiceConfig);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isMessageComplete, setIsMessageComplete] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ref to hold the VoiceRecorder component instance
  const voiceRecorderRef = useRef<{ sendCurrentRecording: () => void }>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Validate API keys
  useEffect(() => {
    const validateCredentials = async () => {
      try {
        setIsLoading(true);
        setValidationError(null);

        if (!openaiApiKey) {
          throw new Error("OpenAI API key is required for voice chat functionality.");
        }
        if (!elevenlabsApiKey) {
          throw new Error("ElevenLabs API key is required for text-to-speech functionality.");
        }

        // Validate ElevenLabs API key using the helper function
        const isValid = await validateElevenLabsApiKey(elevenlabsApiKey);
        if (!isValid) {
          throw new Error('Invalid ElevenLabs API key');
        }

        console.log('ElevenLabs API key validated successfully');

        // Validate selected voice
        if (selectedVoice) {
          const voiceResponse = await fetch(ELEVENLABS_CONFIG.endpoints.voices(selectedVoice.id), {
            headers: {
              'xi-api-key': elevenlabsApiKey
            }
          });

          if (!voiceResponse.ok) {
            throw new Error('Invalid voice ID');
          }

          const voiceData = await voiceResponse.json();
          console.log('Voice validation successful:', voiceData.name);
        }

      } catch (error) {
        console.error('Validation error:', error);
        setValidationError(error instanceof Error ? error.message : 'Failed to validate credentials');
        toast.error(error instanceof Error ? error.message : 'Failed to validate credentials');
      } finally {
        setIsLoading(false);
      }
    };

    validateCredentials();
  }, [openaiApiKey, elevenlabsApiKey, selectedVoice]);

  const toggleRecording = useCallback(() => {
    if (isAssistantSpeaking || !isMessageComplete) {
      toast.error("Please wait for the current message to complete.");
      return;
    }

    // Reset states when starting a new recording
    if (!isRecording) {
      setCurrentTranscription('');
      setIsProcessing(false);
    }

    setIsRecording(prev => !prev);
  }, [isAssistantSpeaking, isMessageComplete, isRecording]);

  const handleVoiceInput = useCallback(async (audioBlob: Blob) => {
    console.log('handleVoiceInput called with audio blob size:', audioBlob.size);
    console.log('Current states:', {
      isAssistantSpeaking,
      isMessageComplete,
      isProcessing,
      isRecording
    });

    if (!openaiApiKey || !elevenlabsApiKey) {
      console.log('API keys missing');
      toast.error("API keys are not configured.");
      setIsProcessing(false);
      setIsRecording(false);
      return;
    }

    if (isAssistantSpeaking || !isMessageComplete) {
      console.log('Cannot process: isAssistantSpeaking or !isMessageComplete');
      toast.error("Please wait for the current message to complete.");
      setIsRecording(false);
      return;
    }

    // Check if the audio blob is too small (likely just background noise)
    if (audioBlob.size < 1000) { // Less than 1KB is probably just noise
      console.log('Audio too small, likely just background noise');
      setIsRecording(false);
      return;
    }

    console.log('Starting to process voice input...');
    setIsMessageComplete(false);
    setIsProcessing(true);
    setIsRecording(false); // Stop recording immediately when we start processing

    try {
      console.log('Starting transcription...');
      // 1. Transcribe audio using OpenAI Whisper
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');

      console.log('Sending transcription request...');
      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: formData,
      });

      if (!transcriptionResponse.ok) {
        const error = await transcriptionResponse.json();
        console.error('Transcription API Error:', error);
        throw new Error(`Transcription failed: ${error.error?.message || 'Unknown error'}`);
      }

      const transcriptionData = await transcriptionResponse.json();
      const transcription = transcriptionData.text;
      console.log('Transcription received:', transcription);

      if (!transcription.trim()) {
        console.log('Empty transcription received, likely silence or background noise.');
        setIsMessageComplete(true);
        setIsRecording(false);
        return;
      }

      // Add user message with transcription
      const userMessage: Message = {
        id: Date.now().toString(),
        content: transcription,
        role: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setCurrentTranscription('');

      console.log('Getting AI response...');
      // 2. Get AI response using OpenAI Chat
      const messagesForChat = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        { role: 'user', content: transcription }
      ];

      console.log('Sending chat request...');
      const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: messagesForChat,
          temperature: 0.7,
        }),
      });

      if (!chatResponse.ok) {
        const error = await chatResponse.json();
        console.error('Chat API Error:', error);
        throw new Error(`Chat failed: ${error.error?.message || 'Unknown error'}`);
      }

      const chatData = await chatResponse.json();
      const assistantResponse = chatData.choices[0].message.content;
      console.log('AI response received:', assistantResponse);

      // Prepare assistant message shell with a temporary ID
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        content: assistantResponse,
        role: 'assistant',
        timestamp: new Date(),
        audioUrl: undefined,
      };

      console.log('Converting to speech...');
      // 3. Convert text to speech using ElevenLabs
      console.log('Sending TTS request...');
      const ttsAudioBlob = await textToSpeech(assistantResponse, selectedVoice.id, elevenlabsApiKey);
      const audioUrl = URL.createObjectURL(ttsAudioBlob);

      // Update the assistant message with the audio URL
      assistantMessage.audioUrl = audioUrl;
      setMessages(prev => [...prev, assistantMessage]);
      onMessage?.(assistantMessage);

      console.log('Playing audio response...');
      // Play the audio
      setIsAssistantSpeaking(true);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        console.log('Audio playback completed');
        setIsAssistantSpeaking(false);
        setIsMessageComplete(true);
        setIsRecording(false);
        URL.revokeObjectURL(audioUrl);
      };
      await audioRef.current.play();

    } catch (error) {
      console.error('Error processing voice input:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process voice input');
      setIsMessageComplete(true);
      setIsRecording(false);
    } finally {
      setIsProcessing(false);
    }
  }, [openaiApiKey, elevenlabsApiKey, selectedVoice, messages, systemPrompt, onMessage, isAssistantSpeaking, isMessageComplete]);

  // Render the main component content
  const renderContent = () => {
    if (validationError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="text-red-500 mb-4">{validationError}</div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="flex-1 overflow-y-auto p-4">
          <ChatMessages messages={messages} />
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleRecording}
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              className="rounded-full"
              disabled={isAssistantSpeaking || !isMessageComplete}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <VoiceRecorder
              ref={voiceRecorderRef}
              isRecording={isRecording && !isAssistantSpeaking && isMessageComplete}
              onRecordingComplete={handleVoiceInput}
              onRecordingChange={setIsRecording}
              silenceThreshold={vadOptions.silenceThreshold}
              silenceDuration={vadOptions.silenceDuration}
              minSpeechDuration={vadOptions.minSpeechDuration}
              maxSpeechDuration={vadOptions.maxSpeechDuration}
              energyThreshold={vadOptions.energyThreshold}
              smoothingFactor={vadOptions.smoothingFactor}
            />

            <VoiceSelector
              voices={ELEVENLABS_CONFIG.defaultVoices}
              selectedVoice={selectedVoice}
              onVoiceChange={setSelectedVoice}
              elevenlabsApiKey={elevenlabsApiKey}
            />
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
};

export default VoiceChat;