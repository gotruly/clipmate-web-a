import { Timestamp } from "firebase/firestore";

export type IClipmateBase<T extends Record<string, any> = Record<string, any>> = {
  data: T;
  inbox: "default" | "archive" | "trash";
  inbox_changed: boolean;
  collections: Record<string, { date_added: Timestamp }>;
  collections_public: string[];
  date_added: {
    seconds: number;
    nanoseconds: number;
  };
  user_id: string;
  search_data: {
    target_id: string;
    id: string;
    text: string;
    type: string;
    title: string | null;
    authors: string[];
  };
  date_created: {
    seconds: number;
    nanoseconds: number;
  };
  date_smart: {
    seconds: number;
    nanoseconds: number;
  };
  search_added: boolean;
  type: string;
  _id: string;
};

export type ITwitter = {
  post: {
    attachments: {
      media_keys: string[];
    };
    entities: {
      urls: {
        display_url: string;
        expanded_url: string;
        start: number;
        end: number;
        media_key: string;
        url: string;
        images?: { height: number; width: number; url: string }[];
      }[];
      annotations: {
        probability: number;
        normalized_text: string;
        start: number;
        end: number;
        type: string;
      }[];
    };
    conversation_id: string;
    public_metrics: {
      like_count: number;
      bookmark_count: number;
      reply_count: number;
      quote_count: number;
      retweet_count: number;
      impression_count: number;
    };
    edit_history_tweet_ids: string[];
    created_at: string;
    text: string;
    note_tweet: {
      text: string;
    };
    id: string;
    author_id: string;
    lang: string;
    context_annotations: {
      domain: {
        name: string;
        description: string;
        id: string;
      };
      entity: {
        name: string;
        id: string;
      };
    }[];
  };
  author: {
    name: string;
    public_metrics: {
      tweet_count: number;
      like_count: number;
      following_count: number;
      listed_count: number;
      followers_count: number;
    };
    verified: boolean;
    description: string;
    created_at: string;
    profile_image_url: string;
    id: string;
    username: string;
  };
  media: {
    preview_image_url: string;
    url: string;
    width: number;
    variants: [
      {
        bit_rate: number;
        content_type: string;
        url: string;
      }
    ];
    type: string;
    media_key: string;
    height: number;
  }[];

  url: string;
};

