import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "مذاق بادية حضرموت",
  description: "منيو مذاق بادية حضرموت — نكهات أصيلة من أرض حضرموت.",
  themeColor: "#16235A",
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
