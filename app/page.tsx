import Image from "next/image";
import logo from "@/assets/wonkypedia.png";
import Link from "next/link";
import { getDb } from "@/db/client";
import { articles, linkedToCount, undiscoveredLinks } from "@/drizzle/schema";
import { desc, eq, not, and, isNotNull } from "drizzle-orm";

// This will disable caching
export const dynamic = "force-dynamic";

export default async function Home() {
  const db = getDb();

  const recentArticlesPromise = db
    .select({ title: articles.title, createdAt: articles.createdAt })
    .from(articles)
    .orderBy(desc(articles.createdAt))
    .where(isNotNull(articles.content))
    .limit(5)
    .execute();

  const mostLinkedTitlesPromise = db
    .select({ to: linkedToCount.to, count: linkedToCount.count })
    .from(linkedToCount)
    .where(and(isNotNull(linkedToCount.to), not(eq(linkedToCount.to, ""))))
    .orderBy(desc(linkedToCount.count))
    .limit(5)
    .execute();

  const undiscoveredLinksPromise = db
    .select({ to: undiscoveredLinks.to, count: undiscoveredLinks.count })
    .from(undiscoveredLinks)
    .where(
      and(isNotNull(undiscoveredLinks.to), not(eq(undiscoveredLinks.to, "")))
    )
    .orderBy(desc(undiscoveredLinks.count))
    .limit(5)
    .execute();

  const [recentArticles, mostLinkedTitles, undiscoveredLinksRes] =
    await Promise.all([
      recentArticlesPromise,
      mostLinkedTitlesPromise,
      undiscoveredLinksPromise,
    ]);

  return (
    <div className="max-w-screen-md mx-auto p-5 flex flex-col items-center min-w-min">
      <Image src={logo} alt="Wonkypedia" width={256} height={256} />
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
        {undiscoveredLinksRes && undiscoveredLinksRes.length > 0 && (
          <ArticleList
            articles={undiscoveredLinksRes?.map((article) => ({
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
                prefetch={false}
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
