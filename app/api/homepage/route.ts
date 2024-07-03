import { get } from "@/shared/kv";

export async function GET() {
  try {
    const homepage = await get("homepage");
    return new Response(JSON.stringify(homepage), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "No homepage found" }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 404,
    });
  }
}
