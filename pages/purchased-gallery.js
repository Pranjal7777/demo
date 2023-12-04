import React, { useState, useEffect, useRef } from "react";

import {
  close_drawer,
  guestLogin,
  stopPageLoader,
} from "../lib/global";
import { getCookie, getCookiees, setCookie } from "../lib/session";
import isMobile from "../hooks/isMobile";
import { useRouter } from "next/router";
import { getLikedPurchasedPostApi, getPurchasedPostsApi } from "../services/assets";
import dynamic from "next/dynamic";
import CustomHead from "../components/html/head";
import { UpdateModelCardPostSubject } from "../lib/rxSubject";
import { useDispatch, useSelector } from "react-redux";
import { otherProfileData } from "../redux/actions/otherProfileData";
import DvHomeLayout from "../containers/DvHomeLayout";
import { isAgency } from "../lib/config/creds";
const PurchasedPosts = dynamic(
  () => import("../components/Drawer/PurchasedPosts"),
  { ssr: false }
);

function PurchasedPost(props) {
  const { query } = props;
  const [validGuest, setValidGuest] = useState(false);
  const auth = getCookie("auth");
  const [mobileView] = isMobile();
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(500);
  const [loading, setLoading] = useState(true);
  const homePageref = useRef(null);
  const [page, setPage] = useState(0);
  const [hasMore, sethasMore] = useState(false);
  const [apiResponse, setResponse] = useState(false);
  const dispatch = useDispatch()
  const [selectId, setId] = useState("");
  const [isModelOpen, setModelOpen] = useState(false);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    if (!auth) {
      guestLogin().then((res) => {
        setCookie("guest", true);
        setValidGuest(true);
      });
    }
    // startLoader();
    getLikedPost(20, 0);
    close_drawer();
  }, []);

  const handleDialog = (flag = true) => {
    setModelOpen(flag);
  };

  useEffect(() => {
    UpdateModelCardPostSubject.subscribe(({ postId, data = {} }) => {
      setData((prev) => {
        let postInst = prev.map((item) => {
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
  }, []);

  const getLikedPost = async (limit = 10, skip = 0) => {
    const query = {
      limit: (mobileView && skip === 0) ? 20 : limit,
      offset: skip + 1,
      postType: 2,
      sort: 0,
    };
    if (isAgency()) {
      query["creatorId"] = selectedCreatorId
    }
    try {
      const res = await getLikedPurchasedPostApi(query)

      setToggleDrawer(true);
      if (res?.status === 200) {
        const updatedValue = res.data.result.map((elem) => ({ ...elem, likeCount: elem.totalLike }))
        setOffset(skip);
        if (skip) {
          dispatch(otherProfileData([...data, ...res.data.result]));
          setData((prev) => [...prev, ...updatedValue]);
          setLoading(false);
        } else {
          dispatch(otherProfileData(updatedValue));
          setData(res.data.result);
          setLoading(false);
        }
        sethasMore(true);
        if (res.data.totalCount) {
          setTotalCount(res.data.totalCount);
        }
      }
      if (res && res.status == 204) {
        setData((prev) => [...prev]);
        setLoading(false);
        sethasMore(false);
      }
      stopPageLoader();
      setTimeout(() => {
        setResponse(true);
      }, 1000);
      // console.log("liked posts:", res);
    } catch (error) {
      console.error("liked posts error:", error);
      stopPageLoader();
      setLoading(false);
      sethasMore(false);
      setTimeout(() => {
        setResponse(true);
      }, 1000);
    };
  };

  useEffect(() => {
    if (page > 0) {
      getLikedPost(10, page);
    }
  }, [page]);

  const handleReloadItem = () => {
    // console.log("_______reload");
  };

  if (!validGuest && !auth) {
    return (
      <div className="mv_wrap_home">
        <CustomHead {...props.seoSettingData}></CustomHead>
      </div>
    );
  }

  const handleCloseDrawer = () => {
    router.back();
  };

  return (
    <div className="mv_wrap_home" ref={homePageref} id="home-page">
      {mobileView ? (
        <>
          <PurchasedPosts
            handleCloseDrawer={handleCloseDrawer}
            loading={loading}
            setLoading={setLoading}
            getLikedPost={getLikedPost}
            totalCount={totalCount}
            handleReloadItem={handleReloadItem}
            data={data}
            setPage={setPage}
            offset={offset}
            hasMore={hasMore}
            isModelOpen={isModelOpen}
            handleDialog={handleDialog}
            selectId={selectId}
            setId={setId}
            title={"Purchased Gallery"}
            apiResponse={apiResponse}
          />
        </>
      ) : (
        <DvHomeLayout
          activeLink="purchased-gallery"
          setLoading={setLoading}
          setPage={setPage}
          loading={loading}
          getLikedPost={getLikedPost}
          totalCount={totalCount}
          handleReloadItem={handleReloadItem}
          data={data}
          offset={offset}
          homePageref={homePageref}
          hasMore={hasMore}
          apiResponse={apiResponse}
          pageLink="/purchased-gallery"
          withMore
          {...props}
        />
      )}
      <style jsx>{`
      :global(.myAccount_sticky__section_header){
        top : -16px !important;
      }
      `}</style>
    </div>
  );
}

PurchasedPost.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;
  let token = decodeURIComponent(getCookiees("token", ctx.req));
  let account = {};
  return {
    query: query,
    account,
  };
};

export default PurchasedPost;
