import { getRecommendationSongs } from "../services/pythonService";


const getRecommendtion=async(req,res)=>{
    const {songTitle}=req.body;
    try{
        const songs=await getRecommendationSongs(songTitle);
        res.status(200).json({songs});
    }catch(error){
        console.error(error);
        res.status(500).json({message:error.message});
    }
}

export {getRecommendtion};