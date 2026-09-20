import Image from "next/image";
import Link from "next/link";
import styles from "./blog_card.module.css";

interface BlogCardProps {
  slug: string;
  title: string;
  publishDate: Date;
  image: string;
}

export function BlogCard({ slug, title, publishDate, image }: BlogCardProps) {
  const formattedDate = publishDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt=""
          fill={true}
          sizes="(width < 700px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
          className={styles.image}
        />

        <div className={styles.overlay}>
          <span className={styles.date}>{formattedDate}</span>
          <h2 className={styles.title}>{title}</h2>
        </div>
      </div>
    </Link>
  );
}
