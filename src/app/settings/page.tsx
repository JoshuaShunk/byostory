import React from "react";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import DeleteAccountButton from "./DeleteAccountButton";

const Settings = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in"); // Redirect to sign-in if the user is not authenticated
  }

  // Fetch user data from Clerk
  const user = await clerkClient.users.getUser(userId);

  const email = user.primaryEmailAddress
    ? user.primaryEmailAddress.emailAddress
    : "No email";

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Settings
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Manage your account settings and preferences.
          </p>
        </div>
        <div className="bg-white shadow sm:rounded-lg p-6 space-y-6">
          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full overflow-hidden">
              <img
                src={user.imageUrl}
                alt="User Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.fullName}
              </h2>
              <p className="text-sm text-gray-600">{email}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Account</h3>

          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Security</h3>
            <div>
              <p className="text-sm text-gray-600">
                Two-Factor Authentication:{" "}
                {user.twoFactorEnabled ? "Enabled" : "Disabled"}
              </p>
              <p className="text-sm text-gray-600">
                Backup Codes: {user.backupCodeEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-8">
            <div>
              <SignOutButton redirectUrl="/" />
            </div>
            <div>
              <DeleteAccountButton /> {/* Use the client component here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
