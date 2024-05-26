"use client";

import { Icon } from "@iconify/react";
import React from "react";

interface FlameProps {
  className?: string;
}

const Flame: React.FC<FlameProps> = ({ className }) => {
  return (
    <Icon icon="lucide:flame" className={className} width="24" height="24" />
  );
};

export default Flame;
