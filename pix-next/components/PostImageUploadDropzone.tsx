import React from "react";
import { useDropzone } from "react-dropzone";
import { Box, IconButton, Typography } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
type PostImageUploadDropzoneProps = {
	image: Blob | null;
	setImage: React.Dispatch<React.SetStateAction<Blob | null>>;
};
function PostImageUploadDropzone({
	image,
	setImage,
}: PostImageUploadDropzoneProps) {
	const onDrop = (acceptedFiles: Array<File>) =>	 {
		if (acceptedFiles.length > 0) {
            setImage(acceptedFiles[0]);
        }
	};
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: false,
		accept: {
			"image/png": [".png"],
			"image/jpg": [".jpg", ".jpeg", ".webp"],
		},
	});

	return (
		<Box className="flex items-center">
			<IconButton {...getRootProps()}>
				<AddPhotoAlternateIcon className="text-3xl text-primary" />
				<input {...getInputProps()} />
			</IconButton>
			{isDragActive ? (
				<Typography className="text-base">
					Drop the image here...
				</Typography>
			) : !image ? (
				<></>
			) : (
				<Typography className="text-sm truncate max-w-[200px]">
					{image.name}
				</Typography>
			)}
		</Box>
	);
}

export default PostImageUploadDropzone;
