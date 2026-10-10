import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin/auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Connexion · Admin" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // Déjà connecté → dashboard.
  if (await isAuthenticated()) redirect("/nousdev");
  return <LoginForm />;
}
