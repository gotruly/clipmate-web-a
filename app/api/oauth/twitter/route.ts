import { env } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";
import { captureException } from "@sentry/nextjs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (state !== "state") {
    return NextResponse.json({ error: "Invalid state", status: 400 });
  }

  try {
    const tokenResponse = await fetch(
      `https://api.twitter.com/2/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${env.oauth.twitter_redirect_uri}&client_id=${env.oauth.twitter_client_id}&code_verifier=challenge`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token } = await tokenResponse.json();

    return NextResponse.json({ access_token, refresh_token });
  } catch (error) {
    captureException(error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
}
