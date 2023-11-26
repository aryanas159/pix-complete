import { Box, Typography } from "@mui/material";
type MessageProps = {
	message: string;
	isSender: boolean;
	imageUrl?: string;
};
function Message({ message, isSender, imageUrl }: MessageProps) {
	return (
		<Box className={` flex flex-col items-${isSender ? "end" : "start"}`}>
			{imageUrl ? (
				<div className={` flex flex-col items-${isSender ? "end" : "start"}`}>
					<div
						className={`flex p-1 items-center ${isSender ? "bg-primary rounded-s-2xl" : "bg-black rounded-e-2xl"}  ${
							isSender ? "rounded-tr-2xl" : "rounded-tl-2xl"
						}`}
					>
						<a href={imageUrl} target="_blank">
							<img
								src={imageUrl}
								alt="image"
								className="w-[300px] rounded-2xl"
							/>
						</a>
					</div>
					{message && (
						<div
							className={`relative flex flex-col py-1 ${
								isSender
									? "bg-primary text-black items-end rounded-bl-2xl pl-2 pr-2"
									: "bg-black text-white items-start rounded-br-2xl pr-2 pl-2"
							}`}
						>
							<Typography>{message}</Typography>
						</div>
					)}
				</div>
			) : (
				<div
					className={`relative flex flex-col gap-0 p-2 ${
						isSender
							? "bg-primary text-black items-end rounded-l-2xl rounded-tr-2xl"
							: "bg-black text-white items-start rounded-r-2xl rounded-tl-2xl"
					}`}
				>
					<Typography>{message}</Typography>
				</div>
			)}
		</Box>
	);
}

export default Message;
