import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import connectDB from "@/lib/db/connectDB";
import UserSchema from "@/lib/db/UserSchema";
import { generateAccessToken, verifyToken } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    await connectDB();

    const refreshToken = req.headers.get("Authorization")?.split(" ")[1];

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Cannot refresh a null token" },
        { status: 401 },
      );
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return NextResponse.json(
        { error: "Logging out with an invalid refresh token" },
        { status: 401 },
      );
    }

    const userId = decoded.sub;
    const user = await UserSchema.findById(userId);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const accessToken = generateAccessToken(user._id, user.password);

    return NextResponse.json({ accessToken }, { status: 200 });
  } catch (err) {
    console.error(`Error in /api/refresh: ${err}`);
    return NextResponse.json({ error: "Login error" }, { status: 500 });
  }
}
