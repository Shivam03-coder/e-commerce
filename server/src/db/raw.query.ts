import { NotFoundError } from "@src/utils/error.utils";
import { db } from ".";

export async function findCartById(cartId: string) {
  const res = await db.$queryRaw`
    SELECT * FROM Cart WHERE id = ${cartId}
  `;

  if (!res) {
    throw new NotFoundError("Cart not found");
  }

  return res;
}
