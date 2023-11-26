import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prismaClient";

type RequestBody = {
	postImgUrl: string;
	content: string;
};
export async function POST(request: Request) {
	const session = await getServerSession(authOptions);
	try {
		if (session?.user) {
			const { id } = session.user as { id: number };
			let body: RequestBody = {
				postImgUrl: "",
				content: ""
			}
			const formData = await request.formData();
			if (formData.has("imageUrl")) {
				body.postImgUrl = formData.get("imageUrl") as string
			}
			if (formData.has("content")) {
				body.content = formData.get("content") as string
			}
			await prisma.$queryRaw`
                INSERT INTO posts (userId, postImgUrl, content)
                VALUES (${id}, ${body.postImgUrl}, ${body.content});
            `;
			const post: Array<Post> = await prisma.$queryRaw`
                SELECT * FROM posts
                WHERE postId = LAST_INSERT_ID();
            `;
			return NextResponse.json({post: post[0]}, { status: 200 });
		}
		return NextResponse.json({ session: null });
	} catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong", error });
    }
}