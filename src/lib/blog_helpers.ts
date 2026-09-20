import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";

type BlogPostFileNameInfo = {
  fileName: string;
  slug: string;
  publishDate: Date;
};

type BlogPostFrontmatterMetadata = {
  title: string;
  image: string;
  description?: string;
  draft?: boolean;
};

type BlogPost = {
  content: ComponentType;
  title: string;
  image: string;
  description?: string;
  publishDate: Date;
  slug: string;
  draft?: boolean;
};

const BLOG_POST_FILENAME = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.(md|mdx)$/i;

function parseBlogPostFileName(fileName: string) {
  const match = BLOG_POST_FILENAME.exec(fileName);

  if (match === null) {
    console.warn(
      `\n${fileName} doesn't match filename format for a blog post: YYYY-MM-DD-slug.(md|mdx)\n`
    );
    return null;
  }

  const [, year, month, day, slug] = match;
  const publishDate = new Date(`${year}-${month}-${day}`);

  if (Number.isNaN(publishDate.getTime())) {
    return null;
  }

  return {
    fileName,
    slug,
    publishDate,
  };
}

function guardFrontmatterMetadata(
  metadata: unknown
): metadata is BlogPostFrontmatterMetadata {
  return (
    typeof metadata === "object" &&
    metadata !== null &&
    "title" in metadata &&
    typeof metadata.title === "string" &&
    "image" in metadata &&
    typeof metadata.image === "string" &&
    ("description" in metadata ? typeof metadata.description === "string" : true) &&
    ("draft" in metadata ? typeof metadata.draft === "boolean" : true)
  );
}

export async function readBlogPostFileInfoList(): Promise<
  BlogPostFileNameInfo[]
> {
  const contentFolderPath = path.resolve(
    process.cwd(),
    "./app/(main)/blog/content"
  );

  return (await readdir(contentFolderPath))
    .map((fileName) => parseBlogPostFileName(fileName))
    .filter((entry) => entry !== null)
    .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
}

export async function readTotalBlogPostsPageCount(
  postsPerPage: number
): Promise<number> {
  const fileNameInfoList = await readBlogPostFileInfoList();

  return Math.ceil(fileNameInfoList.length / postsPerPage);
}

async function loadBlogPost(file: BlogPostFileNameInfo): Promise<BlogPost> {
  const postModule = await import(`@/blog-content/${file.fileName}`);
  let frontmatterMetadata: BlogPostFrontmatterMetadata;

  if (guardFrontmatterMetadata(postModule.metadata)) {
    frontmatterMetadata = postModule.metadata;
  } else {
    console.warn(
      `${file.fileName} has invalid frontmatter metadata. Supported properties are: title (string), image (string), description (optional, string), draft (optional, boolean)`
    );
    frontmatterMetadata = { title: "", image: "", draft: true };
  }

  return {
    content: postModule.default,
    title: frontmatterMetadata.title,
    image: frontmatterMetadata.image,
    description: frontmatterMetadata.description,
    slug: file.slug,
    publishDate: file.publishDate,
    draft: frontmatterMetadata.draft,
  };
}

/**
 * Loads a page of blog post files from a directory by filename date prefix.
 * File names must follow: YYYY-MM-DD-title.(md|mdx)
 */
export async function readBlogPostsPage(
  page: number,
  postsPerPage: number
): Promise<BlogPost[]> {
  const fileNameInfoList = await readBlogPostFileInfoList();
  const start = Math.max(0, page - 1) * postsPerPage;
  const pageFiles = fileNameInfoList.slice(start, start + postsPerPage);

  return Promise.all(pageFiles.map(loadBlogPost));
}

export async function readAllBlogPostSlugs(): Promise<string[]> {
  const fileNameInfoList = await readBlogPostFileInfoList();

  return fileNameInfoList.map((file) => file.slug);
}

export async function readBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const fileNameInfoList = await readBlogPostFileInfoList();
  const file = fileNameInfoList.find((entry) => entry.slug === slug);

  if (file === undefined) {
    return null;
  }

  return loadBlogPost(file);
}
