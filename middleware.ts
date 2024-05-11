import { auth } from "@/auth"
 
export default auth((req) => {
  
  if(!!req.auth && req.nextUrl.pathname==='/auth/login' ){
    const loginUrl = `${req.nextUrl.origin}/`;
    return Response.redirect(loginUrl);
  }
  if (!req.auth && req.nextUrl.pathname!=='/auth/login') {
    const loginUrl = `${req.nextUrl.origin}/auth/login`;
    return Response.redirect(loginUrl);
  }
  
})
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  }