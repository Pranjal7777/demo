import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import useBookmark from "../../hooks/useBookMark";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import {
  COLLECTION_POST_PLACEHOLDER,
  DV_COLLECTION_PLACEHOLDER,
  PRIMARY,
  RADIO_CHECKED,
} from "../../lib/config";
import {
  close_dialog,
  close_drawer,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
const Pagination = dynamic(() => import("../../hoc/divPagination"), { ssr: false });
const FigureCloudinayImage = dynamic(() => import("../cloudinayImage/cloudinaryImage"), { ssr: false });
const Header = dynamic(() => import("../header/header"), { ssr: false });
const Image = dynamic(() => import("../image/image"), { ssr: false });
const PageLoader = dynamic(() => import("../loader/page-loader"), { ssr: false });
const Button = dynamic(() => import("../button/button"), { ssr: false });
import { useTheme } from "react-jss";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";
import { handleContextMenu } from "../../lib/helper";

const BookmarkSelections = (props) => {
  const theme = useTheme();
  const { posts, getBookMark, addBookMarkReq, removeBookmark } = useBookmark();
  const [mobile] = isMobile();
  const [bookMark, setBookmark] = useState({});
  const [lang] = useLang();
  const [isSelectAll, setIsSelectAll] = useState(false);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    if (mobile) {
      // const heigth = allSelectPost ? allSelectPost.offsetHeight : "90";

      if (drawerSelection) {
        drawerSelection.style.paddingTop = "90px";
      }
    }

    getPosts();
  }, []);

  useEffect(() => {
    !mobile && props.setMultiBookmark(bookMark)

    props.click &&
      props.click(
        props.type == 3 ? props.handleAddPost : selectAllMethod,
        confirmBookmarkRemoval,
        bookMark,
        unSelectAllMethod
      );
    props.setShowDoneBtn &&
      props.setShowDoneBtn(!Object.keys(bookMark).length == 0);
  }, [bookMark, posts]);

  const getPostImage = (post) => {
    let url = post.postData
      ? typeof post.postData[0] != "undefined"
        ? post.postData[0]
        : {}
      : {};
    return url;
  };

  const selectAllMethod = () => {
    let selectedAll = {};

    posts &&
      posts.map((post) => {
        selectedAll = {
          ...selectedAll,
          [post.postId]: {
            ...post,
          },
        };
      });
      setIsSelectAll(true)
    setBookmark(selectedAll);
  };

  const unSelectAllMethod = () => {
    let selectedAll = {};
    setIsSelectAll(false)
    setBookmark(selectedAll);
  };

  const handleAddPost = () => {
    if (props.type == 1 || props.type == 2) {
      startLoader();
      let ids = '';
      ids = Object.keys(bookMark).map(id => ids.concat("", id));
      addBookMarkReq({
        requestPayload: {
          postId: `${ids}`,
          collectionId: props.collectionId || props.currentcollectionId,
        },
        cb: () => {
          close_drawer("bottomBookmarkMenu");
          props.getPosts && props.getPosts();
          props.onClose();
          stopLoader();
        },
      });
      props.handelChildImage && props.handelChildImage(Object.values(bookMark)[0]);
      props.getPosts && props.getPosts();
    } else {
      props.onClick
        ? handleBtnClickImage()
        : props.handelChildImage && props.handelChildImage(Object.values(bookMark)[0]);
    }
  };

  const handleBtnClickImage = () => {
    props.handelChildImage && props.handelChildImage(Object.values(bookMark)[0]);
    props.onClick(Object.values(bookMark)[0]), props.onClose();
  }

  const confirmBookmarkRemoval = () => {
    mobile
      ? open_drawer("confirmDrawer",
        {
          title: lang.removeBookmarkMsg,
          yes: removeAll,
        },
        "bottom"
      )
      : open_dialog("confirmDialog", {
        title: lang.removeBookmarkMsg,
        yes: removeAll,
        closeAll: true,
      });
  };

  const removeAll = () => {
    if (Object.keys(bookMark) && Object.keys(bookMark).length > 0) {
      startLoader();
      removeBookmark({
        postIds: Object.keys(bookMark),
        index: props.index || -1,
        collectionId: props.collectionId,
        isFromCollection: props.collectionId ? true : false,
        cb: () => {
          props.onClose();
          close_dialog("confirmDialog");
          props.getPosts && props.getPosts();
          close_drawer("bottomBookmarkMenu");
          Toast("Post Deleted!", "success")
          setTimeout(() => {
            stopLoader();
          }, 100);
        },
        userId: isAgency() ? selectedCreatorId : ""
      });
    }
  };

  const getPosts = (page = 0) => {
    return new Promise(async (res, rej) => {
      try {
        await getBookMark({
          collectionId: props.type == 1 ? "" : props.collectionId,
          offset: page,
          limit: 15,
        });
        props.setShowButton && props.setShowButton(true);
        res();
      } catch (e) {
        rej();
      }
    });
  };

  return (
    <div
      className={mobile
        ? "drawerBgCss w-100 vh-100 overflow-hidden text-app"
        : "mt-3"
      }
    >
      <Pagination
        id={"selectionDrawerBody"}
        items={posts}
        totalRecord={0}
        getItems={getPosts}
      />
      {mobile && (
        <Header
          id="allSelectPost"
          title={props.title ||"All Posts"}
          back={props.onClose}
          Data={props.title || "All Post"}
          right={() => {
            return props.multi ? (
              <div
                className="d-flex justify-content-end align-items-center mr-3 fntSz15 nowrap pt-1"
                onClick={() => {
                  isSelectAll ? unSelectAllMethod() : selectAllMethod();
                }}
              >
                {isSelectAll ? lang.unselectAll : lang.selectAll}
              </div>
            ) : (
              ""
            );
          }}
        />
      )}{" "}
      <div id="drawerSelection" className="h-100  d-flex flex-column">
        <div className="h-100 overflow-auto" id="selectionDrawerBody">
          <div
            className={`row mx-0  ${posts && posts.length == 0 && "h-75"
              }  w-100`}
          >
            {posts ? (
              posts.length > 0 ? (
                [...posts].map((post, index) => {
                  const postImage = getPostImage(post);
                  const isTextPost = post.postData[0].type == 4 || post.postData[0].text;
                  let textPostInfo;
                  if (isTextPost) {
                    textPostInfo = post.postData[0];
                  }
                  return (
                    <div className="col-4 px-2 mb-3" key={index}>
                      <div
                        className={`callout-none position-relative imaeg-card ${!mobile ? "dv-photo cursorPtr" : ""
                          }`}
                        onContextMenu={handleContextMenu}
                        onClick={
                          bookMark[post.postId]
                            ? () => {
                              const prevPost = { ...bookMark };
                              delete prevPost[post.postId];
                              setBookmark(prevPost);
                              // open_drawer(
                              //   "BookmarkSelections",
                              //   { collectionId: collection._id },
                              //   "right"
                              // );
                            }
                            : () => {
                              props.multi == 1
                                ? setBookmark((prevBookmark) => {
                                  return {
                                    ...prevBookmark,
                                    [post.postId]: post,
                                  };
                                })
                                : setBookmark(() => {
                                  return {
                                    [post.postId]: post,
                                  };
                                });
                              // open_drawer(
                              //   "BookmarkSelections",
                              //   { collectionId: collection._id },
                              //   "right"
                              // );
                            }
                        }
                      >
                        {!isTextPost ? <FigureCloudinayImage
                          publicId={
                            postImage.type == 1
                              ? postImage.url
                              : postImage.thumbnail
                          }
                          style={{
                            borderRadius: "7px",
                            backgroundColor: "#485164",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          width={mobile ? 150 : 300}
                          height={mobile ? 140 : 300}
                          crop={"fill"}
                          isVisible={post.isVisible}
                          isCollectionPage={true}
                          tileLockIcon={true}
                        /> :
                          <div className="d-flex justify-content-center align-items-center"
                            style={{
                              width: mobile ? "114px" : "300px",
                              height: mobile ? "116px" : "300px",
                              background: textPostInfo.bgColorCode,
                              color: textPostInfo.colorCode,
                              fontFamily: textPostInfo.font
                            }}>
                            {textPostInfo.text}
                          </div>}
                        <div className="bookmark"></div>
                        <div className="radio-button">
                          {bookMark[post.postId] ? (
                            <div>
                              <Image
                                className={
                                  mobile ? "checked-icon" : "dv-checked"
                                }
                                src={RADIO_CHECKED}
                              />
                            </div>
                          ) : (
                            <div
                              className={
                                mobile
                                  ? "border-border-white checked-icon"
                                  : "dv-checked border-border-white"
                              }
                            ></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="mt-5 text-center flex-column h-100 d-flex justify-content-center align-items-center w-100 placeholder-image">
                  {mobile ? (
                    <Image
                      src={COLLECTION_POST_PLACEHOLDER}
                      height="100px"
                      width="100px"
                    />
                  ) : (
                    <div
                      className=" dv__bg_light_color d-flex justify-content-center mt-5 align-items-center mx-auto"
                      style={{
                        height: "115px ",
                        width: "110px",
                        borderRadius: "7px",
                      }}
                    >
                      <Image
                        src={DV_COLLECTION_PLACEHOLDER}
                        height="60px"
                        width="60px"
                      />
                    </div>
                  )}

                  <div className="w-500 mt-3 fntSz16">{lang.noPostFound}</div>
                </div>
              )
            ) : (
              <div className="mt-5 text-center w-100">
                <PageLoader start={true} />
              </div>
            )}
          </div>
        </div>
        {mobile && (
          <div className="py-4 px-4 position-fixed mx-auto" style={{ left: "0", bottom: "0", right: "0" }}>
          {posts &&
              posts.length > 0 &&
              (props.type == 1 || props.type == 3 ? (
                <Button
                  onClick={handleAddPost}
                  disabled={Object.keys(bookMark).length == 0}
                  type="button"
                  cssStyles={theme.blueButton}
                >
                  {lang.done}
                </Button>
              ) : (
                <button
                  onClick={() => {
                    confirmBookmarkRemoval();
                  }}
                  disabled={Object.keys(bookMark).length == 0}
                  type="button"
                  className="btn btn-default greyBorderBtn "
                  style={{ border: `1px solid ${PRIMARY}`, color: PRIMARY }}
                >
                  {lang.remove}
                </button>
              ))}
          </div>
        )}{" "}
      </div>
    </div>
  );
};

export default BookmarkSelections;
