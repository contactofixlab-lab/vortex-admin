import AdminShell from "@/components/AdminShell";
import CatalogPage from "@/components/CatalogPage";
import type { CatalogItem } from "@/components/CatalogPage";

const SERIES: CatalogItem[] = [
  { id:1,  title:"Breaking Bad",         genre:"Drama",     year:2008, status:"on",    episodes:62,  lang:"Sub/Dub", servers:["OneDrive","GDrive","Mega"] },
  { id:2,  title:"The Last of Us S2",    genre:"Drama",     year:2025, status:"on",    episodes:7,   lang:"Sub/Dub", servers:["GDrive","Mega"] },
  { id:3,  title:"Stranger Things S5",   genre:"Sci-Fi",    year:2025, status:"draft", episodes:8,   lang:"Sub/Dub", servers:["OneDrive"] },
  { id:4,  title:"House of Dragon S2",   genre:"Fantasía",  year:2024, status:"on",    episodes:8,   lang:"Sub/Dub", servers:["OneDrive","GDrive"] },
  { id:5,  title:"Severance S2",         genre:"Thriller",  year:2025, status:"on",    episodes:10,  lang:"Sub/Dub", servers:["Mega"] },
  { id:6,  title:"The Bear S3",          genre:"Drama",     year:2024, status:"on",    episodes:10,  lang:"Sub/Dub", servers:["GDrive","Mega"] },
  { id:7,  title:"Shogun",               genre:"Historia",  year:2024, status:"on",    episodes:10,  lang:"Sub/Dub", servers:["OneDrive","GDrive","Mega"] },
  { id:8,  title:"Arcane S2",            genre:"Acción",    year:2024, status:"on",    episodes:9,   lang:"Sub/Dub", servers:["OneDrive","Mega"] },
  { id:9,  title:"Fallout S1",           genre:"Sci-Fi",    year:2024, status:"on",    episodes:8,   lang:"Sub/Dub", servers:["GDrive"] },
  { id:10, title:"The Penguin",          genre:"Crimen",    year:2024, status:"off",   episodes:8,   lang:"Sub/Dub", servers:["OneDrive"] },
];

export default function SeriesPage() {
  return (
    <AdminShell>
      <CatalogPage type="SERIE" items={SERIES} />
    </AdminShell>
  );
}
