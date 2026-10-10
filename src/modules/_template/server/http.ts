import { jsonOk } from "@/shared/http/envelope";
import { __domainCamel__Service } from "./__domain__.service";

export async function GET() {
  const items = await __domainCamel__Service.list();
  return jsonOk(items);
}
