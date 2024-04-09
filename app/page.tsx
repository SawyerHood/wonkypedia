import { db, schema } from "@/db";
import { asc, desc } from "drizzle-orm";
import Image from "next/image";
import logo from "@/assets/wonkypedia.png";
import Search from "@/components/search";

export default async function Home() {
  const articles = await db
    .select()
    .from(schema.articles)
    .orderBy(desc(schema.articles.createdAt))
    .limit(10);

  return (
    <div className="max-w-screen-md mx-auto p-5 flex flex-col items-center min-w-min">
      <Image src={logo} alt="Wonkypedia" width={512} height={512} />
      <Search className="mt-8 w-full" />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent articles</h2>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 min-w-fit">
          {articles.map((article) => (
            <li key={article.title}>
              <a
                href={`/${article.title}`}
                className="text-blue-500 hover:underline"
              >
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
