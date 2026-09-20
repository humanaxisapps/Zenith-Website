import Link from "next/link";
import styles from "./blog_pagination.module.css";

type BlogPaginationProps = {
  currentPage: number;
  totalPageCount: number;
  basePath?: string;
};

function buildPageHref(page: number, basePath: string) {
  return page <= 1 ? basePath : `${basePath}/page/${page}`;
}

export function BlogPagination({
  currentPage,
  totalPageCount,
  basePath = "/blog",
}: BlogPaginationProps) {
  const newerDisabled = currentPage <= 1;
  const olderDisabled = currentPage >= totalPageCount;

  const newerHref = buildPageHref(currentPage - 1, basePath);
  const olderHref = buildPageHref(currentPage + 1, basePath);

  return (
    <nav className={styles.pagination} aria-label="Blog pagination">
      <PaginationButton
        label="Older Posts"
        href={olderHref}
        disabled={olderDisabled}
      />
      <PaginationButton
        label="Newer Posts"
        href={newerHref}
        disabled={newerDisabled}
      />
    </nav>
  );
}

function PaginationButton({
  label,
  href,
  disabled,
}: {
  label: string;
  href: string;
  disabled: boolean;
}) {
  if (disabled) {
    return (
      <button className={styles.button} disabled>
        {label}
      </button>
    );
  }

  return (
    <Link href={href} className={styles.button}>
      {label}
    </Link>
  );
}
