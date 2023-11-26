"use client";
import { Box, Button, Typography } from "@mui/material";
import UserAvatar from "@/components/UserAvatar";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setFollowing } from "@/lib/redux/slices/user/userSlice";
import { getFollowings } from "@/lib/getFunctions";
import type { RootState } from "@/lib/redux/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const FollowUserCard = ({ userId, fullName, email, imageUrl }: User) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { data: session } = useSession();
	const following = useSelector((state: RootState) => state.user.following);
	const followers = useSelector((state: RootState) => state.user.followers);
	const handleFollow = async () => {
		try {
			await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/follow/${userId}`);
			const newFollowing = await getFollowings();
			dispatch(setFollowing({ following: newFollowing }));
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Box className="flex p-2 gap-2 items-center max-w-[90vw]">
			<UserAvatar
				userId={userId as number}
				userName={fullName}
				imageUrl={imageUrl}
			/>
			<Box
				className="flex flex-col grow pr-2 justify-center cursor-pointer"
				onClick={() => router.push(`/user/${userId}`)}
			>
				<Typography className="text-dark/80 xs:text-xs sm:text-sm font-semibold font-Poppins">
					{fullName}
				</Typography>
				<Typography className="xs:text-[0.6rem] text-ellipsis sm:text-xs text-primary-text">
					{email}
				</Typography>
				{followers.find((user) => user.userId === userId) && (
					<Typography className="text-[0.65rem] text-green font-semibold">
						Follows you
					</Typography>
				)}
			</Box>
			{session?.user?.id !== userId &&
				(following.find((user) => user.userId == userId) ? (
					<Button
						variant="contained"
						size="small"
						className="transition-all rounded-2xl bg-bg-light text-red border border-red border-solid text-xs font-[400] py-1 hover:bg-red/10 "
						onClick={handleFollow}
						sx={{
							textTransform: "none",
						}}
					>
						Unfollow
					</Button>
				) : (
					<Button
						variant="contained"
						size="small"
						className="transition-all rounded-2xl bg-black text-primary border border-solid border-primary hover:bg-primary/10 text-xs py-1 "
						onClick={handleFollow}
						sx={{
							textTransform: "none",
						}}
					>
						Follow
					</Button>
				))}
		</Box>
	);
};

export default FollowUserCard;
