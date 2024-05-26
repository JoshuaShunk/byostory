"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PREDEFINED_TAGS } from "@/tags";

const ExplorePage = () => {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Redirect to /explore/all if the page is accessed without a tag
    router.push("/explore/all");
  }, [router]);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/public-stories?tag=${selectedTag}`);
        const data = await response.json();
        if (response.ok) {
          setStories(data.stories);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [selectedTag]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Explore Public Stories</h1>
      <div className="mb-4">
        <label htmlFor="tags" className="mr-2">
          Filter by Tag:
        </label>
        <select
          id="tags"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All</option>
          {PREDEFINED_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
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
