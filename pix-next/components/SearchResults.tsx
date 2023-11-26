"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import FollowUserCard from "@/components/FollowUserCard";
export default function 	SearchResults({ name }: { name: string }) {
	const [results, setResults] = useState<Array<User>>([]);
	useEffect(() => {
		axios
			.get(`${process.env.NEXT_PUBLIC_API_URL}/user?name=${name}`)
			.then((res) => {
				if (res.data?.result) {
					setResults(res.data?.result);
				}
			})
			.catch((err) => console.log(err));
	}, [name]);
	return (
		<Box className="flex flex-col gap-2 xs:p-2 sm:p-4 rounded-xl absolute top-14 -left-12 max-w-[90vw] bg-bg-light z-20 shadow-xl">
			{results.length ? (
				results.map((user) => <FollowUserCard key={user.userId} {...user} />)
			) : (
				<Typography className="text-dark">No results found</Typography>
			)}
		</Box>
	);
}
