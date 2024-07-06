import axios from 'axios';


const getRecommendationSongs=async(SongTitle)=>{
    try{
        const response=await axios.get(`http://localhost:5000/recommendation/recommend`,{song_title:SongTitle});
        return response.data;
    }catch(error){
        console.error(error);
        return {message:error.message};
    }


}
export {getRecommendationSongs};