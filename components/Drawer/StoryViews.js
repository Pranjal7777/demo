import Route from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  circled_eye,
  DELETE_SVG,
  TEXT_POST_ACTIVE_DESKTOP,
  // DELETE_WHITE
} from "../../lib/config";
import {
  authenticate,
  close_dialog,
  close_drawer,
  open_dialog,
  open_drawer,
  open_progress,
  startLoader,
  startPageLoader,
  stopLoader,
  stopPageLoader,
  Toast,
} from "../../lib/global";
import { getStoryViewsApi, storyDeleteApi } from "../../services/assets";
import useLang from "../../hooks/language";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import Icon from "../image/icon";
import Wrapper from "../../hoc/Wrapper";
import { setCookie } from "../../lib/session";
import Image from "../image/image";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";
import { handleContextMenu } from "../../lib/helper";
const FigureCloudinayImage = dynamic(
  () => import("../cloudinayImage/cloudinaryImage"),
  { ssr: false }
);
const CustomHeader = dynamic(() => import("../header/CustomHeader"), {
  ssr: false,
});
const PageLoader = dynamic(() => import("../loader/page-loader"), {
  ssr: false,
});
const PaginationIndicator = dynamic(
  () => import("../pagination/paginationIndicator"),
  { ssr: false }
);
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
const UserTile = dynamic(() => import("./UserTile"), { ssr: false });
const Skeleton = dynamic(() => import("@material-ui/lab/Skeleton"), {
  ssr: false,
});

