import express from 'express'
import userrouter from './routes/user.routes.js'
import projectRoutes from '../src/routes/project.routes.js'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'
import aiRoutes from '../src/routes/ai.routes.js'


const app = express()

//middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(morgan("dev"))


//prefix
app.use('/api/users' , userrouter)
app.use('/api/projects' , projectRoutes)

app.use('/api/ai' ,aiRoutes )

app.get("/", (req, res) => {
  res.send("API is running");
});
export default app