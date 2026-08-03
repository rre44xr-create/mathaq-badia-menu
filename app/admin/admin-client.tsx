"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { categories, fetchMenu, MenuItem, previewItems } from "../../lib/menu";

const blankItem = {
  name: "",
  category: "اللحم",
  description: "",
  price: "",
  calories: "",
  featured: false,
  image: "lamb",
};

const foodImage: Record<string, string> = {
  lamb: "/food/lamb.jpg",
  chicken: "/food/chicken.jpg",
  breakfast: "/food/breakfast.jpg",
  drink: "/food/breakfast.jpg",
};

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

  async function loadItems() {
    try {
      setItems(await fetchMenu());
    } catch {
      setItems(previewItems);
    }
  }

  useEffect(() => { loadItems(); }, []);

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
  }

  async function saveItem(event: FormEvent) {
    event.preventDefault();
    const response = await fetch(editingId ? `/api/menu/${editingId}` : "/api/menu", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
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
          <a href="/"><span>↗</span> عرض صفحة العميل</a>
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
                  <img src={foodImage[item.image] || foodImage.lamb} alt="" />
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
            <label>صورة الصنف<select value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })}><option value="lamb">لحم</option><option value="chicken">دجاج</option><option value="breakfast">فطور</option><option value="drink">مشروبات</option></select></label>
            <label className="form-check"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> إظهاره ضمن الأكثر طلبًا</label>
            <footer className="form-wide"><button type="button" className="cancel" onClick={() => setFormOpen(false)}>إلغاء</button><button type="submit" className="save">{editingId ? "حفظ التعديلات" : "إضافة إلى المنيو"}</button></footer>
          </form>
        </div>
      )}
    </main>
  );
}
