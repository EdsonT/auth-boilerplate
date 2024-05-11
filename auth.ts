import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "./db/config"
import { eq } from "drizzle-orm"
import { users } from "./db/schema"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
// import User from "./db/entities/user";

// Your own logic for dealing with plaintext password strings; be careful!
// import { saltAndHashPassword } from "@/utils/password"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, request) {
        // const entity = new User()
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        })
        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("User not found.")
        }
        
        // Your authentication logic here, e.g., verify credentials.email and credentials.password
        // If authentication is successful, populate and return the `user` object
        return user;
      },
    }),
  ],
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
})