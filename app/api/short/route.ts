import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import connectDB from "@/lib/db/connectDB";
import UrlSchema from "@/lib/db/UrlSchema";
import UserSchema from "@/lib/db/UserSchema";
import { validateUrl, verifyToken } from "@/lib/utils";

export async function POST(req: Request) {
  await connectDB();
  const { originalUrl } = await req.json();

  if (validateUrl(originalUrl)) {
    try {
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

      let url = await UrlSchema.findOne({ originalUrl });
      if (url) {
        return NextResponse.json(url, { status: 200 });
      } else {
        const urlId = nanoid();

        url = new UrlSchema({
          originalUrl,
          urlId,
          date: new Date(),
        });
        await url.save();

        await UserSchema.findByIdAndUpdate(user._id, {
          $push: { urls: url },
        });

        return NextResponse.json(url, { status: 201 });
      }
    } catch (err) {
      console.error(`Error in /api/short: ${err}`);
      return NextResponse.json(
        { error: "Server error in /short" },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json(
      { error: "Invalid original Url" },
      { status: 400 },
    );
  }
}
