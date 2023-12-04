import { flattenDeep } from 'lodash';
import Router from 'next/router';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { open_drawer, startLoader, stopLoader, Toast } from '../../../lib/global';
import { viewedHashtag } from '../../../redux/actions';
import { getHashtagsAPI } from '../../../services/hashtag';
import ExplorePostView from '../../explore/explore-post-view';

const HashtagPostViewer = (props) => {
  const [selectId, setId] = useState(props.postId);
  const hashTagLists = useSelector((state) => state?.viewedHashtagPost?.hashtagList);
  const HASHTAG_NAME = useSelector((state) => state?.viewedHashtagPost?.hashtagName);
  const hashTagTotal = useSelector((state) => state?.viewedHashtagPost?.totalPost);
  const HASHTAG_LIST = HASHTAG_NAME === props?.hashtag ? hashTagLists : []
  const HASHTAG_TOTAL_POST = HASHTAG_NAME === props?.hashtag ? hashTagTotal : ""
  const hashTagPage = useSelector((state) => state?.viewedHashtagPost?.page);

  const dispatch = useDispatch();
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    HASHTAG_NAME !== props?.hashtag && getHashtagPosts(1);
  }, [])

  useEffect(() => {
    page > 1 && hasMore && loading && getHashtagPosts(page);
  }, [loading, hasMore])

  const followUnfollowEvent = (id) => {
    let postInstance = HASHTAG_LIST;
    postInstance.map((item) => {
      item.userId == id ? (item["isFollowed"] = 1) : "";
    });

    // TODO: Will check this case
    // dispatch(viewedHashtag({
    //   hashtagList: [...hashtagList, ...res?.data?.result],
    //   totalPost: res?.data?.totalCount,
    // }));
    // setHashtagList([...postInstance]);
  };

  const handleBackHashtag = () => {
    Router.back()
    // open_drawer("HashtagFollow", {
    //   // hashtag: data,
    //   // S3_IMG_LINK,
    // }, "right")
  }

  const getHashtagPosts = async (pageCount) => {
    if (!hasMore) return
    try {
      startLoader();

      let hashtag = props?.hashtag;

      const payload = {
        hashtag,
        page: pageCount,
      }

      // API Calling
      const res = await getHashtagsAPI(payload);
      if (res.status !== 200) setHasMore(false)
      if (res.status == 200) {
        dispatch(viewedHashtag({
          hashtagList: [...HASHTAG_LIST, ...res?.data?.result],
          totalPost: res?.data?.totalCount,
          hashtagName: hashtag,
          page: pageCount
        }));

        setLoading(false)
      }
      stopLoader();

    } catch (err) {
      stopLoader();
      console.error("ERROR IN getHashtag", err);
      Toast(err?.response?.data?.message, "error");
      setHasMore(false)
      setLoading(false)
    }
  }

  return (
    <ExplorePostView
      title={props?.hashtag?.name || props?.hashtag}
      onClose={handleBackHashtag}
      selectedPost={selectId}
      posts={HASHTAG_LIST ? flattenDeep(HASHTAG_LIST) : []}
      id="search-page"
      loading={loading}
      callApi={HASHTAG_LIST.length !== HASHTAG_TOTAL_POST}
      setPage={setPage}
      hashTagPage={hashTagPage}
      setLoading={setLoading}
      // loader={loader}
      // page={page}
      followUnfollowEvent={followUnfollowEvent}
    />
  )
}

export default HashtagPostViewer;