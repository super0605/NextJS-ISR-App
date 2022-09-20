import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { dehydrate, QueryClient } from "react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import ArticleCard from "../../components/ArticleCard";
import { fetchPosts, usePosts } from "../../hooks/usePosts";
import { PageParamsType, ArticleType } from "../../types/shared-types";
import styles from "../../styles/index.module.css";

const pageSize = 6;

const Home: NextPage = () => {
  const router = useRouter();
  const baseUrl = "/posts";
  const page = Number(router.query?.page) || 1;
  const { data, isLoading } = usePosts({
    page,
    limit: pageSize,
  });

  const handlePagination = (arrow: string) => {
    if (arrow === "prev") {
      const postUrl = `${baseUrl}/${page > 1 ? page - 1 : 1}`;
      router.push(postUrl);
    }

    if (arrow === "next") {
      const postUrl = `${baseUrl}/${page < 40 ? page + 1 : 40}`;
      router.push(postUrl);
    }
  };

  return (
    <>
      <Head>
        <title>NextJS ISR App | Posts</title>
        <meta name="description" content="Posts list page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.containerOuter}>
        <div className={styles.containerInner}>
          <Link href="/">
            <h1 className={styles.title}>
              Next <span className={styles.titlePink}>ISR</span> App
            </h1>
          </Link>
          {isLoading && <div>loading ...</div>}

          {!isLoading && (
            <div className={styles.cardGrid}>
              {data.data.length > 0 &&
                data.data.map((item: ArticleType) => (
                  <ArticleCard
                    key={item.id}
                    id={item.id}
                    text={item.text}
                    image={item.image}
                    publishDate={item.publishDate}
                    owner={item.owner}
                  />
                ))}

              <div className={styles.prevWrap}>
                <button
                  className={styles.prevBtn}
                  onClick={() => handlePagination("prev")}
                  disabled={page === 1}
                >
                  Prev
                </button>
              </div>
              <div className={styles.nextWrap}>
                <button
                  className={styles.nextBtn}
                  onClick={() => handlePagination("next")}
                  disabled={page === 40}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export async function getStaticPaths() {
  const pages = await Promise.all(
    new Array(5)
      .fill(true)
      .map((_, idx) => fetchPosts({ page: idx, limit: 50 }))
  );

  const posts = pages.flatMap((page) => page.data);

  const totalBlogsNum = posts.length;
  const totalPagesNum = Math.ceil(totalBlogsNum / pageSize);
  const paths = [];
  for (let index = 0; index < totalPagesNum; index++) {
    paths.push({ params: { page: (index + 1).toString() } });
  }

  return { paths, fallback: true };
}

export async function getStaticProps({ params }: PageParamsType) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["posts", params?.page, pageSize], () =>
    fetchPosts({ page: params?.page, limit: pageSize })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 3600, // In seconds
  };
}

export default Home;
