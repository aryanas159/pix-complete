"use client";
import { Box, Typography, IconButton, Collapse } from "@mui/material";
import React, { useState, useEffect } from "react";
import UserAvatar from "@/components/UserAvatar";
import { getUser, getLikes, getComments } from "@/lib/getFunctions";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import { useSession } from "next-auth/react";
import Comments from "@/components/Comments";
import TimeAgo from "@/components/TimeAgo";
import axios from "axios";
function Post({ postId, userId, postImgUrl, content, timeStamps }: Post) {
	const [user, setUser] = useState<User | null>(null);
	const [likes, setLikes] = useState<Array<Like>>([]);
	const [comments, setComments] = useState<Array<CommentType>>([]);
	const [commentsVisible, setCommentsVisible] = useState<boolean>(false);
	const { data: session } = useSession();
	useEffect(() => {
		getLikes(postId).then((res) => setLikes(res));
		getComments(postId).then((res) => setComments(res));
		getUser(userId).then((res) => setUser(res));
	}, []);
	const handleLike = async () => {
		try {
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`
			);
			const newLikes = await getLikes(postId);
			setLikes(newLikes);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Box>
			<Box className="flex flex-col bg-bg-light xs:p-2 sm:p-4 rounded-2xl">
				{user && (
					<Box className="flex items-center pb-4">
						<UserAvatar
							userId={user?.userId as number}
							userName={user?.fullName}
							imageUrl={user?.imageUrl}
						/>
						<Box className="flex flex-col ml-3">
							<Typography className="text-[1.1rem] text-dark sm:font-semibold font-Poppins">
								{user?.fullName}
							</Typography>
							<TimeAgo date={new Date(timeStamps)} />
						</Box>
					</Box>
				)}
				<Box>
					{content && (
						<Typography
							paragraph
							className="px-2 pb-2 xs:text-sm sm:text-[1rem] whitespace-pre-line m-0"
						>
							{content}
						</Typography>
					)}
				</Box>
				{postImgUrl && (
					<Box className="w-full flex items-center justify-center">
						<a href={postImgUrl} target="_blank">
							<img
								src={postImgUrl}
								alt={postId.toString()}
								className="rounded-2xl max-w-full max-h-[100vh]"
							/>
						</a>
					</Box>
				)}
			</Box>
			<Box>
				<Box className="flex items-center p-2 transition-all">
					{likes.find((like) => like.userId === session?.user?.id) ? (
						<FavoriteIcon
							className="text-pink text-base transition-all m-1 cursor-pointer"
							onClick={handleLike}
						/>
					) : (
						<FavoriteBorderIcon
							className="text-pink text-base transition-all m-1 cursor-pointer"
							onClick={handleLike}
						/>
					)}
					<Typography className="text-sm mr-2">{likes.length}</Typography>

					<ModeCommentIcon
						className="text-[#0090C1] text-base transition-all m-1 cursor-pointer"
						onClick={() => setCommentsVisible((prev) => !prev)}
					/>

					<Typography className="text-sm">{comments.length}</Typography>
				</Box>
				<Box className="">
					<Collapse in={commentsVisible} orientation="vertical">
						<Comments
							comments={comments}
							postId={postId}
							setComments={setComments}
						/>
					</Collapse>
				</Box>
			</Box>
		</Box>
	);
}

export default Post;
