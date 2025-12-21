import { NextRequest, NextResponse } from "next/server";
import { getSubtitles, getVideoDetails } from "youtube-caption-extractor";

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId");
  const lang = request.nextUrl.searchParams.get("lang") || "en";

  if (!videoId) {
    return NextResponse.json({ error: "videoId is required" }, { status: 400 });
  }

  try {
    const [captions, details] = await Promise.all([
      getSubtitles({ videoID: videoId, lang }).catch(() => []),
      getVideoDetails({ videoID: videoId, lang }).catch(() => null),
    ]);

    return NextResponse.json({
      captions: captions || [],
      details: details || null,
    });
  } catch (error) {
    console.error("Failed to fetch captions:", error);
    return NextResponse.json(
      { error: "Failed to fetch captions", captions: [], details: null },
      { status: 200 }
    );
  }
}
