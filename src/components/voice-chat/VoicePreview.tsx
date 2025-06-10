import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";
import type { VoiceConfig } from './types';
import { ELEVENLABS_CONFIG, textToSpeech } from '@/config/elevenlabs';

interface VoicePreviewProps {
  voice: VoiceConfig;
  elevenlabsApiKey: string;
  className?: string;
}

export const VoicePreview: React.FC<VoicePreviewProps> = ({
  voice,
  elevenlabsApiKey,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const previewText = "Hello! I'm your AI learning assistant. How can I help you today?";

  const playPreview = async () => {
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      const audioBlob = await textToSpeech(previewText, voice.id, elevenlabsApiKey);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const newAudio = new Audio(audioUrl);
      newAudio.onended = () => {
        setIsPlaying(false);
        setAudio(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing voice preview:', error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={playPreview}
      className={className}
      title="Play voice preview"
    >
      {isPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );
}; 