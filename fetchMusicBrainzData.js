import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch genres from MusicBrainz
const fetchGenres = async () => {
    try {
        const response = await axios.get('https://musicbrainz.org/ws/2/genre/all',{headers: {Accept: 'application/json'}});
        return response.data.genres.map(genre => genre.name);
    } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
    }
};

// Fetch artists by genre
const fetchArtistsByGenre = async (genre) => {
    try {
        const response = await axios.get(`https://musicbrainz.org/ws/2/artist?query=tag:${genre}&limit=10`,{headers: {Accept: 'application/json'}});
        return response.data.artists;
    } catch (error) {
        console.error(`Error fetching artists for genre ${genre}:`, error);
        return [];
    }
};

// Fetch artists, albums, and tracks
const fetchMusicData = async () => {
    const genres = await fetchGenres();
    const songs = [];

    for (const genre of genres.slice(0, 5)) { // Limiting to 5 genres for demo purposes
        const artists = await fetchArtistsByGenre(genre);
        for (const artist of artists) {
            try {
                const artistResponse = await axios.get(`https://musicbrainz.org/ws/2/artist/${artist.id}?inc=releases`,{headers: {Accept: 'application/json'}});
                const artistData = artistResponse.data;

                const releasePromises = artistData.releases.slice(0, 3).map(async (release) => { // Limiting to 3 releases per artist for demo purposes
                    try {
                        const releaseResponse = await axios.get(`https://musicbrainz.org/ws/2/release/${release.id}?inc=recordings`,{headers: {Accept: 'application/json'}});
                        const releaseData = releaseResponse.data;

                        releaseData.media[0].tracks.forEach((recording) => {
                            songs.push({
                                title: recording.title,
                                artist: artistData.name,
                                genre: genre,
                                duration: recording.length || 0,
                            });
                        });
                    } catch (error) {
                        console.error(`Error fetching release data for release ${release.id}:`, error);
                    }
                });

                await Promise.all(releasePromises);
            } catch (error) {
                console.error(`Error fetching music data for artist ${artist.id}:`, error);
            }
        }
    }

    return songs;
};

// Store fetched data in the database
const storeMusicData = async () => {
    const songs = await fetchMusicData();
    try {
        for (const song of songs) {
            await prisma.song.create({
                data: song,
            });
        }
        console.log('Music data stored successfully');
    } catch (error) {
        console.error('Error storing music data:', error);
    }
};

storeMusicData();
