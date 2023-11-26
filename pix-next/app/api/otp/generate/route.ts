import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { genSaltSync, hashSync } from "bcrypt-ts";

interface GenerateOtpInterface {
	email: string;
}

export async function POST(request: Request) {
	const { email }: GenerateOtpInterface = await request.json();
	if (!email) return NextResponse.json({ "message": "Please enter an email" }, {status: 404});
	const otp = Math.floor(Math.random() * 900000) + 100000;
	const transporter = nodemailer.createTransport({
		service: "gmail",
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: "ssaryans597@gmail.com",
			pass: process.env.GMAIL_PASS,
		},
	});

	let mailDetails = {
		from: "ssaryans597@gmail.com",
		to: email,
		subject: "OTP for email verification",
		text: otp.toString(),
	};
	const res = await new Promise((resolve, reject) => {
		transporter.sendMail(mailDetails, function (err, data) {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				const salt = genSaltSync(10);
				const hash = hashSync(otp.toString(), salt);
				if (!hash) reject({"message": "Something went wrong"})
				resolve({ hash });
			}
		});
	});
	return NextResponse.json(res);
}
