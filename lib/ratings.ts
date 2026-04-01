type BaseRating = {
  handle: string;
  rating: number;
  maxRating: number;
  url: string;
};

export type RatingWithHistory = BaseRating & {
  history: number[];
};

type CompetitiveRatings = {
  atcoder: BaseRating;
  codeforces: BaseRating;
};

export type CompetitiveRatingsWithHistory = {
  atcoder: RatingWithHistory;
  codeforces: RatingWithHistory;
};

export type RatingTone = {
  label: string;
  className: string;
};

type AtCoderHistoryItem = {
  NewRating: number;
};

type CodeforcesUserInfoResponse = {
  status: string;
  result?: Array<{
    handle: string;
    rating?: number;
    maxRating?: number;
  }>;
};

type CodeforcesRatingChange = {
  ratingUpdateTimeSeconds: number;
  newRating: number;
};

type CodeforcesRatingResponse = {
  status: string;
  result?: CodeforcesRatingChange[];
};

async function fetchCodeforcesRating(fallback: BaseRating): Promise<RatingWithHistory> {
  try {
    const [infoRes, ratingRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${fallback.handle}`, { cache: "no-store" }),
      fetch(`https://codeforces.com/api/user.rating?handle=${fallback.handle}`, { cache: "no-store" }),
    ]);

    const info = infoRes.ok ? ((await infoRes.json()) as CodeforcesUserInfoResponse) : null;
    const ratingData = ratingRes.ok ? ((await ratingRes.json()) as CodeforcesRatingResponse) : null;

    const user = info?.result?.[0];
    const history = ratingData?.result?.map((r) => r.newRating) ?? [];

    return {
      ...fallback,
      rating: user?.rating ?? fallback.rating,
      maxRating: user?.maxRating ?? fallback.maxRating,
      history,
    };
  } catch {
    return { ...fallback, history: [] };
  }
}

async function fetchAtCoderRating(fallback: BaseRating): Promise<RatingWithHistory> {
  try {
    const response = await fetch(
      `https://atcoder.jp/users/${fallback.handle}/history/json`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return { ...fallback, history: [] };
    }

    const historyItems = (await response.json()) as AtCoderHistoryItem[];

    if (!historyItems.length) {
      return { ...fallback, history: [] };
    }

    const history = historyItems.map((h) => h.NewRating);
    const latest = history.at(-1) ?? fallback.rating;
    const maxRating = Math.max(...history, fallback.maxRating);

    return {
      ...fallback,
      rating: latest,
      maxRating,
      history,
    };
  } catch {
    return { ...fallback, history: [] };
  }
}

export async function getCompetitiveRatings(
  fallbackRatings: CompetitiveRatings,
): Promise<CompetitiveRatingsWithHistory> {
  const [atcoder, codeforces] = await Promise.all([
    fetchAtCoderRating(fallbackRatings.atcoder),
    fetchCodeforcesRating(fallbackRatings.codeforces),
  ]);

  return { atcoder, codeforces };
}

export function getAtCoderTone(rating: number): RatingTone {
  if (rating >= 2800) return { label: "Red", className: "toneAtcoderRed" };
  if (rating >= 2400) return { label: "Orange", className: "toneAtcoderOrange" };
  if (rating >= 2000) return { label: "Yellow", className: "toneAtcoderYellow" };
  if (rating >= 1600) return { label: "Blue", className: "toneAtcoderBlue" };
  if (rating >= 1200) return { label: "Cyan", className: "toneAtcoderCyan" };
  if (rating >= 800) return { label: "Green", className: "toneAtcoderGreen" };
  if (rating >= 400) return { label: "Brown", className: "toneAtcoderBrown" };
  return { label: "Gray", className: "toneAtcoderGray" };
}

export function getCodeforcesTone(rating: number): RatingTone {
  if (rating >= 3000) return { label: "Legendary Grandmaster", className: "toneCfLegendary" };
  if (rating >= 2600) return { label: "International Grandmaster", className: "toneCfRed" };
  if (rating >= 2400) return { label: "Grandmaster", className: "toneCfRed" };
  if (rating >= 2300) return { label: "International Master", className: "toneCfOrange" };
  if (rating >= 2100) return { label: "Master", className: "toneCfOrange" };
  if (rating >= 1900) return { label: "Candidate Master", className: "toneCfPurple" };
  if (rating >= 1600) return { label: "Expert", className: "toneCfBlue" };
  if (rating >= 1400) return { label: "Specialist", className: "toneCfCyan" };
  if (rating >= 1200) return { label: "Pupil", className: "toneCfGreen" };
  return { label: "Newbie", className: "toneCfGray" };
}
