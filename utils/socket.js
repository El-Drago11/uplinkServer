require('dotenv').config();
const socket = require("socket.io");
const { verifySocket } = require('../middleware/auth');
const game = require('../models/game');


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
        const gameId = socket.handshake.auth.gameId;
        socket.on("click-event", async () => {
            try {
                await game.findOneAndUpdate(
                    { _id: gameId }, // Filter by gameId
                    { $inc: { clickCount: 1 } }, // Increment click count
                );
                return;
            } catch (err) {
                console.error("Database operation failed:", err.message);
            }
        });
    
        socket.on("disconnect", () => {});
    });
    
}

module.exports = initializeTheSocket;