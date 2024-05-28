"use server";
import { signInSchema, signUpSchema } from "@/components/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import User from "@/db/entities/user";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { v4 as uuidv4 } from "uuid";
import { sendInvitationEmail } from "@/lib/mail";
import VerificationToken from "@/db/entities/verificationToken";
const entity = new User();
export async function registerUser(values: z.infer<typeof signUpSchema>) {
    const validatedFields = signUpSchema.safeParse(values);

    // Validates the fields using zod and the signup schema
    if (!validatedFields.success) return { error: "Invalid Fields" };

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await entity.getUserByEmail(email);

    // Verifies that the email is not already registered in the DB
    if (existingUser) throw new Error("Email Already in use");

    const tokenEntity = new VerificationToken();
    const isInvited = await tokenEntity.getVerificationTokenByEmail(email)

    if (!isInvited || isInvited.expires < new Date()) throw new Error("You were not invited or your invitation expired")

    // Proceed with the insertion in the DB
    try {
        return await entity.createUser({ email, password: hashedPassword, name, emailVerified:new Date() });
    } catch (err) {
        throw new Error("User couldn't be ceated");
    }
}

export async function login(values: z.infer<typeof signInSchema>) {
    const validatedFields = signInSchema.safeParse(values);

    if (!validatedFields.success) throw new Error("Invalid Fields");

    const { email, password } = validatedFields.data;
    const existingUser = await entity.getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password)
        throw new Error("User doest not exist");

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });
    } catch (error) {
        if (error instanceof AuthError) // Handle auth errors
            throw error // Rethrow all other errors
        throw error;
    }
}

export async function invite(email: string) {
    const tokenEntity = new VerificationToken();
    const existingUser = await entity.getUserByEmail(email);
    const exisitingToken = await tokenEntity.getVerificationTokenByEmail(email);
    if (existingUser) throw new Error("User already Registered!")

    if (exisitingToken) {
        try {
            const newToken = await tokenEntity.extendTokenExpiration(exisitingToken.email, new Date(new Date().getTime() + 3600 * 1000))
            await sendInvitationEmail(email, newToken[0].token);
            return "Invitation sent successfully...";
        } catch (err) {
            throw new Error("Error while processing your requet");
        }

    }

    try {
        const newToken = await tokenEntity.createVerificationToken(
            {
                email,
                token: uuidv4(),
                expires: new Date(new Date().getTime() + 3600 * 1000),
            }
        )
        await sendInvitationEmail(email, newToken[0].token);
        return "Invitation sent successfully..."
    } catch (err) {
        throw new Error("Something went wrong!")
    }

}
export async function verificationToken(token:string) {
    const tokenEntity = new VerificationToken();
    const exisitingToken = await tokenEntity.getVerificationToken(token);
    if(!exisitingToken) return{ error:"The invitation is invalid"}
    
    const hasExpired = exisitingToken.expires < new Date();
    if(hasExpired) return{ error:"The invitation has expired" }

    return{ success:"Invitation is Valid"}
    
}