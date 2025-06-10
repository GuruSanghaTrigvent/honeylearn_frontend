import React, { useEffect, useRef, useState, useImperativeHandle, ForwardedRef } from 'react';
// import { Button } from "@/components/ui/button"; // Not needed in this version
// import { Mic, Square } from "lucide-react"; // Not needed in this version
// import VoiceActivityDetection from '@ricky0123/vad'; // Not using this directly anymore
import { useMicVAD } from '@ricky0123/vad-react'; // Import the hook and utils
import type { VoiceRecorderProps } from './types';

// Function to convert Float32Array to WAV Blob
const float32ToWavBlob = (audioData: Float32Array, sampleRate: number): Blob => {
  const numChannels = 1; // Mono audio
  const bytesPerSample = 2; // 16-bit audio
  const bitsPerSample = bytesPerSample * 8;

  const buffer = new ArrayBuffer(44 + audioData.length * bytesPerSample);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk length
  view.setUint32(4, 36 + audioData.length * bytesPerSample, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, numChannels * bytesPerSample, true);
  // bits per sample
  view.setUint16(34, bitsPerSample, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, audioData.length * bytesPerSample, true);

  // Write the PCM data (convert Float32 to Int16)
  let offset = 44;
  for (let i = 0; i < audioData.length; i++) {
    const s = Math.max(-1, Math.min(1, audioData[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    offset += bytesPerSample;
  }

  return new Blob([view], { type: 'audio/wav' });
};

const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

export const VoiceRecorder = React.forwardRef(({
  onRecordingComplete,
  isRecording,
  onRecordingChange,
  silenceThreshold = -45,
  silenceDuration = 1500,
  minSpeechDuration = 500,
  maxSpeechDuration = 30000,
  energyThreshold = 0.3,
  smoothingFactor = 0.2,
}: VoiceRecorderProps, ref: ForwardedRef<{ sendCurrentRecording: () => void }>) => {
  // Use the useMicVAD hook
  const vad = useMicVAD({
    startOnLoad: false,
    onSpeechEnd: (audioData) => {
      console.log('VAD: Speech Segment Complete', audioData);
      
      // Convert Float32Array to WAV Blob using fixed sample rate 16000
      const audioBlob = float32ToWavBlob(audioData, 16000); 
      
      // Pass the Blob to the parent component
      onRecordingComplete(audioBlob);
    },
    onFrameProcessed: (probs) => {
      // Update audio level for visual feedback
      setAudioLevel(probs.isSpeech ? 1 : 0); // Use isSpeech property from SpeechProbabilities
    },
    // Pass VAD options to the hook
    positiveSpeechThreshold: energyThreshold,
    negativeSpeechThreshold: 0.3,
    minSpeechFrames: Math.ceil(minSpeechDuration / 64),
  });

  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0); // Audio level from VAD hook
  const timerRef = useRef<number>();

   // Expose sendCurrentRecording via ref
   useImperativeHandle(ref, () => ({
    sendCurrentRecording: () => {
         if (vad.listening || vad.userSpeaking) {
             vad.pause(); // Pause to trigger onSpeechEnd with the current segment
             // onSpeechEnd will handle the rest (converting to blob and calling onRecordingComplete)
         }
    },
  }));


  // Effect to start/stop the VAD based on the isRecording prop from the parent (VoiceChat)
  useEffect(() => {
    if (isRecording) {
      // Start the VAD provided by the hook
      if (vad.listening === false && !vad.userSpeaking) { // Prevent double start
         vad.start();
         // Start timer for visual feedback
         timerRef.current = window.setInterval(() => {
           setRecordingTime(prev => prev + 1);
         }, 1000);
      }
    } else {
      // Stop the VAD provided by the hook
      if (vad.listening === true || vad.userSpeaking) { // Only stop if it's active
        vad.pause(); // Use pause to stop listening but keep the instance alive for potential restart
        stopTimer();
      }
    }

    // Cleanup function
    return () => {
      // Clean up timer and VAD on component unmount
      stopTimer();
      // Optionally call vad.destroy() if you want to fully clean up the VAD instance
      // vad.destroy(); // Use destroy on final component unmount if needed
    };
  }, [isRecording, vad]); // Add vad to dependency array

  // Stop timer function
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
    setRecordingTime(0);
    setAudioLevel(0); // Reset audio level
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render logic - show indicator when the hook indicates listening or speaking
  // We use vad.listening or vad.userSpeaking for display now
  const displayIndicator = vad.listening || vad.userSpeaking;

  return (
    <div className="flex items-center gap-2">
      {displayIndicator && ( // Show indicator when listening is active
        <>
          <div className="text-sm text-muted-foreground">
            {/* Recording: {formatTime(recordingTime)} */}
            {vad.userSpeaking ? 'Speaking...' : 'Listening...'}
          </div>
          {/* Audio level indicator */}
          <div className="w-20 h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-100 ease-linear"
              style={{ width: `${audioLevel * 100}%` }}
            ></div>
          </div>
        </>
      )}
      {/* Display VAD status or error if any */}
      {vad.loading && <div className="text-sm text-blue-500">Loading VAD model...</div>}
      {vad.errored && <div className="text-sm text-red-500">Error: {vad.errored}</div>}
    </div>
  );
}); 