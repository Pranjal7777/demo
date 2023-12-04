import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stopLoader, Toast } from "../lib/global/loader";
import { UpdateModelCardPostSubject } from "../lib/rxSubject";
import { otherProfileData } from "../redux/actions/otherProfileData";

import {
  bookmarkPost,
  getBookmarkPosts,
  remveBookmarkPost,
} from "../services/collection";
import { isAgency } from "../lib/config/creds";
const useBookmark = (isBookmarked = 0, count = 0) => {
  const [bookmark, setBookMark] = useState(isBookmarked || "");
  const [posts, setPosts] = useState(null);
  const [totalCount, setTotalCount] = useState(count || 0);
  const [pageLoader, setPageLoader] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const dispatch = useDispatch()
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    // if (posts) {
    UpdateModelCardPostSubject.subscribe(({ postId, data = {} }) => {
      setPosts((prev) => {
        let postInst = prev?.map((item) => {
          if (item.postId === postId) {
            return {
              ...item,
              ...data,
            };
          } else {
            return item;
          }
        });
        return postInst;
      });
    });
    // }
  }, []);

  const subscribedEvent = (id) => {
    let postInstance = posts;

    postInstance.map((item) => {
      item.userId == id && item.postType == 2 ? (item["isVisible"] = 1) : "";
    });

    setPosts([...postInstance]);
  };

  const addBookMarkReq = async (requestData = {}) => {
    const { cb, requestPayload } = requestData;
    try {
      await bookmarkPost(requestPayload);

      //   console.log("collectyions  ", collectionData);
      // const data = collectionData.status == 200 ? collectionData.data.data : [];
      cb && cb();
      // setCollection(data);
    } catch (e) {
      e.response && Toast(e.response.data.message, "error");
    }
  };

  const getBookMark = async ({
    collectionId: collectionId,
    offset = 0,
    limit = 10,
  }) => {
    setPageLoader(true);

    return new Promise(async (res, rej) => {
      try {
        const data = await getBookmarkPosts({
          collectionId: collectionId,
          offset: offset * limit,
          limit,
          userId: isAgency() ? selectedCreatorId : ""
        });
        stopLoader();

        setPageLoader(false);

        let oldPost = [];

        if (offset != 0) {
          oldPost = [...posts];
        }

        if (data.status != 200) {
          setHasMore(false)
          setPosts(oldPost);
          if (offset == 0) {
            setTotalCount(0);
          }
          return rej();
        }
        if (data.status == 200) {
          setPageCount(p => p + 1)
          setHasMore(true)
          const updatedValue = data?.data?.data?.data?.map((elem) => ({ ...elem, likeCount: elem.totalLike }))
          dispatch(otherProfileData(updatedValue));
        }
        setTotalCount(data.data.data.totalCount);
        setPosts([...oldPost, ...data.data.data.data]);

        res();
      } catch (e) {
        console.error("error", e);
        setPosts([]);
        setHasMore(false)
      }
    });
  };

  const removeBookmark = useCallback(
    async ({ postIds, collectionId, isFromCollection, cb, index, userId }) => {
      // console.log("sadasda", posts);
      if (isFromCollection) {
        isFromCollection = true;
      } else {
        isFromCollection = false;
      }

      try {
        await remveBookmarkPost({ postIds, collectionId, isFromCollection, userId });
        setBookMark(false);
        if (postIds && postIds.length == 1) {
          if (typeof index != "undefined") {
            let filteredPost = posts ? [...posts] : [];
            // console.log("sadasda", index, filteredPost);
            filteredPost[index] && (filteredPost[index].isBookmarked = false);

            posts && setPosts(filteredPost);
          }
        }
        cb && cb();
      } catch (e) {
        console.error(e);
      }
    },
    [posts, setPosts]
  );

  return {
    bookmark,
    hasMore,
    posts,
    pageLoader,
    totalCount,
    pageCount,
    setBookMark,
    removeBookmark,
    getBookMark,
    addBookMarkReq,
    subscribedEvent,
  };
};

export default useBookmark;
