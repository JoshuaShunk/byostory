// components/MyStoriesClient.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import DeleteButton from "./DeleteButton";

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

interface MyStoriesClientProps {
  stories: Story[];
}

const MyStoriesClient: React.FC<MyStoriesClientProps> = ({
  stories: initialStories,
}) => {
  const [stories, setStories] = useState<Story[]>(initialStories);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Stories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.length > 0 ? (
          stories.map((story) => (
            <div
              key={story.id}
              className="relative flex flex-col bg-white dark:bg-zinc-800 p-4 shadow-md rounded-lg"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">{story.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {story.tags && JSON.parse(story.tags).join(", ")}
                </p>
                <p className="text-sm mb-4">{story.description}</p>
              </div>
              <div className="mt-auto">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>{story.wordCount} words</span>
                  <span>{story.views} views</span>
                </div>
                <div className="flex justify-between items-center">
                  <Link
                    href={
                      story.public
                        ? `/stories/${story.slug}`
                        : `/mystories/${story.slug}`
                    }
                    className="text-blue-500 hover:underline"
                  >
                    Read more
                  </Link>
                  <DeleteButton
                    storyId={story.id}
                    onDelete={() => {
                      const updatedStories = stories.filter(
                        (s) => s.id !== story.id
                      );
                      setStories(updatedStories);
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No stories found.</p>
        )}
      </div>
    </div>
  );
};

export default MyStoriesClient;
