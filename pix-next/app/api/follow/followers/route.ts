import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prismaClient";
export async function GET(request: Request) {
	const url = new URL(request.url);
	const userId = url.searchParams.get("userId");
	try {
		const session = await getServerSession(authOptions);
		if (session?.user) {
			if (userId) {
				const res: Array<User> = await prisma.$queryRaw`
					SELECT userId, fullName, email, imageUrl FROM followers
					INNER JOIN users
					ON followers.followerId = users.userId
					WHERE followingId = ${userId}
				`;
				return NextResponse.json({ followers: res }, { status: 200 });
			}
			const res: Array<User> = await prisma.$queryRaw`
                SELECT userId, fullName, email, imageUrl FROM followers
                INNER JOIN users
                ON followers.followerId = users.userId
                WHERE followingId = ${session.user.id}
            `;
			return NextResponse.json({ followers: res }, { status: 200 });
		}
		return NextResponse.json({ message: "Not authorized" }, { status: 401 });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 }
		);
	}
}
