const env = {
  app_name: process.env.NEXT_PUBLIC_APP_NAME,
  firebase: { functionRegion: "us-west1" },
  oauth: {
    twitter_redirect_uri: "https://app.clipmate.ai/auth/callback/twitter",
    twitter_client_id: "ZUJiYVViUDZFTVJvUEdIdmtJdUI6MTpjaQ",
    twitter_url: `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${"ZUJiYVViUDZFTVJvUEdIdmtJdUI6MTpjaQ"}&redirect_uri=${"https://app.clipmate.ai/auth/callback/twitter"}&scope=tweet.read users.read bookmark.read follows.read offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`,

    reddit_redirect_uri: "https://app.clipmate.ai/auth/callback/reddit",
    reddit_client_id: "BuxK6ELOXeuGA6CwFMryzA",
    reddit_url: `https://www.reddit.com/api/v1/authorize?client_id=${"BuxK6ELOXeuGA6CwFMryzA"}&response_type=code&state=ClipmateIOS&redirect_uri=${"https://app.clipmate.ai/auth/callback/reddit"}&duration=permanent&scope=save identity read history`,

    github_client_id: "Ov23lisrNT9CunWp41aO",
    github_client_secret: "e9f59504a38ba57d2ae1a2053c638e0133317102",
    github_token_url: "https://github.com/login/oauth/access_token",
    github_url: `${"https://github.com/login/oauth/authorize"}?client_id=${"Ov23lisrNT9CunWp41aO"}&scope=read:user&redirect_uri=${"https://app.clipmate.ai/auth/callback/github"}`,
    github_redirect_uri: "https://app.clipmate.ai/auth/callback/github",

    // Local Reddit OAuth - For Testing
    // reddit_redirect_uri: "http://localhost:3000/auth/callback/reddit",
    // reddit_client_id: "dIPfg5btXGDRSqWFboM9ug",
    // reddit_url: `https://www.reddit.com/api/v1/authorize?client_id=${"dIPfg5btXGDRSqWFboM9ug"}&response_type=code&state=ClipmateIOS&redirect_uri=${"http://localhost:3000/auth/callback/reddit"}&duration=permanent&scope=save identity read history`,
  },
  chrome_extension_id: "mafodmdmlnaeedjmkcahoalllaaleehj",
  posthog_id: "phc_hJq4JHEBu569JINTeU6DUBtNtzTHl5naQhbDI7dqmUW",
  posthog_host: "/ingest",
  intercom_id: "bzferfsc",
  intercom_HMAC: "7Ta-Hw37JYmFv_ne20aGaMXzFf8XfP5P2Y5wnNfQ",
  rc_key: "rcb_sb_IYiKwRdAecuoyxPZtGzPCQeWl",
  react_scan_monitoring_api_key: "tEFTZewZgKIj3Wi6nM69EQaVLMtOZizD",
};

export { env };
