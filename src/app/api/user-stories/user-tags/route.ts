import { NextRequest, NextResponse } from 'next/server';
import { getXataClient } from '@/xata';
import { auth } from '@clerk/nextjs/server'; // Assuming you have a function to verify auth and get user info

const xata = getXataClient();

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch unique tags for the authenticated user
    const stories = await xata.db.stories
      .filter({ userId: userId })
      .select(['tags'])
      .getAll();

    const tagsSet = new Set<string>();
    stories.forEach(story => {
      const tags: string[] = JSON.parse(story.tags || '[]');
      tags.forEach((tag: string) => tagsSet.add(tag));
    });

    const tags = Array.from(tagsSet);

    return NextResponse.json({ tags }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user tags:', error);
    return NextResponse.json({ message: 'An error occurred while fetching tags' }, { status: 500 });
  }
}
