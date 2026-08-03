import { chatGPTSignOutPath } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

export default function UnauthorizedPage() {
  return (
    <main className="admin-auth-page" dir="rtl">
      <section className="admin-auth-card">
        <span
          className="admin-auth-logo"
          role="img"
          aria-label="مذاق بادية حضرموت"
        />
        <span>لوحة إدارة المطعم</span>
        <h1>هذا الحساب غير مخوّل</h1>
        <p>
          لوحة الإدارة خاصة بصاحب المطعم. سجّل الخروج ثم ادخل بالحساب
          المصرّح له.
        </p>
        <a href={chatGPTSignOutPath("/admin")}>تسجيل الخروج والمحاولة بحساب آخر</a>
        <a className="admin-auth-back" href="/">العودة إلى المنيو</a>
      </section>
    </main>
  );
}
