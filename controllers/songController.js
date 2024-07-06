import prisma from "../config/db";

const createSong = async (req, res) => {
    const {title,artisit,genre,duration}=req.body;
    try{
        const song=await prisma.song.create({
            data:{
                title,
                artisit,
                genre,
                duration
            }
        });
        res.status(200).json({song});
    }catch(error){
        console.error(error);
        res.status(500).json({message:error.message});
    }
}

const getAllSongs = async (req, res) => {
    try{
        const songs=await prisma.song.findMany();
        res.status(200).json({songs});
    }catch(error){
        console.error(error);
        res.status(500).json({message:error.message});
    }
}

const seachSong = async (req, res) => {
    const {title}=req.query;
    try{
        const songs=await prisma.song.findMany({
            where:{
                title:{
                    contains:title
                }
            }
        });
        res.status(200).json({songs});
    }catch(error){
        console.error(error);
        res.status(500).json({message:error.message});
    }
}

export {createSong,getAllSongs,seachSong};