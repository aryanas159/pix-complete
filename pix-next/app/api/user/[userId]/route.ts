import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
export async function GET(
	request: Request,
	{ params: { userId } }: { params: { userId: number } }
) {
	try {
		const req: Array<User> = await prisma.$queryRaw`
        SELECT * FROM users
        WHERE userId = ${userId}
    `;
		const user = req[0];
		if (user) {
			return NextResponse.json({ user }, { status: 200 });
		}
		return NextResponse.json(
			{ message: "User doesn't exist" },
			{ status: 404 }
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Something went wrong", error },
			{ status: 500 }
		);
	}
}
