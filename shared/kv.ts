import { IS_LOCAL } from "./config";
import { kv } from "@vercel/kv";

export async function set(key: string, value: any): Promise<any> {
  if (IS_LOCAL) {
    const fs = await import("fs-extra");
    // Write to file system
    const appRoot = process.cwd();
    return fs.outputFile(
      `${appRoot}/public/kv/${key}.json`,
      JSON.stringify(value)
    );
  } else {
    return kv.set(key, value);
  }
}

export async function get(key: string): Promise<unknown | null> {
  if (IS_LOCAL) {
    const fs = await import("fs-extra");
    const appRoot = process.cwd();
    if (await exists(`${appRoot}/public/kv/${key}.json`)) {
      return JSON.parse(
        await fs.readFile(`${appRoot}/public/kv/${key}.json`, "utf-8")
      );
    }
    return null;
  } else {
    return kv.get(key);
  }
}

async function exists(path: string) {
  const fs = await import("fs-extra");
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
}
