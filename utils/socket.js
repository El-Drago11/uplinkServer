require('dotenv').config();
const socket = require("socket.io");
const { verifySocket } = require('../middleware/auth');


const frontendUrl = process.env.FRONT_END_URL

const initializeTheSocket = (server) => {
    //step-3: cors setup
    const io = socket(server, {
        cors: {
            origin: frontendUrl,
        }
    })
    //step-4: when the web trying to connect with the backend
    io.on("connection", async(socket) => {

        //---> Verify token
        const token = socket.handshake.auth.token
        const isVerify = await verifySocket(token)
        if(!isVerify) return;
        
        //-----> handle events
        socket.on("join-chat",({senderId,senderName,recieverId,recieverName})=>{
            //create a uniqueId
            const roomId = [senderId,recieverId].sort().join('_').trim();
            socket.join(roomId)
        });

        socket.on("send-message",async({senderId,senderName,recieverId,recieverName,message})=>{
            //step1: Get the roomId
            const roomId = [senderId,recieverId].sort().join('_').trim();
            //Step2: Send the message to the reciever 
            io.to(roomId).emit("recieve-message",{senderId,recieverId,message})
        })
        socket.on("disconnect",()=>{})
    });
}

module.exports = initializeTheSocket;