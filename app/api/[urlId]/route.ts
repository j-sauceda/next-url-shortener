import { NextResponse } from "next/server";

import connectDB from "@/lib/db/connectDB";
import UrlSchema from "@/lib/db/UrlSchema";
import UserSchema from "@/lib/db/UserSchema";

export async function GET(req: Request) {
  try {
    await connectDB();

    const requestUrl = req.url;
    const urlId = requestUrl.split("/")[4];

    const url = await UrlSchema.findOne({ urlId });

    if (url) {
      await UrlSchema.updateOne(
        {
          urlId,
        },
        {
          $inc: { clicks: 1 },
        },
      );

      return NextResponse.json({ url: url.originalUrl }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Not found" }, { status: 400 });
    }
  } catch (err) {
    console.error(`Error in /api/:urlId: ${err}`);
    return NextResponse.json(
      { error: "Server error in /:urlId" },
      { status: 500 },
    );
  }
}
