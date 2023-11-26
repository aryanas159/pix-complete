import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
export async function GET() {
	try {
		const users: Array<User> = await prisma.$queryRaw`
        SELECT * FROM users
    `;
		return NextResponse.json({ users });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Something went wrong", error },
			{ status: 500 }
		);
	}
}
