// app/stories/[slug]/page.tsx

import { getXataClient } from "@/xata";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Story {
  id: string;
  name: string;
  tags: string;
  description: string;
  wordCount: number;
  slug: string;
  story: string;
  userId: string;
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

async function fetchStoryBySlug(slug: string) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/api/public-stories?slug=${encodeURIComponent(slug)}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch story");

  const data = await res.json();
  return data.story;
}

async function incrementViews(storyId: string) {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/increment-views`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ storyId }),
  });
}

const StoryPage = async ({ params }: { params: { slug: string } }) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in"); // Redirect to sign-in if the user is not authenticated
  }

  const { slug } = params;
  const storyData = await fetchStoryBySlug(slug);

  if (!storyData) return <div>Story not found</div>;

  // Fetch user details for the story's author
  const account = await fetchUserDetails(storyData.userId);
  const story: Story = {
    ...storyData,
    accountName: account
      ? `${account.firstName} ${account.lastName}`
      : "Unknown",
  };

  // Increment views if the story is loaded successfully and the viewer is not the author
  if (story.userId !== userId) {
    await incrementViews(story.id);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{story.name}</h1>
      <p className="text-sm text-gray-600 mb-2">
        {story.tags && JSON.parse(story.tags).join(", ")}
      </p>
      <p className="text-sm mb-4">{story.description}</p>
      <p className="text-sm text-gray-600 mb-4">{story.wordCount} words</p>
      <p className="text-sm text-gray-600 mb-4">By {story.accountName}</p>
      <div className="whitespace-pre-line">{story.story}</div>
      <Link href="/mystories" className="text-blue-500 hover:underline">
        Back to stories
      </Link>
    </div>
  );
};

export default StoryPage;
