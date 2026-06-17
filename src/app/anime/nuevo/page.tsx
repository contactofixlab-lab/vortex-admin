import AdminShell from "@/components/AdminShell";
import ContentFormClient from "@/components/ContentFormClient";

export default function AnimeNuevoPage() {
  return (
    <AdminShell>
      <ContentFormClient type="ANIME" />
    </AdminShell>
  );
}
