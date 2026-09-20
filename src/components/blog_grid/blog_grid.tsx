import type { ReactNode } from "react";
import styles from "./blog_grid.module.css";

interface BlogGridProps {
  children: ReactNode;
}

export function BlogGrid({ children }: BlogGridProps) {
  return <div className={styles.blogGrid}>{children}</div>;
}
