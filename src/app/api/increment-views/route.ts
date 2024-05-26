import { NextRequest, NextResponse } from 'next/server';
import { getXataClient } from '@/xata';
import { auth } from '@clerk/nextjs/server';

const xata = getXataClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { storyId } = await req.json();

    if (!storyId) {
      return NextResponse.json({ message: 'Story ID is required' }, { status: 400 });
    }

    const story = await xata.db.stories.read(storyId);

    if (!story) {
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    if (story.userId === userId) {
      return NextResponse.json({ message: 'Authors cannot increment views on their own stories' }, { status: 403 });
    }

    // Check if the user has already viewed the story
    const existingView = await xata.db.story_views
      .filter({
        storyId,
        userId,
      })
      .getFirst();

    if (existingView) {
      return NextResponse.json({ message: 'View already counted' }, { status: 200 });
    }

    // Record the new view
    await xata.db.story_views.create({
      storyId,
      userId,
    });

    // Increment views
    await xata.db.stories.update(storyId, {
      views: (story.views || 0) + 1,
    });

    return NextResponse.json({ message: 'View count incremented' }, { status: 200 });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json({ message: 'An error occurred while incrementing views' }, { status: 500 });
  }
}
