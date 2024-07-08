import axios from 'axios';

const fetchSongFromAPI = async (id) => {
    try{
        const response=await axios.get(`https://musicbrainz.org/ws/2/recording/${id}`,{headers: {Accept: 'application/json'}});
        return response.data;
    }catch(error){
        console.error(`error fetching song data from ID ${id}:`,error);
        throw error;
        
    }
}

const fetchSongsFromAPI=async(query){
    try{
        const response = await axios.get(`https://musicbrainz.org/ws/2/recording`, {
            params: { query, limit: 10 },
            headers: { Accept: 'application/json' }
        });
        return response.data.recordings;

    }catch(error){
        console.error(`Error fetching songs data for query ${query}:`, error);
        throw error;

    }
}

const createSong = async (req, res) => {
    const {id}=req.body;
    try{
        const song=await fetchSongFromAPI(id)
        res.status(200).json({song})
    }catch(error){
        console.error(error);
        res.status(500).json({message:error.message});
    }
}

const getAllSongs = async (req, res) => {
    try{
        const songs = await fetchSongsFromAPI(''); // Fetch top songs or any default query
        res.status(200).json({ songs });
    }catch(error){
        console.error(error);
        res.status(500).json({message:error.message});
    }
}

const searchSong = async (req, res) => {
    const {title}=req.query;
    try{
        const songs = await fetchSongsFromAPI(title);
        res.status(200).json({ songs });
    }catch(error){
        console.error(error);
        res.status(500).json({message:error.message});
    }
}

export {createSong,getAllSongs,searchSong};