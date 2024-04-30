import { put } from "@/shared/put";

export async function genCloudflareImage(prompt: string): Promise<Blob | null> {
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
    return null;
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

const genImageBlob = genCloudflareImage;

export async function genAndUploadImage(prompt: string) {
  const key = crypto.randomUUID();

  const blob = await genImageBlob(prompt);

  if (!blob) {
    return null;
  }

  const res = await put(`images/${key}.jpg`, blob);

  return res;
}
