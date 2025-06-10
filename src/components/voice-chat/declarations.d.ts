declare module '*.tsx' {
  import type { FC } from 'react';
  const component: FC;
  export default component;
}

declare module './VoiceRecorder' {
  import type { FC } from 'react';
  import type { VoiceRecorderProps } from './types';
  export const VoiceRecorder: FC<VoiceRecorderProps>;
}

declare module './VoicePlayer' {
  import type { FC } from 'react';
  import type { VoicePlayerProps } from './types';
  export const VoicePlayer: FC<VoicePlayerProps>;
}

declare module './ChatMessages' {
  import type { FC } from 'react';
  import type { ChatMessagesProps } from './types';
  export const ChatMessages: FC<ChatMessagesProps>;
}

declare module './VoiceActivityDetector' {
  export class VoiceActivityDetector {
    constructor(
      stream: MediaStream,
      options: Partial<{
        silenceThreshold: number;
        silenceDuration: number;
        minSpeechDuration: number;
        maxSpeechDuration: number;
        energyThreshold: number;
        smoothingFactor: number;
      }>,
      callbacks: {
        onSpeechStart: () => void;
        onSpeechEnd: () => void;
        onSilence: () => void;
      }
    );
    updateOptions(newOptions: Partial<{
      silenceThreshold: number;
      silenceDuration: number;
      minSpeechDuration: number;
      maxSpeechDuration: number;
      energyThreshold: number;
      smoothingFactor: number;
    }>): void;
    stop(): void;
  }
} 