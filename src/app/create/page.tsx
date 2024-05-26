"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AiTitleGenerator from "./AiTitleGenerator";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css"; // Import the default styles for react-tagsinput
import "./tagsinput.css"; // Import the custom styles to override the default styles
import CheckSlug from "@/components/CheckSlug";

const CreateStory = () => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [storyLength, setStoryLength] = useState(500);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean>(true);
  const [checkSlug, setCheckSlug] = useState<boolean>(false);
  const router = useRouter();

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isPublic && !isSlugAvailable) {
      alert(
        "The title you have chosen is already in use. Please choose a different title."
      );
      return;
    }

    // Redirect to /create/generate with query parameters
    const queryParams = new URLSearchParams({
      title,
      description,
      tags: JSON.stringify(tags),
      isPublic: isPublic.toString(),
      storyLength: storyLength.toString(),
    });

    router.push(`/create/generate?${queryParams.toString()}`);
  };

  const handleTagsChange = (tags: string[]) => {
    setTags(tags);
  };

  const handlePublicChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newIsPublic = event.target.checked;
    setIsPublic(newIsPublic);

    if (newIsPublic) {
      setCheckSlug(true);
    } else {
      setCheckSlug(false);
      setIsSlugAvailable(true); // Reset slug availability if not public
    }
  };

  useEffect(() => {
    if (isPublic && title) {
      setCheckSlug(true);
    }
  }, [title, isPublic]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create a New Story</h1>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Story Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Describe what the story is about"
              rows={6}
            ></textarea>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <div className="flex space-x-2">
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter the title"
              />
              <AiTitleGenerator description={description} setTitle={setTitle} />
            </div>
            {checkSlug && (
              <CheckSlug
                title={title}
                isPublic={isPublic}
                setIsSlugAvailable={setIsSlugAvailable}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="tags"
            >
              Tags
            </label>
            <TagsInput
              value={tags}
              onChange={handleTagsChange}
              inputProps={{ placeholder: "Add a tag" }}
              addKeys={[9, 13]} // Tab, Enter, Space keys to add tags
              onlyUnique
              addOnBlur
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="storyLength"
            >
              Story Length (words)
            </label>
            <input
              id="storyLength"
              name="storyLength"
              type="number"
              value={storyLength}
              onChange={(e) => setStoryLength(Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter story length (max 2500 words)"
              max={2500}
            />
          </div>
        </div>

        <div className="flex items-center">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mr-2"
            htmlFor="isPublic"
          >
            Make Public
          </label>
          <input
            id="isPublic"
            name="isPublic"
            type="checkbox"
            checked={isPublic}
            onChange={handlePublicChange}
            className="leading-tight"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-700 transition-colors duration-300"
          >
            Generate Story
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStory;
