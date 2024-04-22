import { supabaseServiceClient } from "@/db/service";

export async function genCloudflareImage(prompt: string): Promise<Blob> {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "image/jpeg",
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

async function genFireworksImage(prompt: string): Promise<Blob> {
  const response = await fetch(
    "https://api.fireworks.ai/inference/v1/image_generation/accounts/fireworks/models/stable-diffusion-xl-1024-v1-0",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "image/jpeg",
        Authorization: `Bearer ${process.env.FIREWORKS_AI_KEY}`,
      },
      body: JSON.stringify({
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        seed: 0,
        safety_check: false,
        prompt,
      }),
    }
  );

  console.log(response.status);
  const blob = await response.blob();

  return blob;
}

const genImageBlob = genFireworksImage;

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
    .upload(`${key}.jpg`, blob);
  console.log("end upload: ", Date.now() - start);

  if (error) {
    console.error(error);
  }
  const { data } = await supabaseServiceClient.storage
    .from("images")
    .getPublicUrl(`${key}.jpg`);

  console.log("imageData", data);

  return data.publicUrl;
}
