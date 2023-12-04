import { deleteReq, get, patchWithToken, postWithToken } from "../lib/request";
import { getCookie } from "../lib/session";

export const postComment = (data) => {
  return postWithToken("/comments/", data);
};

export const getComments = (list = {}) => {
  const userId = getCookie("uid");
  const query = `/comments/?limit=${list.limit || 10}&skip=${
    list.skip || 0
  }&assetId=${list.postId}`;
  return get(query);
};

export const editComment = (data) => {
  return patchWithToken("/comments/", data)
}

export const deleteComment = (data) => {
  return deleteReq("/comments/", data)
}
