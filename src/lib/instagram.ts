export interface InstagramChildMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO';
  media_url: string;
}

export interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
  children?: {
    data: InstagramChildMedia[];
  };
}

export interface InstagramProfileInfo {
  id: string;
  name: string;
  shortName: string;
  instagramId: string;
  handle: string;
  profileUrl: string;
}

export const INSTAGRAM_CONFIG: InstagramProfileInfo = {
  id: 'nursing-college',
  name: 'Mahalakshmi College of Nursing',
  shortName: 'Nursing College',
  instagramId: (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_INSTAGRAM_USER_ID) || '27676450398672968',
  handle: (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_INSTAGRAM_HANDLE) || '@mahalakshmicollegeofnursing',
  profileUrl: 'https://www.instagram.com/mahalakshmicollegeofnursing/',
};

const DEFAULT_TOKEN =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_INSTAGRAM_ACCESS_TOKEN) ||
  'IGAAOXxzDm1FZABZAGJsRkpQaUJNZAU05UHdVczJiMC10VFVZAU3ZA3eF9SXzBwYzNyMGlJaXVvME5SNC0waHh5a3prdmtqQ3VfS25NQndRLUdYa2lkRjA0NWpXMGo3dlhyWFNMWjVFc1VPWlRIa2xDSzJiTDJLV3FQcnBPbW5hbTc2TQZDZD';

const CACHE_KEY = 'mcn_instagram_media_feed_cache';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

/**
 * Checks if a post or reel is an event post based on caption hashtags
 */
export function isEventMedia(item: InstagramMediaItem): boolean {
  if (!item.caption) return false;
  return /#events?\b/i.test(item.caption);
}

/**
 * Extract all hashtags from a caption
 */
export function extractHashtags(caption?: string): string[] {
  if (!caption) return [];
  const matches = caption.match(/#[a-zA-Z0-9_\u0900-\u0D7F]+/g);
  return matches || [];
}

/**
 * Formats ISO date string to readable format
 */
export function formatInstagramDate(timestamp?: string): string {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Fetches all media items from the Instagram Graph API with caching
 */
export async function fetchInstagramMedia(forceRefresh = false): Promise<InstagramMediaItem[]> {
  // 1. Check cache first unless forced
  if (!forceRefresh) {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS && Array.isArray(parsed.items)) {
          return parsed.items;
        }
      }
    } catch {
      // Ignore cache reading error
    }
  }

  const token = DEFAULT_TOKEN;
  let allMedia: InstagramMediaItem[] = [];
  let nextUrl: string | null = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,children{id,media_type,media_url}&access_token=${token}`;

  let maxPages = 5; // Safety bound

  while (nextUrl && maxPages > 0) {
    maxPages--;
    const res: Response = await fetch(nextUrl);
    if (!res.ok) {
      throw new Error(`Instagram API error: ${res.status} ${res.statusText}`);
    }
    const json: { data?: InstagramMediaItem[]; paging?: { next?: string } } = await res.json();
    if (Array.isArray(json.data)) {
      allMedia = allMedia.concat(json.data);
    }
    nextUrl = json.paging?.next || null;
  }

  // Save to cache
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        items: allMedia,
      })
    );
  } catch {
    // Ignore storage quota error
  }

  return allMedia;
}
