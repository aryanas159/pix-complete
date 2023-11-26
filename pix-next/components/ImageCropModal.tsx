"use client";
import { Modal, Box, Typography, Button } from "@mui/material";
import React, { useState, useRef } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CropIcon from "@mui/icons-material/Crop";
interface ModalProps {
	open: boolean;
	onClose: () => void;
	image: Blob | null;
	crop: Crop;
	setCrop: React.Dispatch<React.SetStateAction<Crop>>;
	imageWidth: number;
}
const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "transparent",
	p: 0,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	gap: "8px",
};
const ImageCropModal = ({
	open,
	onClose,
	image,
	crop,
	setCrop,
	imageWidth,
}: ModalProps) => {
	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby="image-crop-modal"
			aria-describedby="image-crop-model"
		>
			<Box sx={style}>
				{image ? (
					<ReactCrop
						crop={crop}
						onChange={(c) => setCrop(c)}
						minWidth={200}
						minHeight={200}
					>
						<img
							src={URL.createObjectURL(image)}
							id="image-crop-modal"
							width={imageWidth}
						/>
					</ReactCrop>
				) : (
					<Typography>Upload a image first</Typography>
				)}

				<Button variant="contained" onClick={onClose}>
					<CropIcon sx={{ marginRight: 1 }} />
					<Typography fontSize={16}>Crop</Typography>
				</Button>
			</Box>
		</Modal>
	);
};
export default ImageCropModal;
