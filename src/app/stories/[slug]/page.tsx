import Link from "next/link";

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

const StoryPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const story = await fetchStoryBySlug(slug);

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
