"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import Loader from "@/components/loader";
import { Icon } from "@iconify/react";

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

const MyStories = () => {
  const { isLoaded, userId } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in");
      return;
    }

    if (userId) {
      const fetchStories = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/user-stories?tag=all`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!res.ok) throw new Error("Failed to fetch stories");
          const data = await res.json();
          console.log("Fetched stories:", data.stories); // Log fetched stories
          setStories(data.stories);
        } catch (error) {
          console.error("Error fetching stories:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchStories();
    }
  }, [isLoaded, userId, router]);

  const deleteStory = async (storyId: string) => {
    try {
      const res = await fetch(`/api/user-stories?id=${storyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to delete story");
      setStories(stories.filter((story) => story.id !== storyId));
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  if (loading) return <Loader />;

  console.log("Rendered stories:", stories); // Log stories to be rendered

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Stories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.map((story) => {
          console.log(`Story: ${story.name}, Public: ${story.public}`); // Log the public state of each story
          return (
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
                  <button
                    onClick={() => deleteStory(story.id)}
                    className="text-gray-500 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-500"
                    aria-label="Delete"
                  >
                    <Icon icon="lucide:trash-2" width="24" height="24" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyStories;
