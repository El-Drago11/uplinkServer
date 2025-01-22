require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT
const frontendUrl = process.env.FRONT_END_URL
const cookieParser = require('cookie-parser');
const cors = require('cors')
const http = require('http');
const initializeTheSocket = require('./utils/socket');
const userRoute = require('./routes/User')

//Db connection
require('./config/database').connect()

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:frontendUrl,
    credentials:true
}))


//App Routes
app.use('/api/v1/auth',userRoute)

//socket server setup
const server = http.createServer(app);
initializeTheSocket(server)

//default backend route
app.use("/",(req,res)=>{
    return res.json({
        success:true,
        message:`Uplink live at port : ${port}`
    })
})

server.listen(port,()=>{
    console.log(`Server started at port ${port}`)
})