import express from 'express';
import dotenv from 'dotenv';
// import {userRoute} from '/routes/authRoutes.js';
import playlistRoute from './routes/playlistRoutes.js';
import songRoute from './routes/songRoutes.js';
import authRoute from './routes/authRoutes.js';
import recommendationRoute from './routes/recommendationRoutes.js';

dotenv.config();
const app=express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('API is running');
});


// app.use('/api/users',userRoute);
app.use('/api/auth',authRoute);
app.use('/api/playlists',playlistRoute);
app.use('/api/songs',songRoute);
app.use('/api/recommendations',recommendationRoute);

const PORT=process.env.PORT || 5000;
app.listen(PORT,console.log(`Server running in  port ${PORT}`));