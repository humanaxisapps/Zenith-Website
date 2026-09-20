import { Article } from "@/components/article/article";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./blog_post.module.css";

interface BlogPostProps {
  title: string;
  publishDate: Date;
  image: string;
  content: ReactNode;
}

export function BlogPost({ title, publishDate, image, content }: BlogPostProps) {
  const formattedDate = publishDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Article className={styles.blogPost}>
      <Link href="/blog" className={styles.backLink}>
        ← Back to Blog
      </Link>

      <div className={styles.hero}>
        <Image src={image} alt="" fill={true} style={{ objectFit: "cover" }} />
      </div>

      <span className={styles.publishDate}>{formattedDate}</span>
      <h1 className={styles.title}>{title}</h1>

      {content}
    </Article>
  );
}
