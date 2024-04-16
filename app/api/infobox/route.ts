import { genAndUploadImage } from "@/generation/image";
import { generateInfobox } from "@/generation/infobox";
import { getDb } from "@/db/client";
import { articles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  // Extract the `title` from the body of the request
  const { title } = await req.json();

  // Find the article in the database
  const results = await getDb()
    .select()
    .from(articles)
    .where(eq(articles.title, title));

  if (results.length === 0) {
    return new Response(JSON.stringify({ error: "Article not found." }), {
      status: 404,
    });
  }

  const articleData = results[0];

  // Use the article content to generate an infobox
  try {
    const infobox = await generateInfobox(
      `# ${title}\n${articleData.content}` || articleData.title
    );

    if (infobox.imageDescription) {
      infobox.imageUrl = await genAndUploadImage(infobox.imageDescription);
    }

    return new Response(JSON.stringify(infobox));
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to generate infobox." }),
      { status: 500 }
    );
  }
}
