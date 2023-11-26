import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
	request: Request,
	{ params: { postId } }: { params: { postId: number } }
) {
	try {
		const post: Array<Post> = await prisma.$queryRaw`
        SELECT * FROM posts
        WHERE postId = ${postId}
    `;
		if (post.length) {
			return NextResponse.json({ post: post[0] }, { status: 200 });
		} else {
			return NextResponse.json(
				{ message: "Post doesn't exist" },
				{ status: 404 }
			);
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "Something went wrong", error });
	}
}

export async function DELETE(
	request: Request,
	{ params: { postId } }: { params: { postId: number } }
) {
	try {
		const session = await getServerSession(authOptions);
		const post: Array<Post> = await prisma.$queryRaw`
        SELECT * FROM posts
        WHERE postId = ${postId}
    `;
		if (!session?.user || session?.user?.id && session?.user?.id !== post[0].userId) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}
		if (post.length) {
			await prisma.$queryRaw`
                DELETE FROM posts
                WHERE postId = ${postId};
            `;
			return NextResponse.json({ message: "Post deleted" }, { status: 200 });
		} else {
			return NextResponse.json(
				{ message: "Post doesn't exist" },
				{ status: 404 }
			);
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "Something went wrong", error });
	}
}
