import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.categoryList.findMany({
      include: {
        movies: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    const items = {
      loved: [],
      liked: [],
      ok: [],
      not_for_me: [],
    };

    categories.forEach((cat) => {
      items[cat.name] = cat.movies.map((m) => ({
        id: m.id,
        title: m.title,
        poster_path: m.poster_path,
        year: m.year,
      }));
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to get board', error);
    return NextResponse.json({ error: 'Failed to fetch board state' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { items } = await request.json();

    // Use a transaction to reliably wipe and rewrite the current state
    await prisma.$transaction(async (tx) => {
      // Clear existing movies to avoid complex upsert/reordering logic
      await tx.movie.deleteMany();

      for (const [categoryName, movies] of Object.entries(items)) {
        // Ensure category exists
        await tx.categoryList.upsert({
          where: { name: categoryName },
          update: {},
          create: { name: categoryName },
        });

        // Insert movies for this category
        if (movies.length > 0) {
          const moviesToInsert = movies.map((m, index) => ({
            id: m.id.toString(),
            title: m.title,
            poster_path: m.poster_path,
            year: m.year,
            categoryName: categoryName,
            position: index,
          }));

          await tx.movie.createMany({
            data: moviesToInsert,
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save board', error);
    return NextResponse.json({ error: 'Failed to save board state' }, { status: 500 });
  }
}
