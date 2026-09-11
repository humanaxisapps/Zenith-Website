import { readdir } from "node:fs/promises";
import path from "node:path";
import { ScreenshotBuilder } from "./components/screenshot_builder/screenshot_builder";

const SCREENSHOT_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

async function readAvailableScreenshots(): Promise<string[]> {
  const appViewFolderPath = path.resolve(process.cwd(), "./public/app_view");

  const fileNames = await readdir(appViewFolderPath);

  return fileNames
    .filter(
      (fileName) =>
        SCREENSHOT_EXTENSIONS.includes(path.extname(fileName).toLowerCase()) &&
        // App screenshots follow PascalCase (e.g. Goals.png); everything else
        // in this folder (logos, placeholders, bezel shadows) is lower/kebab-case.
        /^[A-Z]/.test(fileName)
    )
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => `/app_view/${fileName}`);
}

export default async function ScreenshotBuilderPage() {
  const availableScreenshots = await readAvailableScreenshots();

  return <ScreenshotBuilder availableScreenshots={availableScreenshots} />;
}
