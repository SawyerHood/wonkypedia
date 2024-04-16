import { supabaseServiceClient } from "@/db/service";

export async function genImageBlob(prompt: string): Promise<Blob> {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
    },
    body: JSON.stringify({ prompt }),
  };

  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/bytedance/stable-diffusion-xl-lightning`,
    options
  );

  return await resp.blob();
}

export async function genAndUploadImage(prompt: string) {
  const key = crypto.randomUUID();

  const blob = await genImageBlob(prompt);
  const { data: updateData, error } = await supabaseServiceClient.storage
    .from("images")
    .upload(`${key}.png`, blob);
  if (error) {
    console.error(error);
  }
  const { data } = await supabaseServiceClient.storage
    .from("images")
    .getPublicUrl(`${key}.png`);

  return data.publicUrl;
}
