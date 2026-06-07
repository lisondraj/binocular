import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#4a4a4a",
};

export default function Main2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
