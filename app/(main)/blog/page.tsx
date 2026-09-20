import { BlogCard } from "@/components/blog_card/blog_card";
import { BlogGrid } from "@/components/blog_grid/blog_grid";
import { BlogPagination } from "@/components/blog_pagination/blog_pagination";
import { MAX_BLOG_POSTS_PER_PAGE } from "@/constants";
import {
  readBlogPostsPage,
  readTotalBlogPostsPageCount,
} from "@/lib/blog_helpers";

export default async function BlogIndexPage() {
  const totalPageCount = await readTotalBlogPostsPageCount(
    MAX_BLOG_POSTS_PER_PAGE
  );
  const posts = await readBlogPostsPage(1, MAX_BLOG_POSTS_PER_PAGE);

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
        <BlogPagination currentPage={1} totalPageCount={totalPageCount} />
      )}
    </>
  );
}
