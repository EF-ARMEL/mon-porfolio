import type { Metadata } from "next";
import { listProjects, seedProjectsIfEmpty } from "@/lib/admin/projects";
import PortfolioGrid from "@/components/projects/PortfolioGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio · Réalisations — Nousdev",
  description:
    "Plus de 6 projets menés et livrés par Nousdev : plateformes, CRM, sites et produits web, des réalisations récentes aux projets fondateurs.",
};

export default async function PortfolioPage() {
  await seedProjectsIfEmpty();
  const projects = await listProjects();

  return <PortfolioGrid projects={projects} />;
}
