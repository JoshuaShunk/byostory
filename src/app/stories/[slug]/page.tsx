"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

interface Story {
  id: string;
  name: string;
  tags: string;
  description: string;
  wordCount: number;
  slug: string;
  userId: string;
  story: string;
  accountName: string; // Adding accountName to the Story interface
}

const StoryPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { isLoaded, userId } = useAuth();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStoryBySlug = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/public-stories?slug=${encodeURIComponent(slug)}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch story");
        const data = await res.json();
        setStory(data.story);

        // Increment views if the story is loaded successfully and the viewer is not the author
        if (data.story && data.story.userId !== userId) {
          await fetch(`/api/increment-views`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ storyId: data.story.id }),
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchStoryBySlug();
    }
  }, [isLoaded, userId, slug, router]);

  if (loading) return <div>Loading...</div>;

  if (!story) return <div>Story not found</div>;

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
