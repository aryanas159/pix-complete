import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient"
export async function GET(
	request: Request,
	{ params: { userEmail } }: { params: { userEmail: string } }
) {
	const user: Array<User> = await prisma.$queryRaw`
                                    SELECT * FROM users
                                    WHERE email = ${userEmail}
                                    LIMIT 1;
    `;
	if (user.length) {
		return NextResponse.json({ user: user[0] }, { status: 200 });
	}
	return NextResponse.json({ message: "User doesn't exist" });
}