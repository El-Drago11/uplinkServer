require('dotenv').config();
const socket = require("socket.io");
const { verifySocket } = require('../middleware/auth');
const game = require('../models/game');
const User = require('../models/User');
const jwt = require("jsonwebtoken");

const frontendUrl = process.env.FRONT_END_URL

const initializeTheSocket = (server) => {
    //step-1: cors setup
    const io = socket(server, {
        cors: {
            origin: frontendUrl,
        }
    })

    // Middleware for token verification
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Authentication error: Token is missing."));
            }

            const isVerified = await verifySocket(token);
            if (isVerified) {
                return next();
            } else {
                return next(new Error("Authentication error: Invalid token."));
            }
        } catch (err) {
            return next(new Error("Authentication error: Internal server error."));
        }
    });

    //step-2: when the web trying to connect with the backend
    io.on("connection", async (socket) => {
        const token = socket.handshake.auth.token;
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        socket.join(decode.id.trim())
        socket.on("click-event", async ({gameId,getCount}) => {
            try {
                if(!gameId || !getCount) return new Error("Game details not found");

                //step1: update user click in DB
                const gameData = await game.findOne({_id:gameId})

                if(!gameData) return new Error("Game not found");

                const newCount =  (parseInt(getCount)+1) - gameData.clickCount

                const gameResp  = await game.findOneAndUpdate(
                    { _id: gameId },
                    { $inc: { clickCount: newCount } },
                    {new:true}
                );

                //setp2: Get user details
                const adminId = await User.findOne({accountType:'Admin'})
                const adminRoomId = adminId._id.toString();
                io.to(adminRoomId).emit('player-updated')
                io.to(decode.id.trim()).emit('player-updated',{gameResp})
                return ;

            } catch (err) {
                console.error("Database operation failed:", err);
            }
        });
        socket.on('block-user',({playerId})=>{
            io.to(playerId.toString()).emit('blocked-profile')
        })
    
        socket.on("disconnect", () => {});
    });
    
}

module.exports = initializeTheSocket;