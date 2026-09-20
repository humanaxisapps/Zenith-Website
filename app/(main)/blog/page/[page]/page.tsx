import { BlogCard } from "@/components/blog_card/blog_card";
import { BlogGrid } from "@/components/blog_grid/blog_grid";
import { BlogPagination } from "@/components/blog_pagination/blog_pagination";
import { MAX_BLOG_POSTS_PER_PAGE } from "@/constants";
import {
  readBlogPostsPage,
  readTotalBlogPostsPageCount,
} from "@/lib/blog_helpers";

export default async function BlogPagePage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const totalPageCount = await readTotalBlogPostsPageCount(
    MAX_BLOG_POSTS_PER_PAGE
  );
  const posts = await readBlogPostsPage(Number(page), MAX_BLOG_POSTS_PER_PAGE);

  return (
    <>
      <BlogGrid>
        {posts.map((post) => (
          <BlogCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            publishDate={post.publishDate}
            image={post.image}
          />
        ))}
      </BlogGrid>

      {totalPageCount > 1 && (
        <BlogPagination
          currentPage={Number(page)}
          totalPageCount={totalPageCount}
        />
      )}
    </>
  );
}

export async function generateStaticParams() {
  const totalPageCount = await readTotalBlogPostsPageCount(
    MAX_BLOG_POSTS_PER_PAGE
  );

  // Page 1 is served from /blog itself, so static params start at page 2.
  return Array.from({
    length: Math.max(0, totalPageCount - 1),
  }).map((_, index) => ({
    page: String(index + 2),
  }));
}

export const dynamicParams = false;
