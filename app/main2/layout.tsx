import type { Viewport } from "next";

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function Main2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
