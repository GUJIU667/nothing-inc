import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Nothing Inc. | 无事集团", template: "%s — Nothing Inc." },
  description: "Nothing Inc.（无事集团）是一个零层级虚拟创意社区。Your title. Your choice. Infinite possibilities.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
