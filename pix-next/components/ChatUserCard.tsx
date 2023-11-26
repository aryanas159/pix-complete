"use client";
import { Box, Button, Typography } from "@mui/material";
import UserAvatar from "@/components/UserAvatar";
type ChatUserCardProps =  User & {
	isOnline: boolean;
	handleUserClick: (user: User) => void;
}
const ChatUserCard = ({
	userId,
	fullName,
	email,
	imageUrl,
	isOnline,
	handleUserClick,
}: ChatUserCardProps) => {
	return (
		<Box
			className="flex p-2 gap-2 items-center cursor-pointer"
			onClick={() => {
				handleUserClick({ userId, fullName, email, imageUrl });
			}}
		>
			<UserAvatar
				userId={userId as number}
				userName={fullName}
				imageUrl={imageUrl}
			/>
			<Typography className="text-dark/80 text-sm font-semibold font-Poppins grow">
				{fullName}
			</Typography>

			{isOnline ? (
				<div className="w-2 h-2 bg-[#90EE90] rounded-full"></div>
			) : (
				<div className="w-2 h-2 bg-red rounded-full"></div>
			)}
		</Box>
	);
};

export default ChatUserCard;
