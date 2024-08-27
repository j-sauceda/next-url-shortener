import { NextResponse } from "next/server";

import connectDB from "@/lib/db/connectDB";
import UrlSchema from "@/lib/db/UrlSchema";
import UserSchema from "@/lib/db/UserSchema";
import { validateUrl, verifyToken } from "@/lib/utils";

export async function PUT(req: Request) {
  await connectDB();
  const { urlId, originalUrl } = await req.json();

  try {
    if (!validateUrl(originalUrl)) {
      return NextResponse.json(
        { error: "Invalid original Url" },
        { status: 400 },
      );
    }

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

    let url = await UrlSchema.findOne({ urlId });
    if (!url || !user.urls.includes(url._id)) {
      return NextResponse.json(
        { error: "URL shortcut does not belong to current user" },
        { status: 401 },
      );
    } else {
      const updatedUrl = await UrlSchema.findByIdAndUpdate(url._id, {
        originalUrl,
      });

      return NextResponse.json({ ...url._doc, originalUrl }, { status: 202 });
    }
  } catch (err) {
    console.error(`Error in /api/update: ${err}`);
    return NextResponse.json(
      { error: "Server error in /api/delete" },
      { status: 500 },
    );
  }
}
