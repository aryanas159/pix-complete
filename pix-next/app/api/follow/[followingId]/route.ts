import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
	request: Request,
	{ params: { followingId } }: { params: { followingId: Number } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (session?.user?.id) {
			const res: Array<FollowerType> = await prisma.$queryRaw`
            SELECT * FROM followers
            WHERE followerId = ${session.user.id} AND followingId = ${followingId}
        `;
			if (res.length > 0) {
				await prisma.$queryRaw`
            DELETE FROM followers
            WHERE followerId = ${session.user.id} AND followingId = ${followingId}
        `;
				return NextResponse.json({ message: "Unfollowed" }, { status: 200 });
			} else {
				await prisma.$queryRaw`
            INSERT INTO followers (followerId, followingId)
            VALUES (${session.user.id}, ${followingId})
        `;
				return NextResponse.json({ message: "Followed" }, { status: 200 });
			}
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
