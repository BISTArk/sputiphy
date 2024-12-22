//271a574ba03140e79ddc97fef6f69a40
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, TextField, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SongCard from './components/SongCard';
import LikedSongs from './components/LikedSongs';

const CLIENT_ID = '271a574ba03140e79ddc97fef6f69a40';
const REDIRECT_URI = 'http://localhost:3000/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPE = 'user-library-read user-library-modify';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function Home({ token, logout, searchTracks, tracks, setQuery, handleLike, handleUnlike, likedTrackIds }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Spotify Song Search
          </Typography>
          <Button component={Link} to="/liked-songs" color="inherit">
            Liked Songs
          </Button>
          {!token ? (
            <Button
              color="inherit"
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
            >
              Login
            </Button>
          ) : (
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ padding: '20px' }}>
        {token && (
          <form onSubmit={searchTracks}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search for a song"
              onChange={(e) => setQuery(e.target.value)}
              sx={{ marginBottom: '20px' }}
              InputProps={{
                style: {
                  color: 'black', // Change the text color to black
                },
              }}
            />
            <Button variant="contained" color="primary" type="submit">
              Search
            </Button>
          </form>
        )}

        <div style={{ marginTop: '20px' }}>
          {tracks.map((track) => (
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
    </ThemeProvider>
  );
}

function Callback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = new URLSearchParams(location.hash.substring(1));
    const token = hash.get('access_token');

    if (token) {
      window.localStorage.setItem('token', token);
      navigate('/');
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
}

function App() {
  const [token, setToken] = useState(window.localStorage.getItem('token') || '');
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [likedTrackIds, setLikedTrackIds] = useState([]);

  useEffect(() => {
    if (token) fetchLikedSongs();
  }, [token]);

  const fetchLikedSongs = async () => {
    let allSongs = [];
    let url = 'https://api.spotify.com/v1/me/tracks';  // Initial request URL

    // Continue fetching while there is a next page
    while (url) {
      try {
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Add the current page of tracks to the allSongs array
        allSongs = [...allSongs, ...data.items.map((item) => item.track)];

        // Set the URL to the next page if available
        url = data.next;
      } catch (error) {
        console.error('Error fetching liked songs:', error);
        break;  // Exit the loop in case of an error
      }
    }

    // Once all songs are fetched, update the state
    setLikedSongs(allSongs);
    setLikedTrackIds(allSongs.map((item) => item.id));
  };

  const logout = () => {
    setToken('');
    window.localStorage.removeItem('token');
  };

  const searchTracks = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'track' },
    });
    setTracks(data.tracks.items);
  };

  // Handle song like operation and update the state
  const handleLike = async (trackId) => {
    await axios.put(`https://api.spotify.com/v1/me/tracks`, { ids: [trackId] }, { headers: { Authorization: `Bearer ${token}` } });

    // Update liked songs state
    setLikedTrackIds((prevLikedTrackIds) => [...prevLikedTrackIds, trackId]);
  };

  // Handle song unlike operation and update the state
  const handleUnlike = async (trackId) => {
    await axios.delete(`https://api.spotify.com/v1/me/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { ids: [trackId] },
    });

    // Update liked songs state
    setLikedTrackIds((prevLikedTrackIds) => prevLikedTrackIds.filter((id) => id !== trackId));
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              token={token}
              logout={logout}
              searchTracks={searchTracks}
              tracks={tracks}
              setQuery={setQuery}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              likedTrackIds={likedTrackIds}
            />
          }
        />
        <Route
          path="/liked-songs"
          element={
            <LikedSongs
              token={token}
              likedSongs={likedSongs}
              logout={logout}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              likedTrackIds={likedTrackIds}
              fetchLikedSongs={fetchLikedSongs}
            />
          }
        />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;
