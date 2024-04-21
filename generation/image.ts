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

  if (!resp.ok) {
    console.error("Error generating image", await resp.text());
    console.error("resp", resp);
  }

  return await resp.blob();
}

export async function genAndUploadImage(prompt: string) {
  console.log("genAndUploadImage");
  const key = crypto.randomUUID();

  let start = Date.now();
  console.log("start genImageBlob");
  const blob = await genImageBlob(prompt);
  console.log("end genImageBlob: ", Date.now() - start);

  start = Date.now();
  console.log("start upload");
  const { data: _, error } = await supabaseServiceClient.storage
    .from("images")
    .upload(`${key}.png`, blob);
  console.log("end upload: ", Date.now() - start);

  if (error) {
    console.error(error);
  }
  const { data } = await supabaseServiceClient.storage
    .from("images")
    .getPublicUrl(`${key}.png`);

  console.log("imageData", data);

  return data.publicUrl;
}
