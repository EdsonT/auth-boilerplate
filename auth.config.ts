import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import  User from "@/db/entities/user";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { signInSchema } from "./components/schemas";
 
export default { 
    providers: [
        Credentials({
            async authorize(credentials) {
                const validateFields = signInSchema.safeParse(credentials);

                if (validateFields.success){
                    const {email, password} = validateFields.data;
                    const entity = new User()
                    const user = await entity.getUserByEmail(email);
                    if(!user || !user.password) return null;

                    const passwordMatch = await bcrypt.compare(password,user.password);

                    if(passwordMatch) return user;
                }
                return null;
            }
        })
    ] 
} satisfies NextAuthConfig