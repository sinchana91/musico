import axios from 'axios';
import pkg from '@mhoc/axios-digest-auth';
const {AxiosDigestAuth} = pkg;

const USERNAME = 'sinchi';
const PASSWORD = 'sinchi@2003';

const digestAuth = new AxiosDigestAuth({
    username:USERNAME,
    password:PASSWORD,
  });


const fetchSongFromAPI = async (id) => {
    try {
        const response = await digestAuth.request({
            method:"GET",
            url:`https://musicbrainz.org/ws/2/recording/${id}`,
            params: { fmt: 'json', inc: 'genres user-genres tags' },
            headers: { Accept: 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching song data from ID ${id}:`, error);
        throw error;
    }
};

const fetchSongsByGenreFromAPI = async (genre) => {
    try {
        const response = await digestAuth.request({
            method:"GET",
            url:'https://musicbrainz.org/ws/2/recording', 
            params: { query: `tag:${genre}`, fmt: 'json', limit: 10 },
            headers: { Accept: 'application/json' }
        });
        return response.data.recordings;
    } catch (error) {
        console.error(`Error fetching songs data for genre ${genre}:`, error);
        throw error;
    }
};

const recommendSongs = async (req, res) => {
    const { song_id } = req.query;
    if (!song_id) return res.status(400).json({ error: 'Song ID is required' });
    try {
        const song = await fetchSongFromAPI(song_id);
        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }
        const tags = song.tags || [];
        const genres = song['genre-list'] || [];
        const genre = tags.length > 0 ? tags[0].name : genres.length > 0 ? genres[0].name : null;

        if (!genre) {
            return res.status(404).json({ error: 'Genre not found' });
        }

        const similarSongs = await fetchSongsByGenreFromAPI(genre);
        const filteredSongs = similarSongs.filter(similarSong => similarSong.id !== song_id);
        res.status(200).json({ filteredSongs });
    } catch (error) {
        console.error('Error recommending songs:', error);
        res.status(500).json({ message: error.message });
    }
};

export { recommendSongs };
