// components/DeleteAccountButton.tsx
"use client";

import React, { useState } from "react";
import Modal from "react-modal";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";

const DeleteAccountButton = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleDeleteAccount = async () => {
    if (userId) {
      await clerkClient.users.deleteUser(userId);
      closeModal();
      router.push("/sign-in");
    }
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="mt-2 text-red-600 hover:text-red-500"
      >
        Delete Account
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Delete Account"
        className="bg-white p-4 rounded shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-semibold mb-4">Confirm Account Deletion</h2>
        <p className="mb-4">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteAccountButton;
