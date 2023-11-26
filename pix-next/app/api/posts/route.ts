import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
export async function GET(request: Request) {
	const url = new URL(request.url);
	const userId = url.searchParams.get("userId");
	if (userId) {
		try {
			const posts: Array<Post> = await prisma.$queryRaw`
        SELECT * FROM posts
        WHERE userId = ${userId}
        ORDER BY timeStamps DESC
    `;
			return NextResponse.json({ posts }, { status: 200 });
		} catch (error) {
			return NextResponse.json({ message: "Something went wrong", error });
		}
	}
	try {
		const posts: Array<Post> = await prisma.$queryRaw`
        SELECT * FROM posts
        ORDER BY timeStamps DESC
    `;
		return NextResponse.json({ posts }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "Something went wrong", error });
	}
}
