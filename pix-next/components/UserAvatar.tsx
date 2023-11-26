import React from "react";
import { Avatar } from "@mui/material";
type UserAvatarProps = {
    userId: number;
    userName: string;
    imageUrl: string;
    size?: number;
}
import { useRouter } from "next/navigation";

function UserAvatar({userId, userName, imageUrl, size}: UserAvatarProps) {
    const router = useRouter();
	return <>
        <Avatar 
            alt={userName}
            src={imageUrl}
            sx={{
                width: size ? size : 36,
                height: size ? size : 36,
            }}
            className="cursor-pointer"
            onClick={() => router.push(`/user/${userId}`)}
        />
    </>;
}

export default UserAvatar;
