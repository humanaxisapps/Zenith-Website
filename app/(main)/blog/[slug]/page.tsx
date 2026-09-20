import { BlogPost } from "@/components/blog_post/blog_post";
import { readAllBlogPostSlugs, readBlogPostBySlug } from "@/lib/blog_helpers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await readBlogPostBySlug(slug);

  if (post === null) {
    notFound();
  }

  return (
    <BlogPost
      title={post.title}
      publishDate={post.publishDate}
      image={post.image}
      content={<post.content />}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await readBlogPostBySlug(slug);

  if (post === null) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: post.image }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await readAllBlogPostSlugs();

  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;
