import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { dehydrate, QueryClient } from "react-query";
import { useRouter } from "next/router";
import classnames from "classnames";
import Link from "next/link";
import { fetchPosts } from "../../hooks/usePosts";
import { fetchPost, usePost } from "../../hooks/usePost";
import { PostParamsType } from "../../types/shared-types";
import indexStyles from "../../styles/index.module.css";
import styles from "../../styles/article-detail.module.css";

const PostDetail: NextPage = () => {
  const router = useRouter();
  const postId = String(router.query?.postId) || "60d0fe4f5311236168a10a10";
  const { data, isLoading } = usePost({
    postId: postId,
  });

  return (
    <>
      <Head>
        <title>NextJS ISR App | Post Detail</title>
        <meta name="description" content="Post detail page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={indexStyles.containerOuter}>
        <div
          className={classnames([
            indexStyles.containerInner,
            styles.containerInner,
          ])}
        >
          <Link href="/">
            <h1 className={indexStyles.title}>
              Next <span className={indexStyles.titlePink}>ISR</span> App
            </h1>
          </Link>
          {isLoading && <div>loading ...</div>}

          {!isLoading && (
            <div className={styles.postDetailWrap}>
              <h1 className={styles.postTitle}>
                {data?.owner?.firstName} {data?.owner?.lastName}
              </h1>
              <div className={styles.postInfoWrap}>
                <p className={styles.postDate}>{data?.publishDate}</p>
                <div className={styles.postAvatarWrap}>
                  <Image
                    alt={`card avatar ${data?.owner?.firstName}`}
                    src={
                      data?.owner?.picture ||
                      "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y"
                    }
                    layout="fill"
                    objectFit="cover"
                    loading="lazy"
                    quality={100}
                  />
                </div>
              </div>
              <div className={styles.postImgWrap}>
                <Image
                  alt={`card image ${data?.id}`}
                  src={
                    data?.image ||
                    "https://picsum.photos/id/870/200/300?grayscale&blur=2"
                  }
                  layout="fill"
                  objectFit="cover"
                  loading="lazy"
                  quality={70}
                />
              </div>
              <p className={styles.postDescription}>{data?.text}</p>
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

  const paths = posts.map((post) => ({
    params: { postId: post.id },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }: PostParamsType) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["post", params?.postId], () =>
    fetchPost({ postId: params?.postId })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 3600, // In seconds
  };
}

export default PostDetail;
