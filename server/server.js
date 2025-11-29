import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import router from './routes/foodRoutes.js';
import foodItem from './models/foodItem.js';
import { Server } from 'socket.io';
import http from 'http'
import { Socket } from 'dgram';
dotenv.config();
connectDB();
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
})
app.set('socketio',io);
io.on('connection',(socket)=>{
    console.log('New Client Connected',socket.id);
    socket.on('disconnect',()=>{
        console.log('Client Disconected');
    })
})
app.use(cors());
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const PORT = process.env.PORT || 5000;
app.use('/api/food',router);
app.get('/',(req,res)=>{
    res.send('API is running....');
})
server.listen(PORT,()=>{
    console.log(`server is running on port${PORT}`)
})