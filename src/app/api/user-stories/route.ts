import { NextRequest, NextResponse } from 'next/server';
import { getXataClient } from '@/xata';
import { auth } from '@clerk/nextjs/server';

const xata = getXataClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get('tag');
    const slug = searchParams.get('slug');
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let stories;

    if (slug) {
      stories = await xata.db.stories
        .filter({
          slug,
          userId,
        })
        .getMany();

      const story = stories.length > 0 ? stories[0] : null;
      return NextResponse.json({ story }, { status: 200 });
    } else if (tag) {
      if (tag === 'all') {
        stories = await xata.db.stories.filter({ userId }).getAll();
      } else {
        // Assuming tag is the single tag you want to filter by
        const tagString = `"\\"${tag}\\""`;

        // Fetch stories with the specified tag
        stories = await xata.db.stories
          .filter({
            userId,
            tags: tagString,
          })
          .getMany();
      }
      return NextResponse.json({ stories }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid query parameters' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ message: 'An error occurred while fetching stories' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const storyId = searchParams.get('id');

    if (!storyId) {
      return NextResponse.json({ message: 'Story ID is required' }, { status: 400 });
    }

    const story = await xata.db.stories.read(storyId);

    if (!story || story.userId !== userId) {
      return NextResponse.json({ message: 'Story not found or unauthorized' }, { status: 404 });
    }

    await xata.db.stories.delete(storyId);

    return NextResponse.json({ message: 'Story deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json({ message: 'An error occurred while deleting the story' }, { status: 500 });
  }
}
