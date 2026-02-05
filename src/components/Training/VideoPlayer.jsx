import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw } from 'lucide-react';

export default function VideoPlayer({ videoUrl, title, onProgress, onComplete }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      if (onProgress) {
        onProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) {
        onComplete();
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onProgress, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const changePlaybackRate = (rate) => {
    const video = videoRef.current;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!document.fullscreenElement) {
      video.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <div className="relative">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto"
          poster="/placeholder.svg?height=400&width=800"
        />
        
        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="bg-black bg-opacity-50 rounded-full p-4 text-white hover:bg-opacity-70 transition-all"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-16 left-0 right-0 px-4">
          <div
            className="w-full h-1 bg-gray-300 rounded cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-blue-600 rounded"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="hover:text-blue-400">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="hover:text-blue-400">
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => changePlaybackRate(0.5)}
                  className={`text-xs px-2 py-1 rounded ${playbackRate === 0.5 ? 'bg-blue-600' : 'bg-gray-600'}`}
                >
                  0.5x
                </button>
                <button
                  onClick={() => changePlaybackRate(1)}
                  className={`text-xs px-2 py-1 rounded ${playbackRate === 1 ? 'bg-blue-600' : 'bg-gray-600'}`}
                >
                  1x
                </button>
                <button
                  onClick={() => changePlaybackRate(1.25)}
                  className={`text-xs px-2 py-1 rounded ${playbackRate === 1.25 ? 'bg-blue-600' : 'bg-gray-600'}`}
                >
                  1.25x
                </button>
                <button
                  onClick={() => changePlaybackRate(1.5)}
                  className={`text-xs px-2 py-1 rounded ${playbackRate === 1.5 ? 'bg-blue-600' : 'bg-gray-600'}`}
                >
                  1.5x
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              
              <button onClick={toggleFullscreen} className="hover:text-blue-400">
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
