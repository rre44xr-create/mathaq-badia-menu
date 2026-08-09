"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { categories, fetchMenu, MenuItem, previewItems, resolveMenuImage } from "../../lib/menu";

const blankItem = {
  name: "",
  category: "اللحم",
  description: "",
  price: "",
  calories: "",
  featured: false,
  image: "",
};

function categoryImage(category: string) {
  if (category === "الدجاج") return "chicken";
  if (category === "الفطور") return "breakfast";
  if (category === "المشروبات الساخنة") return "drink";
  return "lamb";
}

async function compressImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("اختر ملف صورة فقط");
  if (file.size > 8 * 1024 * 1024) throw new Error("حجم الصورة يجب ألا يتجاوز 8 ميجابايت");

  const bitmap = await createImageBitmap(file);
  const maxDimension = 1200;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("تعذر تجهيز الصورة");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/webp", 0.78);
}

type AdminClientProps = {
  adminName: string;
  signOutPath: string;
};

export default function AdminClient({ adminName, signOutPath }: AdminClientProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(blankItem);
  const [notice, setNotice] = useState("");
  const [imageBusy, setImageBusy] = useState(false);
  const [imageInputKey, setImageInputKey] = useState(0);

  async function loadItems() {
    try {
      setItems(await fetchMenu());
    } catch {
      setItems(previewItems);
    }
  }

  useEffect(() => {
    fetchMenu().then(setItems).catch(() => setItems(previewItems));
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) =>
      !term ||
      item.name.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term),
    );
  }, [items, query]);

  function openAdd() {
    setEditingId(null);
    setForm(blankItem);
    setImageInputKey((value) => value + 1);
    setFormOpen(true);
  }

  function openEdit(item: MenuItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      price: String(item.price),
      calories: String(item.calories),
      featured: Boolean(item.featured),
      image: item.image,
    });
    setFormOpen(true);
    setImageInputKey((value) => value + 1);
  }

  async function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageBusy(true);
    try {
      const image = await compressImage(file);
      if (image.length > 1_500_000) throw new Error("الصورة كبيرة بعد الضغط، جرّب صورة أصغر");
      setForm((current) => ({ ...current, image }));
      setNotice("تم تجهيز الصورة، احفظ الصنف لتثبيتها");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "تعذر قراءة الصورة");
    } finally {
      setImageBusy(false);
    }
  }

  async function saveItem(event: FormEvent) {
    event.preventDefault();
    const response = await fetch(editingId ? `/api/menu/${editingId}` : "/api/menu", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        image: form.image || categoryImage(form.category),
        price: Number(form.price),
        calories: Number(form.calories),
        featured: form.featured ? 1 : 0,
      }),
    });
    if (response.ok) {
      setNotice(editingId ? "تم حفظ التعديلات" : "تمت إضافة الصنف إلى المنيو");
      setFormOpen(false);
      await loadItems();
    } else {
      setNotice("تعذر حفظ الصنف، حاول مرة أخرى.");
    }
  }

  async function removeItem(item: MenuItem) {
    if (!window.confirm(`هل تريد حذف «${item.name}»؟`)) return;
    const response = await fetch(`/api/menu/${item.id}`, { method: "DELETE" });
    if (response.ok) {
      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      setNotice("تم حذف الصنف");
    }
  }

  return (
    <main className="admin-layout" dir="rtl">
      <aside className="admin-sidebar">
        <span
          className="admin-brand-logo"
          role="img"
          aria-label="مذاق بادية حضرموت"
        />
        <nav>
          <a className="active" href="/admin"><span>▦</span> إدارة المنيو</a>
          <Link href="/"><span>↗</span> عرض صفحة العميل</Link>
        </nav>
        <div className="sidebar-note">
          <b>لوحة المطعم</b>
          <span>كل تعديل تحفظه يظهر مباشرة في منيو العميل.</span>
        </div>
        <div className="admin-user">
          <span>مسجّل الدخول</span>
          <b>{adminName}</b>
          <a href={signOutPath}>تسجيل الخروج</a>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-top">
          <div>
            <span className="admin-kicker">لوحة التحكم</span>
            <h1>إدارة المنيو</h1>
            <p>أضف الأصناف وعدّل الأسعار والوصف والسعرات من مكان واحد.</p>
          </div>
          <button className="admin-add" onClick={openAdd}><span>＋</span> إضافة صنف جديد</button>
        </header>

        <div className="admin-stats">
          <article><span>إجمالي الأصناف</span><strong>{items.length}</strong><small>صنف في المنيو</small></article>
          <article><span>التصنيفات</span><strong>{new Set(items.map((item) => item.category)).size}</strong><small>أقسام رئيسية</small></article>
          <article><span>الأكثر طلبًا</span><strong>{items.filter((item) => item.featured).length}</strong><small>أطباق مميزة</small></article>
        </div>

        <section className="admin-card">
          <div className="admin-card-head">
            <div><h2>الأصناف الحالية</h2><p>تحكم بكل ما يظهر للعميل.</p></div>
            <label className="admin-search">
              <span>⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن صنف..." />
            </label>
          </div>

          <div className="admin-list">
            <div className="admin-list-head">
              <span>الصنف</span><span>التصنيف</span><span>السعر</span><span>السعرات</span><span>الحالة</span><span>الإجراءات</span>
            </div>
            {filtered.map((item) => (
              <article className="admin-row" key={item.id}>
                <div className="admin-dish">
                  <img src={resolveMenuImage(item)} alt={`صورة ${item.name}`} loading="lazy" />
                  <span><b>{item.name}</b><small>{item.description}</small></span>
                </div>
                <span className="admin-category">{item.category}</span>
                <strong className="admin-price">{item.price} <small>ر.س</small></strong>
                <span className="admin-calories">{item.calories.toLocaleString("ar-SA")} سعرة</span>
                <span className={item.featured ? "admin-status featured" : "admin-status"}>
                  {item.featured ? "مميز" : "منشور"}
                </span>
                <div className="admin-actions">
                  <button onClick={() => openEdit(item)} aria-label={`تعديل ${item.name}`}>✎</button>
                  <button className="delete" onClick={() => removeItem(item)} aria-label={`حذف ${item.name}`}>⌫</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      {notice && <button className="notice" onClick={() => setNotice("")}>{notice}<span>×</span></button>}

      {formOpen && (
        <div className="modal-layer" onMouseDown={() => setFormOpen(false)}>
          <form className="menu-form" onSubmit={saveItem} onMouseDown={(event) => event.stopPropagation()}>
            <header>
              <div><span>إدارة المنيو</span><h2>{editingId ? "تعديل الصنف" : "إضافة صنف جديد"}</h2></div>
              <button type="button" onClick={() => setFormOpen(false)} aria-label="إغلاق">×</button>
            </header>
            <label>اسم الصنف<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="مثال: نفر لحم مندي" /></label>
            <label>التصنيف<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="form-wide">وصف الطبق<textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="اكتب وصفًا واضحًا وشهيًا للطبق" /></label>
            <label>السعر (ر.س)<input required min="0" step=".5" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label>
            <label>السعرات الحرارية<input required min="0" type="number" value={form.calories} onChange={(event) => setForm({ ...form, calories: event.target.value })} /></label>
            <div className="form-image form-wide">
              <div className="form-image-preview">
                {form.image ? (
                  <img
                    src={resolveMenuImage({ name: form.name, image: form.image })}
                    alt="معاينة صورة الصنف"
                  />
                ) : (
                  <span aria-hidden="true">▧</span>
                )}
              </div>
              <div className="form-image-copy">
                <b>{editingId ? "تغيير صورة الصنف" : "إضافة صورة للصنف"}</b>
                <p>اختر صورة واضحة من الجوال أو الكمبيوتر، وسيتم ضغطها تلقائيًا لتفتح بسرعة في المنيو.</p>
                <label className={imageBusy ? "image-upload busy" : "image-upload"}>
                  <input
                    key={imageInputKey}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={selectImage}
                    disabled={imageBusy}
                  />
                  <span>{imageBusy ? "جاري تجهيز الصورة..." : form.image ? "اختيار صورة أخرى" : "اختيار صورة"}</span>
                </label>
                {form.image && (
                  <button
                    type="button"
                    className="image-remove"
                    onClick={() => {
                      setForm({ ...form, image: "" });
                      setImageInputKey((value) => value + 1);
                    }}
                  >
                    إزالة الصورة المختارة
                  </button>
                )}
              </div>
            </div>
            <label className="form-check"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> إظهاره ضمن الأكثر طلبًا</label>
            <footer className="form-wide"><button type="button" className="cancel" onClick={() => setFormOpen(false)}>إلغاء</button><button type="submit" className="save" disabled={imageBusy}>{editingId ? "حفظ التعديلات" : "إضافة إلى المنيو"}</button></footer>
          </form>
        </div>
      )}
    </main>
  );
}
