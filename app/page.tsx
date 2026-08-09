"use client";

import { useEffect, useMemo, useState } from "react";
import { categories, fetchMenu, type MenuItem, previewItems, resolveMenuImage } from "../lib/menu";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.2 3.8 9.7 8 7.9 9.8c1.1 2.5 3.8 5.2 6.3 6.3l1.8-1.8 4.2 2.5-.7 3c-.2.8-.9 1.3-1.7 1.3C10 20.6 3.4 14 2.9 6.2c0-.8.5-1.5 1.3-1.7l3-.7Z" />
    </svg>
  );
}

export default function CustomerMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu()
      .then(setItems)
      .catch(() => setItems(previewItems))
      .finally(() => setLoading(false));
  }, []);

  const visibleItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const categoryMatch =
        activeCategory === "الكل" || item.category === activeCategory;
      const searchMatch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term);
      return categoryMatch && searchMatch;
    });
  }, [items, activeCategory, query]);

  return (
    <main className="mobile-menu-viewport" dir="rtl">
      <div className="mobile-menu-app">
        <div className="mobile-pattern-strip" aria-hidden="true" />
        <header className="mobile-brand">
          <span
            className="mobile-brand-logo"
            role="img"
            aria-label="شعار مذاق"
          />
          <h1>بادية حضرموت</h1>
          <p className="mobile-brand-en" dir="ltr">MATHAQ BADIA HADHRAMAUT</p>
          <span className="mobile-brand-ornament" aria-hidden="true">✦</span>
        </header>

        <section className="mobile-intro" aria-label="عن مطعم مذاق">
          <span>نكهات من أرض الأصالة</span>
          <h2>طعم حضرموت على أصوله</h2>
          <p>
            وصفات حضرمية أصيلة تُطهى على مهل بمكونات مختارة، ونقدّمها
            لكم بكرم أهل البادية.
          </p>
        </section>

        <section className="mobile-menu-section" id="menu">
          <div className="mobile-menu-heading">
            <div>
              <span aria-hidden="true">◆</span>
              <h2>قائمة الطعام</h2>
              <span aria-hidden="true">◆</span>
            </div>
            <a href="tel:0559979939" aria-label="اتصل بالمطعم">
              <PhoneIcon />
            </a>
          </div>

          <div className="mobile-menu-tools">
            <label className="mobile-search">
              <SearchIcon />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث عن طبق..."
                aria-label="ابحث في قائمة الطعام"
              />
            </label>

            <div
              className="mobile-categories"
              role="tablist"
              aria-label="تصنيفات الطعام"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === category}
                  className={activeCategory === category ? "active" : ""}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {!loading && visibleItems.length > 0 && (
            <div className="mobile-menu-meta">
              <p className="mobile-results-count">
                {visibleItems.length.toLocaleString("ar-SA")} أطباق
              </p>
              <p className="mobile-calorie-note">السعرات تقديرية وقد تختلف حسب الكمية وطريقة التحضير</p>
            </div>
          )}

          {loading ? (
            <div className="mobile-items mobile-loading" aria-label="جاري تحميل المنيو">
              {[1, 2, 3, 4].map((item) => <span key={item} />)}
            </div>
          ) : visibleItems.length ? (
            <div className="mobile-items">
              {visibleItems.map((item) => (
                <article className="mobile-food-card" key={item.id}>
                  <figure className="mobile-food-photo">
                    <img
                      src={resolveMenuImage(item)}
                      alt={`صورة ${item.name}`}
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption>{item.category}</figcaption>
                  </figure>
                  <div className="mobile-food-copy">
                    <div className="mobile-food-head">
                      <div>
                        <small>
                          {item.category}
                          {Boolean(item.featured) && <em>الأكثر طلبًا</em>}
                        </small>
                        <h3>{item.name}</h3>
                      </div>
                      <strong className="mobile-price">
                        <b>{item.price}</b>
                        <span>ر.س</span>
                      </strong>
                    </div>
                    <p>{item.description}</p>
                    <div className="mobile-calories" aria-label={`${item.calories} سعرة حرارية تقريبًا`}>
                      <span className="mobile-calorie-icon" aria-hidden="true">✦</span>
                      <span>السعرات الحرارية</span>
                      <strong>{item.calories.toLocaleString("ar-SA")}</strong>
                      <small>سعرة تقريبًا</small>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mobile-empty">
              <strong>ما لقينا هذا الطبق</strong>
              <span>جرّب كلمة ثانية أو اختر تصنيفًا مختلفًا.</span>
            </div>
          )}
        </section>

        <footer className="mobile-footer">
          <span className="mobile-footer-ornament" aria-hidden="true">◆ ✦ ◆</span>
          <strong>مذاق بادية حضرموت</strong>
          <p>الأسعار شاملة الضريبة المضافة</p>
          <div className="mobile-footer-pattern" aria-hidden="true" />
        </footer>
      </div>

      <a className="mobile-order-bar" href="tel:0559979939">
        <span className="mobile-order-icon"><PhoneIcon /></span>
        <span>
          <small>للطلب والاستفسار</small>
          <b>اتصل بالمطعم</b>
        </span>
        <strong dir="ltr">055 997 9939</strong>
      </a>
    </main>
  );
}
