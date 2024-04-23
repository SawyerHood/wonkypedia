import Article from "./article";
import { uriToTitle } from "@/shared/articleUtils";
import { auth } from "@/auth";
import { LoginBlock } from "@/ui/LoginBlock";
import { headers } from "next/headers";

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

export default async function Page({ params }: { params: { slug: string } }) {
  const title = uriToTitle(params.slug);
  const session = await auth();
  const origin = headers().get("origin") ?? headers().get("host");

  const resp = await fetch(
    `${
      origin?.startsWith("localhost") ? "http" : "https"
    }://${origin}/api/article?title=${title}`,
    {
      next: {
        tags: [title],
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const article = resp.ok ? await resp.json() : null;
  console.log("hello");
  console.log(article);

  return (
    <Article
      title={title}
      article={article}
      isLoggedIn={!!session}
      loginSection={<LoginBlock />}
    />
  );
}
