import { requireRestaurantAdmin } from "../admin-auth";
import AdminClient from "./admin-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await requireRestaurantAdmin("/admin");

  return (
    <AdminClient
      adminName={admin.displayName}
      signOutPath="/"
    />
  );
}
