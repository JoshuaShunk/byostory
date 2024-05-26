import { useEffect, useState } from "react";

const CheckSlug = ({
  title,
  isPublic,
  setIsSlugAvailable,
}: {
  title: string;
  isPublic: boolean;
  setIsSlugAvailable: (isAvailable: boolean) => void;
}) => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkSlugAvailability = async (title: string) => {
      setLoading(true);
      try {
        const response = await fetch("/api/check-slug", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        });

        const data = await response.json();

        setIsSlugAvailable(data.available);
        setMessage(data.message);
      } catch (error) {
        console.error("Error checking slug:", error);
        setMessage("An error occurred while checking the slug");
      } finally {
        setLoading(false);
      }
    };

    if (isPublic && title) {
      checkSlugAvailability(title);
    }
  }, [title, isPublic, setIsSlugAvailable]);

  return (
    <div>
      {loading && <p>Checking slug...</p>}
      {message && (
        <p
          className={
            message.includes("available") ? "text-green-500" : "text-red-500"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default CheckSlug;
