"use client";

import React, { useState } from "react";

const AiTitleGenerator = ({
  description,
  setTitle,
}: {
  description: string;
  setTitle: (title: string) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const generateTitle = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-title", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTitle(data.title);
    } catch (error) {
      console.error("Error generating title:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={generateTitle}
      className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-colors duration-300"
      disabled={loading}
    >
      {loading ? "Generating..." : "Generate using AI"}
    </button>
  );
};

export default AiTitleGenerator;
