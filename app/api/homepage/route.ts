import { get } from "@/shared/kv";

export async function GET() {
  const homepage = await get("homepage");

  console.log(homepage);

  return new Response(JSON.stringify(homepage), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
