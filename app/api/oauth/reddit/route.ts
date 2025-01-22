import { env } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";
import { captureException } from "@sentry/nextjs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (state !== "ClipmateIOS") {
    return new NextResponse("Invalid state", { status: 400 });
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", String(code));
    params.append("redirect_uri", String(env.oauth.reddit_redirect_uri));

    const tokenResponse = await fetch(`https://www.reddit.com/api/v1/access_token`, {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${env.oauth.reddit_client_id}:${""}`).toString(
          "base64"
        )}`,
      },
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token response error: ${tokenResponse.statusText}`);
    }

    const { access_token, refresh_token } = await tokenResponse.json();

    return NextResponse.json({ access_token, refresh_token });
  } catch (error) {
    captureException(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
