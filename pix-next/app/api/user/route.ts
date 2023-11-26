import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const name = searchParams.get("name");
		if (name) {
			const res = await prisma.$queryRaw`
            SELECT *
            FROM users
            WHERE fullName LIKE ${name + "%"}
            OR fullName LIKE ${"%" + name + "%"}
            OR email LIKE ${name + "%"}
            OR email LIKE ${"%" + name + "%"}
            ORDER BY 
            CASE 
                WHEN fullName LIKE ${name + "%"} THEN 1  
                WHEN fullName LIKE ${"%" + name + "%"} THEN 2  
                WHEN email LIKE ${name + "%"} THEN 3  
                WHEN email LIKE ${"%" + name + "%"} THEN 4  
                ELSE 5                                
            END, 
            fullName, 
            email
        `;
			return NextResponse.json({ result: res }, { status: 200 });
		}
		return NextResponse.json({ result: [] }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ result: [] }, { status: 500 });
	}
}
