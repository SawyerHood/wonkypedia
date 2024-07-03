import { IS_LOCAL } from "./config";
import { kv } from "@vercel/kv";

export async function set(key: string, value: any): Promise<any> {
  return kv.set(key, value);
}

export async function get(key: string): Promise<unknown | null> {
  return kv.get(key);
}
