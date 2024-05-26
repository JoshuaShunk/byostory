import { NextRequest, NextResponse } from 'next/server';
import { getXataClient } from '@/xata';
import { auth } from '@clerk/nextjs/server';
import { slugify } from '@/util/slugify';

const xata = getXataClient();

export async function POST(req: NextRequest) {
  try {
    const { title, description, tags, isPublic, story, storyLength } = await req.json();
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: 'You must be logged in to save a story' }, { status: 401 });
    }

    const slug = slugify(title);

    const response = await xata.db.stories.create({
      name: title,
      slug, // Add the slug to the database
      story,
      isPublic,
      description,
      wordCount: storyLength,
      tags: JSON.stringify(tags),
      userId,
    });

    return NextResponse.json({ message: 'Story saved successfully', data: response }, { status: 201 });
  } catch (error) {
    console.error('Error saving story:', error);
    return NextResponse.json({ message: 'An error occurred while saving the story' }, { status: 500 });
  }
}
