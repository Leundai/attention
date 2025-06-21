interface MediaItem {
  id?: string;
  type?: string;
  url?: string;
  display_url?: string;
  expanded_url?: string;
  dimensions?: {
    width?: number;
    height?: number;
  };
  alt_text?: string | null;
}

interface Hashtag {
  text?: string;
  indices?: number[];
}

interface Mention {
  id?: string;
  username?: string;
  name?: string;
  indices?: number[];
}

interface Url {
  url?: string;
  expanded_url?: string;
  display_url?: string;
  indices?: number[];
}

interface TweetUser {
  id?: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  followers_count?: number;
  following_count?: number;
  tweets_count?: number;
  likes_count?: number;
  listed_count?: number;
  is_verified?: boolean;
  is_protected?: boolean;
  created_at?: string;
  professional_category?: string;
  website?: string;
}

interface Tweet {
  id: string;
  conversation_id: string;
  text: string;
  created_at: string;
  language?: string;
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  bookmarks: number;
  views: number;
  is_liked?: boolean;
  is_retweeted?: boolean;
  is_bookmarked?: boolean;
  is_quote_tweet: boolean;
  is_reply: boolean;
  is_thread: boolean;
  possibly_sensitive?: boolean;
  media?: MediaItem[];
  user?: TweetUser;
  quoted_tweet?: Tweet | null;
  hashtags: Hashtag[];
  mentions: Mention[];
  urls?: Url[];
  parsed_at: string;
  [key: string]: unknown;
}

export type { Tweet, TweetUser, MediaItem, Hashtag, Mention, Url };
