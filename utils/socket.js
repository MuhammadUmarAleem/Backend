const { Server } = require("socket.io");

let io;

exports.initWebSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Allows connections from any origin, adjust if needed
            methods: ["GET", "POST", "PUT"], // Allowed methods
        },
    });

    console.log("WebSocket server initialized");


    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("joinConversation", (conversationId) => {
            socket.join(conversationId);
            console.log(`User joined conversation room: ${conversationId}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
};

exports.getIO = () => io;
