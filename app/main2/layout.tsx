import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#2a2a2a",
};

export default function Main2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
