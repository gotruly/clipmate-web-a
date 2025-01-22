import { useMutation, useQuery } from "@tanstack/react-query";

type Params = {
  code: string;
  state: string;
};

type GithubParams = {
  code: string;
};

const TwitterOAuthCallback = async ({ code, state }: Params) => {
  const res = await fetch(`/api/oauth/twitter?code=${code}&state=${state}`);

  if (res.status !== 200) {
    return { error: "Failed to fetch token", status: 500 };
  }

  const { access_token, refresh_token } = await res.json();

  return { access_token, refresh_token };
};

const RedditOAuthCallback = async ({ code, state }: Params) => {
  const res = await fetch(`/api/oauth/reddit?code=${code}&state=${state}`);

  if (res.status !== 200) {
    return { error: "Failed to fetch token", status: 500 };
  }

  const { access_token, refresh_token } = await res.json();

  return { access_token, refresh_token };
};

const GithubOAuthCallback = async ({ code }: GithubParams) => {
  const res = await fetch(`/api/oauth/github?code=${code}`);

  if (res.status !== 200) {
    return { error: "Failed to fetch token", status: 500 };
  }

  const { access_token, refresh_token } = await res.json();

  return { access_token, refresh_token };
};

// TanStack Query Functions
export function useTwitterOAuthCallback() {
  return useMutation({
    mutationFn: ({ code, state }: Params) => TwitterOAuthCallback({ code, state }),
  });
}

export function useRedditOAuthCallback() {
  return useMutation({
    mutationFn: ({ code, state }: Params) => RedditOAuthCallback({ code, state }),
  });
}

export function useGithubOAuthCallback() {
  return useMutation({
    mutationFn: ({ code }: GithubParams) => GithubOAuthCallback({ code }),
  });
}
