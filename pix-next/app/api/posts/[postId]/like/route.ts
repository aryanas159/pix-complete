import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function POST(
	request: Request,
	{ params: { postId } }: { params: { postId: number } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}
		const { id: userId } = session.user;
		const isLiked: Array<{ postId: Number; userId: Number }> =
			await prisma.$queryRaw`
					SELECT * FROM likes
					WHERE userId = ${userId} AND postId = ${postId}
	`;
		if (isLiked.length > 0) {
			await prisma.$queryRaw`
        DELETE FROM likes
		WHERE userId = ${userId} AND postId = ${postId}
    `;
			return NextResponse.json({ message: "Post unliked" }, { status: 200 });
		}
		await prisma.$queryRaw`
        INSERT INTO likes (userId, postId)
        VALUES (${userId}, ${postId})
		
    `;
		return NextResponse.json({ message: "Post liked" }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "Something went wrong", error });
	}
}
