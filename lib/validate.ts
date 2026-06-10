import { ZodType } from "zod";
import { ApiError } from "@/lib/api-error";

export async function parseJsonBody<T>(req: Request, schema: ZodType<T>): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError("Invalid JSON body", 400);
  }
  return schema.parse(body);
}

export function parseSearchParams<T>(
  url: URL,
  schema: ZodType<T>
): T {
  const params = Object.fromEntries(url.searchParams.entries());
  return schema.parse(params);
}
