"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
function MobileMenu() {
	const linkClasses = "p-2 text-white no-underline";
	const { data: session } = useSession();
	return (
		<>
			<Link href="/feed" className={linkClasses}>
				<div>Home</div>
			</Link>
			{session?.user && (
				<Link href={`/user/${session.user.id}`} className={linkClasses}>
					<div>My Profile</div>
				</Link>
			)}
			<Link href="/chat" className={linkClasses}>
				<div>PIX Chat</div>
			</Link>
			<div className={linkClasses} onClick={() => signOut()}>
				<div>Logout</div>
			</div>
		</>
	);
}

export default MobileMenu;
