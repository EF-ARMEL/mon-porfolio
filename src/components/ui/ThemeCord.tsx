"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeCord() {
  const { theme, toggleTheme } = useTheme();
  const cordRef = useRef<SVGPathElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);

  const THRESHOLD = 150; // Distance to trigger theme switch
  const START_Y = 60;    // Initial handle position from top

  useGSAP(() => {
    if (isDragging) {
      // Simple physics for the cord curve
      const y2 = dragY + START_Y;
      const sag = Math.max(0, (dragY - 50) * 0.2);
      if (cordRef.current) {
        cordRef.current.setAttribute("d", `M 0 0 Q ${sag} ${y2 / 2} 0 ${y2}`);
      }
    } else {
      // Reset cord to straight line
      if (cordRef.current) {
        gsap.to(cordRef.current, {
          attr: { d: `M 0 0 Q 0 ${START_Y / 2} 0 ${START_Y}` },
          duration: 0.4,
          ease: "elastic.out(1, 0.3)"
        });
      }
    }
  }, { dependencies: [isDragging, dragY], scope: containerRef });

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: any) => {
    if (!isDragging) return;

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const relativeY = clientY - rect.top;
    const delta = Math.max(0, relativeY - START_Y);
    setDragY(delta);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    if (dragY >= THRESHOLD) {
      const tl = gsap.timeline();

      tl.to(handleRef.current, {
        y: dragY + 10,
        duration: 0.1,
        ease: "power2.in",
        onComplete: () => {
          toggleTheme();
        }
      })
      .to(handleRef.current, {
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)"
      });
    } else {
      gsap.to(handleRef.current, {
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    }

    setIsDragging(false);
    setDragY(0);
  };

  return (
    <div
      ref={containerRef}
      className="fixed top-0 right-12 z-[100] flex flex-col items-center cursor-pointer select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      <svg
        width="20"
        height="600"
        className="overflow-visible pointer-events-none"
        style={{ transform: "translate(-50%, 0)" }}
      >
        <path
          ref={cordRef}
          d={`M 0 0 Q 0 ${START_Y / 2} 0 ${START_Y}`}
          stroke="var(--cord-color)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          className="transition-colors duration-500"
          style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" }}
        />
      </svg>

      <div
        ref={handleRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 bg-brand-orange w-4 h-4 rounded-full border-2 border-white shadow-xl transition-colors duration-500 z-10"
        style={{
          top: `${START_Y}px`,
          cursor: 'grab',
        }}
      />

      <button
        onClick={toggleTheme}
        className="sr-only focus:not-sr-only absolute top-0 left-0 bg-brand-orange text-black px-2 py-1 text-xs rounded"
        aria-label="Toggle Theme"
      >
        Switch Theme
      </button>
    </div>
  );
}
