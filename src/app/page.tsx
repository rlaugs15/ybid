import { getUser } from "@/services/actions/user.api";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  redirect("/dashboard");
}
