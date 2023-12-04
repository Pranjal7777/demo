import React, { useEffect } from "react";
import useBookmark from "../../hooks/useBookMark";
import { MENU_ICON, COLLECTION_POST_PLACEHOLDER } from "../../lib/config";
import { open_drawer, startLoader } from "../../lib/global";
import useLang from "../../hooks/language";
import Router from "next/router";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("../header/header"), { ssr: false });
const Image = dynamic(() => import("../image/image"), { ssr: false });
const PageLoader = dynamic(() => import("../loader/page-loader"), {
  ssr: false,
});
const ModelCard = dynamic(() => import("../timeline-control/timeline-card"), {
  ssr: false,
});
const Pagination = dynamic(() => import("../../hoc/divPagination"), {
  ssr: false,
});
const Button = dynamic(() => import("../button/button"), { ssr: false });
import { useTheme } from "react-jss";
import Icon from "../image/icon";

const BookmarkPosts = (props) => {
  const theme = useTheme();
  const { posts, getBookMark, pageLoader, removeBookmark, totalCount } =
    useBookmark(0, props.count);
  const [lang] = useLang();

  useEffect(() => {
    // const heigth = allpost ? allpost.offsetHeight : "90";
    if (drawerBody) {
      drawerBody.style.paddingTop = "90px";
    }

    getBookMark({ collectionId: props.collectionId });

    return () => {};
  }, []);

  const getPosts = (page = 0) => {
    return new Promise(async (res, rej) => {
      try {
        await getBookMark({ collectionId: props.collectionId, offset: page });
        res();
      } catch (e) {
        rej();
      }
    });
  };

  return (
    <div className="bg-dark-custom d-flex flex-column w-100 h-100 overflow-hidden">
      <Header
        id="allpost"
        title={props.title || "All Post"}
        subtitle={totalCount || 0 + " Posts"}
        Data={props.title || "All Post"}
        back={() => {
          props.onClose();
          startLoader();
          props.getCollectionData && props.getCollectionData();
        }}
        right={() => {
          return (
            <div className="d-flex justify-content-end mr-3">
              <Icon
                icon={`${MENU_ICON}#moreOptions`}
                color={theme.type === "light" ? "#000" : "#fff"}
                style={{ position: "absolute", bottom: "23px", right: "10px" }}
                onClick={() => {
                  open_drawer(
                    "bottomBookmarkMenu",
                    {
                      collectionId: props.collectionId,
                      getCollectionData: props.getCollectionData,
                      getPosts: getPosts,
                      title:props.title
                    },
                    "bottom"
                  );
                }}
              />
            </div>
          );
        }}
      />
      <Pagination
        id={"drawerBody"}
        items={posts}
        totalRecord={0}
        getItems={getPosts}
      />
      <div id="drawerBody" className="h-100 overflow-auto">
        {posts ? (
          <div className={`col-12 ${!posts.length && 'my-5 py-5'}`}>
            {posts.length ? (
              posts.map((data, index) => {
                return (
                  <div key={index}>
                    <ModelCard
                      removeBookmark={removeBookmark}
                      price={data.price}
                      currency={data.currency || {}}
                      profileLogo={data.profilePic}
                      isBookmarked={
                        typeof data.isBookmarked != "undefined"
                          ? data.isBookmarked
                          : true
                      }
                      collectionId={props.collectionId}
                      profileName={data.firstName}
                      onlineStatus={data.postedAt}
                      postImage={data.postData}
                      postType={data.postType}
                      likeCount={data.totalLike}
                      commentCount={data.commentCount || data.commentCount_x || data.commentCount_y}
                      postDesc={data.description}
                      index={index}
                      postId={data.postId}
                      userId={data.userId}
                      username={data.username || data.userName}
                      isLiked={data.isLike}
                      totalTipReceived={data.totalTipReceived}
                      isVisible={data.isVisible || 0}
                      taggedUsers={data.taggedUsers}
                      post={data}
                    />
                  </div>
                );
              })
            ) : (
              <div className=" text-center w-100 placeholder-image h-100 d-flex flex-column align-content-center justify-content-center ">
                <div className="mb-5 pb-5">
                  <Image
                    src={COLLECTION_POST_PLACEHOLDER}
                    height="100px"
                    width="100px"
                  ></Image>
                  <div className="w-600 mt-3 fntSz22">No Post Found !</div>
                  <div className="w-500  fntSz14">
                    {`${lang.saveInCollection} ${props.title} ${lang.collection}.`}
                  </div>
                </div>

                <div className="posBtm">
                  <Button
                    type="submit"
                    fclassname="mb-3 rounded-pill btnGradient_bg"
                    id="scr6"
                    onClick={() => {
                      props?.allCollections ? open_drawer(
                        "BookmarkSelections",
                        {
                          type: 1,
                          multi: true,
                          collectionId: props.collectionId,
                          getCollectionData: props.getCollectionData,
                          getPosts: getPosts,
                          allCollections: props.allCollections
                        },
                        "bottom"
                      ) : ()=> Router.push("/");
                    }}
                  >
                    {lang.addCollection}
                  </Button>
                </div>
              </div>
            )}
            {pageLoader && posts.length > 5 && (
              <div className="py-4 justify-content-center text-center w-100">
                <PageLoader start={pageLoader}></PageLoader>
              </div>
            )}
          </div>
        ) : (
          <div className="d-flex justify-content-center align-content-center mt-5">
            <PageLoader start={true}></PageLoader>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkPosts;
