import { NextResponse } from "next/server";
import { compareSync } from "bcrypt-ts";
export async function POST(request: Request) {
	const { otp, hash } = await request.json();
	if (!otp || !hash)
		return NextResponse.json(
			{ "message": "Please provide necessary information" },
			{ status: 404 }
		);
	const isOtpCorrect = compareSync(otp, hash);
	if (isOtpCorrect) return NextResponse.json({ success: true }, {status: 200});
	return NextResponse.json({ success: false }, { status: 404 });
}
