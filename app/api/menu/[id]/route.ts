import { eq } from "drizzle-orm";
import { getRestaurantAdmin } from "../../../admin-auth";
import { getDb } from "../../../../db";
import { menuItems } from "../../../../db/schema";
import { normaliseMenuImage } from "../../../../lib/menu-image";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getRestaurantAdmin())) {
      return Response.json({ error: "غير مصرح لك بتعديل المنيو" }, { status: 401 });
    }
    const { id } = await context.params;
    const body = await request.json();
    const db = await getDb();
    const [item] = await db.update(menuItems).set({
      name: String(body.name),
      category: String(body.category),
      description: String(body.description),
      price: Number(body.price),
      calories: Number(body.calories),
      featured: Number(body.featured) ? 1 : 0,
      image: normaliseMenuImage(body.image, "lamb"),
    }).where(eq(menuItems.id, Number(id))).returning();
    return Response.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر تحديث الصنف";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getRestaurantAdmin())) {
      return Response.json({ error: "غير مصرح لك بتعديل المنيو" }, { status: 401 });
    }
    const { id } = await context.params;
    const db = await getDb();
    await db.delete(menuItems).where(eq(menuItems.id, Number(id)));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "تعذر حذف الصنف" }, { status: 500 });
  }
}
