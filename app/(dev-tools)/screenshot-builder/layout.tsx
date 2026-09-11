import { ThemeStyle } from "@/components/theme_style/theme_style";
import { THEME } from "@/constants";
import "@/global.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SCREENSHOT_BUILDER_THEME_ROOT_CONTAINER_CLASSNAME } from "./components/screenshot_builder/screenshot_builder";

export const metadata: Metadata = {
  title: "Screenshot Builder - Dev Tool",
  description:
    "Internal tool for generating a device-framed screenshot on a solid background at a custom size.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <html lang="en" data-theme={THEME}>
      <head>
        <ThemeStyle
          themeRootContainer={`.${SCREENSHOT_BUILDER_THEME_ROOT_CONTAINER_CLASSNAME}`}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
