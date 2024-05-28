import NextAuth, { type DefaultSession } from "next-auth"
import authConfig from "./auth.config"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./db/config"
import User from "./db/entities/user"
declare module "next-auth" {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
      user: {
        id:string
        /** The user's postal address. */
        role: {}
        /**
         * By default, TypeScript merges new interface properties and overwrites existing ones.
         * In this case, the default session user properties will be overwritten,
         * with the new ones defined above. To keep the default session user properties,
         * you need to add them back into the newly declared interface.
         */
      } & DefaultSession["user"]
    }
  }
  const entity = new User()

export const { auth, handlers, signIn, signOut } = NextAuth({
    pages:{
        signIn:"/auth/login",
        error:"/auth/error",
    },
    events:{
        // async linkAccount({user}) {
        //     await db.users.update({
        //             where:{ id: user.id},
        //             data: { emailVerified : new Date()}
        //         })
        // }
    },
    callbacks: {
        async signIn({user, account}) {
            if(account?.provider !== "credentials") return true;

            // const existingUser = await entity.getUserById(user.id!);
            
            // //Prevent Sign in without email verification
            // if (!existingUser?.emailVerified) return false;
            // if(!existingUser || !existingUser.emailVerified) return false
            
            // a
            return true;
        },
        async session({ token, session }) {
          
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await entity.getUserById(token.sub);

            if (!existingUser) return token;
            token.role = existingUser.role;
            return token;
        }
    },



    adapter: DrizzleAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})