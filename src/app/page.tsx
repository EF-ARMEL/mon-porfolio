import Home from "@/components/Home";
import Maintenance from "@/components/Maintenance";
import { isMaintenance } from "@/lib/db";
import { listProjects, seedProjectsIfEmpty } from "@/lib/admin/projects";
import { isAuthenticated } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function Page() {
  // Maintenance : le visiteur voit la page dédiée. L'admin connecté garde l'accès.
  const [maintenance, admin] = await Promise.all([isMaintenance(), isAuthenticated()]);

  if (maintenance && !admin) {
    return <Maintenance />;
  }

  // Seed des projets par défaut à la première visite (no-op ensuite).
  await seedProjectsIfEmpty();
  const projects = await listProjects();

  return <Home projects={projects} />;
}
