"use client";
import { useEffect, useState } from "react";
import UserInfo from "@/components/UserInfo";
import FeedPosts from "@/components/FeedPosts";
import { Container, Box } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import {
	getUserPosts,
	getFollowers,
	getFollowings,
	getUser,
} from "@/lib/getFunctions";
import { useDispatch } from "react-redux";
import { setFollowers, setFollowing } from "@/lib/redux/slices/user/userSlice";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
type Props = {
	params: {
		userId: number;
	};
};

export default function UserPage({ params: { userId } }: Props) {
	const [posts, setPosts] = useState<Array<Post> | null>(null);
	const [user, setUser] = useState<User | null>();
	const [theirFollowers, setTheirFollowers] = useState<Array<User>>([]);
	const [theirFollowing, setTheirFollowing] = useState<Array<User>>([]);
	const dispatch = useDispatch();
	useEffect(() => {
		TimeAgo.addDefaultLocale(en);
		TimeAgo.addLocale(ru);
		getUser(userId)
			.then((res) => setUser(res))
			.catch((err) => console.log(err));
		getUserPosts(userId)
			.then((res) => setPosts(res))
			.catch((err) => console.log(err));
		getFollowers(userId)
			.then((res) => setTheirFollowers(res))
			.catch((err) => console.log(err));
		getFollowings(userId)
			.then((res) => setTheirFollowing(res))
			.catch((err) => console.log(err));
		getFollowers()
			.then((res) => dispatch(setFollowers({ followers: res })))
			.catch((err) => console.log(err));
		getFollowings()
			.then((res) => dispatch(setFollowing({ following: res })))
			.catch((err) => console.log(err));
	}, []);
	return (
		<Box className="mx-4 flex xs:flex-col sm:flex-row sm:px-64 gap-8 xs:items-center sm:items-start pt-8 bg-bg-dark min-h-[100vh] mb-8">
			<UserInfo
				user={
					user
						? {
								userId: user.userId as number,
								fullName: user.fullName,
								imageUrl: user.imageUrl,
								email: user.email,
						  }
						: {
								userId: 0,
								fullName: "",
								imageUrl: "",
								email: "",
						  }
				}
				followers={theirFollowers}
				following={theirFollowing}
			/>
			<Container className="flex flex-col gap-4 p-0">
				<FeedPosts posts={posts} />
			</Container>
		</Box>
	);
}
