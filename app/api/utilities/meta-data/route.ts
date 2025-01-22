import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url") as string;

  try {
    const res = await fetch(`https://api.dub.co/metatags?url=${url}`);
    return NextResponse.json({ res });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
