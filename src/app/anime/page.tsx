import AdminShell from "@/components/AdminShell";
import CatalogPage from "@/components/CatalogPage";
import type { CatalogItem } from "@/components/CatalogPage";

const ANIME: CatalogItem[] = [
  { id:1,  title:"One Piece",           genre:"Aventura",  year:1999, status:"on",    episodes:1110, lang:"Sub/Dub", servers:["OneDrive","GDrive","Mega"] },
  { id:2,  title:"Dragon Ball Super",   genre:"Acción",    year:2015, status:"on",    episodes:131,  lang:"Sub/Dub", servers:["OneDrive","Mega"] },
  { id:3,  title:"Demon Slayer S4",     genre:"Acción",    year:2024, status:"on",    episodes:8,    lang:"Sub/Dub", servers:["GDrive","Mega"] },
  { id:4,  title:"Solo Leveling S2",    genre:"Acción",    year:2025, status:"on",    episodes:13,   lang:"Sub",     servers:["OneDrive","GDrive"] },
  { id:5,  title:"Jujutsu Kaisen S3",   genre:"Acción",    year:2025, status:"draft", episodes:6,    lang:"Sub",     servers:["GDrive"] },
  { id:6,  title:"Naruto Shippuden",    genre:"Acción",    year:2007, status:"on",    episodes:500,  lang:"Sub/Dub", servers:["OneDrive","GDrive","Mega"] },
  { id:7,  title:"Attack on Titan",     genre:"Drama",     year:2013, status:"on",    episodes:87,   lang:"Sub/Dub", servers:["OneDrive","Mega"] },
  { id:8,  title:"Bleach TYBW P3",      genre:"Acción",    year:2024, status:"draft", episodes:4,    lang:"Sub",     servers:["OneDrive"] },
  { id:9,  title:"Dragon Ball Daima",   genre:"Aventura",  year:2024, status:"on",    episodes:20,   lang:"Sub/Dub", servers:["GDrive","Mega"] },
  { id:10, title:"Frieren",             genre:"Fantasía",  year:2023, status:"on",    episodes:28,   lang:"Sub",     servers:["OneDrive","GDrive"] },
  { id:11, title:"My Hero Academia S7", genre:"Acción",    year:2024, status:"off",   episodes:21,   lang:"Sub/Dub", servers:["Mega"] },
  { id:12, title:"Vinland Saga S2",     genre:"Historia",  year:2023, status:"on",    episodes:24,   lang:"Sub",     servers:["GDrive"] },
];

export default function AnimePage() {
  return (
    <AdminShell>
      <CatalogPage type="ANIME" items={ANIME} />
    </AdminShell>
  );
}
