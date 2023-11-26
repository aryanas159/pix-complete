import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/lib/Providers";
const inter = Inter({ subsets: ["latin"] });
import { CssBaseline } from "@mui/material";
export const metadata: Metadata = {
	title: "PIX",
	description: "Social media app for sharing photos",
};
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Providers>
			<CssBaseline>
				<html lang="en">
					<body>
						<div id="root">{children}</div>
					</body>
				</html>
			</CssBaseline>
		</Providers>
	);
}
