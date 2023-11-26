"use client";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import FormTextField from "@/components/FormTextField";
import { Button, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "@/components/GoogleSignInButton";
type FormValues = {
	email: string;
	password: string;
};

const initialValues: FormValues = {
	email: "",
	password: "",
};

const validationSchema = yup.object({
	email: yup
		.string()
		.required("Please enter your email")
		.email("Please enter a valid email"),
	password: yup
		.string()
		.required("Please enter your password")
		.min(8, "Password must be at least 8 characters"),
});

export default function LoginForm() {
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();
	useEffect(() => {
		router.prefetch("/feed");
	}, [router]);
	const handleSubmit = async (values: FormValues) => {
		try {
			setLoading(true);
			toast.loading("Logging in...");
			const signInResponse = await signIn("credentials", {
				email: values.email,
				password: values.password,
				redirect: false,
				callbackUrl: "/feed",
			});
			if (!signInResponse?.ok) {
				toast.dismiss();
				toast.error("Please check your credentials");
				console.log(signInResponse?.error);
				setLoading(false);
				return;
			}
			toast.dismiss();
			toast.success("Logged in successfully");
			setLoading(false);
			router.push("/feed");
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};
	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: handleSubmit,
	});
	return (
		<form
			onSubmit={formik.handleSubmit}
			className="flex flex-col items-start gap-4 w-full sm:w-[70%]"
		>
			<FormTextField
				id="email"
				name="email"
				label="Email"
				value={formik.values.email}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				error={
					(formik.touched.email as boolean) &&
					(Boolean(formik.errors.email) as boolean)
				}
				helperText={formik.touched.email && formik.errors.email}
			/>
			<FormTextField
				id="passwrord"
				name="password"
				label="Password"
				type="password"
				value={formik.values.password}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				error={
					(formik.touched.password as boolean) &&
					(Boolean(formik.errors.password) as boolean)
				}
				helperText={formik.touched.password && formik.errors.password}
			/>
			<Button
				type="submit"
				variant="contained"
				disabled={loading}
				className="w-full rounded-xl hover:bg-primary"
			>
				Sign In with PIX
			</Button>
			<div className="flex w-full items-center gap-1">
				<div className="bg-black h-[1px] w-full"></div>
				<Typography className="text-xs font-Roboto font-medium text-black">
					OR
				</Typography>
				<div className="bg-black h-[1px] w-full"></div>
			</div>
			<GoogleSignInButton />
		</form>
	);
}
