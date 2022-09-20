export interface UserType {
  id: string;
  title: string[];
  firstName: string;
  lastName: string;
  picture: string;
}

export interface ArticleType {
  id: string;
  text: string;
  image: string;
  likes?: number;
  link?: string;
  tags?: string[];
  publishDate: string;
  owner: UserType;
}

export interface FetchPostsType {
  page: number | null;
  limit: number | null;
}

export interface PageParamType {
  page: number;
}

export interface PageParamsType {
  params: PageParamType;
}

export interface ArticleParamType {
  postId: string;
}

export interface FetchPostType {
  postId: string;
}

export interface PostParamsType {
  params: ArticleParamType;
}
