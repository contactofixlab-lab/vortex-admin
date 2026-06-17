import AdminShell from "@/components/AdminShell";
import CatalogPage from "@/components/CatalogPage";
import type { CatalogItem } from "@/components/CatalogPage";

const PELICULAS: CatalogItem[] = [
  { id:1,  title:"Dune: Parte 2",            genre:"Sci-Fi",    year:2024, status:"on",    lang:"Sub/Dub", servers:["OneDrive","GDrive","Mega"] },
  { id:2,  title:"Oppenheimer",              genre:"Historia",  year:2023, status:"on",    lang:"Sub/Dub", servers:["OneDrive","GDrive"] },
  { id:3,  title:"Poor Things",             genre:"Drama",     year:2023, status:"on",    lang:"Sub",     servers:["GDrive","Mega"] },
  { id:4,  title:"Spider-Man: No Way Home", genre:"Acción",    year:2021, status:"on",    lang:"Sub/Dub", servers:["OneDrive","Mega"] },
  { id:5,  title:"Avengers: Endgame",        genre:"Acción",    year:2019, status:"on",    lang:"Sub/Dub", servers:["OneDrive","GDrive","Mega"] },
  { id:6,  title:"Top Gun: Maverick",        genre:"Acción",    year:2022, status:"on",    lang:"Sub/Dub", servers:["GDrive"] },
  { id:7,  title:"The Batman",              genre:"Acción",    year:2022, status:"on",    lang:"Sub/Dub", servers:["OneDrive","GDrive","Mega"] },
  { id:8,  title:"Parasite",               genre:"Thriller",  year:2019, status:"on",    lang:"Sub",     servers:["Mega"] },
  { id:9,  title:"Interstellar",            genre:"Sci-Fi",    year:2014, status:"on",    lang:"Sub/Dub", servers:["OneDrive","GDrive"] },
  { id:10, title:"Joker: Folie à Deux",     genre:"Drama",     year:2024, status:"off",   lang:"Sub/Dub", servers:["OneDrive"] },
  { id:11, title:"Alien: Romulus",          genre:"Terror",    year:2024, status:"draft", lang:"Sub/Dub", servers:["GDrive","Mega"] },
  { id:12, title:"Gladiator II",            genre:"Acción",    year:2024, status:"on",    lang:"Sub/Dub", servers:["OneDrive","GDrive","Mega"] },
];

export default function PeliculasPage() {
  return (
    <AdminShell>
      <CatalogPage type="PELÍCULA" items={PELICULAS} />
    </AdminShell>
  );
}
