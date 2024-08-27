import { NextResponse } from "next/server";

import connectDB from "@/lib/db/connectDB";
import UserSchema from "@/lib/db/UserSchema";
import { verifyToken } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    await connectDB();

    const refreshToken = req.headers.get("Authorization")?.split(" ")[1];

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Cannot logout without a token" },
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

    const user = await UserSchema.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: refreshToken },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Logging out with invalid user" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 201 },
    );
  } catch (err) {
    console.error(`Error in /api/logout: ${err}`);
    return NextResponse.json({ error: "Logout error" }, { status: 500 });
  }
}
