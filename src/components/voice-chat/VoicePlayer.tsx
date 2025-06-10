import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import type { VoicePlayerProps } from './types';

export const VoicePlayer: React.FC<VoicePlayerProps> = ({
  audioUrl,
  onPlaybackStart,
  onPlaybackEnd,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);

  // Initialize audio element
  useEffect(() => {
    if (audioUrl) {
      setIsLoading(true);
      setError(null);
      
      // Create new audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Set up event listeners
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setIsLoading(false);
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        isPlayingRef.current = false;
        setCurrentTime(0);
        onPlaybackEnd?.();
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setError('Failed to load audio');
        setIsLoading(false);
      });

      // Cleanup
      return () => {
        audio.pause();
        audio.removeEventListener('loadedmetadata', () => {});
        audio.removeEventListener('timeupdate', () => {});
        audio.removeEventListener('ended', () => {});
        audio.removeEventListener('error', () => {});
      };
    }
  }, [audioUrl, onPlaybackEnd]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
          onPlaybackStart?.();
        })
        .catch((error) => {
          console.error('Playback error:', error);
          setError('Failed to play audio');
        });
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlay}
        disabled={!audioUrl || !!error || isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      <div className="flex-1">
        <Slider
          value={[currentTime]}
          max={duration}
          step={0.1}
          onValueChange={(value) => {
            if (audioRef.current) {
              audioRef.current.currentTime = value[0];
              setCurrentTime(value[0]);
            }
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        {error && (
          <div className="text-xs text-red-500 mt-1">
            {error}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 w-32">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <Slider
          value={[volume]}
          max={1}
          step={0.1}
          onValueChange={handleVolumeChange}
        />
      </div>
    </div>
  );
}; 