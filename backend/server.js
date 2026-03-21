import 'dotenv/config'
import http from 'http'//--------------------------because it make ease while using socket
import app from './src/app.js';
import connectdb from './src/db/db.js';
import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'

const port = process.env.PORT || 4000
const server = http.createServer(app)
const io = new Server(server, {

    cors: {
        origin: '*',
    }

});

io.use((socket, next) => {


    try {

        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];;

        if (!token) {
            return next(new Error('Authentication error'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)


        if (!decoded) {
            return next(new Error('Authentication error'))
        }



        socket.user = decoded

        next();

    } catch (error) {
        next(error)
    }


})

io.on('connection', socket => {

    console.log("user is connected")

    socket.on('event', data => { /* … */ });
    socket.on('disconnect', () => { /* … */ });
});







connectdb()

server.listen(port, function () {
    console.log(`server is running on ${port}`)
})