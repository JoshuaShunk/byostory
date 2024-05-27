import React from "react";
import Link from "next/link";

const Help = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Help & Support
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            For more information, please visit the following pages:
          </p>
        </div>
        <div className="bg-white shadow sm:rounded-lg p-6">
          <ul className="space-y-4">
            <li>
              <Link
                href="/privacy"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Terms and Conditions
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-center text-2xl font-semibold text-gray-900">
            Contact Us
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            If you have any questions or need further assistance, please contact
            us at:
          </p>
          <div className="mt-4 text-center">
            <a
              href="mailto:support@byostory.com"
              className="text-indigo-600 hover:text-indigo-500"
            >
              support@byostory.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
