"use client";
import React from "react";
import { Box } from "@mui/material";
import FollowUserCard from "@/components/FollowUserCard";
import { getAllUsers } from "@/lib/getFunctions";
import { useState, useEffect } from "react";
function AllUsers() {
	const [users, setUsers] = useState<Array<User>>([]);
	useEffect(() => {
		getAllUsers().then((res) => setUsers(res));
	}, []);
	return (
		<Box className="flex flex-col p-4 bg-bg-light rounded-2xl w-1/3 gap-4">
			{users.map((user) => (
				<FollowUserCard key={user.userId} {...user} />
			))}
		</Box>
	);
}

export default AllUsers;
