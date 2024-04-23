import { getDb } from "@/db/client";
import { articles } from "@/drizzle/schema";
import { stripMarkdown } from "@/shared/articleUtils";
import { ArticleCard } from "@/ui/ArticleCard";
import { and, count, desc, eq, isNotNull, not } from "drizzle-orm";
import Link from "next/link";

const PAGE_SIZE = 20;

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const db = await getDb();
  const [{ total }] = await db
    .select({ total: count() })
    .from(articles)
    .where(and(isNotNull(articles.content), not(eq(articles.content, ""))))
    .execute();
  const rows = await db
    .select({
      title: articles.title,
      createdAt: articles.createdAt,
      image: articles.imageUrl,
      content: articles.content,
    })
    .from(articles)
    .where(and(isNotNull(articles.content), not(eq(articles.content, ""))))
    .orderBy(desc(articles.createdAt))
    .limit(PAGE_SIZE)
    .offset((searchParams.page ? parseInt(searchParams.page) : 0) * PAGE_SIZE);

  return (
    <div className="flex flex-col p-4">
      {rows.map((row, index) => {
        if (row.title === "Eeeeeeee") {
          console.log(row);
        }
        const splitContent = row.content?.split(/\#.*?\n/);
        const strippedContent = stripMarkdown(
          splitContent?.[1] || row.content || ""
        ).slice(0, 150);
        return (
          <ArticleCard
            key={index}
            title={row.title}
            content={strippedContent}
          />
        );
      })}
      <div className="flex justify-between items-center mt-4 max-w-full md:max-w-2xl mx-auto gap-4">
        <Link href={`/browse?page=${parseInt(searchParams.page || "0") - 1}`}>
          <button
            disabled={searchParams.page === "0" || !searchParams.page}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            &lt;
          </button>
        </Link>
        <Link href={`/browse?page=${parseInt(searchParams.page || "0") + 1}`}>
          <button
            disabled={
              parseInt(searchParams.page || "0") >=
              Math.ceil(total / PAGE_SIZE) - 1
            }
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            &gt;
          </button>
        </Link>
      </div>
    </div>
  );
}
