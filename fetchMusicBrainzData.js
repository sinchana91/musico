import axios from 'axios';
import { PrismaClient } from '@prisma/client';
const prisma=new PrismaClient();
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
const fetchArtistsByGenre=sync(genre)=>{
try{
    const response=await axios.get(`https://musicbrainz.org/ws/2/artist?query=tag:${genre}&limit=10`);
    return response.data.artists
}catch(error){
    console.error(`Error fetching artists for genre ${genre}:`,error);
    return [];
}
}

//fetch artist,alnums,tracks
const fetchMusicData=async()=>{
    const genres=await fetchGenres();
    const songs=[]
    for (const genre of genres.slice(0,5)){
        const artists=await fetchArtistsByGenre(genre);
        for (const artist of artists){
            try{
                const artistResponse=await axios.get(`https://musicbrainz.org/ws/2/artist/${artist.id}?inc=releases`);
                const artistData=artistResponse.data;
                for (const release of artistData.releases.slice(0,3)){
                    const releaseResponse=await axios.get(`https://musicbrainz.org/ws/2/release/${release.id}?inc=recordings`);
                    const releaseData=releaseResponse.data;
                    for (const recording of releaseData.media[0].tracks){
                        songs.push({
                            title: recording.title,
                            artist: artistData.name,
                            genre: genre,
                            duration: recording.length || 0,
                        })
                    }
                }
            }catch(error){
                console.error(`Error fetching music data for artist ${artist.id}:`,error);
            }
    }
}
return songs;
};

//STORE FETHCED DATA IN THE DATABSES
const storeMusicData=async()=>{
    const songs=await fetchMusicData();
    try{
        for(const song of songs){
            await prisma.song.create({
                data:song,
            });
        }
        console.log('Music data stored successfully');
    }catch(error){
        console.error('Error storing music data:',error);
    }
};

storeMusicData();
