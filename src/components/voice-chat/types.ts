export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  audioUrl?: string;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
}

export interface VoiceConfig {
  id: string;
  name: string;
  description: string;
}

export interface VoiceChatProps {
  onMessage?: (message: Message) => void;
  className?: string;
  initialMessages?: Message[];
  openaiApiKey?: string;
  elevenlabsApiKey?: string;
  voiceConfig?: VoiceConfig;
  systemPrompt?: string;
  vadOptions?: Partial<{
    silenceThreshold: number;
    silenceDuration: number;
    minSpeechDuration: number;
    maxSpeechDuration: number;
    energyThreshold: number;
    smoothingFactor: number;
  }>;
}

export interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  isRecording: boolean;
  onRecordingChange: (isRecording: boolean) => void;
  silenceThreshold?: number;
  silenceDuration?: number;
  minSpeechDuration?: number;
  maxSpeechDuration?: number;
  energyThreshold?: number;
  smoothingFactor?: number;
  onSendCurrentRecording?: () => void;
}

export interface VoicePlayerProps {
  audioUrl: string;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
  className?: string;
}

export interface ChatMessagesProps {
  messages: Message[];
}

export interface VoiceSelectorProps {
  voices: VoiceConfig[];
  selectedVoice: VoiceConfig;
  onVoiceChange: (voice: VoiceConfig) => void;
  elevenlabsApiKey: string;
  className?: string;
} 