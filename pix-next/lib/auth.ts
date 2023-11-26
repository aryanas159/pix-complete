import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type {
	NextAuthOptions,
	Session,
	User,
	Profile,
	Account,
	DefaultSession,
	JWT,
	AdapterUser,
} from "next-auth";
import axios from "axios";
export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			name: "PIX",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "text" },
			},
			async authorize(credentials, req): Promise<User | null> {
				try {
					const res = await axios.post(
						`${process.env.NEXT_PUBLIC_API_URL}/user/login`,
						{
							email: credentials?.email,
							password: credentials?.password,
						}
					);
					const { user } = res?.data;
					if (user) {
						return {
							id: user?.userId,
							email: user?.email,
							name: user?.fullName,
							image: user?.imageUrl,
						};
					}
					return null;
				} catch (error) {
					console.log(error);
					return null;
				}
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async signIn({
			user,
			account,
			profile,
		}: {
			user: User | AdapterUser;
			account: Account | null;
			profile?: any;
		}): Promise<boolean> {
			if (account?.provider == "credentials") {
				return true;
			}
			if (account?.provider == "google") {
				
				const userEmail = profile?.email;
				const res = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/user/fromEmail/${userEmail}`
				);
				
				const { user: myUser } = res.data;
				
				if (myUser) {
					if (myUser?.type == "GOOGLE") {
						user.id = myUser?.userId;
						return true;
					}
					return false;
				}
				const formData = new FormData();
				if (profile?.email && profile?.name && profile?.picture) {
					formData.append("fullName", profile?.name);
					formData.append("email", profile?.email);
					formData.append("password", "googleauth");
					formData.append("imageUrl", profile?.picture);
					formData.append("type", "GOOGLE");
				}
				try {
					const res = await axios.post(
						`${process.env.NEXT_PUBLIC_API_URL}/user/signup`,
						formData
					);
					return true;
				} catch (error) {
					console.log(error);
					return false;
				}
			}
			return false;
		},
		async jwt({ token, user }): Promise<JWT> {

			if (user) {
				token.user = user;
			}
			return token;
		},
		async session({ session, token }: {session: Session, token: JWT}): Promise<Session> {
			const { user } = token;
			if (user) {
				session.user = user;
			}
			return session;
		},
		
	},
};
