const extractMedia = (legacy: any) => {
  const media = [];
  const mediaEntities = legacy.extended_entities?.media || legacy.entities?.media || [];

  for (const item of mediaEntities) {
    media.push({
      id: item.id_str,
      type: item.type,
      url: item.media_url_https,
      display_url: item.display_url,
      expanded_url: item.expanded_url,
      dimensions: {
        width: item.original_info?.width,
        height: item.original_info?.height,
      },
      alt_text: item.ext_alt_text || null,
    });
  }

  return media;
};

const extractHashtags = (legacy: any) => {
  return (legacy.entities?.hashtags || []).map((tag: any) => ({
    text: tag.text,
    indices: tag.indices,
  }));
};

const extractMentions = (legacy: any) => {
  return (legacy.entities?.user_mentions || []).map((mention: any) => ({
    id: mention.id_str,
    username: mention.screen_name,
    name: mention.name,
    indices: mention.indices,
  }));
};

const extractUrls = (legacy: any) => {
  return (legacy.entities?.urls || []).map((url: any) => ({
    url: url.url,
    expanded_url: url.expanded_url,
    display_url: url.display_url,
    indices: url.indices,
  }));
};

const isReply = (legacy: any) => {
  return legacy.in_reply_to_status_id_str != null;
};

const isThread = (legacy: any) => {
  return legacy.display_text_range && legacy.display_text_range[0] > 0;
};

const parseTweet = (raw_tweet: any) => {
  let tweet: any = raw_tweet;
  if ('tweet' in raw_tweet) {
    tweet = raw_tweet.tweet as any;
  }

  try {
    const legacy = tweet.legacy || {};
    const core = tweet.core || {};
    const userResult = core.user_results?.result || {};
    const userLegacy = userResult.legacy || {};
    const userCore = userResult.core || {};

    // Extract basic tweet info
    const tweetInfo = {
      // Tweet identifiers
      id: tweet.rest_id,
      conversation_id: legacy.conversation_id_str,

      // Content
      text: legacy.full_text || '',
      created_at: legacy.created_at,
      language: legacy.lang,

      // Engagement metrics
      likes: legacy.favorite_count || 0,
      retweets: legacy.retweet_count || 0,
      replies: legacy.reply_count || 0,
      quotes: legacy.quote_count || 0,
      bookmarks: legacy.bookmark_count || 0,
      views: parseInt(tweet.views?.count) || 0,

      // User engagement status
      is_liked: legacy.favorited || false,
      is_retweeted: legacy.retweeted || false,
      is_bookmarked: legacy.bookmarked || false,

      // Content flags
      is_quote_tweet: legacy.is_quote_status || false,
      is_reply: isReply?.(legacy) || false,
      is_thread: isThread?.(legacy) || false,
      possibly_sensitive: legacy.possibly_sensitive || false,

      // Media content
      media: extractMedia?.(legacy) || [],

      // User information
      user: {
        id: userResult.rest_id,
        username: userCore.screen_name,
        display_name: userCore.name,
        avatar_url: userResult.avatar?.image_url,

        // User metrics
        followers_count: userLegacy.followers_count || 0,
        following_count: userLegacy.friends_count || 0,
        tweets_count: userLegacy.statuses_count || 0,
        likes_count: userLegacy.favourites_count || 0,
        listed_count: userLegacy.listed_count || 0,

        // User status
        is_verified: userResult.is_blue_verified || userResult.verification?.verified || false,
        is_protected: userResult.privacy?.protected || false,
        created_at: userCore.created_at,

        // Professional info
        professional_category: userResult.professional?.category?.[0]?.name,
        website: userLegacy.url,
      },

      // Quote tweet info (if applicable)
      quoted_tweet: null,

      // Hashtags and mentions
      hashtags: extractHashtags?.(legacy) || [],
      mentions: extractMentions?.(legacy) || [],
      urls: extractUrls?.(legacy) || [],

      // Temporal info
      parsed_at: new Date().toISOString(),
    };

    // Parse quoted tweet if present
    if (tweet.quoted_status_result?.result) {
      tweetInfo.quoted_tweet = parseTweet(tweet.quoted_status_result?.result) as any;
    }

    return tweetInfo;
  } catch (error) {
    console.error('Error parsing individual tweet:', error);
    return null;
  }
};

export const tweetParser = {
  parseResponse: (response: any) => {
    const tweets = [];

    try {
      const instructions = response?.data?.home?.home_timeline_urt?.instructions || [];

      for (const instruction of instructions) {
        if (instruction.type === 'TimelineAddEntries' && instruction.entries) {
          for (const entry of instruction.entries) {
            console.log(typeof entry.entryId);
            if (entry.entryId.includes('promoted-tweet')) continue;

            if (entry.content?.itemContent?.tweet_results?.result) {
              const tweetData = parseTweet(entry.content?.itemContent?.tweet_results?.result);
              if (tweetData) {
                tweets.push(tweetData);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error parsing Twitter response:', error);
    }

    return tweets;
  },
};
