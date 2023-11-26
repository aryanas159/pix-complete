import { Box } from "@mui/material";
function UserTyping() {
	const spanClasses =
		"bg-white h-[6px] w-[6px] bg-black absolute top-3 left-4 rounded-full animate-blink";
	return (
		<Box className="flex p-4 rounded-2xl bg-black relative w-16">
			<span className={`${spanClasses}`}></span>
			<span className={`${spanClasses} ml-3 animation-delay-100`}></span>
			<span className={`${spanClasses} ml-6 animation-delay-200`}></span>
		</Box>
	);
}

export default UserTyping;
