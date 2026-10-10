"use client";

import { useState } from "react";
import Preloader from "@/components/layout/Preloader";
import Hero from "@/components/hero/Hero";
import About from "@/components/sections/About";
import ProjectsSection from "@/components/projects/ProjectsSection";
import Stack from "@/components/sections/Stack";
import Toolbox from "@/components/sections/Toolbox";
import Quiz from "@/components/sections/Quiz";
import Testimonials from "@/components/sections/Testimonials";
import ContactScene from "@/components/ContactScene";
import Footer from "@/components/layout/Footer";
import type { ProjectRecord } from "@/lib/admin/projects";

export default function Home({ projects }: { projects: ProjectRecord[] }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* Site-wide Grain Overlay */}
      <div className="grain-overlay" />

      <main
        className={`min-h-screen overflow-x-clip transition-all duration-1000 ease-in-out ${
          isLoading ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
        }`}
        style={{ transform: "none", filter: "none", willChange: "auto" }}
      >
        <Hero startAnimation={!isLoading} />
        <About />
        <ProjectsSection projects={projects} />
        <Stack />
        <Toolbox />
        <Quiz />
        <Testimonials />

        <ContactScene />
        <Footer />
      </main>
    </>
  );
}
