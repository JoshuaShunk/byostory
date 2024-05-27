// app/explore/[tag]/page.tsx

import { getXataClient } from "@/xata";
import { clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";

interface Story {
  id: string;
  name: string;
  tags: string;
  description: string;
  wordCount: number;
  slug: string;
  accountName?: string;
}

const fetchUserDetails = async (userId: string) => {
  try {
    const user = await clerkClient.users.getUser(userId);
    return user;
  } catch (error) {
    console.error(`Error fetching user details for userId ${userId}:`, error);
    return null;
  }
};

const ExplorePage = async ({ params }: { params: { tag: string } }) => {
  const { tag } = params;

  const xataClient = getXataClient();
  const tagFilter =
    tag === "all"
      ? { isPublic: true }
      : { isPublic: true, tags: { $any: `"${tag}"` } };

  const storiesData = await xataClient.db.stories.filter(tagFilter).getMany();

  const storiesWithAccountNames = await Promise.all(
    storiesData.map(async (story) => {
      const account = await fetchUserDetails(story.userId);
      return {
        ...story,
        accountName: account
          ? `${account.firstName} ${account.lastName}`
          : "Unknown",
      };
    })
  );

  const stories: Story[] = storiesWithAccountNames.map((story) => ({
    id: story.id ?? "",
    name: story.name ?? "Untitled",
    tags: story.tags ?? "",
    description: story.description ?? "No description",
    wordCount: story.wordCount ?? 0,
    slug: story.slug ?? "",
    accountName: story.accountName ?? "Unknown",
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Explore Public Stories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.map((story) => (
          <div
            key={story.id}
            className="card bg-white p-4 shadow-md rounded-lg"
          >
            <h2 className="text-xl font-semibold mb-2">{story.name}</h2>
            <p className="text-sm text-gray-600 mb-2">
              {story.tags && JSON.parse(story.tags).join(", ")}
            </p>
            <p className="text-sm mb-4">{story.description}</p>
            <p className="text-sm text-gray-600 mb-4">
              {story.wordCount} words
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Designed by: {story.accountName}
            </p>
            <Link
              href={`/stories/${story.slug}`}
              className="text-blue-500 hover:underline"
            >
              Read more
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
