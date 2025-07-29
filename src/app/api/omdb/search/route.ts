import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
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
      `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`,
    );

    if (!response.ok) {
      throw new Error(`OMDB API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Check if OMDB API returned an error
    if (data.Response === "False") {
      return NextResponse.json(
        { error: data.Error || "Search failed" },
        { status: 400 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("OMDB search error:", error);
    return NextResponse.json(
      { error: "Failed to search OMDB" },
      { status: 500 },
    );
  }
}
