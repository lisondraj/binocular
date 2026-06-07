import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#3a3a3a",
};

export default function Main2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
