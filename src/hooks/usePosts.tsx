import { useQuery } from "react-query";
import { FetchPostsType } from "../types/shared-types";

const fetchPosts = async ({ page, limit }: FetchPostsType) => {
  const headers = {
    "app-id": "6328b060caa3283bf13d16e4",
    "Content-Type": "application/json",
  };
  const res = await fetch(
    `https://dummyapi.io/data/v1/post?page=${page}&limit=${limit}`,
    {
      headers,
    }
  );

  const result = await res.json();
  console.log("Testing: Refetching Data by 60 seconds =>", result)
  return result;
};

const usePosts = ({ page, limit }: FetchPostsType) => {
  return useQuery(["posts", page, limit], () => fetchPosts({ page, limit }));
};

export { usePosts, fetchPosts };
