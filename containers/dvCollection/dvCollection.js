import React, { useEffect, useState } from "react";
import useBookmark from "../../hooks/useBookMark";
import Router from "next/router";
import {
  backArrow_black,
  MORE_ICON_Dark,
  black4,
  RED,
  DV_COLLECTION_PLACEHOLDER,
} from "../../lib/config";
import {
  close_dialog,
  open_dialog,
  scrollToView,
  startLoader,
} from "../../lib/global";
import Image from "../../components/image/image";
import PageLoader from "../../components/loader/page-loader";
import Button from "../../components//button/button";
import { useRouter } from "next/router";
import { openCollectionEdit } from "../../lib/helper";
import { getCookie } from "../../lib/session";
import useLang from "../../hooks/language";
import { useTheme } from "react-jss";
import CustomDataLoader from "../../components/loader/custom-data-loading";
import Icon from "../../components/image/icon";
import Allotherpost from "../profile/Allotherpost";
import { useSelector } from "react-redux";
import { isAgency } from "../../lib/config/creds";
import PaginationIndicator from "../../components/pagination/paginationIndicator";

// const ownPostOptionItems = [
//   { label: "Edit post", value: 3 },
//   { label: "Delete post", value: 4 },
// ];
const DvCollections = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const { query = {} } = useRouter();
  const { posts, pageLoader, pageCount, hasMore, totalCount, getBookMark, subscribedEvent } =
    useBookmark(0, query.count);
  const userType = getCookie("userType");
  const [open, toggle] = useState(false);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    userType == 1
      ? scrollToView(props.homePageref, 270)
      : scrollToView(props.homePageref);
    getPosts();
  }, []);

  const getPosts = (page = 0) => {
    return new Promise(async (res, rej) => {
      try {
        await getBookMark({
          collectionId: props.collectionId,
          offset: page,
        });
        res();
      } catch (e) {
        rej();
      }
    });
  };

  return (
    <div className="text-black" id="collection">
      <div
        className={`d-flex align-items-center justify-content-between ${userType == 1 ? "userCollectionheaderCss" : "myAccount_sticky__section_header"}`}>
        <div className="d-flex ">
          <Icon
            icon={`${backArrow_black}#backArrow`}
            color={theme?.text}
            width={22}
            height={22}
            onClick={() => {
              props.back();
              startLoader();
              props.getCollectionData && props.getCollectionData();
            }}
            class="backArrow pt-1"
            alt="Back Arrow"
          />
          <div className="ml-2">
            <h5 className="dv__fnt20 m-0">{props.title || "All Posts"}</h5>
            <div className="fntSz12 w-600 light_app_text">{totalCount > 1 ? `${totalCount} Posts` : `${totalCount} Post`}</div>
          </div>
        </div>

        <div className="position-relative cursorPtr">
          <div onClick={toggle.bind(null, true)}>
            <Icon
              icon={`${MORE_ICON_Dark}#more_icon`}
              color={theme?.text}
              class="rotate90 dv_menu_icon"
              alt="Kebab Menu Icon"
            />
          </div>
          {open && (
            <div
              className="report-backdrop"
              onClick={toggle.bind(null, false)}
            />
          )}
          {open && (
            <div className="position-absolute report-container button-shadow card_bg">
              {props.collectionId && (
                <div
                  className="report-items dv_appTxtClr"
                  style={{ color: "black" }}
                  onClick={() => {
                    openCollectionEdit({
                      collectionId: props.collectionId,
                      creatorId: isAgency() ? selectedCreatorId : "",
                      getCollectionData: props.getCollectionData,
                      getPosts: getPosts,
                    });
                    // props.deleteChatList();
                    toggle(false);
                  }}
                >
                  {lang.editCollection}
                </div>
              )}
              {props.collectionId && (
                <div
                  className="report-items dv_appTxtClr"
                  style={{ color: "black" }}
                  onClick={() => {
                    open_dialog("BookmarkSelections", {
                      outerBox: "full-width",
                      dialogClick: () => close_dialog("BookmarkSelections"),
                      type: 1,
                      multi: true,
                      currentcollectionId: props.collectionId,
                      getPosts: getPosts,
                      title: props.title,
                    });
                    toggle(false);
                  }}
                >
                  {lang.addCollection}
                </div>
              )}
              <div
                className="report-items dv_appTxtClr"
                style={{ color: "black" }}
                onClick={() => {
                  open_dialog("BookmarkSelections", {
                    outerBox: "full-width",
                    dialogClick: () => close_dialog("BookmarkSelections"),
                    type: 2,
                    multi: true,
                    collectionId: props.collectionId,
                    // getCollectionData: props.getCollectionData,
                    getPosts: getPosts,
                    title: props.title,
                  });
                  toggle(false);
                }}
              >
                {lang.multiSelect}
              </div>
              {props.collectionId && (
                <div
                  className="report-items dv_appTxtClr"
                  style={{ color: "red" }}
                  onClick={() => {
                    open_dialog("DeleteDialog", {
                      collectionId: props.collectionId,
                      getCollectionData: props.getCollectionData,
                    });
                    // props.deleteChatList();
                    toggle(false);
                    // props.open_dialog("reportDialog", {
                    //   userId: props._id,
                    //   openDialog: props.open_dialog.bind(
                    //     null,
                    //     "successDialog",
                    //     {
                    //       dialogText: "Congratulations",
                    //       dialogSubText: "the user has been reported",
                    //       dialogImg: env.REPORT_USER_SUCCES,
                    //       textClass: "successText"
                    //     }
                    //   )
                    // });
                  }}
                >
                  {lang.dlt_Collection}
                </div>
              )}
            </div>
          )}{" "}
        </div>
      </div>

      {/* <Pagination
        // elementRef={props.homePageref}
        id={"page_more_side_bar"}
        items={posts}
        totalRecord={0}
        getItems={getPosts}
      /> */}
      <PaginationIndicator
        id={"page_more_side_bar"}
        pageEventHandler={() => {
          if (!pageLoader && hasMore) {
            getPosts(pageCount);
          }
        }}
      />

      <div id="drawerBody" className="h-100 overflow-auto">
        {posts ? (
          <div className={`d-flex flex-wrap row mx-0 dvcollection_section`}>
            {posts.length ? (
              posts.map((data, index) => {
                return (
                  <Allotherpost
                    price={data.price}
                    coverImage={data.previewData ? data.previewData[0]?.url : undefined}
                    currency={data.currency || {}}
                    key={index + data.postId}
                    deletePostEvent={props.deletePostEvent}
                    reloadItems={props.reloadItems}
                    profileLogo={data.profilePic}
                    profileName={data.firstName}
                    onlineStatus={data.postedAt}
                    postImage={data.postData}
                    postType={data.postType}
                    likeCount={data.totalLike}
                    isLiked={data.isLike}
                    commentCount={data.commentCount || data.commentCount_x || data.commentCount_y}
                    postDesc={data.description}
                    postId={data.postId}
                    userId={data.userId}
                    userName={data.userName || data.username}
                    currencySymbol={
                      data.currency && data.currency.symbol
                        ? data.currency.symbol
                        : "$"
                    }
                    isBookmarked={
                      typeof data.isBookmarked != "undefined"
                        ? data.isBookmarked
                        : true
                    }
                    totalTipReceived={data.totalTipReceived}
                    isVisible={data.isVisible || 0}
                    taggedUsers={data.taggedUsers}
                    fullName={`${data.firstName} ${data.lastName}`}
                    subscribedEvent={subscribedEvent}
                    isFromCollection={true}
                    isFollowed={3}
                    postToShow={index}
                    size={80}
                    useIndexFromProps={true}
                    otherPostSlider={true}
                    setPage={() => { }}
                    collectionPage={true}
                    getPosts={getPosts}
                    isMoreMenu={props?.isMoreMenu}
                  />
                );
              })
            ) : (
              <div className="text-center w-100 placeholder-image h-100 d-flex flex-column align-content-center justify-content-center">
                <div className="mt-5 pb-4">
                  <div
                    className=" dv__bg_light_color d-flex justify-content-center align-items-center mx-auto"
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
                      alt="Collection Placeholder Image"
                    />
                  </div>

                  <div className="w-700 mt-4 fntSz16 text-app">{lang.noPostFound}</div>
                  <div className="w-500  fntSz14 text-app">
                    {`${lang.saveInCollection} ${props.title} ${lang.collection}.`}
                  </div>
                </div>

                <div className="col-6 m-auto">
                  <Button
                    type="submit"
                    cssStyles={theme.blueButton}
                    fclassname="mb-3"
                    id="scr6"
                    onClick={() => {
                      props?.allCollections[0]?.coverImage
                        ? open_dialog("BookmarkSelections", {
                          outerBox: "full-width",
                          dialogClick: () => close_dialog("BookmarkSelections"),
                          type: 1,
                          multi: true,
                          currentcollectionId: props.collectionId,
                          getPosts: getPosts,
                          title: props.title,
                        })
                        : Router.push("/");
                    }}
                  >
                    {lang.addCollection}
                  </Button>
                </div>
              </div>
            )}
            {pageLoader && posts.length > 5 && (
              <div className="py-4 justify-content-center text-center w-100">
                <PageLoader start={pageLoader} />
              </div>
            )}
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
            <CustomDataLoader type="ClipLoader" loading={true} size={60} />
          </div>
        )}
      </div>
      <style jsx="true">{`
        :global(.menu-icon) {
          height: 20px;
        }
        :global(.user-avatar-chat) {
          border-radius: 50% !important;
          border: 2px solid rgb(0, 174, 254);
        }
        .title-header {
          background-color: ${black4};
          border-bottom: 2px solid #5a5e68;
          transition: 0.4s;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          height: 70px;
          top: 0;
          z-index: 999;
          width: 100%;
          position: fixed;
        }
        .text-color-red {
          color: ${RED};
        }
        .report-items {
          font-size: 0.75rem;
          padding: 8px 51px 8px 15px;
          cursor: pointer;
        }
        .report-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          z-index: 1;
        }
        .report-container {
          right: 7px;
          top: 125%;
          white-space: nowrap;
          background-color: #fff;
          margin-right: 7px;
          border-radius: 4px;
          overflow: hidden;
          z-index: 2;
          box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
          border: 1px solid ${theme.palette.l_boxshadow1};
        }
        :global(.userCollectionheaderCss) {
             position: sticky !important;
            top: ${props?.isProfilePage ? "164px" : "0px"} !important;
             z-index: 2 !important;
             color: var(--l_app_text);
            //  background: var(--theme);
           }
          //  :global(.adjustRadiusForBlur){
          //   margin:1px;
          //  }
           :global(.adjustAspectRatio){
            width: ${props.isProfilePage ? "24.7% !important" : "32% !important"};
            aspect-ratio: ${props.isProfilePage ? "unset" : "1/1 !important"};
            min-height:unset !important;
          } 
          :global(.adjustAspectRatio .hastag__img){
            max-height: ${props.isProfilePage ? "44vh !important" : "38vh !important"};
          }   
          :global(.adjustAspectRatio .unsetHeight){
            max-height:unset !important;
          }
          :global(.dvcollection_section .unsetHeight) {
            max-height: 28vh ${(userType == 1 && props.isProfilePage) && '!important'};
          }
          :global(.dvcollection_section .adjustAspectRatio) {
            width: 16vw ${(userType == 1 && props.isProfilePage) && '!important'};
          }
      `}</style>
    </div>
  );
};

export default DvCollections;
