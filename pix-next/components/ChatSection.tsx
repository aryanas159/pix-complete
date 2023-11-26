"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { socket } from "@/lib/socket";
import { ChangeEvent } from "react";
import type { UserSession } from "@/types/next-auth";
import { getMessages, postMessage } from "@/lib/getFunctions";
import Message from "@/components/Message";
import UserTyping from "@/components/UserTyping";
import ChatUsers from "@/components/ChatUsers";
import UserAvatar from "@/components/UserAvatar";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import uploadImage from "@/lib/uploadImage";
import CircularProgress from "@mui/material/CircularProgress";
interface SocketSession extends UserSession {
	socketId: string;
}
import Image from "next/image";
import { Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ChatSection() {
	const { data: session } = useSession();
	const [messageText, setMessageText] = useState("");
	const [onlineUsers, setOnlineUsers] = useState<Array<SocketSession>>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [currentRoom, setCurrentRoom] = useState<string>("");
	const [messages, setMessages] = useState<Array<Message>>([]);
	const [isTyping, setIsTyping] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const messageRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState<Boolean>(false);
	const [image, setImage] = useState<Blob | null>(null);
	useEffect(() => {
		if (session?.user) {
			socket.emit("socket-connection", session.user);
		}
	}, [session]);
	useEffect(() => {
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
			console.log("received online users");
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
	const handleBackClick = () => {
		setCurrentRoom("");
		setMessages([]);
	};
	const handleMessageSend = async () => {
		try {
			setIsLoading(true);
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
				setIsLoading(false);
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
				setIsLoading(false);
				setMessageText("");
			}
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};
	const handleImageAdd = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) return;
		if (e.target.files[0].type.split("/")[0] !== "image") return;
		setImage(e.target.files[0]);
	};
	return (
		<Box className="bg-bg-light sm:rounded-2xl flex-[1.5] xs:h-[calc(100vh-64px)] sm:h-auto overflow-auto">
			{!currentRoom ? (
				<Box>
					<Box className="flex items-center gap-2 bg-gray-dark p-2 sm:rounded-2xl">
						<Image
							src="assets/chat.svg"
							alt="Chat Icon"
							width={40}
							height={40}
							className="text-black"
						/>
						<Typography className="font-semibold text-white">
							Chat with people you follow
						</Typography>
					</Box>
					<ChatUsers
						onlineUsers={onlineUsers}
						handleUserClick={handleSelectUser}
					/>
				</Box>
			) : (
				<Box className="flex flex-col h-[calc(100vh-64px)] sm:h-[80vh]">
					<Box className="flex items-center gap-2 bg-gray-dark p-2 sm:rounded-2xl">
						<ArrowBackIcon
							className="text-white cursor-pointer"
							onClick={handleBackClick}
						/>
						<UserAvatar
							userId={selectedUser?.userId as number}
							userName={selectedUser?.fullName as string}
							imageUrl={selectedUser?.imageUrl as string}
						/>
						<Typography className="font-semibold text-white">
							Chatting with {selectedUser?.fullName}
						</Typography>
					</Box>
					<Box className="flex flex-1 flex-col p-4 gap-[1px] bg-bg-light w-full overflow-y-scroll">
						{messages.length === 0 && (
							<Typography className="text-center text-gray">
								No messages yet
							</Typography>
						)}
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
					<Box className="flex gap-2 items-center px-4 py-2">
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
								onClick={handleMessageSend}
							/>
						)}
					</Box>
				</Box>
			)}
		</Box>
	);
}
