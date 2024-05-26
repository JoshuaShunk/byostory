// app/components/ThemeSwitch.tsx
"use client";

import { FiMoon, FiSun } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import clsx from "clsx"; // Import clsx to handle classnames dynamically

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleThemeChange = (newTheme: string) => {
    setIsSpinning(true);
    setTheme(newTheme);
    setTimeout(() => setIsSpinning(false), 500); // Stop spinning after animation completes
  };

  if (!mounted)
    return (
      <Image
        src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
        width={25}
        height={25}
        sizes="25x25"
        alt="Loading Light/Dark Toggle"
        priority={false}
        title="Loading Light/Dark Toggle"
      />
    );

  const iconStyle = {
    width: "25px", // Change the size as needed
    height: "25px", // Change the size as needed
    cursor: "pointer",
    margin: "10px", // Adjust position if needed
    transition: "transform 0.5s ease-in-out", // Add transition here
  };

  return (
    <div>
      {resolvedTheme === "dark" ? (
        <FiMoon
          onClick={() => handleThemeChange("light")}
          style={iconStyle}
          className={clsx({ spin: isSpinning })}
        />
      ) : (
        <FiSun
          onClick={() => handleThemeChange("dark")}
          style={iconStyle}
          className={clsx({ spin: isSpinning })}
        />
      )}
    </div>
  );
}
