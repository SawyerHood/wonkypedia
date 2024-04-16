import { supabaseServiceClient } from "@/db/service";
import { genAndUploadImage } from "@/generation/image";
import { generateInfobox } from "@/generation/infobox";
import { slugify } from "@/shared/articleUtils";

export async function POST(req: Request) {
  // Extract the `title` from the body of the request
  const { title } = await req.json();

  // Find the article in the database
  const { data: articleData, error: articleError } = await supabaseServiceClient
    .from("articles")
    .select("title, content")
    .eq("title", title)
    .single();

  if (articleError) {
    return new Response(JSON.stringify({ error: "Article not found." }), {
      status: 404,
    });
  }

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
