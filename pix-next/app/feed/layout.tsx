import React from "react";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "PIX",
	description: "Social media app for sharing photos",
};
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerSession();
	console.log({session})
	if (!session) {
		return redirect("/login");
	}
	return (
		<div>
			<Navbar />
			{children}
		</div>
	);
}

export default RootLayout;
