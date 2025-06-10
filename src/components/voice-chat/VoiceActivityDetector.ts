interface VADOptions {
  silenceThreshold: number;      // dB
  silenceDuration: number;       // ms
  minSpeechDuration: number;     // ms
  maxSpeechDuration: number;     // ms
  energyThreshold: number;       // 0-1
  smoothingFactor: number;       // 0-1
}

interface VADCallbacks {
  onSpeechStart: () => void;
  onSpeechEnd: () => void;
  onSilence: () => void;
  onAudioLevel?: (level: number) => void;
}

export class VoiceActivityDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private silenceTimer: number | null = null;
  private speechStartTime: number | null = null;
  private isSpeaking: boolean = false;
  private options: VADOptions;
  private onSpeechStart: () => void;
  private onSpeechEnd: () => void;
  private onSilence: () => void;
  private onAudioLevel?: (level: number) => void;
  private stream: MediaStream;
  private source: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;

  constructor(
    stream: MediaStream,
    options: Partial<VADOptions>,
    callbacks: VADCallbacks
  ) {
    // Set default options
    this.options = {
      silenceThreshold: -50,
      silenceDuration: 1000,
      minSpeechDuration: 300,
      maxSpeechDuration: 30000,
      energyThreshold: 0.5,
      smoothingFactor: 0.3,
      ...options
    };

    this.onSpeechStart = callbacks.onSpeechStart;
    this.onSpeechEnd = callbacks.onSpeechEnd;
    this.onSilence = callbacks.onSilence;
    this.onAudioLevel = callbacks.onAudioLevel;
    this.stream = stream;

    this.initializeVAD();
  }

  private initializeVAD() {
    try {
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = this.options.smoothingFactor;

      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.source.connect(this.analyser);

      this.startMonitoring();
    } catch (error) {
      console.error('Failed to initialize VAD:', error);
      throw error;
    }
  }

  private startMonitoring() {
    const bufferLength = this.analyser!.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkAudioLevel = () => {
      this.analyser!.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      const volume = average / 255; // Normalize to 0-1
      const db = 20 * Math.log10(volume);

      this.onAudioLevel?.(volume);

      if (db > this.options.silenceThreshold) {
        if (!this.isSpeaking) {
          this.isSpeaking = true;
          this.speechStartTime = Date.now();
          this.onSpeechStart();
        }
        
        // Clear silence timer if it exists
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
      } else {
        if (this.isSpeaking && !this.silenceTimer) {
          this.silenceTimer = window.setTimeout(() => {
            const speechDuration = Date.now() - (this.speechStartTime || 0);
            
            // Only trigger speech end if we've spoken long enough
            if (speechDuration >= this.options.minSpeechDuration) {
              this.isSpeaking = false;
              this.onSpeechEnd();
            }
            
            this.onSilence();
            this.silenceTimer = null;
          }, this.options.silenceDuration);
        }
      }

      this.animationFrameId = requestAnimationFrame(checkAudioLevel);
    };

    checkAudioLevel();
  }

  public updateOptions(newOptions: Partial<VADOptions>) {
    this.options = {
      ...this.options,
      ...newOptions
    };

    if (this.analyser) {
      this.analyser.smoothingTimeConstant = this.options.smoothingFactor;
    }
  }

  public stop() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.source) {
      this.source.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
} 