export type IReddit = {
  post: {
    secure_media: string | null;
    saved: boolean;
    hide_score: boolean;
    total_awards_received: number;
    subreddit_id: string;
    score: number;
    num_comments: number;
    mod_reason_title: string | null;
    whitelist_status: string;
    removed_by: string | null;
    spoiler: boolean;
    id: string;
    created_utc: number;
    banned_at_utc: number | null;
    discussion_type: string | null;
    edited: boolean;
    allow_live_comments: boolean;
    author_flair_background_color: string;
    approved_by: string | null;
    media_embed: {};
    domain: string;
    top_awarded_type: string | null;
    no_follow: boolean;
    approved_at_utc: number | null;
    ups: number;
    author_flair_type: string;
    permalink: string;
    wls: number;
    content_categories: string | null;
    author_flair_css_class: string;
    mod_reports: any[];
    gilded: number;
    removal_reason: string | null;
    send_replies: boolean;
    archived: boolean;
    author_flair_text_color: string;
    can_mod_post: boolean;
    is_self: boolean;
    author_fullname: string;
    link_flair_css_class: string | null;
    upvote_ratio: number;
    selftext_html: string | null;
    selftext: string;
    body: string;
    body_html: string | null;
    user_reports: any[];
    is_crosspostable: boolean;
    clicked: boolean;
    url: string;
    author_flair_template_id: string;
    url_overridden_by_dest: string;
    parent_whitelist_status: string;
    stickied: boolean;
    author_is_blocked: boolean;
    quarantine: boolean;
    view_count: number | null;
    link_flair_richtext: any[];
    link_flair_background_color: string;
    author_flair_richtext: [
      {
        a: string;
        u: string;
        e: string;
      },
      {
        t: string;
        e: string;
      }
    ];
    over_18: boolean;
    subreddit: string;
    suggested_sort: string | null;
    can_gild: boolean;
    is_robot_indexable: boolean;
    is_created_from_ads_ui: boolean;
    author_premium: boolean;
    post_hint: string;
    locked: boolean;
    likes: number | null;
    thumbnail: string;
    downs: number;
    author: string;
    created: number;
    treatment_tags: any[];
    link_flair_text_color: string;
    gildings: {};
    report_reasons: any | null;
    is_video: boolean;
    is_original_content: boolean;
    subreddit_name_prefixed: string;
    mod_reason_by: string | null;
    name: string;
    awarders: string[];
    media_only: boolean;
    num_reports: any | null;
    preview: {
      images: {
        resolutions: {
          width: number;
          url: string;
          height: number;
        }[];
        source: {
          width: number;
          url: string;
          height: number;
        };
        id: string;
        variants: {};
      }[];
      enabled: boolean;
    };
    pinned: boolean;
    hidden: boolean;
    author_patreon_flair: boolean;
    mod_note: string | null;
    media: {
      oembed: {
        author_name: string;
        provider_url: string;
        title: string;
        thumbnail_url: string;
        type: string;
        version: string;
        thumbnail_height: number;
        author_url: string;
        thumbnail_width: number;
        width: number;
        html: string;
        provider_name: string;
        height: number;
      };
      type: string;
    } | null;
    title: string;
    author_flair_text: string;
    num_crossposts: number;
    thumbnail_width: number;
    secure_media_embed: {};
    link_flair_text: string | null;
    subreddit_type: string;
    is_meta: boolean;
    subreddit_subscribers: number;
    distinguished: string | null;
    removed_by_category: string | null;
    thumbnail_height: number;
    all_awardings: any[];
    link_flair_type: string;
    visited: boolean;
    pwls: number;
    category: string | null;
    banned_by: string | null;
    contest_mode: boolean;
    is_reddit_media_domain: boolean;
  };
  url: string;
};

export type IPDF = {
  summary: string;
  preview_image: string;
  storage_file_path: string;
  file_name: string;
  storage_file_name: string;
  title: string;
  short_summary: string;
  authors: string[];
  image_CACHE: string;
  file_CACHE: string;
};

export type IGithub = {
  repo: {
    compare_url: string;
    watchers: number;
    teams_url: string;
    pulls_url: string;
    tags_url: string;
    issue_comment_url: string;
    forks_url: string;
    web_commit_signoff_required: boolean;
    homepage: string;
    full_name: string;
    updated_at: string;
    notifications_url: string;
    milestones_url: string;
    visibility: string;
    id: number;
    languages_url: string;
    default_branch: string;
    private: boolean;
    has_projects: boolean;
    watchers_count: number;
    downloads_url: string;
    topics: string[];
    has_wiki: boolean;
    disabled: boolean;
    ssh_url: string;
    archived: boolean;
    git_refs_url: string;
    size: number;
    license: {
      key: string;
      node_id: string;
      spdx_id: string;
      name: string;
      url: string;
    };
    forks_count: number;
    name: string;
    issues_url: string;
    has_issues: boolean;
    open_issues: number;
    commits_url: string;
    merges_url: string;
    git_commits_url: string;
    contents_url: string;
    labels_url: string;
    trees_url: string;
    description: string;
    html_url: string;
    deployments_url: string;
    is_template: boolean;
    url: string;
    hooks_url: string;
    has_pages: boolean;
    node_id: string;
    permissions: {
      triage: boolean;
      pull: boolean;
      admin: boolean;
      maintain: boolean;
      push: boolean;
    };
    svn_url: string;
    git_url: string;
    language: string;
    releases_url: string;
    git_tags_url: string;
    contributors_url: string;
    has_downloads: boolean;
    issue_events_url: string;
    owner: {
      followers_url: string;
      subscriptions_url: string;
      node_id: string;
      html_url: string;
      gists_url: string;
      gravatar_id: string;
      login: string;
      type: string;
      avatar_url: string;
      url: string;
      site_admin: boolean;
      received_events_url: string;
      events_url: string;
      id: number;
      following_url: string;
      starred_url: string;
      repos_url: string;
      user_view_type: string;
      organizations_url: string;
    };
    created_at: string;
    comments_url: string;
    events_url: string;
    has_discussions: boolean;
    stargazers_count: number;
    keys_url: string;
    open_issues_count: number;
    fork: boolean;
    subscribers_url: string;
    archive_url: string;
    pushed_at: string;
    collaborators_url: string;
    clone_url: string;
    forks: number;
    statuses_url: string;
    subscription_url: string;
    assignees_url: string;
    branches_url: string;
    allow_forking: boolean;
    mirror_url: string | null;
    blobs_url: string;
    stargazers_url: string;
  };
  url: string;
};

