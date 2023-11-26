const express = require("express");
const { createServer } = require("http");
require("dotenv").config();
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "https://pix-next.vercel.app",
	},
});
const PORT = process.env.PORT || 4000;
const UsersState = {
	users: [],
	setUsers: function (newUsersArray) {
		this.users = newUsersArray;
	},
};
app.get("/", async (req, res) => {
	const sockets = await io.fetchSockets();
	res.json({ message: "connected" });
});
io.on("connection", (socket) => {
	console.log(`${socket.id} connected`);
	socket.on("chat-message", ({ message, room }) => {
		io.to(room).emit("chat-message", message);
	});
	socket.on("socket-connection", (newUser) => {
		const alreadyExists = UsersState.users.find(
			(user) => user.id === newUser.id
		);
		if (!alreadyExists) {
			UsersState.setUsers([
				...UsersState.users,
				{ ...newUser, socketId: socket.id },
			]);
		}
		io.emit("online-users", { onlineUsers: UsersState.users });
	});
	socket.on("room-join", ({ room }) => {
		socket.join(room);
		console.log("room joined");
		socket.emit("message", `${room} joined`);
	});
	socket.on("typing", ({ room, userSession }) => {
		socket.broadcast.to(room).emit("typing", { room, userSession });
	});
	socket.on("disconnect", () => {
		UsersState.setUsers(
			UsersState.users.filter((user) => user.socketId !== socket.id)
		);
		io.emit("online-users", { connectedUsers: UsersState.users });
		console.log(`${socket.id} disconnected`);
	});
});
httpServer.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
