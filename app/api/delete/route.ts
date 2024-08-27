import { NextResponse } from "next/server";

import connectDB from "@/lib/db/connectDB";
import UrlSchema from "@/lib/db/UrlSchema";
import UserSchema from "@/lib/db/UserSchema";
import { verifyToken } from "@/lib/utils";

export async function DELETE(req: Request) {
  await connectDB();
  const { urlId } = await req.json();

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

    let url = await UrlSchema.findOne({ urlId });
    if (!url) {
      return NextResponse.json({ status: 204 });
    } else {
      await UserSchema.findByIdAndUpdate(user._id, {
        $pull: { urls: url._id },
      });

      await UrlSchema.findByIdAndDelete(url._id.toString());

      return NextResponse.json({ status: 204 });
    }
  } catch (err) {
    console.error(`Error in /api/delete: ${err}`);
    return NextResponse.json(
      { error: "Server error in /api/delete" },
      { status: 500 },
    );
  }
}
