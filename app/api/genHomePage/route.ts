import { generateHomepage } from "@/generation/homepage";
import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const homepage = await generateHomepage();
  kv.set("homepage", homepage);
  revalidatePath("/api/homepage");
  return new Response(JSON.stringify(homepage), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
