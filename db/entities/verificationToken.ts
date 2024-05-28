import { PostgresError } from "postgres";
import { db } from "../config";
import { verificationTokens } from "../schema";
import { eq } from "drizzle-orm";

type NewVerificationToken = typeof verificationTokens.$inferInsert

export default class VerificationToken {
    async createVerificationToken(record: NewVerificationToken) {
        try {
            const token = await db.insert(verificationTokens)
                                  .values(record)
                                  .returning({ token: verificationTokens.token })
            return token;
        }
        catch (err) {
            throw err
        }
    }
    async getVerificationTokenByEmail(email:string){
        try{
            const record = await db.query.verificationTokens.findFirst({
                where: eq(verificationTokens.email,email)
            })
            return record;
        } catch(err){
            throw err;
        }
    }
    async extendTokenExpiration(email:string, expires:Date){
        try{
            const record = await db.update(verificationTokens)
                                   .set({expires:expires})
                                   .where(eq(verificationTokens.email,email))
                                   .returning({ token: verificationTokens.token });
            return record;
                            
        }catch(err){
            throw err
        }
    }
    async getVerificationToken(token:string){
        try{
            const record = await db.query.verificationTokens.findFirst({
                where: eq(verificationTokens.token,token)
            })
            return record;
        } catch(err){
            throw err;
        }
    } 


}