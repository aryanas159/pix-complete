import UserAvatar from "@/components/UserAvatar";
import { useState, useEffect } from "react";
import { getUser } from "@/lib/getFunctions";
import { Box, Typography } from "@mui/material";
const Comment = ({ userId, content }: CommentType) => {
	const [user, setUser] = useState<User | null>(null);
	useEffect(() => {
		getUser(userId).then((res) => setUser(res));
	}, []);
	if (user) {
		return (
			<Box className="flex gap-4 p-0 rounded-2xl">
				<UserAvatar
					userId={userId}
					userName={user?.fullName}
					imageUrl={user?.imageUrl}
					size={28}
				/>
				<Box>
					<Typography className="text-dark font-semibold font-Poppins text-sm">
						{user?.fullName}
					</Typography>
					<Typography className="text-[0.8rem]">{content}</Typography>
				</Box>
			</Box>
		);
	}
};
export default Comment;
