import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const fetchGenres=async()=>{
    try{
        const response =await axios.get('https://musicbrainz.org/ws/2/genre/all');
        return response.data.genres.map(genres=>genres.name);


    }catch(error){
        console.error(error);
        return [];
    }
};
//fetch artist by genre
const fetchMusicData=sync(genre)=>{
try{
    const response=await axios.get(`https://musicbrainz.org/ws/2/artist?query=tag:${genre}&limit=10`);
    return response.data.artists
}catch(error){
    console.error(`Error fetching artists for genre ${genre}:`,error);
    return [];
}
}

//fetch artist,alnums,tracks
