import { NextRequest, NextResponse } from 'next/server';
import { getXataClient } from '@/xata';
import { auth } from '@clerk/nextjs/server';
import { slugify } from '@/util/slugify';

const xata = getXataClient();

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: 'You must be logged in to check a slug' }, { status: 401 });
    }

    const slug = slugify(title);

    // Check if the slug is already taken by the user
    const existingStory = await xata.db.stories
      .filter({ userId, slug })
      .select(['id'])
      .getFirst();

    if (existingStory) {
      return NextResponse.json({ available: false, message: 'Title already taken' }, { status: 200 });
    }

    return NextResponse.json({ available: true, message: 'Title is available' }, { status: 200 });
  } catch (error) {
    console.error('Error checking slug:', error);
    return NextResponse.json({ message: 'An error occurred while checking the slug' }, { status: 500 });
  }
}
