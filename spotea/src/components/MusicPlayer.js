import React, { useState, useRef } from 'react';
import ytdl from 'ytdl-core';
import { Button, Slider } from '@mui/material';

function MusicPlayer({ track, playPause, togglePlayPause, handleNext, handlePrev, handleSeek, handleRepeat, audioRef }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Track when song is played to update the current time
  const onTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const onLoadedData = () => {
    setDuration(audioRef.current.duration);
  };

  const onSeek = (event, newValue) => {
    audioRef.current.currentTime = newValue;
    setCurrentTime(newValue);
  };

  return (
    <div>
      <h3>{track?.title}</h3>
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedData={onLoadedData}
        onEnded={handleNext}
        src={track?.audioUrl}
        controls={false}
        autoPlay={playPause}
      />
      
      <Slider
        value={currentTime}
        min={0}
        max={duration}
        step={0.1}
        onChange={onSeek}
        sx={{ width: '100%', marginTop: '10px' }}
      />

      <Button onClick={togglePlayPause}>
        {playPause ? 'Pause' : 'Play'}
      </Button>
      <Button onClick={handlePrev}>Prev</Button>
      <Button onClick={handleNext}>Next</Button>
      <Button onClick={handleRepeat}>Repeat</Button>
    </div>
  );
}

export default MusicPlayer;
