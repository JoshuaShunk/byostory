import { NextRequest, NextResponse } from 'next/server';
import { getXataClient } from '@/xata';
import { clerkClient } from '@clerk/nextjs/server';

const xata = getXataClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get('tag');
    const slug = searchParams.get('slug');

    let stories;

    if (slug) {
      // Fetch a single story by slug
      stories = await xata.db.stories
        .filter({ slug })
        .getMany();
    } else if (tag) {
      if (tag === 'all') {
        stories = await xata.db.stories.filter({ isPublic: true }).getAll();
      } else {
        const tagString = `"\\"${tag}\\""`;
        stories = await xata.db.stories
          .filter({
            isPublic: true,
            tags: { $any: tagString },
          })
          .getMany();
      }
    } else {
      return NextResponse.json({ message: 'Invalid query parameters' }, { status: 400 });
    }

    // Fetch user details for each story's userId
    const fetchUserDetails = async (userId: string) => {
      try {
        const user = await clerkClient.users.getUser(userId);
        return user;
      } catch (error) {
        console.error(`Error fetching user details for userId ${userId}:`, error);
        return null;
      }
    };

    const storiesWithAccountNames = await Promise.all(stories.map(async (story) => {
      const account = await fetchUserDetails(story.userId);
      return {
        ...story,
        accountName: account ? `${account.firstName} ${account.lastName}` : 'Unknown',
      };
    }));

    if (slug && storiesWithAccountNames.length > 0) {
      // Return the single story if slug is provided
      return NextResponse.json({ story: storiesWithAccountNames[0] }, { status: 200 });
    }

    console.log("Fetched public stories with account names:", storiesWithAccountNames);
    return NextResponse.json({ stories: storiesWithAccountNames }, { status: 200 });
  } catch (error) {
    console.error('Error fetching public stories:', error);
    return NextResponse.json({ message: 'An error occurred while fetching public stories' }, { status: 500 });
  }
}
