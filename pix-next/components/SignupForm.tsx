"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, TextField, Typography } from "@mui/material";
import FormTextField from "@/components/FormTextField";
import MyDropzone from "@/components/MyDropzone";
import ImageCropModal from "./ImageCropModal";
import { type Crop } from "react-image-crop";
import axios from "axios";
import toast from "react-hot-toast";
import uploadImage from "@/lib/uploadImage";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mui/material";
interface FormValues {
	fullName: string;
	email: string;
	password: string;
	confirmPassword: string;
}

const initialValues: FormValues = {
	fullName: "",
	email: "",
	password: "",
	confirmPassword: "",
};

const validationSchema = yup.object({
	fullName: yup
		.string()
		.required("Please enter your full name")
		.min(5, "Full name must be at least 5 characters"),
	email: yup
		.string()
		.required("Please enter your email")
		.email("Please enter a valid email"),
	password: yup
		.string()
		.required("Please enter your password")
		.min(8, "Password must be at least 8 characters"),
	confirmPassword: yup
		.string()
		.required("Please confirm your password")
		.oneOf([yup.ref("password")], "Passwords must match"),
});
const SignupForm = () => {
	const [image, setImage] = useState<Blob | null>(null);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [crop, setCrop] = useState<Crop>();
	const [imageWidth, setImageWidth] = useState<number>(480);
	const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
	const [otpHash, setOtpHash] = useState<string | null>(null);
	const [otp, setOtp] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();
	const isMobile = useMediaQuery("(max-width: 800px)");
	useEffect(() => {
		if (image && !isMobile) {
			setModalOpen(true);
		}
	}, [image]);
	const generateOtp = async (email: string) => {
		const res = await axios.post(
			`${process.env.NEXT_PUBLIC_API_URL}/otp/generate`,
			{
				email,
			}
		);
		const { hash } = res?.data;
		if (hash) {
			setOtpHash(hash);
		}
	};
	const handleSubmit = async (values: FormValues) => {
		try {
			setLoading(true);
			if (!image) {
				toast.error("Please upload a profile picture");
				setLoading(false);
				return;
			}
			const res = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/user/fromEmail/${values.email}`
			);
			if (res.data.user) {
				toast.error("User with this email already exists");
				setLoading(false);
				return;
			}
			if (!otpHash) {
				const otpPromise = generateOtp(values.email);
				toast.promise(otpPromise, {
					loading: "Sending OTP...",
					success: "OTP sent successfully",
					error: "Error sending OTP",
				});
				await otpPromise;
				setLoading(false);
			} else {
				if (!otp) {
					toast.error("Please enter the OTP");
					setLoading(false);
				}
				const promise = axios.post(
					`${process.env.NEXT_PUBLIC_API_URL}/otp/verify`,
					{ otp, hash: otpHash }
				);
				toast.promise(promise, {
					loading: "Verifying OTP...",
					success: "OTP verified successfully",
					error: "Error verifying OTP",
				});
				const res = await promise;
				const { success } = res.data;
				if (success) {
					const formData = new FormData();
					const keys = Object.keys(values);
					formData.append("upload_preset", "my_unsigned_preset");
					if (!croppedImage) {
						formData.append("file", image);
					} else {
						formData.append("file", croppedImage);
					}
					const { secure_url } = await uploadImage(formData);
					if (!secure_url) {
						toast.error("Error uploading image");
						return;
					}
					formData.delete("file");
					formData.delete("upload_preset");
					keys.forEach((key) =>
						formData.append(key, values[key as keyof FormValues])
					);
					formData.append("imageUrl", secure_url);
					formData.append("type", "CREDENTIALS");
					const registrationPromise = axios.post(
						`${process.env.NEXT_PUBLIC_API_URL}/user/signup`,
						formData
					);
					toast.promise(registrationPromise, {
						loading: "Registering...",
						success: "Registered successfully",
						error: "Error registering",
					});
					await registrationPromise;
					setLoading(false);
					router.push("/login");
				} else {
					setLoading(false);
				}
			}
		} catch (error: any) {
			console.log(error);
			if (error?.response?.data?.message) {
				toast.error(error?.response?.data?.message);
				setLoading(false);
			} else {
				toast.error("Something went wrong!");
				setLoading(false);
			}
		}
	};
	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: handleSubmit,
	});
	function getCroppedImage(sourceImage: HTMLImageElement, cropConfig: Crop) {
		const canvas = document.createElement("canvas");
		const wRatio = sourceImage.naturalWidth / imageWidth;
		const hRatio =
			sourceImage.naturalHeight /
			((imageWidth * sourceImage.naturalHeight) / sourceImage.naturalWidth);
		canvas.width = cropConfig.width * wRatio;
		canvas.height = cropConfig.height * hRatio;
		const ctx = canvas.getContext("2d");
		if (ctx) {
			ctx.drawImage(
				sourceImage,
				cropConfig.x * wRatio,
				cropConfig.y * hRatio,
				cropConfig.width * wRatio,
				cropConfig.height * hRatio,
				0,
				0,
				cropConfig.width * wRatio,
				cropConfig.height * hRatio
			);
		}
		return new Promise((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (!blob) {
					reject(new Error("Canvas is empty"));
					return;
				}
				resolve(blob);
			}, "image/jpeg");
		});
	}
	const handleCrop = async () => {
		if (crop) {
			const reader = new FileReader();
			reader.onload = async () => {
				const dataURL = reader.result as string;
				const img = new Image();
				img.src = dataURL;
				img.onload = async () => {
					if (image) {
						const imageBlob = (await getCroppedImage(img, crop)) as Blob;
						const file = new File([imageBlob], image.name, {
							type: "image/png",
							lastModified: Date.now(),
						});
						setCroppedImage(file);
					}
				};
			};
			if (image) {
				reader.readAsDataURL(image);
			}
		}
		setModalOpen(false);
	};
	return (
		<form
			onSubmit={formik.handleSubmit}
			className="flex flex-col items-start gap-3 flex-1"
		>
			<FormTextField
				id="fullName"
				name="fullName"
				label="Full Name"
				value={formik.values.fullName}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				error={
					(formik.touched.fullName as boolean) &&
					(Boolean(formik.errors.fullName) as boolean)
				}
				helperText={formik.touched.fullName && formik.errors.fullName}
			/>
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
				id="password"
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
			<FormTextField
				id="confirmPassword"
				name="confirmPassword"
				label="Confirm Password"
				type="password"
				value={formik.values.confirmPassword}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				error={
					(formik.touched.confirmPassword as boolean) &&
					(Boolean(formik.errors.confirmPassword) as boolean)
				}
				helperText={
					formik.touched.confirmPassword && formik.errors.confirmPassword
				}
			/>
			<MyDropzone image={image} setImage={setImage} />
			{croppedImage ? (
				<img src={URL.createObjectURL(croppedImage)} width={100} />
			) : (
				image && <img src={URL.createObjectURL(image)} width={100} />
			)}
			<ImageCropModal
				open={modalOpen}
				onClose={handleCrop}
				image={image}
				crop={crop as Crop}
				setCrop={setCrop as React.Dispatch<React.SetStateAction<Crop>>}
				imageWidth={imageWidth}
			/>
			{otpHash && (
				<TextField
					variant="standard"
					name="otp"
					placeholder="OTP sent to your email"
					value={otp}
					onChange={(e) => setOtp(e.target.value)}
					type="number"
					InputLabelProps={{
						sx: {
							color: "#000",
							fontSize: { xs: "0.8rem", sm: "0.9rem" },
						},
					}}
					inputProps={{
						sx: {
							color: "#000",
							padding: { xs: "0.8rem", sm: "1rem" },
						},
					}}
				/>
			)}
			<Button type="submit" variant="contained" disabled={loading}>
				Submit
			</Button>
		</form>
	);
};

export default SignupForm;
