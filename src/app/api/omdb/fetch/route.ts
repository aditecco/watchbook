import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imdbId = searchParams.get("id");

    if (!imdbId) {
      return NextResponse.json(
        { error: 'IMDB ID parameter "id" is required' },
        { status: 400 },
      );
    }

    // Use server-side environment variable (not NEXT_PUBLIC)
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OMDB API key not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `https://www.omdbapi.com/?i=${encodeURIComponent(imdbId)}&apikey=${apiKey}`,
    );

    if (!response.ok) {
      throw new Error(`OMDB API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Check if OMDB API returned an error
    if (data.Response === "False") {
      return NextResponse.json(
        { error: data.Error || "Fetch failed" },
        { status: 400 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("OMDB fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch OMDB data" },
      { status: 500 },
    );
  }
}
