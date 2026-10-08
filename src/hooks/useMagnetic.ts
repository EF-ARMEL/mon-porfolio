"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Hook to create a magnetic attraction effect for an element.
 * Calculates the distance between the cursor and the element's center
 * and returns a translation offset to create a "pull" sensation.
 */
export function useMagnetic(strength = 0.3) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLElement>(null);

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Apply the attraction strength
      setPosition({
        x: distanceX * strength,
        y: distanceY * strength,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [strength]);

  return {
    ref,
    position,
    handleMouseLeave, // Optional: can be used on the element itself
  };
}
