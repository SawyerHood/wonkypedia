import { getDb } from "@/db/client";
import { stripMarkdown, titleToUri, uriToTitle } from "@/shared/articleUtils";
import { IS_LOCAL } from "@/shared/config";
import { ArticleCard } from "@/ui/ArticleCard";
import { sql } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const param = uriToTitle(searchParams.q);

  return (
    <div className="flex flex-col p-4">
      <div className="p-4 my-2 mx-auto bg-white rounded shadow overflow-hidden max-w-full md:max-w-2xl w-full">
        <h2 className="text-lg font-medium">
          Can&apos;t find what you&apos;re looking for?
        </h2>
        <p className="text-gray-600">
          Generate a new article for <b>{param}</b>.
        </p>
        <Link href={`/article/${titleToUri(param)}`}>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">
            Generate Article
          </button>
        </Link>
      </div>
      <Suspense fallback={<SearchResultSkeleton />}>
        <SearchResults param={param} />
      </Suspense>
    </div>
  );
}

async function SearchResults({ param }: { param: string }) {
  const db = getDb();

  // This is pretty slow, we should pre compute this column and store it in the database, but this is fine
  // for a few thousand articles.
  const query = sql`
  select
    title, content
  from
    articles
  where
    to_tsvector(content || ' ' || title) -- concat columns, but be sure to include a space to separate them!
  @@ websearch_to_tsquery(${param});`;

  const results = await db.execute(query);

  const rows: { title: string; content: string }[] = IS_LOCAL
    ? results
    : (results as any).rows;

  return rows.map(
    ({ title, content: rawContent }: { title: string; content: string }) => {
      const content = stripMarkdown(rawContent);
      const matchingContent =
        getMatchingContent(content, param) ?? `${content.substring(0, 150)}...`;

      const highlightedContent = matchingContent
        .split(new RegExp(`(${param})`, "gi"))
        .map((part, index) =>
          part.toLowerCase() === param.toLowerCase() ? (
            <span key={index} className="bg-yellow-200">
              {part}
            </span>
          ) : (
            part
          )
        );

      return (
        <ArticleCard key={title} title={title} content={highlightedContent} />
      );
    }
  );
}

function SearchResultSkeleton() {
  return (
    <div className="animate-pulse p-4 my-2 mx-auto bg-white rounded shadow overflow-hidden max-w-full md:max-w-2xl w-full">
      <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
    </div>
  );
}

function getMatchingContent(content: string, param: string) {
  const index = content.toLowerCase().indexOf(param.toLowerCase());
  if (index === -1) return null;
  return `${content.substring(index - 50, index + 100)}...`;
}
