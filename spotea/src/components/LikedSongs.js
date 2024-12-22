// src/components/LikedSongs.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import SongCard from './SongCard';

function LikedSongs({ token, likedSongs, logout, handleLike, handleUnlike, likedTrackIds, fetchLikedSongs }) {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Liked Songs
          </Typography>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ padding: '20px' }}>
        <Button variant="contained" color="secondary" onClick={fetchLikedSongs} sx={{ marginBottom: '20px' }}>
          Reload Liked Songs
        </Button>

        <div style={{ marginTop: '20px' }}>
          {likedSongs.map((track) => (
            <SongCard
              key={track.id}
              track={track}
              isLiked={likedTrackIds.includes(track.id)}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
            />
          ))}
        </div>
      </Container>
    </>
  );
}

export default LikedSongs;
