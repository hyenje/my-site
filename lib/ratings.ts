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
