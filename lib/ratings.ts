type BaseRating = {
  handle: string;
  rating: number;
  maxRating: number;
  url: string;
};

type CompetitiveRatings = {
  atcoder: BaseRating;
  codeforces: BaseRating;
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

async function fetchCodeforcesRating(fallback: BaseRating): Promise<BaseRating> {
  try {
    const response = await fetch(
      `https://codeforces.com/api/user.info?handles=${fallback.handle}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return fallback;
    }

    const data = (await response.json()) as CodeforcesUserInfoResponse;
    const user = data.result?.[0];

    if (!user) {
      return fallback;
    }

    return {
      ...fallback,
      rating: user.rating ?? fallback.rating,
      maxRating: user.maxRating ?? fallback.maxRating,
    };
  } catch {
    return fallback;
  }
}

async function fetchAtCoderRating(fallback: BaseRating): Promise<BaseRating> {
  try {
    const response = await fetch(
      `https://atcoder.jp/users/${fallback.handle}/history/json`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return fallback;
    }

    const history = (await response.json()) as AtCoderHistoryItem[];

    if (!history.length) {
      return fallback;
    }

    const latest = history.at(-1)?.NewRating ?? fallback.rating;
    const maxRating = Math.max(...history.map((entry) => entry.NewRating), fallback.maxRating);

    return {
      ...fallback,
      rating: latest,
      maxRating,
    };
  } catch {
    return fallback;
  }
}

export async function getCompetitiveRatings(
  fallbackRatings: CompetitiveRatings,
): Promise<CompetitiveRatings> {
  const [atcoder, codeforces] = await Promise.all([
    fetchAtCoderRating(fallbackRatings.atcoder),
    fetchCodeforcesRating(fallbackRatings.codeforces),
  ]);

  return {
    atcoder,
    codeforces,
  };
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
