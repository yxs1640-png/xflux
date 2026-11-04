export interface TwitterUser {
  id: string;
  username: string;
  name: string;
  description?: string;
  followers_count: number;
  following_count: number;
  tweet_count: number;
  profile_image_url?: string;
  /** Profile banner / header image when available */
  profile_banner_url?: string;
  /** X profile avatar shape, e.g. Circle or Square */
  profile_image_shape?: string;
  /** True when blue-verified or legacy verified */
  verified: boolean;
  /** Legacy verified flag from X (`verification.verified`) when distinct from blue */
  legacy_verified?: boolean;
  /** e.g. Business — from X verification.verified_type */
  verified_type?: string;
  created_at: string;
  location?: string;
  /** Expanded website URL when available */
  url?: string;
  /** Display website host/path (e.g. coresignal.com) */
  website?: string;
  protected?: boolean;
  can_dm?: boolean;
  suspended?: boolean;
  professional_type?: string;
  professional_categories?: string[];
  has_extended_profile?: boolean;
}

export interface TwitterTweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  author?: TwitterUser;
}
