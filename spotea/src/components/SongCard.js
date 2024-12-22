import React, { useState, useRef } from 'react';
import axios from 'axios';
import MusicPlayer from './MusicPlayer';

function SongCard({ track, isLiked, handleLike, handleUnlike }) {
  const [playPause, setPlayPause] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    setPlayPause(!playPause);
  };

  const handleNext = () => {
    // Fetch the next song from the list and update the audio URL
    // You can implement a way to get the next song from the list
  };

  const handlePrev = () => {
    // Fetch the previous song from the list and update the audio URL
  };

  const handleRepeat = () => {
    // Replay the current song
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  const fetchAudio = async (videoId) => {
    try {
      const { data } = await axios.get(`/getAudioUrl?videoId=${videoId}`);
      setAudioUrl(data.url);
      setCurrentSong(track);
    } catch (error) {
      console.error('Error fetching audio:', error);
    }
  };

  const handleSongClick = () => {
    // You can extract videoId from the track URL (assuming track.url is the YouTube link)
    const videoId = track.url.split('v=')[1];
    fetchAudio(videoId);
    togglePlayPause();
  };

  return (
    <div onClick={handleSongClick}>
      <div>
        <img src={track.album.images[0].url} alt={track.name} />
        <h4>{track.name}</h4>
        <p>{track.artists[0].name}</p>
      </div>

      {currentSong && (
        <MusicPlayer
          track={{ ...currentSong, audioUrl }}
          playPause={playPause}
          togglePlayPause={togglePlayPause}
          handleNext={handleNext}
          handlePrev={handlePrev}
          handleRepeat={handleRepeat}
          audioRef={audioRef}
        />
      )}
    </div>
  );
}

export default SongCard;
