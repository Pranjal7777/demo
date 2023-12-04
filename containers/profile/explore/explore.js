import React, { useEffect, useState } from "react";
import ExploreSearch from "../../../components/explore/explore-search";
import { open_drawer, startLoader } from "../../../lib/global";
import PageLoader from "../../../components/loader/page-loader";
import { getExploreSearch } from "../../../services/explore";
import Pagination from "../../../hoc/divPagination";
import Image from "../../../components/image/image";
import FigureCloudinayImage from "../../../components/cloudinayImage/cloudinaryImage";
import flattenDeep from "lodash/flattenDeep";
import ExploreSkeleton from "../../../components/explore/explore-skeleton";
import Model from "../../../components/model/model";
import SimpleDialog from "../../../components/model/dialog";
import ExplorePostView from "../../../components/explore/explore-post-view";
import { ImageVideoIcons, BACK_TO_TOP } from "../../../lib/config";
import DvHeader from "../../DvHeader/DvHeader";
import isMobile from "../../../hooks/isMobile";
import DvExplorePost from "./dv_explorePost";
import { useTheme } from "react-jss";
import ScrollTopEvent from "../../../components/pagination/ScrollTopEvent"
import { IconButton } from "@material-ui/core";
import Icon from "../../../components/image/icon"
import { UpdateModelCardPostSubject } from "../../../lib/rxSubject";
import { getCookie } from "../../../lib/session";
import MarkatePlaceHeader from "../../markatePlaceHeader/markatePlaceHeader";
import sortBy from "lodash/sortBy";

