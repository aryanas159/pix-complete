import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { compareSync } from "bcrypt-ts";
type UserInterface = User & {
	type: string;
	[key: string]: Blob | string |number| undefined;
}
export async function POST(request: Request) {
	const { email, password } = await request.json();
	if (!email || !password)
		return NextResponse.json(
			{ message: "Provide necessary information", success: false },
			{ status: 400 }
		);
	const results: Array<UserInterface> = await prisma.$queryRaw`
                                    SELECT * FROM users
                                    WHERE email = ${email}
                                    LIMIT 1;
    `;
	const user = results[0];
	if (!user)
		return NextResponse.json(
			{ message: "User with the provided email doesn't exist" },
			{ status: 404 }
		);
	const isPasswordCorrect = compareSync(password, user.password!.toString());
	if (!isPasswordCorrect)
		return NextResponse.json(
			{ message: "Password is incorrect", success: false },
			{ status: 401 }
		);
	return NextResponse.json({ user }, { status: 200 });
}
