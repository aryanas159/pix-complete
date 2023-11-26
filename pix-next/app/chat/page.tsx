"use client";
import React, { useEffect, useState, useRef } from "react";
import {
	TextField,
	Button,
	Container,
	Grid,
	Stack,
	Box,
	Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import ChatUsers from "@/components/ChatUsers";
import SelectedUserInfo from "@/components/SelectedUserInfo";
import type { UserSession } from "@/types/next-auth";
import { getMessages } from "@/lib/getFunctions";
import Message from "@/components/Message";
import { postMessage } from "@/lib/getFunctions";
import UserTyping from "@/components/UserTyping";
import { socket } from "@/lib/socket";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import { ChangeEvent } from "react";
import uploadImage from "@/lib/uploadImage";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";
import ChatSection from "@/components/ChatSection";
import { useMediaQuery } from "@mui/material";
interface SocketSession extends UserSession {
	socketId: string;
}
function Chat() {
	const { data: session } = useSession();
	const [messageText, setMessageText] = useState("");
	const [onlineUsers, setOnlineUsers] = useState<Array<SocketSession>>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [currentRoom, setCurrentRoom] = useState<string>("");
	const [messages, setMessages] = useState<Array<Message>>([]);
	const [isTyping, setIsTyping] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const messageRef = useRef<HTMLDivElement>(null);
	const [image, setImage] = useState<Blob | null>(null);
	const [isLoading, setIsLoading] = useState<Boolean>(false);
	const isMobile = useMediaQuery("(max-width:800px)");
	useEffect(() => {
		if (session?.user) {
			socket.emit("socket-connection", session.user);
		}
		const onConnect = () => {
			console.log("connected");
			setIsConnected(true);
		};
		const onDisconnect = () => {
			console.log("disconnected");
			setIsConnected(false);
		};
		const onOnlineUsers = ({
			onlineUsers,
		}: {
			onlineUsers: Array<SocketSession>;
		}) => {
			setOnlineUsers(onlineUsers);
		};
		const onMessage = (message: string) => {
			console.log(message);
		};
		const onChatMessage = (message: Message) => {
			setMessages((prev) => [...prev, message]);
		};
		const onTyping = ({
			room,
			userSession,
		}: {
			room: string;
			userSession: UserSession;
		}) => {
			setIsTyping(true);
		};
		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("online-users", onOnlineUsers);
		socket.on("message", onMessage);
		socket.on("chat-message", onChatMessage);
		socket.on("typing", onTyping);
		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("online-users", onOnlineUsers);
			socket.off("message", onMessage);
			socket.off("chat-message", onChatMessage);
			socket.off("typing", onTyping);
		};
	}, []);
	useEffect(() => {
		const timeOut = setTimeout(() => {
			setIsTyping(false);
		}, 4000);
		return () => clearTimeout(timeOut);
	}, [isTyping]);
	useEffect(() => {
		if (messageRef.current) {
			messageRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "start",
			});
		}
	}, [messages, isTyping]);
	const handleMessage = async () => {
		if (image) {
			const formData = new FormData();
			formData.append("upload_preset", "my_unsigned_preset");
			formData.append("file", image);
			const { secure_url } = await uploadImage(formData);
			const message: Message = {
				message: messageText,
				senderId: session?.user.id as number,
				receiverId: selectedUser?.userId as number,
				imageUrl: secure_url,
			};
			socket.emit("chat-message", { message, room: currentRoom });
			await postMessage(message);
			setMessageText("");
			setImage(null);
			return;
		}
		if (messageText) {
			const message: Message = {
				message: messageText,
				senderId: session?.user.id as number,
				receiverId: selectedUser?.userId as number,
			};
			socket.emit("chat-message", { message, room: currentRoom });
			postMessage(message);
			setMessageText("");
		}
	};
	const handleImageAdd = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) return;
		if (e.target.files[0].type.split("/")[0] !== "image") return;
		setImage(e.target.files[0]);
	};
	const handleSelectUser = (user: User) => {
		setSelectedUser(user);
		const myId = session?.user.id as number;
		const theirId = user.userId as number;
		getMessages(myId, theirId)
			.then((res) => setMessages(res))
			.catch((err) => console.log(err));

		const room =
			myId > theirId ? `${theirId}-${myId}-room` : `${myId}-${theirId}-room`;
		setCurrentRoom(room);
		socket.emit("room-join", {
			room: room,
			user: session,
			to: selectedUser,
		});
	};
	return isMobile ? (
			<ChatSection />
		
	) : (
		<Grid
			container
			direction="row"
			spacing={8}
			className="bg-bg h-screen px-64"
		>
			<Grid item xs={4}>
				<ChatUsers
					onlineUsers={onlineUsers}
					handleUserClick={handleSelectUser}
				/>
			</Grid>
			<Grid item xs={8} className="flex flex-col h-[100vh] pb-2">
				<SelectedUserInfo selectedUser={selectedUser} />
				<Box className="flex flex-col p-4 gap-2 bg-bg-light rounded-2xl flex-1 overflow-y-scroll">
					{selectedUser ? (
						<>
							{messages.map(({ senderId, message, imageUrl }) => (
								<Message
									message={message}
									isSender={session?.user.id === senderId}
									imageUrl={imageUrl}
								/>
							))}
							{isTyping && <UserTyping />}
							<div ref={messageRef} />
						</>
					) : (
						<div className="flex flex-col items-center justify-center h-full">
							<Image
								src="assets/chat.svg"
								alt="Chat Icon"
								width={100}
								height={100}
								className="w-[150px] h-[150px]"
							/>
							<Typography className="text-[2rem] text-primary mb-2">
								Welcome to PIX Chat
							</Typography>
							<Typography className="font-light ">
								Talk and share photos among the people you follow
							</Typography>
						</div>
					)}
				</Box>
				{image && (
					<div className="p-2 relative w-[200px]">
						<div
							className="flex justify-center absolute top-2 -right-2 text-white bg-gray-dark w-[25px] h-[25px] rounded-full cursor-pointer"
							onClick={() => setImage(null)}
						>
							x
						</div>
						<img
							src={URL.createObjectURL(image)}
							width={200}
							alt="Preview"
							className="rounded-2xl"
						/>
					</div>
				)}
				{selectedUser && (
					<Box className="flex gap-2 items-center px-4 pt-2">
						<input
							type="text"
							className="px-4 py-2 rounded-full w-full bg-gray-dark text-white outline-none border-none"
							value={messageText}
							onChange={(e) => setMessageText(e.target.value)}
							placeholder="Type a message..."
							onKeyDown={() => {
								socket.emit("typing", {
									room: currentRoom,
									userSession: session?.user,
								});
							}}
						/>
						<label className="flex items-center">
							<input type="file" className="hidden" onChange={handleImageAdd} />
							<ImageIcon className="text-primary cursor-pointer" />
						</label>
						{isLoading ? (
							<Box sx={{ display: "flex" }}>
								<CircularProgress size={20} />
							</Box>
						) : (
							<SendIcon
								className="text-primary cursor-pointer"
								onClick={handleMessage}
							/>
						)}
					</Box>
				)}
			</Grid>
		</Grid>
	);
}

export default Chat;
