import 'dotenv/config'
import http from 'http'//--------------------------because it make ease while using socket
import app from './src/app.js';
import connectdb from './src/db/db.js';

const server = http.createServer(app)

const port = process.env.PORT||4000

connectdb()

app.listen(port , function(){
    console.log(`server is running on ${port}` )
})