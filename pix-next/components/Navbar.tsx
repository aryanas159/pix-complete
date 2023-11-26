"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { InputBase } from "@mui/material";
import Button from "@mui/material/Button";
import { Avatar } from "@mui/material";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import SearchResults from "@/components/SearchResults";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMediaQuery } from "@mui/material";
import MobileMenu from "@/components/MobileMenu";
export default function Navbar() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [search, setSearch] = React.useState<string>("");
	const [isFocused, setIsFocused] = React.useState<boolean>(false);
	const isMobile = useMediaQuery("(max-width:800px)");
	const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
	return (
		<AppBar
			position="sticky"
			className="bg-bg/60 h-[64px]"
			sx={{
				boxShadow: "none",
				borderBottom: "1px solid #333",
				backdropFilter: "blur(15px)",
			}}
		>
			<Toolbar className="justify-between">
				<Box
					className="flex gap-4 items-center xs:pl-2 sm:pl-8 cursor-pointer"
					onClick={() => router.push("/feed")}
				>
					<Image
						src="/assets/logo_dark.png"
						alt="PIX"
						width={40}
						height={40}
						className="xs:w-[30px] xs:h-[30px] sm:h-[40px] sm:w-[40px] mr-4"
					/>
					<Typography
						variant="h6"
						component="div"
						className="text-[1.8rem] font-AROneSans tracking-wider xs:hidden md:block"
					>
						PIX
					</Typography>
				</Box>
				<Box className="flex gap-4 sm:mr-8 items-center">
					<div className="flex items-center relative gap-2 bg-gray-dark rounded-full px-4  xs:py-1 sm:py-2 transition-all">
						<SearchIcon />
						<InputBase
							size="small"
							name="search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search…"
							onFocus={() => setIsFocused(true)}
							onBlur={() => {
								setTimeout(() => {
									setIsFocused(false);
								}, 300);
							}}
							className="text-white xs:text-sm xs:w-30 sm:w-60 transition-all"
						/>
						{search && isFocused && <SearchResults name={search} />}
					</div>
					<Link href="/chat" className="flex items-center xs:hidden sm:block">
						<Image
							src="/assets/chat.svg"
							alt="PIX Chat"
							width={30}
							height={30}
							className="cursor-pointer"
						/>
					</Link>
					{session?.user && (
						<Avatar
							alt={session.user?.name as string}
							src={session.user?.image as string}
							sx={{
								width: { xs: 32, sm: 40 },
								height: { xs: 32, sm: 40 },
							}}
							className="cursor-pointer"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						/>
					)}
					{!isMobile &&
						(session ? (
							<Button color="inherit" onClick={() => signOut()}>
								Logout
							</Button>
						) : (
							<Button color="inherit" onClick={() => signIn()}>
								Login
							</Button>
						))}
				</Box>
				{isMobile && isMenuOpen && (
					<div className="flex flex-col p-4 gap-2 absolute bg-bg top-[56px] right-0">
						<MobileMenu />
					</div>
				)}
			</Toolbar>
		</AppBar>
	);
}
