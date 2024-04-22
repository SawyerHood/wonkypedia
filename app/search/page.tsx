import { getDb } from "@/db/client";
import { titleToUri, uriToTitle } from "@/shared/articleUtils";
import { sql } from "drizzle-orm";
import Link from "next/link";
import { remark } from "remark";
import strip from "strip-markdown";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const param = uriToTitle(searchParams.q);
  const db = getDb();
  const query = sql`
  select
    title, content
  from
    articles
  where
    to_tsvector(content || ' ' || title) -- concat columns, but be sure to include a space to separate them!
  @@ websearch_to_tsquery(${param});`;

  const results = await db.execute(query);

  const rows = results.rows as { title: string; content: string }[];

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
      {rows.map(
        ({
          title,
          content: rawContent,
        }: {
          title: string;
          content: string;
        }) => {
          const content = remark()
            .use(strip)
            .processSync(rawContent.replace(/\[\[(.*?)\]\]/g, "$1"))
            .toString();
          const matchingContent =
            getMatchingContent(content, param) ??
            `${content.substring(0, 150)}...`;

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
            <div
              key={title}
              className="p-4 my-2 mx-auto bg-white rounded shadow overflow-hidden max-w-full md:max-w-2xl w-full"
            >
              <a
                href={`/article/${title}`}
                className="no-underline hover:underline text-blue-500"
              >
                <h2 className="text-lg font-medium">{title}</h2>
              </a>
              <p className="text-gray-600">{highlightedContent}</p>
            </div>
          );
        }
      )}
    </div>
  );
}

function getMatchingContent(content: string, param: string) {
  const index = content.toLowerCase().indexOf(param.toLowerCase());
  if (index === -1) return null;
  return `${content.substring(index - 50, index + 100)}...`;
}
