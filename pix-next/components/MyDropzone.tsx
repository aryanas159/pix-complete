"use client";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
interface MyDropzoneProps {
	image: Blob | null;
	setImage: React.Dispatch<React.SetStateAction<Blob | null>>;
}

const MyDropzone = ({ image, setImage }: MyDropzoneProps) => {
	const onDrop = (acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			setImage(acceptedFiles[0]);
		}
	};
	return (
		<Dropzone onDrop={onDrop}>
			{({ getRootProps, getInputProps, isDragActive, open }) => (
				<section className="xs:p-2 sm:p-4 border-dashed border cursor-pointer rounded-xl border-black text-black">
					<div {...getRootProps()}>
						<input {...getInputProps()} />
						{isDragActive ? (
							<Typography className="text-lg">Drop the files here ...</Typography>
						) : (
							<Box className="flex g-2 items-center max-w-full text-ellipsis">
								{image ? 
									image.name.length > 20 ? image.name.substring(0, 20) + "..." : image.name
								: (
									<>
										<AddIcon />
										<Typography className="xs:text-sm sm:text-base">Upload a profile picture</Typography>
									</>
								)}
							</Box>
						)}
					</div>
				</section>
			)}
		</Dropzone>
	);
};

export default MyDropzone;
