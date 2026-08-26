import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VideoHub 视频平台",
  description: "VideoHub 视频平台登录与视频管理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
