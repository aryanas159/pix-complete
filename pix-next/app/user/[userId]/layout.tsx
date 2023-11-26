import React from "react";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import axios from "axios";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
export async function generateMetadata({
	params: { userId },
}: {
	params: { userId: number };
}): Promise<Metadata> {
    const session = await getServerSession();
    if (!session) {
        return redirect("/login");
    }
	try {
		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`
		);
		if (res.data?.user) {
			return {
				title: `${res.data?.user?.fullName} on PIX`,
				description: `${res.data?.user?.email}`,
			};
		}
		return {
			title: `User does not exist`,
			description: `User does not exist`,
		};
	} catch (error) {
		console.log(error);
		return {
			title: `User does not exist`,
			description: `User does not exist`,
		};
	}
}
function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Navbar />
			{children}
		</div>
	);
}

export default RootLayout;
