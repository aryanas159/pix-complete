import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function GET(request: Request, { params: { postId } }: { params: { postId: number } }) {
	try {
		const comments = await prisma.$queryRaw`
            SELECT * FROM comments
            WHERE postId = ${postId}
    `;
		return NextResponse.json({ comments }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "Something went wrong", error });
	}
}
