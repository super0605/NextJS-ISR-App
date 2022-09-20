import { useQuery } from "react-query";
import { FetchPostType } from "../types/shared-types";

const fetchPost = async ({ postId }: FetchPostType) => {
  const headers = {
    "app-id": "6328b060caa3283bf13d16e4",
    "Content-Type": "application/json",
  };
  const res = await fetch(`https://dummyapi.io/data/v1/post/${postId}`, {
    headers,
  });

  const result = await res.json();
  console.log("Testing: Refetching Post by 60 seconds =>", result);
  return result;
};

const usePost = ({ postId }: FetchPostType) => {
  return useQuery(["posts", postId], () => fetchPost({ postId }));
};

export { usePost, fetchPost };
