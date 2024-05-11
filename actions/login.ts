"use server"

import { signIn } from "@/auth"
import { LoginSchema } from "@/components/auth/schemas";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/dist/server/api-utils";
import * as z from "zod"
export default async function login(formData: FormData)  {
      // Validate the form data against the schema
      const {email,password} = LoginSchema.parse({
        email:formData.get("email"),
        password:formData.get("password"),
      });

      const result = await signIn('credentials', {
        email: email,
        password: password,
      });
      
    
  };