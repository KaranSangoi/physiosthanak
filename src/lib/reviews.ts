import { siteConfig } from '@/data/site-config';

/**
 * Live Google review stats, sourced from the Featurable widget's public API.
 *
 * Why this exists: the review count used to be a hardcoded integer in
 * site-config.ts. It drifted out of date roughly weekly, and every manual fix
 * was stale again within days. Featurable already syncs from Google for the
 * on-page reviews widget, so we read the same numbers it does.
 *
 * The values in site-config.ts are now only a fallback for when the API is
 * unreachable at build time. They do not need to be kept current, but keeping
 * them roughly right means a failed fetch degrades quietly instead of visibly.
 */

const FEATURABLE_WIDGET_ID = '8f844505-6165-4a48-bebf-6a5e4aceaa54';
const FEATURABLE_ENDPOINT = `https://api.featurable.com/v1/widgets/${FEATURABLE_WIDGET_ID}`;

/** Refresh at most once a day. Reviews arrive far slower than this. */
const REVALIDATE_SECONDS = 60 * 60 * 24;

/** Don't hang a build on a slow third party. */
const FETCH_TIMEOUT_MS = 5000;

export interface ReviewStats {
  reviewCount: number;
  /** e.g. 5 */
  averageRating: number;
  /** e.g. "5.0" — for schema and display, always one decimal place. */
  ratingDisplay: string;
  /** False when the live fetch failed and we fell back to site-config. */
  isLive: boolean;
}

const FALLBACK: ReviewStats = {
  reviewCount: siteConfig.reviewCount,
  averageRating: 5,
  ratingDisplay: '5.0',
  isLive: false,
};

function buildStats(count: number, rating: number): ReviewStats {
  return {
    reviewCount: count,
    averageRating: rating,
    ratingDisplay: rating.toFixed(1),
    isLive: true,
  };
}

/**
 * Returns live review stats, or the site-config fallback if anything at all
 * goes wrong. This function never throws and never returns a zero count —
 * a missing rating must not be allowed to render "0 reviews" or emit an
 * invalid aggregateRating into our schema.
 */
export async function getReviewStats(): Promise<ReviewStats> {
  try {
    const response = await fetch(FEATURABLE_ENDPOINT, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) return FALLBACK;

    const data: unknown = await response.json();
    if (typeof data !== 'object' || data === null) return FALLBACK;

    const payload = data as {
      success?: unknown;
      totalReviewCount?: unknown;
      averageRating?: unknown;
    };

    if (payload.success === false) return FALLBACK;

    const count = Number(payload.totalReviewCount);
    const rating = Number(payload.averageRating);

    // A count of 0 is far more likely to be an API hiccup than a real state —
    // we have had 48+ reviews since 2025 — and rendering it would damage both
    // the page copy and the structured data. Treat it as a failed read.
    if (!Number.isFinite(count) || count < 1) return FALLBACK;

    // Google ratings are 1-5. Anything outside that is not trustworthy.
    const safeRating =
      Number.isFinite(rating) && rating >= 1 && rating <= 5
        ? rating
        : FALLBACK.averageRating;

    return buildStats(count, safeRating);
  } catch {
    // Network error, timeout, malformed JSON — all degrade to the fallback.
    return FALLBACK;
  }
}
