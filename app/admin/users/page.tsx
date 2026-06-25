import { getAdminUsers } from "@/app/lib/admin/queries";
import UsersContent from "./UsersContent";

export default async function UsersPage() {
  const users = await getAdminUsers();
  return <UsersContent users={users} />;
}
