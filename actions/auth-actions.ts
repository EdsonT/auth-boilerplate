"use server";
import { signInSchema, signUpSchema } from "@/components/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import User from "@/db/entities/user";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { v4 as uuidv4} from "uuid";
import { sendInvitationEmail } from "@/lib/mail";
const entity = new User();
export async function registerUser(values: z.infer<typeof signUpSchema>) {
    const validatedFields = signUpSchema.safeParse(values);

    // Validates the fields using zod and the signup schema
    if (!validatedFields.success) return { error: "Invalid Fields" };

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await entity.getUserByEmail(email);

    console.log(existingUser);

    // Verifies that the email is not already registered in the DB
    if (existingUser) throw new Error("Email Already in use");

    // Proceed with the insertion in the DB
    try {
        return await entity.createUser({ email, password: hashedPassword, name });
    } catch (err) {
        throw err;
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
            redirectTo: DEFAULT_LOGIN_REDIRECT ,
        });
    } catch (error) {
        if (error instanceof AuthError) // Handle auth errors
            throw error // Rethrow all other errors
        throw error;
    }
}   

export async function invite(email:string) {
    const token = uuidv4();
    await sendInvitationEmail(email,token);
    
}