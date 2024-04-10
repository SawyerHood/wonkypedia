import { supabaseServiceClient } from "@/db/service";
import Article from "./article";
import { uriToTitle } from "@/shared/articleUtils";

export const dynamic = "force-dynamic";

// or Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const title = uriToTitle(params.slug);
  return {
    title: title,
  };
}

const loadArticle = async (title: string) => {
  const { data: article } = await supabaseServiceClient
    .from("articles")
    .select()
    .eq("title", title);
  return article;
};

export default async function Page({ params }: { params: { slug: string } }) {
  const title = uriToTitle(params.slug);
  const article = await loadArticle(title);

  return <Article title={title} article={article?.[0]?.content ?? null} />;
}
