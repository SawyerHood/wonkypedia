import { genAndUploadImage } from "@/generation/image";

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const url = await genAndUploadImage(prompt);
  return new Response(JSON.stringify({ url }));
}
