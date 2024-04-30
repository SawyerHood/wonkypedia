import { put as vercelPut } from "@vercel/blob";
import { IS_LOCAL } from "./config";

export async function put(path: string, blob: Blob) {
  if (IS_LOCAL) {
    const fs = await import("fs-extra");

    const buffer = await blob.arrayBuffer();
    const data = Buffer.from(buffer);
    await fs.outputFile(`${process.cwd()}/public/blob/${path}`, data);

    return `http://localhost:3000/blob/${path}`;
  }

  return (
    await vercelPut(path, blob, {
      access: "public",
    })
  ).url;
}
