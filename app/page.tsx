import { supabaseServiceClient } from "@/db/service";
import Image from "next/image";
import logo from "@/assets/wonkypedia.png";
import Generate from "@/components/generate";
import Link from "next/link";

// This will disable caching
// export const dynamic = "force-dynamic";

// Revalidate every minute
export const revalidate = 60;

export default async function Home() {
  const recentArticlesPromise = supabaseServiceClient
    .from("articles")
    .select("title, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const mostLinkedTitlesPromise = supabaseServiceClient
    .from("linked_to_count")
    .select("to, count")
    .order("count", { ascending: false })
    .neq("to", null)
    .neq("to", "")
    .limit(5);

  const undiscoveredLinksPromise = supabaseServiceClient
    .from("undiscovered_links")
    .select("to, count")
    .order("count", { ascending: false })
    .neq("to", null)
    .neq("to", "")
    .limit(5);

  const [
    { data: recentArticles },
    { data: mostLinkedTitles },
    { data: undiscoveredLinks },
  ] = await Promise.all([
    recentArticlesPromise,
    mostLinkedTitlesPromise,
    undiscoveredLinksPromise,
  ]);

  return (
    <div className="max-w-screen-md mx-auto p-5 flex flex-col items-center min-w-min">
      <Image src={logo} alt="Wonkypedia" width={512} height={512} />
      <Generate className="mt-8 w-full" />
      <div className="mt-8 p-4 w-full bg-blue-50 border border-blue-300">
        <h5 className="mb-2 text-xl font-semibold text-blue-800">
          What is Wonkypedia?
        </h5>
        <p className="mb-3 font-light text-blue-600">
          Wonkypedia is a free encyclopedia for an alternative universe. It is
          for those who love going down wiki rabbit holes, but are tired of
          doing learning about real things. As you click between links, articles
          are generated on the fly, building out a shared universe.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 w-full ">
        {recentArticles && recentArticles.length > 0 && (
          <ArticleList articles={recentArticles} title="Recent articles" />
        )}
        {mostLinkedTitles && mostLinkedTitles.length > 0 && (
          <ArticleList
            articles={mostLinkedTitles?.map((article) => ({
              title: article.to!,
            }))}
            title="Most linked articles"
          />
        )}
        {undiscoveredLinks && undiscoveredLinks.length > 0 && (
          <ArticleList
            articles={undiscoveredLinks?.map((article) => ({
              title: article.to!,
            }))}
            title="Undiscovered articles"
          />
        )}
      </div>
    </div>
  );
}

function ArticleList({
  articles,
  title,
}: {
  articles: { title: string }[];
  title: string;
}) {
  return (
    <div className="mb-4">
      <div>
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <ul className="list-disc pl-5">
          {articles?.map((article) => (
            <li key={article.title}>
              <Link
                href={`/${article.title}`}
                className="text-blue-500 hover:underline"
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
