import axios from "axios";


const fetchSongFromAPI = async (id) => {
    try{
        const response=await axios.get(`https://musicbrainz.org/ws/2/recording/${id}`,{headers: {Accept: 'application/json'}});
        return response.data;
    }catch(error){
        console.error(`error fetching song data from ID ${id}:`,error);
        throw error;
        
    }
}

const fetchSOngsByGenreFromAPI = async (genre) => { 
    try{
        const response=await axios.get('https://musicbrainz.org/ws/2/recording',{
            params:{query:`tag:${genre}`,fmt:'json',limit:10},
            headers:{Accept:'application/json'}
        });
        return response.data.recordings;
        }catch(error){
            console.error(`error fetching songs data for genre ${genre}:`,error);
            throw error;
        }
    }

export const recommendSongs=async(req,res)=>{
    const {song_id}=req.body;
    try{
        const song=await fetchSongFromAPI(song_id);
        if(!song){
            return res.status(404).json({error:'song not found'})

        }
        const genre=song['tags'] && song['tags'].legth>0?song['tags'][0].name:null;
        if(!genre){
            return res.status(404).json({error:'genre not found'})
        }
        const similarSongs=await fetchSOngsByGenreFromAPI(genre);
        const filteresSongs=similarSongs.filter(similarSongs=>similarSongs.id!==song_id);
        res.status(200).json({filteresSongs});
    }catch(error){
        console.error(error);
        res.status(500).json({message:error.message});
    }
}