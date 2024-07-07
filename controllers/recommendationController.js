import prisma from '../config/db.js';

export const recommendSongs = async (req, res) => {
    const { song_id } = req.body;
    try {
        const song = await prisma.song.findUnique({ where: { id: song_id } });
        if (!song) return res.status(404).json({ error: 'Song not found' });

        const similarSongs = await prisma.song.findMany({
            where: {
                genre: song.genre,
                id: { not: song_id }
            }
        });
        res.json(similarSongs);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
