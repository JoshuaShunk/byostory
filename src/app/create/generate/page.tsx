"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/loader";

const GenerateStoryPage = ({ params }: { params: any }) => {
  const searchParams = useSearchParams();
  const [story, setStory] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPart, setCurrentPart] = useState(1);

  const title = searchParams.get("title") || "";
  const description = searchParams.get("description") || "";
  const tags = searchParams.get("tags")?.split(",") || [];
  const isPublic = searchParams.get("isPublic") === "true";
  const storyLength = parseInt(searchParams.get("storyLength") || "500", 10);
  const totalParts = Math.ceil(storyLength / 500);

  useEffect(() => {
    const generateStory = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/generate-story", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description,
            part: 1,
            totalParts,
            currentStory: "",
            path: "",
          }),
        });

        const data = await response.json();
        setStory(data.content);
        setOptions(data.options || []);
        setCurrentPart(1); // Ensure we set the current part to 1 after the first generation
      } catch (error) {
        console.error("Error generating story:", error);
      } finally {
        setLoading(false);
      }
    };

    generateStory();
  }, [description, storyLength, totalParts]);

  const handleOptionClick = async (option: string) => {
    setLoading(true);
    try {
      const nextPart = currentPart + 1;
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          part: nextPart,
          totalParts,
          currentStory: story,
          path: option,
        }),
      });

      const data = await response.json();
      setStory((prevStory) => prevStory + "\n\n" + data.content);
      setOptions(data.options || []);
      setCurrentPart(nextPart);
    } catch (error) {
      console.error("Error generating story part:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/save-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          tags,
          isPublic,
          story,
          storyLength,
          views: 0,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Story saved successfully!");
      } else {
        alert("Failed to save the story: " + data.message);
      }
    } catch (error) {
      console.error("Error saving story:", error);
      alert("An error occurred while saving the story.");
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this story?")) {
      setStory("");
      setOptions([]);
      setCurrentPart(1);
      alert("Story deleted.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <p className="text-lg mb-4">{description}</p>
      <div className="flex mb-6 space-x-8">
        <div>
          <strong>Tags:</strong> {Array.isArray(tags) ? tags.join(", ") : ""}
        </div>
        <div>
          <strong>Public:</strong> {isPublic ? "Yes" : "No"}
        </div>
        <div>
          <strong>Target Word Count:</strong> {storyLength}
        </div>
      </div>

      <div className="whitespace-pre-line bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        {story}
        {loading && currentPart === 1 && <Loader />}
      </div>
      {loading && currentPart > 1 && (
        <div className="flex space-x-4 mt-6">
          <Loader />
        </div>
      )}
      {!loading && options && options.length > 0 && (
        <div className="flex space-x-4 mt-6">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-colors duration-300"
            >
              {option}
            </button>
          ))}
        </div>
      )}
      {!loading && options.length === 0 && (
        <>
          <div className="mt-4 flex justify-between items-center">
            <div>End of Story.</div>
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white mt-4 font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-700 transition-colors duration-300"
              >
                Save
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white mt-4 font-semibold py-2 px-4 rounded-lg shadow hover:bg-red-700 transition-colors duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GenerateStoryPage;
