import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    // For development fallback if no key is provided, we can return a mock or an error
    return NextResponse.json({ error: 'TMDB_API_KEY is not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1&include_adult=false`);
    
    if (!res.ok) {
      throw new Error(`TMDB responded with status: ${res.status}`);
    }

    const data = await res.json();
    
    // Filter to only include movies and tv shows
    const filteredResults = data.results.filter(
      (item) => item.media_type === 'movie' || item.media_type === 'tv'
    );

    return NextResponse.json({ results: filteredResults });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch from TMDB' }, { status: 500 });
  }
}
