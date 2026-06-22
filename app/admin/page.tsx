import { getData } from "@/lib/data";
import AdminClient from "@/components/AdminClient";

export const metadata = { title: "Admin — Fikri" };

export default async function AdminPage() {
  const data = await getData();
  return <AdminClient initialData={data} />;
}
