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
        const {content} = await request.json();
        await prisma.$queryRaw`
        INSERT INTO comments (userId, postId, content)
        VALUES (${userId}, ${postId}, ${content})
    `;
        return NextResponse.json({ message: "Comment posted" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong", error });
    }
}
