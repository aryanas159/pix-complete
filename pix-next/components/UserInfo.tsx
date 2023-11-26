"use client";
import { Box, Typography } from "@mui/material";
import { Suspense, useState } from "react";
import UserAvatar from "@/components/UserAvatar";
import FollowUserCard from "@/components/FollowUserCard";
import { Skeleton } from "@mui/material";
import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import axios from "axios";
import { setFollowing } from "@/lib/redux/slices/user/userSlice";
import { getFollowings } from "@/lib/getFunctions";
import { Button } from "@mui/material";
type Props = {
	user: {
		userId: number | undefined;
		fullName: string | undefined;
		imageUrl: string | undefined;
		email: string | undefined;
	};
	followers: Array<User>;
	following: Array<User>;
};
export default function UserInfo({ user, followers, following }: Props) {
	const [showFollowers, setShowFollowers] = useState<Boolean>(false);
	const dispatch = useDispatch();
	const { data: session } = useSession();
	const myFollowing = useSelector((state: RootState) => state.user.following);
	const myFollowers = useSelector((state: RootState) => state.user.followers);
	const handleFollow = async () => {
		try {
			await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/follow/${user.userId}`);
			const newFollowing = await getFollowings();
			dispatch(setFollowing({ following: newFollowing }));
		} catch (error) {
			console.log(error);
		}
	};
	return user.userId && user.fullName && user.imageUrl ? (
		<Box className="sm:min-w-[25vw] max-h-screen w-full xs:p-4 sm:p-8 bg-bg-light rounded-2xl flex flex-col gap-2 items-center flex-1">
			<UserAvatar
				userId={user.userId}
				userName={user.fullName}
				imageUrl={user.imageUrl}
				size={128}
			/>
			<div className="flex flex-col items-center">
				<Typography className="text-[1.2rem] mt-4 text-dark font-semibold font-Poppins">
					{user.fullName}
				</Typography>
				<Typography className="text-[0.7rem] text-blue mb-1">
					{user.email}
				</Typography>
				{myFollowers.find((myFollower) => myFollower.userId == user.userId) && (
					<Typography className="text-[0.65rem] text-green font-semibold mb-2">
						Follows you
					</Typography>
				)}
				{session?.user?.id !== user.userId &&
					(myFollowing.find((fl) => fl.userId == user.userId) ? (
						<Button
							variant="contained"
							size="small"
							className="w-full transition-all rounded-2xl bg-bg-light text-red border border-red border-solid text-xs font-[400] py-1 hover:bg-red/10 "
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
							className="w-full transition-all rounded-2xl bg-black text-primary border border-solid border-primary hover:bg-primary/10 text-xs py-1 "
							onClick={handleFollow}
							sx={{
								textTransform: "none",
							}}
						>
							Follow
						</Button>
					))}
			</div>
			<Box className="flex justify-around w-full items-start">
				<Box
					className="flex flex-col items-center cursor-pointer"
					onClick={() => setShowFollowers(true)}
				>
					<Box className="flex flex-col items-center">
						<Typography className="text-sm text-primary-text/80 flex items-center flex-col">
							Followers
						</Typography>
						{showFollowers && (
							<div className="bg-primary h-[2px] w-10 rounded-full mt-[2px]"></div>
						)}
					</Box>

					<Typography className="text-xs text-primary-text/80 mt-2">
						{followers.length}
					</Typography>
				</Box>
				<Box
					className="flex flex-col items-center cursor-pointer"
					onClick={() => setShowFollowers(false)}
				>
					<Box className="flex flex-col items-center">
						<Typography className="text-sm text-primary-text/80">
							Following
						</Typography>
						{!showFollowers && (
							<div className="bg-primary h-[2px] w-10 rounded-full mt-[2px]"></div>
						)}
					</Box>

					<Typography className="text-xs text-primary-text/80 mt-2">
						{following.length}
					</Typography>
				</Box>
			</Box>
			<Box className="flex flex-col gap-2 pt-4 overflow-y-auto">
				{showFollowers
					? !!followers?.length &&
					  followers.map((follower) => (
							<FollowUserCard key={follower.userId} {...follower} />
					  ))
					: !!following?.length &&
					  following.map((follower) => (
							<FollowUserCard key={follower.userId} {...follower} />
					  ))}
			</Box>
		</Box>
	) : (
		<div className="bg-bg-light sm:min-w-[25vw] max-h-screen w-full xs:p-4 sm:p-8 rounded-2xl flex flex-col gap-2 items-center flex-1">
			<Skeleton variant="circular" width={128} height={128} animation="wave" />
			<Skeleton variant="text" width={200} height={24} animation="wave" />
			<div className="flex justify-around w-full items-start mb-4">
				<div className="flex flex-col items-center">
					<Skeleton variant="text" width={100} height={24} animation="wave" />
					<Skeleton variant="text" width={100} height={24} animation="wave" />
				</div>
				<div className="flex flex-col items-center">
					<Skeleton variant="text" width={100} height={24} animation="wave" />
					<Skeleton variant="text" width={100} height={24} animation="wave" />
				</div>
			</div>
			{[1, 2, 3].map(() => (
				<Skeleton
					variant="rectangular"
					className="w-full rounded-xl"
					height={50}
					animation="wave"
				/>
			))}
		</div>
	);
}
