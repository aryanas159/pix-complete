import NextAuth from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { User } from "next-auth";
import { AdapterUser } from "next-auth";

type UserSession = {
	id: number;
	name: string;
	email: string;
	image: string;
};

declare module "next-auth" {
	interface Session {
		user: UserSession;
	}
	interface JWT extends Record<string, unknown>, DefaultJWT {
		user?: UserSession;
	}
	interface User extends User {
		id?: number;
	}
	interface AdapterUser extends AdapterUser {
		id: number | string;
	}
}
