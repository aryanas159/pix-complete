import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const senderId = url.searchParams.get("senderId");
		const receiverId = url.searchParams.get("receiverId");
		if (senderId && receiverId) {
			const messages = await prisma.$queryRaw`
            SELECT * FROM messages
            WHERE (senderId, receiverId) IN ((${senderId}, ${receiverId}), ( ${receiverId}, ${senderId})) 
        `;
			return NextResponse.json({ messages }, { status: 200 });
		}
		return NextResponse.json(
			{ message: "Provide necessary information" },
			{ status: 400 }
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error }, { status: 500 });
	}
}
