import { generateHomepage } from "@/generation/homepage";
import { set } from "@/shared/kv";
import { revalidatePath } from "next/cache";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response(null, { status: 401 });
  }
  const homepage = await generateHomepage();
  await set("homepage", homepage);
  revalidatePath("/api/homepage");
  return new Response(JSON.stringify(homepage), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
