import prisma from "../config/db.js";

const createPlaylist = async (req, res) => {
    const { name, songs } = req.body;
    try {
        const playlist = await prisma.playlist.create({
            data: {
                name,
                userId: req.user.id,
                songs: {
                    create: songs.map(songId => ({ songId }))
                },
            }
        });
        res.status(200).json({ playlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getUserPlaylists = async (req, res) => {
    try {
        const playlists = await prisma.playlist.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                songs: true
            }
        });
        res.status(200).json({ playlists });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const deletePlaylist = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.playlist.delete({
            where: {
                id
            }
        });
        res.status(200).json({ message: "Playlist deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const updatePlaylist = async (req, res) => {
    const {id} = req.params;
    const {name, songs} = req.body;
    try {
        // Disconnect existing songs
        await prisma.playlistSongs.deleteMany({
            where: {
                playlistId: id
            }
        });

        // Update playlist with new name and connect new songs
        const playlist = await prisma.playlist.update({
            where: {
                id
            },
            data: {
                name,
                songs: {
                    create: songs.map(songId => ({
                        songId
                    }))
                }
            },
            include: {
                songs: true
            }
        });
        res.status(200).json({playlist});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
}
;

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export { createPlaylist, getUserPlaylists, getUserById, deletePlaylist, updatePlaylist };
