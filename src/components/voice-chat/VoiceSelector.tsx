import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VoicePreview } from './VoicePreview';
import type { VoiceConfig } from './types';

interface VoiceSelectorProps {
  voices: VoiceConfig[];
  selectedVoice: VoiceConfig;
  onVoiceChange: (voice: VoiceConfig) => void;
  elevenlabsApiKey: string;
  className?: string;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoice,
  onVoiceChange,
  elevenlabsApiKey,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select
        value={selectedVoice.id}
        onValueChange={(value) => {
          const voice = voices.find(v => v.id === value);
          if (voice) {
            onVoiceChange(voice);
          }
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a voice">
            {selectedVoice.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span>{voice.name}</span>
                  {voice.description && (
                    <span className="text-xs text-muted-foreground">
                      {voice.description}
                    </span>
                  )}
                </div>
                <VoicePreview
                  voice={voice}
                  elevenlabsApiKey={elevenlabsApiKey}
                  className="ml-2"
                />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <VoicePreview
        voice={selectedVoice}
        elevenlabsApiKey={elevenlabsApiKey}
      />
    </div>
  );
}; 