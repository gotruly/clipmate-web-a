import { env } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";
import { captureException } from "@sentry/nextjs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  try {
    const params = new URLSearchParams();
    params.append("code", String(code));
    params.append("client_id", env.oauth.github_client_id);
    params.append("client_secret", env.oauth.github_client_secret);
    params.append("redirect_uri", env.oauth.github_redirect_uri);

    const tokenResponse = await fetch(`https://github.com/login/oauth/access_token`, {
      method: "POST",
      body: params,
      headers: {
        Accept: "application/json",
      },
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token response error: ${tokenResponse.statusText}`);
    }

    const { access_token } = await tokenResponse.json();

    return NextResponse.json({ access_token, refresh_token: null });
  } catch (error) {
    captureException(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