const Explore = (props) => {
  const theme = useTheme();
  const [posts, setPosts] = useState(null);
  const [aspectWidth, setAspectWidth] = useState(0);
  const [laoder, setloader] = useState(false);
  const [selectId, setId] = useState("");
  const [page, setPage] = useState(0);
  const [mobileView] = isMobile();
  const [innterArrayIndex, setInnerIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollToTop, setScrollToTop] = useState(false);
  const [isModelOpen, setModelOpen] = React.useState(false);
  // const [width, setWidth] = useState(0);
  useEffect(() => {
    getExplore();
    setAspectWidth(window.innerWidth - 70);
  }, []);

  useEffect(() => {
    UpdateModelCardPostSubject.subscribe(({ postId, data = {} }) => {
      setPosts((prev) => {
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
  const handleDialog = (flag = true) => {
    setModelOpen(flag);
  };

  const subscribedEvent = (id) => {
    let postInstance = [...posts];
    const filterPost = postInstance.map((item) => {
      if (item.userId == id && item.postType == 2) {
        return { ...item, isVisible: 1 };
      } else {
        return item;
      }
    });
    setPosts([...filterPost]);
  };

  const getExplore = (page = 0, loader) => {
    if (page) setloader(true);
    return new Promise((reso, rej) => {
      // let payload = {
      //   filter: tab,
      //   limit,
      //   offset: page * limit,
      // };
      page && setPage(page);
      page = page + 1;
      return getExploreSearch(page)
        .then(async (res) => {
          if (res.status === 200) {
            var divition = 3;
            var dataLenth = res.data.result && res.data.result?.length;
            var result = res.data.result;
            var group = [];
            let count = 1;
            let subGroup = [];
            let picAlignment = 0;
            ("1 : left , 2 : Right");
            for (let i = 0; i < dataLenth; i++) {
              if (count == 4) {
                count = 1;
                group.push(sortBy(subGroup, ["align"], ["desc"]));
                subGroup = [];
                picAlignment = 0;
              }
              if (
                result[i] &&
                result[i].postData &&
                typeof result[i].postData[0] != "undefined" &&
                result[i].postData[0].type == 2 &&
                !picAlignment
              ) {
                picAlignment = count == 1 ? 1 : 2;
                result[i]["align"] = picAlignment;
              }
              count++;
              subGroup.push(result[i]);
            }
            // var group = _.chunk(res.data.result, 3);
            // group  = group.map(())
            if (page == 1) {
              setPosts(group.flat(2));
            } else {
              setPosts([...posts, ...group.flat(2)]);
            }
            setloader(false);
            reso();
            return;
          } else {
            rej();
          }
        })
        .catch(async (err) => {
          setloader(false);
          // setSkeleton(false);
          rej();
          console.error("getPost status err", err);
          if (err.response) {
            console.error(err.response.data.message);
            setloader(false);
            return;
          }
          console.error(err);
          setloader(false);
        });
    });
  };
  const getPostImage = (post) => {
    return post.postData
      ? typeof post.postData[0] != "undefined"
        ? post.postData[0]
        : {}
      : {};
  };
  const handleScroller = (flag) => {
    if (flag != scrollToTop) {
      setScrollToTop(flag);
    }
  };
  const followUnfollowEvent = (id) => {
    let postInstance = posts;
    postInstance.map((item) => {
      item.userId == id ? (item["isFollowed"] = 1) : "";
    });
    setPosts([...postInstance]);
  };
  return (
    <div
      className="d-flex flex-column"
      style={
        mobileView ? { height: `calc(100vh - 2px)` } : {}
      }
    >
      <div id="top" />
      {mobileView ? (
        <div className="pt-4 pb-3"
          style={{ position: "fixed", zIndex: "99", width: "100%", background: theme.background }}
        >
          <div
            onClick={() => {
              open_drawer("search", { theme }, "right");
            }}
          >
            <ExploreSearch {...props} />
          </div>
        </div>
      ) : (
        /* Desktop Header Module */
        <MarkatePlaceHeader setActiveState={props.setActiveState} />
      )}
      <div
        className={mobileView ? "h-100" : "websiteContainer h-100"}
        style={mobileView ? { paddingTop: "12vh" } : { paddingTop: "10vh" }}
      >
        <div
          id="search-page"
          className={`${mobileView && "h-100"}`}
          style={{ overflowX: "hidden", overflowY: "auto", height: !mobileView ? "90vh" : "" }}
        >
          <div className={mobileView ? "d-flex justify-content-center mx-0 py-1" : "d-flex mx-0"}>
            <div className="col-12 px-0 row">
              {posts ? (
                posts.map((post, index) => {
                  const postImage = getPostImage(post);
                  return (
                    <div
                      key={index}
                      onClick={
                        mobileView
                          ? () => {
                            startLoader();
                            setId(post.postId);
                            handleDialog(true);
                            // open_post_dialog({
                            //   data: post.postData,
                            //   postType: post.postType,
                            //   width: aspectWidth + 70,
                            // });
                          }
                          : () => {
                            setId(post.postId);
                            handleDialog(true);
                            setInnerIndex(index);
                            setCurrentIndex(index);
                          }
                      }
                      style={
                        postImage.type == 4
                          ? {
                            height: `${mobileView ? '120px' : '320px'}`,
                          } : {}
                      }
                      className="col-4 my-1 position-relative cursorPtr px-1"
                    >
                      {postImage.type == 2 && (
                        <div
                          className={
                            mobileView ? "video-icons zIndex1" : "dv__video-icons"
                          }
                        >
                          <Image src={ImageVideoIcons} />
                        </div>
                      )}
                      {postImage.type == 4 && (
                        <div
                          className="text-post-container"
                          style={{
                            wordBreak: 'break-word',
                            color: `${postImage.colorCode}`,
                            background: `${postImage.bgColorCode}`,
                            fontFamily: `${postImage.font}`,
                            overflow: "hidden",
                            fontSize: `${postImage?.text?.length > 250 ? '1.5vw' : postImage?.text?.length > 200 ? '2vw' : postImage?.text?.length > 100 ? '2.7vw' : postImage?.text?.length > 50 ? '2vw' : '4'}`
                          }}
                        >
                          {postImage.text}
                        </div>
                      )}
                      {
                        postImage.type != 4 && (
                          <div className={mobileView ? "image-padding-0" : ""}>
                            <FigureCloudinayImage
                              publicId={
                                postImage.type == 1
                                  ? postImage.url
                                  : postImage.thumbnail
                              }
                              className={
                                mobileView
                                  ? `${post.align ? "h-120" : "h-120"}`
                                  : `${post.align
                                    ? "dv__exploreCard"
                                    : "dv__exploreCard"
                                  }`
                              }
                              style={
                                mobileView
                                  ? {
                                    padding: "0px",
                                    backgroundColor: "#485164",
                                    width: "100%",
                                    height: post.align ? "120px" : "120px",
                                    objectFit: "cover",
                                  }
                                  : {
                                    width: "100%",
                                    height: post.align ? "320px" : "320px",
                                    objectFit: `cover`,
                                  }
                              }
                              postType={post.postType && parseInt(post.postType)}
                              isVisible={post.isVisible || 0}
                              height={
                                mobileView
                                  ? `${post.align ? 540 : 220}`
                                  : `${post.align ? 640 : 304}`
                              }
                              // width={mobileView ? "auto" : 350}
                              width="auto"
                              crop="fill"
                              exploreMobile={true}
                              price={post.price}
                              currency={post.currency}
                              uid={post.userId}
                              userId={getCookie("uid")}
                              lockIcon={getCookie("uid") == post.userId ? false : post.isVisible == 1 ? false : true}
                            />
                          </div>
                        )}
                      {/* <img src="https://source.unsplash.com/random/1" /> */}
                    </div>

                  );
                })
              ) : (
                <div className="row w-100 px-0">
                  {[...new Array(20)].map((_, index) => {
                    return (
                      <div key={index} className="col-4 px-1 py-1 mx-0 ">
                        <ExploreSkeleton />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div id="scroller">
            {/* Back To Top Button */}
            <ScrollTopEvent
              scrollerEvent={(flag) => handleScroller(flag)}
            />
            {scrollToTop && (
              <div
                style={{
                  position: "fixed",
                  bottom: "50px",
                  right: 0,
                  zIndex: 1
                }}
              >
                <IconButton
                  onClick={(e) => {
                    document
                      .getElementById("top")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Icon
                    icon={`${BACK_TO_TOP}#back_to_top`}
                    color={theme.appColor}
                    size={60}
                    viewBox="0 0 60 60"
                  />
                </IconButton>
              </div>
            )}
          </div>
          {laoder && (
            <div className="py-3 d-flex justify-content-center">
              <PageLoader start={true} />
            </div>
          )}
          <Pagination
            key={isModelOpen}
            id="search-page"
            items={posts ? flattenDeep(posts) : []}
            getItems={getExplore}
            page={page || 0}
          />
        </div>
      </div>
      {mobileView ? (
        <Model
          open={isModelOpen}
          className={"full_screen_dialog vw-100"}
          // closeIcon={true}
          keepMounted={true}
          fullScreen={true}
        >
          <ExplorePostView
            title='Explore'
            onClose={() => handleDialog(false)}
            selectedPost={selectId}
            posts={posts ? flattenDeep(posts) : []}
            id="search-page"
            laoder={laoder}
            page={page}
            followUnfollowEvent={followUnfollowEvent}
          ></ExplorePostView>
        </Model>
      ) : (
        <SimpleDialog pathname={'search'} open={isModelOpen} onClose={() => handleDialog(false)} width="65.885vw">
          <DvExplorePost
            onClose={() => handleDialog(false)}
            posts={posts ? posts : []}
            setActiveState={props.setActiveState}
            innterArrayIndex={innterArrayIndex}
            index={currentIndex}
            page={page + 1}
            getItems={getExplore}
            subscribedEvent={subscribedEvent}
            followUnfollowEvent={followUnfollowEvent}
          ></DvExplorePost>
        </SimpleDialog>
      )}
      <style jsx>
        {`    
          /* width */
          ::-webkit-scrollbar {
            width: ${!mobileView ? "5px" : ""} !important; 
          }

          /* Handle */
          ::-webkit-scrollbar-thumb {
            background: ${!mobileView ? "var(--l_light_grey2)" : ""} !important; 
            border-radius: ${!mobileView ? "4px" : ""} !important;
          }

          /* Handle on hover */
          ::-webkit-scrollbar-thumb {
            background: ${!mobileView ? "var(--l_light_grey2)" : ""} !important; 
          }
          .text-post-container {
            word-break: break-word;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 100%;
            padding: 0 15px;
            text-align: center;
          }
          .zIndex1{
            z-index:1;
          }
          :global(.textPostLockScreenCss) {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
          }
        `}
      </style>
    </div>
  );
};
export default Explore;
