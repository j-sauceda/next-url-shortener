import { NextResponse } from "next/server";

import connectDB from "@/lib/db/connectDB";
import UrlSchema from "@/lib/db/UrlSchema";
import UserSchema from "@/lib/db/UserSchema";
import { verifyToken } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Provided a null token" },
        { status: 401 },
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Listing links with an invalid access token" },
        { status: 401 },
      );
    }

    const userId = decoded.sub;
    const user = await UserSchema.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    let userLinks = await UrlSchema.find({ _id: { $in: user.urls } });

    return NextResponse.json(
      { totalItems: userLinks.length, items: userLinks },
      { status: 200 },
    );
  } catch (err) {
    console.error(`Error in /api/links: ${err}`);
    return NextResponse.json({ error: "Links error" }, { status: 500 });
  }
}
