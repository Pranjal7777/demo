import React, { useState } from "react";
import isMobile from "../../hooks/isMobile";
import useCollection from "../../hooks/useCollection";
import {
  CHECK,
  COLLECTION_CHECKED,
  COLLECTION_PLUS,
  DOCUMENT_PLACEHOLDER,
  TEXT_PLACEHOLDER,
  DV_NEW_PLACEHOLDER,
  DV_NEW_PLACEHOLDER_DARK,
} from "../../lib/config";
import {
  close_dialog,
  close_drawer,
  drawerToast,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import { bookmarkPost } from "../../services/collection";
import useLang from "../../hooks/language";
import dynamic from "next/dynamic";
const Pagination = dynamic(() => import("../../hoc/divPagination"), {
  ssr: false,
});
import Wrapper from "../../hoc/Wrapper";
const FigureCloudinayImage = dynamic(
  () => import("../cloudinayImage/cloudinaryImage"),
  { ssr: false }
);
const Image = dynamic(() => import("../image/image"), { ssr: false });
const Button = dynamic(() => import("../button/button"), { ssr: false });
import { useTheme } from "react-jss";
import Icon from "../image/icon";
import { isAgency } from "../../lib/config/creds";
import { useDispatch, useSelector } from "react-redux";
import { handleContextMenu } from "../../lib/helper";
import { updateBookmarkAction } from "../../redux/actions/dashboard/dashboardAction";

export default function Collection(props) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [selectedCollection, selectCollecton] = useState("");
  const { collection = [], postId } = props;
  const [lang] = useLang();
  const [mobile] = isMobile();
  const { updateCollectionData, collections, getCollectionData } =
    useCollection({ collection });
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  // const [collections, setCollections] = useState(collection);
  // console.log("dcsaddasdsadsa", updateCollectionData);
  const bookMark = async (collection) => {
    startLoader();
    const requestPayload = {
      postId: postId,
      collectionId: collection || selectedCollection.collectionId,
    };

    if (!selectedCollection.coverImage) {
    }
    if (isAgency()) {
      requestPayload["userId"] = selectedCreatorId;
    }
    // if (props.postId) {
    //   requestPayload[postId] = props.postId;
    // }
    try {
      const response = await bookmarkPost(requestPayload);
      collection && close_drawer("newCollection");
      collection && close_dialog("newCollection");
      props.onClose && props.onClose();
      stopLoader();
      props.updateBookMark && props.updateBookMark();
      dispatch(updateBookmarkAction({ postId: requestPayload.postId }))
      setTimeout(() => {
        mobile
          ? drawerToast({
            title: lang.postCollectionAdded,
            closeIconVisible: false,
            titleClass: "max-full",
            autoClose: true,
            isMobile: true,
          })
          : open_dialog("successfullDialog", {
            title: lang.postCollectionAdded,
            closeIconVisible: false,
            titleClass: "max-full",
            autoClose: true,
          });
      }, 50);
    } catch (e) {
      e.response && Toast(e.response.data.message, "error");
      props.onClose && props.onClose();
      stopLoader();
    }
  };

  const openAddCollectionDIalog = () => {
    // props.onClose();

    setTimeout(() => {
      mobile
        ? open_drawer("newCollection", {
          imagePic: false,
          bookMark: true,
          isNewCollection: true,
          isFromLandingPage: true,
          image:
            props.postData && typeof props.postData[0] != "undefined"
              ? props.postData[0].type == 1
                ? props.postData[0].url
                : props.postData[0].thumbnail
              : "",
          postVisibleInfo: props.isVisible,
          postType: props.postType,
          userId: props.userId,
          back: (collections) => {
            // setCollections(collections);
            bookMark(collections.collectionId);
          },
        },
          "bottom"
        )
        : open_dialog("newCollection", {
          imagePic: false,
          bookMark: true,
          isNewCollection: true,
          isFromLandingPage: true,
          image:
            props.postData && typeof props.postData[0] != "undefined"
              ? props.postData[0].type == 1
                ? props.postData[0].url
                : props.postData[0].thumbnail
              : "",
          postVisibleInfo: props.isVisible,
          postType: props.postType,
          userId: props.userId,
          back: (collections) => {
            // setCollections(collections);
            bookMark(collections.collectionId);
          },
        });
    }, 100);
  };

  const collectionsList = (data) => {
    return (
      <div
        className="row mb-2 align-content-center cursorPtr"
        onClick={() => {
          selectCollecton(data);
        }}
        key={data.collectionId}
      >
        <div className="col-auto pl-0 pr-2 ">
          {data.coverImage ? (
            <div className="document-image callout-none" onContextMenu={handleContextMenu}>
              <FigureCloudinayImage
                publicId={data.coverImage}
                style={{
                  borderRadius: "7px",
                  backgroundColor: "#f1f1f2",
                }}
                width={33}
                height={33}
                crop={"fill"}
              />
            </div>
          ) : (
            <Image
              src={TEXT_PLACEHOLDER}
              className="document-image "
              height="33px"
              width="33px"
              alt="No Document Placeholder"
            />
          )}
        </div>
        <div
          className={`pl-1 col fntSz14 pr-3 align-self-center text-app text-break`}
        >
          {data.title}
        </div>
        <div className="col-auto px-0 align-self-center">
          {selectedCollection.collectionId == data.collectionId ? (
            <Icon
              icon={`${COLLECTION_CHECKED}#tick_icon`}
              color={theme.appColor}
              size={20}
              class="d-flex"
              viewBox="0 0 20 20"
            />
          ) : (
            <div className="unchecked"></div>
          )}
        </div>
      </div>
    );
  };
  const getCollections = (page = 0) => {
    return new Promise(async (res, rej) => {
      try {
        await getCollectionData({
          offset: page,
          limit: 10,
        });
        res();
      } catch (e) {
        rej();
      }
    });
  };

  return (
    <Wrapper>
      <Pagination
        id={"collectionDiv"}
        items={collections}
        totalRecord={0}
        getItems={getCollections}
      />
      <div className="position-relative overflow-hidden btmModal">
        <div
          className={
            mobile ? "row btmModal px-0 col-12 w-330 mx-auto  pt-4" : ""
          }
        >
          <div className={`col pr-0  ${!mobile && "pt-3"}`}>
            <h5
              className={
                mobile
                  ? `content_heading px-1 py-2 text-center m-0 ${theme.type === "light" ? "text-black" : "text-white"
                  }`
                  : "text-center txt-black dv__fnt26"
              }
            >
              {lang.createCollection}
            </h5>
            <h6
              className={`mb-0 fntSz13  liteGreyClr w-400 pb-2 text-blue34 ${mobile ? "" : "w-330 m-auto text-center px-2 "
                }`}
            >
              {lang.collectionSubTitle}
            </h6>
          </div>

          {mobile && (
            <div
              className="plus-icons col-auto pl-0 cursorPtr"
              onClick={openAddCollectionDIalog}
            >
              {/* <Image src={COLLECTION_PLUS} alt="Add Collection Icon" /> */}
              <Icon
                icon={`${COLLECTION_PLUS}#Add_Collection`}
                color={
                  theme.type == "light"
                    ? theme.palette.l_app_text
                    : theme.palette.d_app_text
                }
                alt="Add Collection Icon"
              />
            </div>
          )}
        </div>

        <div
          id="collectionDiv"
          className={`btmModa  overflow-auto  ${mobile ? "w-330  col-12 max-h-550 " : " dialog-max-height "
            } mx-auto`}
        >
          <div
            className={`pt-3 h-100 col-12 ${mobile ? "" : " w400  mx-auto"}`}
          >
            {collections?.map((coll) => {
              return collectionsList(coll);
            })}
          </div>
        </div>

        <div
          className={`row btmModa col-12 pb-3 ${mobile ? "w-330" : " w400 px-0"
            } mx-auto   d-flex pt-2 align-items-center justify-content-between`}
        >
          {!mobile && (
            <div
              className="row mb-2 mt-2  mx-0 align-content-center cursorPtr"
              onClick={openAddCollectionDIalog}
            >
              <div className="col-auto pl-0 pr-2 ">
                <Icon
                  icon={`${theme.type === "light" ? `${DV_NEW_PLACEHOLDER}#new_collection` : `${DV_NEW_PLACEHOLDER_DARK}#new_collection`}`}
                  color={theme.appColor}
                  size={34}
                  class="d-flex"
                  viewBox="0 0 44 44"
                />
              </div>

              <div className="pl-1 col fntSz14 pr-3 align-self-center fntClrTheme w-600">
                {lang.createCollection}
              </div>
            </div>
          )}
          {collections && collections.length > 0 && (
            <div className={mobile ? "col-12 " : "w-100"}>
              {
                <Button
                  disabled={!selectedCollection}
                  type="button"
                  fclassname="w-100 mt-3 gradient_bg rounded-pill"
                  onClick={() => bookMark()}
                >
                  {lang.save}
                </Button>
              }
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
