// components/DeleteButton.tsx
"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

interface DeleteButtonProps {
  storyId: string;
  onDelete: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ storyId, onDelete }) => {
  const deleteStory = async () => {
    try {
      const res = await fetch(`/api/user-stories?id=${storyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to delete story");
      onDelete();
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  return (
    <button
      onClick={deleteStory}
      className="text-gray-500 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-500"
      aria-label="Delete"
    >
      <Icon icon="lucide:trash-2" width="24" height="24" />
    </button>
  );
};

export default DeleteButton;
