import React from "react";
import "@/styles/loader.css";

interface LoaderProps {
  position?: React.CSSProperties;
}

const Loader: React.FC<LoaderProps> = ({ position }) => {
  return (
    <div className="loader" style={position}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

export default Loader;
