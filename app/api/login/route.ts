import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import connectDB from "@/lib/db/connectDB";
import UserSchema from "@/lib/db/UserSchema";
import { generateAccessToken, generateRefreshToken } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const user = await UserSchema.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const accessToken = generateAccessToken(user._id, user.password);
    const refreshToken = generateRefreshToken(user._id, user.password);

    await UserSchema.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: refreshToken },
    });

    return NextResponse.json({ accessToken, refreshToken }, { status: 200 });
  } catch (err) {
    console.error(`Error in /api/login: ${err}`);
    return NextResponse.json({ error: "Login error" }, { status: 500 });
  }
}
