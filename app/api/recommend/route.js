import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { items } = await request.json();

    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    // Prepare prompt
    const loved = items.loved?.map(m => m.title).join(', ') || 'None';
    const liked = items.liked?.map(m => m.title).join(', ') || 'None';
    const ok = items.ok?.map(m => m.title).join(', ') || 'None';
    const notForMe = items.not_for_me?.map(m => m.title).join(', ') || 'None';

    const prompt = `You are an expert movie and TV show recommender. Based on the user's categorized watchlist:
- Loved: ${loved}
- Liked: ${liked}
- Ok (Mediocre): ${ok}
- Not For Me (Disliked): ${notForMe}

Please suggest exactly 10 movies or TV series the user should watch next. 
Your suggestions should heavily lean into the themes, genres, and styles of the "Loved" and "Liked" lists, while strictly avoiding the elements from the "Not For Me" list. 
Do not include any titles that the user has already listed.

Return ONLY a valid JSON array of objects. Do not include any markdown formatting (like \`\`\`json) or other text.
Each object must have the following exact schema:
[
  {
    "title": "Exact Title of the Movie/Show",
    "year": "Release Year",
    "reason": "A short, engaging 2-sentence explanation of why they will like it based on their preferences."
  }
]`;

    // Call Gemini
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    let rawText = response.text;
    
    // Clean up any potential markdown formatting from the response
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let recommendations = [];
    try {
      recommendations = JSON.parse(rawText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', rawText);
      return NextResponse.json({ error: 'AI returned invalid format' }, { status: 500 });
    }

    // Optionally fetch TMDB posters for each recommendation
    if (TMDB_API_KEY) {
      const enrichedRecommendations = await Promise.all(
        recommendations.map(async (rec) => {
          try {
            const tmdbRes = await fetch(
              `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(rec.title)}&page=1&include_adult=false`
            );
            if (tmdbRes.ok) {
              const tmdbData = await tmdbRes.json();
              // Find first exact or close match
              const match = tmdbData.results.find(
                (item) => (item.media_type === 'movie' || item.media_type === 'tv') && 
                          (item.title === rec.title || item.name === rec.title)
              ) || tmdbData.results.find(
                (item) => item.media_type === 'movie' || item.media_type === 'tv'
              );

              if (match) {
                return {
                  ...rec,
                  poster_path: match.poster_path,
                  // Use TMDB year if available
                  year: (match.release_date || match.first_air_date || rec.year).split('-')[0]
                };
              }
            }
          } catch (e) {
            console.error('TMDB fetch failed for', rec.title, e);
          }
          return rec;
        })
      );
      recommendations = enrichedRecommendations;
    }

    // SAVE TO DATABASE
    await prisma.$transaction(async (tx) => {
      await tx.recommendation.deleteMany();
      await tx.recommendation.createMany({
        data: recommendations.map(rec => ({
          title: rec.title,
          poster_path: rec.poster_path || null,
          year: rec.year || null,
          reason: rec.reason,
        }))
      });
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Recommend API Error:', error);
    return NextResponse.json({ error: 'Failed to process recommendations' }, { status: 500 });
  }
}