export type IScreenshot = {
  hash: string;
  id: number;
  url: string;
};

export type LinkState = {
  image: string;
  description: string;
  title: string;
  url: string;
};

export type ILink = {
  image: string;
  description: string;
  title: string;
  url: string;
};

export type IConnection = {
  automatic_sync: boolean;
  auth_needed: boolean;
  access_token: string;
  refresh_token: string;
  last_sync_start: {
    seconds: number;
    nanoseconds: number;
  };
  count: number;
  last_sync: {
    seconds: number;
    nanoseconds: number;
  };
  full_sync_completed: boolean;
  sync_in_progress: boolean;
  last_sync_end: {
    seconds: number;
    nanoseconds: number;
  };
};

export type IClipmateLimits = {
  last_reset: Timestamp;
  last_used: Timestamp;
  limit: number;
  remaining: number;
};

export interface IClipmateConnection extends Record<string, any> {
  is_pro: boolean;
  is_activated: boolean;
  twitter: IConnection;
  reddit: IConnection;
  limits: IClipmateLimits;
  _id: string;
}

export type IClipmateCollections = {
  name: string;
  description?: string;
  user_id: string;
  public: boolean;
  count: number;
  _id: string;
};

export type IClipmateFollowing = {
  user_id: string;
  origin_user_id: string;
  collection_id: string;
  date_created: Timestamp;
  count: number;
  _id: string;
};

export type DubCoType = {
  title: string;
  description: string;
  image: string;
  poweredBy: string;
};

export type IClipmatePrice = {
  interval_count: number;
  tax_behavior: string;
  metadata: {};
  product: string;
  tiers: any | null;
  recurring: {
    interval_count: number;
    usage_type: string;
    meter: any | null;
    aggregate_usage: any | null;
    interval: string;
    trial_period_days: any | null;
  };
  active: boolean;
  description: any | null;
  billing_scheme: string;
  trial_period_days: any | null;
  unit_amount: number;
  type: string;
  transform_quantity: any | null;
  tiers_mode: any | null;
  currency: string;
  interval: string;
  _id: string;
};

export type IClipmateReaderMode = {
  _id: string;
  id: string;
  md_clean: string;
  md_jina: string;
  highlights: HighlightValue[];
};

export type IClipmateInvoices = {
  url: string;
  client: string;
  mode: string;
  cancel_url: string;
  success_url: string;
  price: string;
  sessionId: string;
  created: Timestamp;
  _id: string;
};

export type Highlight = {
  start: number;
  end: number;
  color: string;
  note: string | null;
};

export type EditingNote = {
  index: number | null;
  text: string;
};

export type HighlightValue = {
  start: number;
  end: number;
  color: string;
  value: string;
  note?: string;
};

export type MenuCoords = {
  top: number;
  left: number;
  value: string;
  start: number;
  end: number;
  hasContent: boolean;
};

export type IClipmateTwitter = IClipmateBase<ITwitter>;
export type IClipmateReddit = IClipmateBase<IReddit>;
export type IClipmateLink = IClipmateBase<ILink>;
export type IClipmatePDF = IClipmateBase<IPDF>;
export type IClipmateGithub = IClipmateBase<IGithub>;
export type IClipmateScreenshot = IClipmateBase<IScreenshot>;
export type IClipmateResponse = IClipmateBase;
