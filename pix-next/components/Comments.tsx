"use client";
import { Stack, Box, TextField, InputAdornment } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import UserAvatar from "@/components/UserAvatar";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import Comment from "@/components/Comment";
import { getComments } from "@/lib/getFunctions";
import toast from "react-hot-toast";
type Props = {
	comments: Array<CommentType>;
	postId: Number;
	setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
};
const Comments = ({ comments, postId, setComments }: Props) => {
	const [comment, setComment] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const { data: session } = useSession();
	const handleComment = async () => {
		if (!comment) {
			toast.error("Bro, you can't post an empty comment");
			return;
		}
		if (loading) {
			toast.error("Hold on bro, we're posting your comment");
			return;
		}
		setLoading(true);
		try {
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comment`,
				{ content: comment }
			);
			setLoading(false);
			const newComments = await getComments(postId);
			setComments(newComments);
			setComment("");
		} catch (error) {
			console.log(error);
			setLoading(false);
			setComment("");
		}
		return;
	};
	return (
		<Stack spacing={2} className="p-4 bg-bg-light rounded-2xl">
			{session && (
				<Box className="flex gap-4 bg-bg-light rounded-2xl">
					<UserAvatar
						userId={session?.user?.id as number}
						userName={session?.user?.name}
						imageUrl={session?.user?.image}
					/>
					<TextField
						variant="standard"
						size="small"
						placeholder="Post a comment"
						fullWidth
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						sx={{
							".MuiInputBase-root": {
								"& input": {
									fontSize: "0.8rem",
								},
							},
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<SendIcon
										className={`cursor-pointer mb-1 text-base ${
											loading ? "text-gray-dark" : "text-primary"
										} `}
										onClick={handleComment}
									/>
								</InputAdornment>
							),
						}}
					/>
				</Box>
			)}
			{!!comments.length &&
				comments.map((comment) => {
					return <Comment key={comment.commentId} {...comment} />;
				})}
		</Stack>
	);
};

export default Comments;
