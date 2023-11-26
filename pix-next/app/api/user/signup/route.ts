import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { genSaltSync, hashSync } from "bcrypt-ts";
type UserInterface = User &{
	type: string;
	[key: string]: Blob | string |number| undefined;
}
let requestBody: UserInterface = {
	fullName: "",
	email: "",
	password: "",
	imageUrl: "",
	type: "CREDENTIALS",
};
export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const formKeys = new Array(...formData.keys());
		for (const key in requestBody) {
			if (!formKeys.includes(key)) {
				return NextResponse.json(
					{
						"message": "Please provide necessary information",
						"success": false,
					},
					{ status: 404 }
				);
			}
			requestBody[key] = formData.get(key) as string;
		}
		const salt = genSaltSync(10);
		const hashedPwd = hashSync(requestBody.password as string, salt);
		await prisma.$queryRaw`
            INSERT INTO users (fullName, email, password, imageUrl, type)
            VALUES (${requestBody.fullName}, ${requestBody.email}, ${hashedPwd}, ${requestBody.imageUrl}, ${requestBody.type})
    `;

		return NextResponse.json({
			message: "User successfully created",
			success: true,
		});
	} catch (err: any) {
		if (err?.meta?.code == "1062") {
			return NextResponse.json(
				{
					message: "Provided email already exists, please login",
					success: false,
				},
				{ status: 409 }
			);
		}
		return NextResponse.json({ err, success: false }, { status: 500 });
	}
}
