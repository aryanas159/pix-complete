import { Button, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import Image from "next/image";
export default function GoogleSignInButton() {
	return (
		<Button
			variant="contained"
			onClick={() => signIn("google", { callbackUrl: "/feed" })}
			className=" w-full flex items-center gap-4 bg-bg-light text-primary-text rounded-xl shadow-lg px-4 py-2 normal-case"
		>
			<Image src="/assets/google.png" alt="google" width={20} height={20} />
			<Typography className="font-medium">Sign in with Google</Typography>
		</Button>
	);
}
