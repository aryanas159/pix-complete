import Post from "@/components/Post";
import { Stack } from "@mui/material";
import { Skeleton } from "@mui/material";
function FeedPosts({ posts }: { posts: Array<Post> | null }) {
	if (posts) {
		return posts?.length == 0 ? (
			<>No Posts</>
		) : (
			<Stack spacing={2} className="">
				{posts.map((post) => (
					<Post key={post.postId} {...post} />
				))}
			</Stack>
		);
	} else {
		return (
			<div className="flex flex-col bg-bg-light xs:p-2 sm:p-4 rounded-2xl w-full flex-1 gap-8">
				<div className="flex gap-2">
					<Skeleton
						variant="circular"
						className="h-[36px] w-[36px]"
						animation="wave"
					/>
					<div className="flex flex-col gap-2">
						<Skeleton
							variant="rectangular"
							className="w-[100px] h-4 rounded-2xl"
							animation="wave"
						/>
						<Skeleton
							variant="rectangular"
							className="w-[80px] h-3 rounded-2xl"
							animation="wave"
						/>
					</div>
				</div>
				<Skeleton
					variant="rectangular"
					className="w-full h-[80px] rounded-2xl"
					animation="wave"
				/>
			</div>
		);
	}
}

export default FeedPosts;
