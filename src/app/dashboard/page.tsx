import { getXataClient } from "@/xata";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";
import Flame from "./Flame";

const Dashboard = async () => {
  const xataClient = getXataClient();
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in"); // Redirect to sign-in if the user is not authenticated
  }

  // Fetch user data from Clerk
  const user = await clerkClient.users.getUser(userId);

  // Fetch the three most recently worked on stories for the user
  const userStories = await xataClient.db.stories
    .filter({ userId })
    .sort("xata.updatedAt", "desc")
    .getMany({ pagination: { size: 3 } });

  // Fetch some trending or featured public stories
  const trendingStories = await xataClient.db.stories
    .filter({ isPublic: true })
    .sort("views", "desc")
    .getMany({ pagination: { size: 3 } });

  return (
    <>
      <h1 className="font-bold text-4xl mb-6">
        Welcome {user.firstName || "User"}
      </h1>
      <div className="container mx-auto">
        <section className="mb-20">
          <h2 className="text-2xl font-semibold mb-4">
            Recently Worked on Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userStories.length > 0 ? (
              userStories.map((story: any) => (
                <div
                  key={story.id}
                  className="relative flex flex-col bg-white dark:bg-zinc-800 p-4 shadow-md rounded-lg"
                >
                  <h3 className="text-xl font-semibold mb-2">{story.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {story.tags && JSON.parse(story.tags).join(", ")}
                  </p>
                  <p className="text-sm mb-4">{story.description}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {story.wordCount} words
                  </p>
                  <div className="mt-auto">
                    <Link
                      href={
                        story.isPublic
                          ? `/stories/${story.slug}`
                          : `/mystories/${story.slug}`
                      }
                      className="text-blue-500 hover:underline"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No stories found.
              </p>
            )}
          </div>
        </section>
        <section className="mt-20">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-semibold ">Trending</h2>
            <Flame className="ml-3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingStories.length > 0 ? (
              trendingStories.map((story: any) => (
                <div
                  key={story.id}
                  className="relative flex flex-col bg-white dark:bg-zinc-800 p-4 shadow-md rounded-lg"
                >
                  <h3 className="text-xl font-semibold mb-2">{story.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {story.tags && JSON.parse(story.tags).join(", ")}
                  </p>
                  <p className="text-sm mb-4">{story.description}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {story.wordCount} words
                  </p>
                  <div className="mt-auto">
                    <Link
                      href={`/stories/${story.slug}`}
                      className="text-blue-500 hover:underline"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No stories found.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
