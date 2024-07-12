



// Function to fetch song details from Spotify
import axios from 'axios';

const CLIENT_ID = '461004eccffb4a2e9216fd15855d8d38';
const CLIENT_SECRET = 'a2ab5743e21a45e4b96d2bec94c8d48d';
let accessToken = null;

const getAccessToken = async () => {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
            }
        });
        accessToken = response.data.access_token;
        return accessToken;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
};

const fetchSongFromAPI = async (id) => {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching song data from ID ${id}:`, error);
        throw error;
    }
};

const fetchRecommendationsFromAPI = async (seed_track) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/recommendations', {
            params: {
                seed_tracks: seed_track,
                limit: 10
            },
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        return response.data.tracks;
    } catch (error) {
        console.error(`Error fetching recommendations for seed track ${seed_track}:`, error);
        throw error;
    }
};

const recommendSongs = async (req, res) => {
    const { song_id } = req.query;
    if (!song_id) return res.status(400).json({ error: 'Song ID is required' });

    try {
        await getAccessToken();
        const song = await fetchSongFromAPI(song_id);
        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }

        const recommendations = await fetchRecommendationsFromAPI(song_id);
        res.status(200).json({ recommendations });
    } catch (error) {
        console.error('Error recommending songs:', error);
        res.status(500).json({ message: error.message });
    }
};

export { recommendSongs };
