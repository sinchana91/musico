import axios from 'axios';


const getRecommendationSongs=async(songId)=>{
    try{
        const response =await axios.post('http://localhost:5001/recommend', { song_id: songId });
        return response.data;
    }catch(error){
        console.error(error);
    throw new Error('Error fetching recommendations from Python');
    }


}
export {getRecommendationSongs};