import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import isMobile from "../../hooks/isMobile";
import useCollection from "../../hooks/useCollection";
import {
  DOCUMENT_PLACEHOLDER,
  DV_DOCUMENT_PLACEHOLDER,
  COLLECTION_BANNER_PLACEHOLDER_IMAGE,
  COLLECTION_COVER_PLACEHOLDER,
  DV_DOCUMENT_PLACEHOLDER_DARK,
  TEXT_PLACEHOLDER,
  P_CLOSE_ICONS,
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
import { addCollection } from "../../services/collection";
import Wrapper from "../../hoc/Wrapper";
const InputText = dynamic(() => import("../formControl/inputText"), {
  ssr: false,
});
const FigureCloudinayImage = dynamic(
  () => import("../cloudinayImage/cloudinaryImage"),
  { ssr: false }
);
const Image = dynamic(() => import("../image/image"), { ssr: false });
const Button = dynamic(() => import("../button/button"), { ssr: false });
import { useTheme } from "react-jss";
import useLang from "../../hooks/language";
import Icon from "../image/icon";
import useBookmark from "../../hooks/useBookMark";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";
import { ADD_FILE_LOGO } from "../../lib/config/placeholder";
import { handleContextMenu } from "../../lib/helper";

export default function NewCollection(props) {
  const { addBookMarkReq } = useBookmark();
  const theme = useTheme();
  const { imagePic = true } = props;
  const [mobile] = isMobile();
  const [lang] = useLang();
  const [collectionName, setColletionName] = useState("");
  const { collections, getCollectionData } = useCollection({});
  const [image, setImage] = useState(props?.image || "");
  const [childImage, setChildImage] = useState("");
  const [isPlaceholderImage, setIsPlaceHolderImage] = useState(false);
  const [isTextpost, setIsTextPost] = useState(false);
  const [textPstData, setTextPostData] = useState({});
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    setIsTextPost(image.includes("collection-cover-placeholder") ? true : false);
  }, [image])

  useEffect(() => {
    setIsTextPost(childImage.includes("collection-cover-placeholder") ? true : false);
  }, [childImage])

  // function to set img url and img file
  const onImageChange = (file, url) => {
    setFile({
      file,
      url,
    });
  };

  const createCollection = async () => {
    startLoader();
    try {
      const requestPayload = {
        title: collectionName,
      };
      if (isAgency()) {
        requestPayload["userId"] = selectedCreatorId;
      }
      const collection = await addCollection(requestPayload);
      if (props.bookMark) {
        if (Object.keys(textPstData).length > 0 && (textPstData?.postData[0]?.type == 4 || textPstData?.postData[0]?.text)) {
          props.back && props.back(collection.data.data, textPstData?.postData[0]);
        } else {
          props.back && props.back(collection.data.data);
        }
        stopLoader();
        return;
      } else {
        if (Object.keys(textPstData).length > 0 && (props.isNewCollection || textPstData?.postData[0]?.type == 4 || textPstData?.postData[0]?.text)) {
          addBookMarkReq({
            requestPayload: {
              postId: `${textPstData?.postId}`,
              collectionId: `${collection?.data?.data?.collectionId}`
            },
            cb: () => {
              close_drawer("bottomBookmarkMenu");
              props.onClose("newCollection");
              stopLoader();
            },
          });
        }
        setTimeout(() => {
          getCollectionData({
            cb: (collections) => {
              stopLoader();
              props.onClose("newCollection");
              if (Object.values(textPstData).length > 0 && (textPstData?.postData[0]?.type == 4 || textPstData?.postData[0]?.text)) {
                props.back && props.back(collections, textPstData?.postData[0]);
              } else {
                props.back && props.back(collections);
              }
            },
          });
        }, 400);
      }
      stopLoader();
    } catch (error) {
      stopLoader();
      console.error("Error in createCollection", error);
      Toast(error?.response?.data?.message || lang.anErrorOccured, "error");
    }
  };

  const handelChildImage = (post) => {
    post?.postData[0]?.type == 4 || post?.postData[0]?.text ? setTextPostData(post) : setChildImage(post?.postData[0].url || "");
  }

  const webInoutStyle = {
    background: theme.palette.l_input_bg,
    color: theme.palette.l_app_text,
  };
  const mobileInoutStyle = {
    background: theme.palette.d_input_bg,
    color: theme.palette.d_app_text,
  };

  return (
    <Wrapper>
      <div className="btmModal">
        <div className="modal-dialog">
          <div
            className={mobile ? "modal-content-mobile specific_section_bg py-3 w-100" : "modal-content"}
          >
            <div className={mobile ? "col-12 w-330 mx-auto" : ""}>
              {mobile && (
                <div className="d-flex flex-row justify-content-between pt-2">
                  <div className="">
                    <h5 className="mb-0 fntSz24 appTextColor">{lang.newCollection}</h5>
                  </div>
                  <Icon
                    icon={P_CLOSE_ICONS + "#cross_btn"}
                    color={theme.type === "light" ? "#000" : "#fff"}
                    width={20}
                    height={25}
                    class="header__ico"
                    alt="close_icon"
                    onClick={() => { props.onClose() }}
                  />
                </div>
              )}
              {
                <div
                  className={"pt-3 d-flex flex-column align-items-start justify-content-center"} >
                  {imagePic && !image && !childImage && (
                    <div className='borderStroke cursorPtr radius_12 d-flex flex-column pt-2 justify-content-center align-items-center' style={{ width: "110px", height: "110px" }}
                      onClick={() => {
                        !mobile
                          ? open_dialog("BookmarkSelections", {
                            outerBox: "full-width",
                            dialogClick: () =>
                              close_dialog("BookmarkSelections"),
                            type: props.type || 1,
                            onClick: (data = {}) => {
                              setTextPostData(data);
                              const { postData = [] } = data;
                              if (postData && postData.length > 0) {
                                const images = postData[0];
                                setImage(
                                  (images?.url || images?.thumbnail) ? images.type == 1
                                    ? images.url
                                    : images.thumbnail : COLLECTION_COVER_PLACEHOLDER
                                );
                                setIsPlaceHolderImage((images?.url || images?.thumbnail) ? false : true);
                              }
                            },
                            handelChildImage,
                            collectionId: props.collectionId,
                            getCollectionData: props.getCollectionData,
                            getPosts: props.getPosts,
                          })
                          : open_drawer("BookmarkSelections", {
                            type: props.type || 1,
                            onClick: (data = {}) => {
                              setTextPostData(data);
                              const { postData = [] } = data;
                              if (postData && postData.length > 0) {
                                const images = postData[0];
                                setImage(
                                  (images?.url || images?.thumbnail) ? images.type == 1
                                    ? images.url
                                    : images.thumbnail : COLLECTION_COVER_PLACEHOLDER
                                );
                                setIsPlaceHolderImage((images?.url || images?.thumbnail) ? false : true);
                              }
                            },
                            collectionId: props.collectionId,
                            getCollectionData: props.getCollectionData,
                            getPosts: props.getPosts,
                            handelChildImage: handelChildImage
                          },
                            "bottom"
                          );
                      }}
                    >
                      <Image
                        src={ADD_FILE_LOGO}
                        height="50px"
                        width="50px"
                      />
                      <span className="pt-2 fntSz13">Add cover</span>
                    </div>
                  )}
                  {(image || childImage) && (
                    <div className="callout-none" onContextMenu={handleContextMenu}>
                      {!isTextpost
                        ? <FigureCloudinayImage
                          publicId={image || childImage}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "12px",
                          }}
                          width={"110px"}
                          height={"110px"}
                          crop={"fill"}
                          isVisible={props.postVisibleInfo}
                          postType={props.postType}
                          userId={props.userId}
                          tileLockIcon={true}
                        />
                        : <Image src={COLLECTION_COVER_PLACEHOLDER} alt="collection placeholder" />}
                    </div>
                  )}
                  {(!image && (!props?.isNewCollection) && (!props?.isFromProfile)) || (!image && props?.isFromLandingPage) &&
                    <div className={`d-flex align-items-center  ${mobile ? "justify-content-start" : "justify-content-center"} `} style={{ width: "70px", height: "70px" }}>
                      <Image
                        src={TEXT_PLACEHOLDER}
                        className="document-image "
                        height="33px"
                        width="33px"
                        alt="No Document Placeholder"
                        style={{
                          borderRadius: "7px",
                          backgroundColor: "#485164",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  }
                  {image && imagePic &&
                    <div
                      className="gradient_text w-500 pt-1"
                      onClick={() => {
                        !mobile
                          ? open_dialog("BookmarkSelections", {
                            outerBox: "full-width",
                            dialogClick: () => close_dialog("BookmarkSelections"),
                            type: props.type || 1,
                            onClick: (data = {}) => {
                              const { postData = [] } = data;
                              if (postData && postData.length > 0) {
                                const images = postData[0];
                                setImage(
                                  (images?.url || images?.thumbnail) ? images.type == 1
                                    ? images.url
                                    : images.thumbnail : COLLECTION_COVER_PLACEHOLDER
                                );
                                setIsPlaceHolderImage((images?.url || images?.thumbnail) ? false : true)
                              }
                            },
                            collectionId: props.collectionId,
                            getCollectionData: props.getCollectionData,
                            getPosts: props.getPosts,
                            handelChildImage: handelChildImage
                          })
                          : open_drawer("BookmarkSelections", {
                            type: props.type || 1,
                            onClick: (data) => {
                              const { postData = [] } = data;
                              const images = postData[0];
                              setImage(
                                images.type == 1
                                  ? images.url
                                  : images.thumbnail
                              );
                            },
                            collectionId: props.collectionId,
                            getCollectionData: props.getCollectionData,
                            getPosts: props.getPosts,
                          },
                            "bottom"
                          );
                      }}
                    >
                      {lang.change}
                    </div>}
                </div>
              }
              <div className="pt-3 pb-1 collection-parent specific_section_bg">
                <InputText
                  value={collectionName}
                  onChange={(e) => {
                    setColletionName(e.target.value);
                  }}
                  className="input-collection solid_circle_border dv_appTxtClr borderStroke"
                  style={{ backgroundColor: "var(--l_drawer)" }}
                  placeholder="Collection Name"
                  cssStyles={mobile ? "" : webInoutStyle}
                  name="collection"
                  maxlength="32"
                />
              </div>
              <div className="d-flex pt-2 align-items-center justify-content-between specific_section_bg">
                <Button
                  disabled={!collectionName}
                  type="button"
                  fclassname="rounded-pill btnGradient_bg"
                  onClick={() => {
                    createCollection();
                  }}
                >
                  {lang.save}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
