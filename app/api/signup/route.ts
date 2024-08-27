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
    if (user) {
      return NextResponse.json(
        { error: "An account already exists with that email" },
        { status: 409 },
      );
    }

    const newUser = new UserSchema({
      email,
      password,
      refreshTokens: [],
      urls: [],
    });
    await newUser.save();

    const accessToken = generateAccessToken(newUser._id, newUser.password);
    const refreshToken = generateRefreshToken(newUser._id, newUser.password);

    await UserSchema.findByIdAndUpdate(newUser._id, {
      $push: { refreshTokens: refreshToken },
    });

    return NextResponse.json({ accessToken, refreshToken }, { status: 200 });
  } catch (err) {
    console.error(`Error in /api/signup: ${err}`);
    return NextResponse.json({ error: "Signup error" }, { status: 500 });
  }
}
