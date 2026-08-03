import { asc, count } from "drizzle-orm";
import { getRestaurantAdmin } from "../../admin-auth";
import { getD1, getDb } from "../../../db";
import { menuItems } from "../../../db/schema";

async function ensureMenuTable() {
  const d1 = await getD1();
  await d1.prepare(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      calories INTEGER NOT NULL,
      featured INTEGER DEFAULT 0 NOT NULL,
      image TEXT DEFAULT 'lamb' NOT NULL
    )
  `).run();
}

const seed = [
  { name:"ذبيحة كاملة", category:"اللحم", description:"ذبيحة كاملة تُحضّر على اختيارك: مندي، مظبي، سليق أو حنيذ، مع أرز بسمتي فاخر.", price:1360, calories:10800, featured:1, image:"lamb" },
  { name:"نصف ذبيحة", category:"اللحم", description:"نصف ذبيحة طرية متبلة بخلطة البادية الخاصة، تُقدّم مع الأرز والمقبلات.", price:680, calories:5400, featured:0, image:"lamb" },
  { name:"ربع ذبيحة", category:"اللحم", description:"ربع ذبيحة بطهي حضرمي أصيل؛ مناسبة للعائلة الصغيرة أو الجمعات.", price:340, calories:2700, featured:0, image:"lamb" },
  { name:"نفر لحم", category:"اللحم", description:"قطع لحم طرية مع أرز المندي المبهر ونكهة الدخان الهادئة.", price:85, calories:980, featured:1, image:"lamb" },
  { name:"برمة لحم", category:"اللحم", description:"لحم يُطهى ببطء في البرمة حتى يصبح طريًا وغنيًا بالنكهة.", price:75, calories:860, featured:0, image:"lamb" },
  { name:"نفر عصيدة", category:"اللحم", description:"عصيدة حضرمية دافئة بقوام ناعم وتقديم تقليدي.", price:10, calories:410, featured:0, image:"breakfast" },
  { name:"حبة دجاج", category:"الدجاج", description:"حبة دجاج كاملة باختيارك: مندي، مظبي، مضغوط، حنيذ أو شواية.", price:40, calories:1280, featured:1, image:"chicken" },
  { name:"نصف دجاج", category:"الدجاج", description:"نصف دجاج متبّل بتوابل حضرمية ومطهو حتى الاحمرار، مع أرز بسمتي.", price:20, calories:720, featured:0, image:"chicken" },
  { name:"حبة دجاج سادة", category:"الدجاج", description:"حبة دجاج كاملة بدون أرز، متبلة ومطهية بخلطة المطعم.", price:28, calories:980, featured:0, image:"chicken" },
  { name:"نصف دجاج سادة", category:"الدجاج", description:"نصف دجاج طازج بدون أرز، متبل ومطهو حتى الاحمرار.", price:14, calories:520, featured:0, image:"chicken" },
  { name:"مقلقل", category:"الفطور", description:"قطع لحم طازجة مقلقلة مع البصل والفلفل والبهارات.", price:25, calories:520, featured:1, image:"breakfast" },
  { name:"كبدة", category:"الفطور", description:"كبدة طازجة مشوحة مع البصل والفلفل والبهارات.", price:20, calories:460, featured:0, image:"breakfast" },
  { name:"مشكل", category:"الفطور", description:"تشكيلة من أطباق الفطور الشعبية في طبق واحد.", price:15, calories:620, featured:0, image:"breakfast" },
  { name:"شوربة", category:"الفطور", description:"شوربة يومية دافئة وخفيفة، تُحضّر طازجة.", price:2, calories:120, featured:0, image:"breakfast" },
  { name:"دلة قهوة مع التمر", category:"المشروبات الساخنة", description:"قهوة عربية متوازنة مع تمر مختار لإتمام تجربة الضيافة.", price:20, calories:190, featured:1, image:"drink" },
  { name:"دلة قهوة", category:"المشروبات الساخنة", description:"دلة قهوة عربية محمصة بالهيل وتُقدّم على أصول الكرم.", price:15, calories:35, featured:0, image:"drink" },
  { name:"كاسة شاي عدني", category:"المشروبات الساخنة", description:"شاي عدني كريمي بالحليب والتوابل العطرية.", price:2, calories:160, featured:0, image:"drink" },
  { name:"كاسة شاي أحمر", category:"المشروبات الساخنة", description:"كاسة شاي أحمر كلاسيكي تُحضّر عند الطلب.", price:1, calories:25, featured:0, image:"drink" },
  { name:"براد شاي عدني كبير", category:"المشروبات الساخنة", description:"براد كبير من الشاي العدني بالحليب والتوابل العطرية.", price:15, calories:480, featured:0, image:"drink" },
  { name:"براد شاي عدني صغير", category:"المشروبات الساخنة", description:"براد صغير من الشاي العدني بالحليب والتوابل العطرية.", price:10, calories:300, featured:0, image:"drink" },
  { name:"براد شاي أحمر كبير", category:"المشروبات الساخنة", description:"براد كبير من الشاي الأحمر الكلاسيكي.", price:10, calories:80, featured:0, image:"drink" },
  { name:"براد شاي أحمر صغير", category:"المشروبات الساخنة", description:"براد صغير من الشاي الأحمر الكلاسيكي.", price:5, calories:45, featured:0, image:"drink" },
];

export async function GET() {
  try {
    await ensureMenuTable();
    const db = await getDb();
    const [summary] = await db.select({ total: count() }).from(menuItems);
    if (!summary.total) await db.insert(menuItems).values(seed);
    const rows = await db.select().from(menuItems).orderBy(asc(menuItems.id));
    return Response.json({ items: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر تحميل المنيو";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await getRestaurantAdmin())) {
      return Response.json({ error: "غير مصرح لك بتعديل المنيو" }, { status: 401 });
    }
    await ensureMenuTable();
    const body = await request.json();
    if (!body.name || !body.category || !body.description) {
      return Response.json({ error: "البيانات الأساسية مطلوبة" }, { status: 400 });
    }
    const db = await getDb();
    const [item] = await db.insert(menuItems).values({
      name: String(body.name),
      category: String(body.category),
      description: String(body.description),
      price: Number(body.price),
      calories: Number(body.calories),
      featured: Number(body.featured) ? 1 : 0,
      image: String(body.image || "lamb"),
    }).returning();
    return Response.json({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر حفظ الصنف";
    return Response.json({ error: message }, { status: 500 });
  }
}
