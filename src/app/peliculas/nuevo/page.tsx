import AdminShell from "@/components/AdminShell";
import ContentFormClient from "@/components/ContentFormClient";

export default function PeliculaNuevaPage() {
  return (
    <AdminShell>
      <ContentFormClient type="PELÍCULA" />
    </AdminShell>
  );
}
