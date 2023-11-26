import { Box, Typography } from "@mui/material";
import UserAvatar from "./UserAvatar";
function SelectedUserInfo({ selectedUser }: { selectedUser: User | null }) {
	return (
		<Box className="flex items-center gap-4 bg-bg-light rounded-2xl p-4 my-4">
			{selectedUser ? (
				<>
					<UserAvatar
						userId={selectedUser.userId as number}
						userName={selectedUser.fullName}
						imageUrl={selectedUser.imageUrl}
						size={48}
					/>
					<Box className="flex flex-col gap-2">
						<Typography className="text-dark/80 font-semibold">
							Chatting with {selectedUser.fullName}
						</Typography>
					</Box>
				</>
			) : (
				<Typography className="text-dark/80 font-semibold">
					Select a User to start chatting
				</Typography>
			)}
		</Box>
	);
}

export default SelectedUserInfo;
