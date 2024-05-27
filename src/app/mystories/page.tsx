// app/mystories/page.tsx

import { getXataClient } from "@/xata";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import MyStoriesClient from "./MyStoriesClient";

interface Story {
  id: string;
  name: string;
  tags: string;
  description: string;
  wordCount: number;
  views: number;
  slug: string;
  public: boolean;
}

const MyStories = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in"); // Redirect to sign-in if the user is not authenticated
  }

  const xataClient = getXataClient();
  const userStories = await xataClient.db.stories
    .filter({ userId })
    .sort("xata.updatedAt", "desc")
    .getMany();

  // Transform the fetched data to match the Story interface
  const stories: Story[] = userStories.map((story) => ({
    id: story.id,
    name: story.name ?? "", // Provide a default value of an empty string if story.name is null or undefined
    tags: story.tags,
    description: story.description ?? "", // Provide a default value of an empty string if story.description is null or undefined
    wordCount: story.wordCount ?? 0, // Provide a default value of 0 if story.wordCount is null or undefined
    views: story.views,
    slug: story.slug,
    public: story.isPublic ?? false, // Provide a default value of false if story.isPublic is null or undefined
  }));

  return <MyStoriesClient stories={stories} />;
};

export default MyStories;
