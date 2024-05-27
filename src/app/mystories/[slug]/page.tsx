// app/mystories/[slug]/page.tsx

import { getXataClient } from "@/xata";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";

interface Story {
  id: string;
  name: string;
  tags: string;
  description: string;
  wordCount: number;
  slug: string;
  story: string;
}

const StoryPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in"); // Redirect to sign-in if the user is not authenticated
  }

  const xataClient = getXataClient();
  const storyData = await xataClient.db.stories
    .filter({ slug, userId })
    .getFirst();

  if (!storyData) {
    return <div>Story not found</div>;
  }

  const story: Story = {
    id: storyData.id ?? "",
    name: storyData.name ?? "Untitled",
    tags: storyData.tags ?? "",
    description: storyData.description ?? "No description",
    wordCount: storyData.wordCount ?? 0,
    slug: storyData.slug ?? "",
    story: storyData.story ?? "",
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{story.name}</h1>
      <p className="text-sm text-gray-600 mb-2">
        {story.tags && JSON.parse(story.tags).join(", ")}
      </p>
      <p className="text-sm mb-4">{story.description}</p>
      <p className="text-sm text-gray-600 mb-4">{story.wordCount} words</p>
      <div className="whitespace-pre-line">{story.story}</div>
      <Link href="/mystories" className="text-blue-500 hover:underline">
        Back to stories
      </Link>
    </div>
  );
};

export default StoryPage;
