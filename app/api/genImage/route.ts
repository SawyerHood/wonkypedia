import { genAndUploadImage } from "@/generation/image";

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  console.log("start");
  const url = await genAndUploadImage(prompt);
  console.log("end");
  return new Response(JSON.stringify({ url }));
}
