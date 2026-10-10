import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin/auth";
import { listProjects } from "@/lib/admin/projects";
import { listMessages, countUnread } from "@/lib/admin/messages";
import { listQuizResults } from "@/lib/admin/quiz";
import { isMaintenance } from "@/lib/db";
import Dashboard from "./Dashboard";

export const metadata = { title: "Dashboard · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const [projects, messages, unread, results, maintenance] = await Promise.all([
    listProjects(),
    listMessages(),
    countUnread(),
    listQuizResults(),
    isMaintenance(),
  ]);

  return (
    <Dashboard
      initialProjects={projects}
      initialMessages={messages}
      initialUnread={unread}
      initialResults={results}
      initialMaintenance={maintenance}
    />
  );
}
