import Image from "next/image";
import Link from "next/link";
import { ArticleType } from "../types/shared-types";
import styles from "../styles/article-card.module.css";

type ArticleCardProps = ArticleType;

const ArticleCard = ({
  id,
  text,
  image,
  publishDate,
  owner,
}: ArticleCardProps) => {
  return (
    <section className={styles.card}>
      <div className={styles.cardImgWrap}>
        <Image
          alt={`card image ${id}`}
          src={image || "https://picsum.photos/id/870/200/300?grayscale&blur=2"}
          layout="fill"
          objectFit="cover"
          loading="lazy"
          quality={70}
        />
      </div>
      <div className={styles.cardContentWrap}>
        <Link href={id ? `/post/${id}` : "/"}>
          <a>
            <h3 className={styles.cardDescription}>{text}</h3>
          </a>
        </Link>

        <div className={styles.cardFooter}>
          <div className={styles.cardTitleWrap}>
            <h2 className={styles.cardTitle}>
              {owner?.firstName} {owner?.lastName}
            </h2>
            <p className={styles.cardDate}>{publishDate}</p>
          </div>
          <div className={styles.cardAvatarWrap}>
            <Image
              alt={`card avatar ${owner?.firstName}`}
              src={
                owner?.picture ||
                "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y"
              }
              layout="fill"
              objectFit="cover"
              loading="lazy"
              quality={100}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleCard;