const StoryViews = (props) => {
  const forllowersListRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [viewers, setViewers] = useState([]);
  const { onClose, back, data } = props;
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [innerWidth, setInnerWidth] = useState(0);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
    getStoryViewers();
  }, []);

  const getStoryViewers = (skip = 0, loading = false) => {
    loading && startPageLoader();
    let payload = {
      storyId: data._id,
    }
    if (isAgency()) {
      payload["userId"] = selectedCreatorId
    }
    getStoryViewsApi(payload)
      .then((res) => {
        if (res && res.data && res.data.data) {
          if (!skip) {
            setViewers(res.data.data);
          } else {
            setViewers((prev) => [...prev, ...res.data.data]);
          }
          setIsLoading(false);
          stopPageLoader();
          setOffset(skip);
        }
      })
      .catch((err) => {
        console.error("error in story viewers ", err);
        setIsLoading(false);
        stopPageLoader();
      });
  };

  const handleClickDelete = () => {
    mobileView
      ? open_drawer(
        "confirmDrawer",
        {
          title: lang.dltStoryConfirmation,
          btn_class: "dangerBgBtn",
          cancelT: lang.cancel,
          submitT: lang.delete,
          yes: deleteStoryHandler,
          // handleClose: ()=>{setPause(false)},
          subtitle: lang.dltStory,
        },
        "bottom"
      )
      : open_dialog("confirmDialog", {
        title: lang.dltStoryConfirmation,
        btn_class: "dangerBgBtn",
        cancelT: lang.cancel,
        submitT: lang.delete,
        yes: deleteStoryHandler,
        handleClose: () => {
          setPause(false);
        },
        subtitle: lang.dltStory,
      });
  };

  const deleteStoryHandler = () => {
    startLoader();
    const payload = {
      storyId: data._id,
    };
    storyDeleteApi(payload)
      .then((res) => {
        back("deleted");
        stopLoader();
        Toast(lang.storyDeleted, "success");
        stopLoader();
      })
      .catch((err) => {
        console.error("error in deleting story", err);
        Toast(lang.dltStoryFailed, "error");
        stopLoader();
      });
    close_dialog();
    close_drawer();
  };

  // Modified By Bhavleen
  const viewStoryCont = () => {
    return (
      <>
        <div
          onContextMenu={handleContextMenu}
          className={`view_story_cont${mobileView ? " pt-3" : " text-center"} callout-none`}
        >
          {data.storyData?.type !== 4 ? <FigureCloudinayImage
            publicId={
              data.storyData?.type == 2
                ? data.storyData?.thumbnail
                : data.storyData?.url
            }
            data={data}
            className={"rounded"}
            isVisible={data.isVisible}
            postType={data.storyType}
            width={parseInt(innerWidth / 2)}
            style={
              mobileView
                ? {
                  objectFit: "cover",
                  maxWidth: "400px",
                  maxHeight: "250px",
                  objectPosition: "top",
                  width: "100%",
                }
                : {
                  objectFit: "cover",
                  maxWidth: "200px",
                  maxHeight: "200px",
                }
            }
          /> : <Image height="100%" width="100%"
            src={TEXT_POST_ACTIVE_DESKTOP}
            className="p-5"
            style={{ backgroundColor: "#003973" }}
            alt="text-post Placeholder"
          />}
        </div>

        <div
          className={`strip p-2 ${mobileView ? "my-3" : "rounded my-2"}`}
          style={{ backgroundColor: "#242a37" }}
        >
          <div className="ml-auto px-2 d-flex">
            <Img className="mr-1" src={circled_eye} width={18} alt="eye" />
            <span className="text-light">{data.totalViews || 0}</span>
            <div
              style={{ textAlign: "right", margin: "0 0 0 auto" }}
              onClick={handleClickDelete}
            >
              <Icon
                icon={`${DELETE_SVG}#delete_icon_b`}
                style={{ cursor: "pointer" }}
                color="#fff"
                size={7}
                unit="%"
                viewBox="0 0 17 18"
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  const userTileViews = () => {
    return (
      <>
        <ul
          className={`list-of-user ${mobileView ? "bg-dark-custom px-2" : "p-0"
            }`}
          ref={forllowersListRef}
          style={mobileView ? { height: "90%" } : { listStyleType: "none" }}
        >
          {viewers && viewers.length ? (
            [...viewers].map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={
                    item.userTypeCode == 2
                      ? () => {
                        setCookie("otherProfile", `${item?.username || item?.userName}$$${item?.userId || item?.userid || item?._id}`)
                        open_progress();
                        Route.push(
                          `/${item.username || item.userName}`
                          // `/user/${item.userId}`
                        );
                      }
                      : () => { }
                  }
                >
                  <UserTile
                    auth={authenticate}
                    uUserId={item.userid}
                    userId={item.uid}
                    isFollow={item.follow == 1 ? true : false}
                    {...item}
                    storyViews={true}
                    isMobile={mobileView}
                  />
                </div>
              );
            })
          ) : (
            <>
              {isLoading && (
                <>
                  <Skeleton
                    variant="rect"
                    width="100%"
                    height={50}
                    animation="wave"
                  />
                  <Skeleton
                    variant="rect"
                    width="100%"
                    height={50}
                    animation="wave"
                  />
                  <Skeleton
                    variant="rect"
                    width="100%"
                    height={50}
                    animation="wave"
                  />
                </>
              )}
              {!isLoading && (
                <div className="my-3 text-center text-muted h4">
                  No Viewers Found
                </div>
              )}
            </>
          )}
          {!isLoading && <PageLoader />}
        </ul>
      </>
    );
  };

  return (
    <>
      {mobileView ? (
        <Wrapper>
          <div className={`drawerBgCss vh-100`}>
            <Wrapper>
              <CustomHeader
                className="position-fixed"
                back={onClose}
                size={25}
              />
              <div id="story_views_cont" className="modal-dialog-cont vh-100">
                {viewers?.length > 8 ? (
                  <PaginationIndicator
                    id="story_views_cont"
                    totalData={viewers || []}
                    totalCount={500}
                    pageEventHandler={() => {
                      // console.log('scrollling-----')
                      getStoryViewers(offset + 10, true);
                    }}
                  />) : ""}
                {viewStoryCont()}

                {userTileViews()}
              </div>
            </Wrapper>
          </div>
        </Wrapper>
      ) : (
        <>
          <div className="py-3 px-2">
            <div className="text-center">
              <h5 className="txt-black dv__fnt34">Story Views</h5>
            </div>
            <button
              type="button"
              className="close dv_modal_close"
              data-dismiss="modal"
              onClick={() => props.onClose()}
            >
              {lang.btnX}
            </button>

            <div id="story_views_cont">
              {viewers?.length > 8 ? (
                <PaginationIndicator
                  id="story_views_cont"
                  totalData={viewers || []}
                  totalCount={500}
                  pageEventHandler={() => {
                    getStoryViewers(offset + 10, true);
                  }}
                />
              ) : ""}
              {viewStoryCont()}

              {userTileViews()}
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default StoryViews;
