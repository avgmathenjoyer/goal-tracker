/* import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import {z} from "zod";
import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";
 */

/* const prisma = new PrismaClient();
async function getUser(username: string): Promise<User| null> {
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    return user;
}

export const {auth, signIn, signOut} = NextAuth({
    ...authConfig,
    providers: [Credentials({
        async authorize(credentials): Promise<any> {
            const parsedCredentials = z.object({email: z.string().email(), password: z.string().min(6)})
                                       .safeParse(credentials);

            if (parsedCredentials.success) {
                const {email, password} = parsedCredentials.data;
                const user = await getUser(email);
                if (!user) return null;
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    console.log(email) 
                    return {
                        id: user.id,
                        email: user.username
                    }; 
                }
            }
            console.log("invalid credentials");
            return null;
        }, 
    })]
}); */
/* const prisma = new PrismaClient();
async function getUser(username: string): Promise<User| null> {
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    return user;
}

export const {handlers, auth, signIn, signOut } = NextAuth({
    providers: [Credentials({
        credentials: {
            username: {label: "Username"},
            password: {label: "Password", type: "password"}
        },
        async authorize(credentials) : Promise<any> {
            const parsedCredentials = z.object({email: z.string().email(), password: z.string().min(6)})
                                       .safeParse(credentials);

            if (parsedCredentials.success) {
                const {email, password} = parsedCredentials.data;
                const user = await getUser(email);
                if (!user) return null;
                const bcrypt = require("bcrypt");
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    return {
                        id: user.id,
                        email: user.username
                    }; 
                }
            }
            console.log("invalid credentials");
            return null;
        }
    })],
    callbacks: {
        authorized({request, auth}) {
            const {pathname} = request.nextUrl;
            if (pathname === "/view") return !!auth;
            return true;
        }
    }
}) */

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"
import prisma from "./lib/prisma";


export const config = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
  ],
  callbacks: {
    async signIn({account, profile}) {
        if (!profile?.email) {
            throw new Error("No email");
        }
        await prisma.user.upsert({
            where: {
                username: profile.email
            },
            create: {
                username: profile.email,
            },
            update: {
                username: profile.email
            }
        })
        return true;
    },
    async session({session, token, user}) {
        //@ts-expect-error
        session.user.id = token.id;
        //return session;
        return { ...session,
            user: { ...session.user,
                id: token.id
            }
        }
    },
    async jwt({token, user, account, profile}) {
        if (profile && profile.email) {
            const user = await prisma.user.findUnique({
                where: {
                    username: profile.email
                }
            })
            if (!user) {
                throw Error("No user found!")
            }
            token.id = user.id
        }
        return token;
    }
  },
} satisfies NextAuthOptions

export default NextAuth(config)