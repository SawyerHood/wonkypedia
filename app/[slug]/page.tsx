import { supabaseServiceClient } from "@/db/service";
import Article from "./article";
import { uriToTitle } from "@/shared/articleUtils";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { slug: string } }) {
  const title = uriToTitle(params.slug);

  const { data: article } = await supabaseServiceClient
    .from("articles")
    .select()
    .eq("title", title);

  return <Article title={title} article={article?.[0]?.content ?? null} />;
}
