import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: any) {
  //token will exist if user is logged in
  const token = await getToken({ req: req, secret: process.env.JWT_SECRET! });
  console.log("token at middleware", token);
  const { pathname } = req.nextUrl;

  if (pathname.includes("api/auth") || token) {
    console.log("respons.next at middleware");
    return NextResponse.next();
  }

  //redirect them to login if they don't have token and are
  //requesting a protected route
  if (!token && pathname !== "/login") {
    console.log("redirect to login middleware");
    return NextResponse.redirect("/login");
  }
}
