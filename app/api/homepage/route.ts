import kv from "@vercel/kv";

export async function GET() {
  const homepage = await kv.get("homepage");

  return new Response(JSON.stringify(homepage), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
