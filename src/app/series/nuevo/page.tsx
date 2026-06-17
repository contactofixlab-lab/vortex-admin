import AdminShell from "@/components/AdminShell";
import ContentFormClient from "@/components/ContentFormClient";

export default function SerieNuevoPage() {
  return (
    <AdminShell>
      <ContentFormClient type="SERIE" />
    </AdminShell>
  );
}
