import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useTheme } from "react-jss";
import dynamic from "next/dynamic";
import Head from "next/head";

import { NONE_ICON, P_CLOSE_ICONS, GIFT_ACTIVE, GIFT_DEACTIVE, FANZLY_ACTIVE, FANZLY_DEACTIVE } from "../../lib/config";
import { close_dialog, close_progress, startLoader, stopLoader, Toast } from "../../lib/global";
import useLang from "../../hooks/language";
import Icon from "../../components/image/icon";
import { open_dialog } from "../../lib/global";
import { getShoutoutReqAttr, isShoutoutEnabled, postReqCreator } from "../../services/shoutout";
import { palette } from "../../lib/palette";
import { getCookiees } from "../../lib/session";

import Image from "../../components/image/image";
import CustButton from "../../components/button/button";
import { close_drawer, drawerToast } from "../../lib/global/loader";
import { sendMail } from "../../lib/global/routeAuth";
import { CoinPrice } from "../ui/CoinPrice";
import { purchaseSuccessFromWallet } from "../../redux/actions/wallet";
import DVinputText from "../DVformControl/DVinputText";
import Button from "../../components/button/button";
import { FOLDER_NAME_IMAGES } from "../../lib/config/creds";
import { getFileType } from "../../lib/helper";
const Switch = dynamic(() => import("../../components/formControl/switch"), { ssr: false });
const PostPlaceHolder = dynamic(() => import("../post/PostPlaceHolder").then(module => module.PostPlaceHolder), { ssr: false });


const ShoutOut = (props) => {
  let userId = getCookiees("uid");
  const theme = useTheme();
  const router = useRouter();
  const [lang] = useLang();

  // hooks
  const [selectedFiles, setSelectedFiles] = useState([]);

  // redux state
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state?.profileData);

  // refs
  const suggestion_ref = useRef(null);

  // props
  const otherUserData = { ...props.otherprofile };

  // local states
  const [activeType, setActiveType] = useState(1);
  const [allAttribute, setAllAttribute] = useState([]);
  const [payload, setPayLoad] = useState({});
  const [isHide, setIsHide] = useState(true);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedUserName, setSelectedUserName] = useState("");
  const [page, setPage] = useState(0);
  const [attributePayload, setAttributePayload] = useState({});
  const [isTextAreaVisible, setIsTextAreaVisible] = useState(false);
  const [otherFieldText, setOtherFieldTxet] = useState("");
  const [handleBtnDisplay, setHandleBtnDisplay] = useState(true);


  useEffect(() => {
    close_progress()
    suggestion_ref?.current?.addEventListener("scroll", handlerScroll);

    handleResizeBox();
    getShoutoutAttrAPI();
    setPayLoad({ ...payload, From: otherUserData?.username });

    return () => {
      suggestion_ref?.current?.removeEventListener("scroll", handlerScroll);
    };
  }, []);

  const handlerScroll = () => {
    if (
      suggestion_ref.current.scrollTop +
      suggestion_ref.current.clientHeight +
      5 >=
      suggestion_ref.current.scrollHeight
    ) {
      setPage(page + 1);
    }
  };

  const handleResizeBox = () => {
    const SuggestionCssObject = document
      .querySelector(".toInpBox")
      ?.getBoundingClientRect();
  };

  useEffect(() => {
    reomoveFieldValue()
  }, [activeType]);

  const reomoveFieldValue = () => {
    if (activeType == 1) {
      setPayLoad({});
      setAttributePayload({});
      setIsHide(false);
      setIsTextAreaVisible(false);
      setOtherFieldTxet("");
    } else {
      setPayLoad({ To: otherUserData.username });
      setSelectedUser(userId);
      setAttributePayload({});
      setIsTextAreaVisible(false);
      setOtherFieldTxet("");
      setIsHide(false);
    }
  }

  const getShoutoutAttrAPI = async () => {
    startLoader();
    try {
      const res = await getShoutoutReqAttr();
      setAllAttribute(res?.data?.data);
      stopLoader();
    } catch (err) {
      stopLoader();
    }
  };

  const handelOtherUser = (objProp, userName) => {
    let obj = {
      ...payload,
    };
    obj[objProp] = userName;

    setSelectedUserName("");
    setPayLoad(obj);
  };

  const handleType = (type) => {
    setActiveType(type);
    setSelectedUserName("");
  };

  const isShoutoutEnabledApi = () => {
    isShoutoutEnabled(otherUserData?._id).then((res) => {
      handlePurchaseInfo()
    }).catch((error) => {
      if (error.response.status == "408") {
        return drawerToast({
          closing_time: 70000,
          // title: lang.shoutoutPlaceholder,
          desc: error.response.data.message,
          closeIconVisible: true,
          isPromo: true,
          button: {
            text: lang.contactUs,
            onClick: () => {
              sendMail();
            },
          },
          titleClass: "max-full",
          autoClose: true,
          isMobile: false,
        });
      }
    })
  }
  const handlePurchaseInfo = () => {
    open_dialog("purchaseConfirmWallet", {
      title: lang.almostDone,
      description: <div ><span className="d-flex fntSz14 flex-column align-items-center"> {`${lang.confirmShoutoutMob} ${otherUserData.username || ""}`}
        <span className="ml-1"><CoinPrice price={otherUserData?.shoutoutPrice?.price} prefixText="for" showCoinText={true} size={14} /></span>
      </span></div>,
      // descriptionTwo: `to ${otherUserData.fullName || ""}`,
      checkout: uploadVdo,
      // closeAll: true,
      price: otherUserData?.shoutoutPrice.price,
      handlePaymentUsingWallet: true,
      button: lang.confirm
    });
  };

  const handleBtn = () => {
    let boolArray = [];

    if (activeType == 2 && userProfile?.username) {
      boolArray.push(true);
    } else if (
      activeType == 1 &&
      userProfile?.username &&
      (selectedUserName || payload?.To)
    ) {
      boolArray.push(true);
    }
    if (activeType == 1 && !payload.To) {
      boolArray.push(false);
    } else {
      boolArray.push(true);
    }

    if (attributePayload["Video"]?.Video?.filesObject) {
      attributePayload["Video"]?.Video?.filesObject && isthumbnailHas
        ? boolArray.push(true)
        : boolArray.push(false);
    }
    let manadatory = allAttribute.filter((data) => data.isMandatory);
    // dynamic field validation
    manadatory.map((attr, index) => {
      if (
        attributePayload[attr.attributeName]?.value ||
        (attributePayload[attr.attributeName]?.Video?.filesObject &&
          isthumbnailHas)
      ) {
        boolArray.push(true);
      } else {
        boolArray.push(false);
      }
    });
    return boolArray.findIndex((data) => data === false) > -1 ? false : true;
  };

  const handleAttributePayload = (field, value) => {
    let payload = { ...attributePayload };
    let obj = {};
    if (value == "Others") {
      setIsTextAreaVisible(true);
      obj = {
        attributeName: field?.attributeName,
        type: field?.type,
        attributeId: field?._id,
        value: value,
      };
      payload[field?.attributeName] = obj;
      setAttributePayload(payload);
    } else {
      setIsTextAreaVisible(false);
      if (field?.attributeName == "Video") {
        obj = {
          attributeName: field?.attributeName,
          type: field?.type,
          attributeId: field?._id,
          value: value,
          isImage: true,
        };
      } else {
        obj = {
          attributeName: field?.attributeName,
          type: field?.type,
          attributeId: field?._id,
          value: value,
        };
      }
      payload[field?.attributeName] = obj;
      setAttributePayload(payload);
    }
  };

  const handleOtherAttributePayload = (field, value) => {
    let payload = { ...attributePayload };
    let obj = {};
    obj = {
      attributeName: field?.attributeName,
      type: field?.type,
      attributeId: field?._id,
      value: otherFieldText,
    };
    payload[field?.attributeName] = obj;
    setAttributePayload(payload);
    Toast("Your message has been saved", "success");
    setHandleBtnDisplay(false);
  };

  const uploadVdo = async (...args) => {
    const videoAttr = allAttribute.filter((field, index) => {
      return field.attributeName == "Video";
    });

    const isImageUpload = selectedFiles[0]?.type === "IMAGE"
    const isVideoFieldReq = videoAttr[0].isMandatory;

    try {
      startLoader();
      if (isVideoFieldReq || selectedFiles?.length) {
        let thumb;
        var postImage = {
          seqId: 1,
          type: 2,
          url: selectedFiles[0]?.file,
        };
        let finalPayload = {
          ...attributePayload,
        };

        if (isImageUpload) {
          thumb = selectedFiles[0]?.thumb || selectedFiles[0]?.preview
          postImage["thumbnail"] = thumb;
          finalPayload["Video"].value = postImage.thumbnail;
          finalPayload["Video"].imageUrl = postImage.thumbnail;
        } else {
          let url = selectedFiles[0]?.file;
          thumb = selectedFiles[0]?.thumb || selectedFiles[0]?.preview
          finalPayload["Video"].value = url;
          finalPayload["Video"].thumbnail = thumb;
          delete finalPayload["Video"].isImage;
        }

        stopLoader();


        setAttributePayload(finalPayload);
      }
      shoutOutRequest(...args);
    } catch (err) {
      Toast("ERROR IN uploadVdo", "error");
      console.error("ERROR IN uploadVdo", err)
      stopLoader();
    }
  };

  const placeOrderStatus = () => {
    open_dialog("successPayment", { successMessage: lang.orderPlacedSuccessfully })
    setTimeout(() => {
      close_dialog("place_order_status");
      close_dialog("open_desktop_shoutout");
      close_dialog("Address");
      close_dialog("purchaseConfirm");
      close_dialog("checkout");
      close_dialog("purchaseConfirmWallet")
      router.push("/virtual-request");
    }, 1500);
    reomoveFieldValue();
  };

  const shoutOutRequest = async (...args) => {
    startLoader();
    try {
      let apiPayload = {
        creatorId: otherUserData?._id,
        orderType: "VIDEO_SHOUTOUT",
        allowProfileView: isHide,
        attribute: Object.values(attributePayload),
        requestedFor:
          activeType == 1 ? userProfile._id || selectedUser?._id || selectedUser : userProfile._id,
        bookingFor:
          activeType == 1 ? payload?.To || selectedUser : userProfile._id,
      };

      // API CALL
      const res = await postReqCreator(apiPayload);
      stopLoader();
      dispatch(purchaseSuccessFromWallet(+otherUserData?.shoutoutPrice.price))
      placeOrderStatus();
    } catch (err) {
      stopLoader();
      console.error("Error in shoutOutRequest", err)
      Toast(lang.errorMsg, "error");
    }
  };

  const handleOtherFieldText = (e) => {
    setHandleBtnDisplay(true);
    setOtherFieldTxet(e.target.value);
  };

  const handleRemoveFile = (id) => {
    const currentFile = selectedFiles.find(f => f.id === id);
    const currentFileIndex = selectedFiles.findIndex(f => f.id === id);
    if (currentFile) {
      const allFiles = [...selectedFiles]
      allFiles.splice(currentFileIndex, 1)
      setSelectedFiles([...allFiles])
      // setRemoveFile(id)
    }
  }

  const handleUploadSuccess = (files) => {
    const allFiles = [{
      seqId: 1,
      preview: getFileType(files[0].data) === "VIDEO" ? files[0].meta?.thumb : files[0].preview,
      id: files[0].id,
      thumb: getFileType(files[0].data) === "VIDEO" ? files[0].meta?.thumb : files[0].meta.key,
      type: getFileType(files[0].data),
      file: files[0].meta.key,
    }]
    setSelectedFiles(allFiles);
    close_dialog("S3Uploader");
    close_drawer("S3Uploader");
  }


  const handleBeforUpload = (files, startUpload) => {
    startUpload(files)
  }

  const uploadDhoutoutVideo = (field) => {
    handleAttributePayload(field)
    open_dialog("S3Uploader", {
      autoProceed: false,
      showUploadButton: true,
      targetId: "ShoutOut",
      fileTypes: ['video/*'],
      handleClose: function () { close_dialog("S3Uploader") },
      open: true,
      folder: `${userId}/${FOLDER_NAME_IMAGES.shoutOut}`,
      successCallback: (files) => handleUploadSuccess(files),
      // removeFile: removeFile,
      theme: theme.type,
      limit: 1,
      beforeUpload: (files, startUpload) => handleBeforUpload(files, startUpload),
      isTransForm: false,
    })
  };

  const getSectionsField = () => {
    return allAttribute?.map((field, index) => {
      switch (field?.type) {
        case "RADIO_BUTTON":
          return (
            <div className="d-flex flex-column justify-content-center align-items-center p-4 borderBtm">
              <h5 className="text-center mb-3"> {field?.attributeName}{" "}
                {field?.isMandatory && (
                  <span>*</span>
                )}
              </h5>
              <div
                className="row mx-0 justify-content-center gap_14"
                style={{ width: "100%" }}
              >
                {field?.value.map((occ, index) => (
                  <div
                    className="text-center cursorPtr"
                    onClick={() => handleAttributePayload(field, occ?.value)}
                  >
                    <Image
                      src={occ?.valueIcon ? occ?.valueIcon : NONE_ICON}
                      alt="dynamic render"
                      className="dynamicAttImgCss object-fit-cover"
                      style={{
                        border: `${occ?.value ==
                          attributePayload[field?.attributeName]?.value
                          ? `1px solid ${theme?.appColor}`
                          : ""
                          }`,
                        width: "72px",
                        height: "72px"
                      }}
                    />
                    <div className="text-center pt-2">{occ?.value}</div>
                  </div>
                ))}
              </div>
              {isTextAreaVisible && (
                <>
                  <textarea
                    className="pl-1 py-2 w-100 radioTextArea"
                    row={5}
                    maxLength={50}
                    style={{ height: "58px" }}
                    placeholder={lang.writeSomething}
                    onChange={handleOtherFieldText}
                    value={otherFieldText}
                  />
                  <div
                    className="text-right w-100 pt-2"
                  >
                    {(otherFieldText && otherFieldText.length) || 0}/50
                  </div>
                  {handleBtnDisplay && (
                    <CustButton
                      type="submit"
                      onClick={() =>
                        handleOtherAttributePayload(field, "Others")
                      }
                      fclassname="mt-3"
                      cssStyles={theme.blueButton}
                      isDisabled={!(otherFieldText.length > 2)}
                    >
                      {lang.save}
                    </CustButton>
                  )}
                </>
              )}
            </div>
          );
          break;

        case "TEXT_BOX": case "TEXT_AREA":
          return (
            <div className="d-flex flex-column w-100 p-4 borderBtm">
              <h5 className="text-center">
                {field.attributeName}{" "}
                {field?.isMandatory && (
                  <span>*</span>
                )}
              </h5>
              <div className="d-flex flex-column w-100 px-4 pt-3">
                <label>
                  {field.attributeName == "Add Instructions" ? lang.instructionForCreator : lang.moreAboutYou}
                </label>
                <textarea
                  className="background_none borderStroke radius_8 p-2 text-app"
                  row={5}
                  style={{ height: "100px" }}
                  maxLength={300}
                  placeholder={lang.typeHerePlaceholder}
                  onChange={(e) =>
                    handleAttributePayload(field, e.target.value)
                  }
                  value={attributePayload[field?.attributeName]?.value || ""}
                />
                <div
                  className="text-right pt-2"
                >
                  {(attributePayload[field?.attributeName]?.value.length) || 0}/300
                </div>
              </div>
            </div>
          );
          break;

        case "VIDEO_UPLOAD":
          return (
            <div className="mainDiv px-3 py-3 mt-4 borderBtm">
              <div className="d-flex justify-content-center fntSz20 font-weight-500">
                {lang.attachMedia}{" "}
                {field?.isMandatory && (
                  <span className="pl-1" style={{ color: "red" }}>
                    *
                  </span>
                )}
              </div>
              <div className="col-12 d-flex flex-column position-relative">
                <PostPlaceHolder
                  isEdit
                  showTitle={false}
                  isSingle
                  setFiles={setSelectedFiles}
                  handleRemoveFile={handleRemoveFile}
                  onClick={() => uploadDhoutoutVideo(field)}
                  files={selectedFiles}
                />
                <div className="font-weight-500 light_app_text fntSz13">{lang.videoUplaodLimit}</div>
              </div>
            </div>
          );
          break;
        default:
          break;
      }
    });
  };

  return (
    <React.StrictMode>
      <Head>
        <script
          defer={true}
          src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js"
        />
      </Head>
      <div className="overflowY-auto" id="shoutout_id" style={{ maxWidth: "500px" }}>
        <div className="py-3 w-100 d-flex position-relative align-items-center">
          <Icon
            icon={`${P_CLOSE_ICONS}#cross_btn`}
            height={22}
            width={22}
            color={"var(--l_app_text)"}
            alt="back arrow icon"
            onClick={() => props.onClose()}
            style={{ right: "10px" }}
            class="cursorPtr position-absolute"
          />
          <h4 className="text-center w-100 my-1">
            {lang.Shoutout_Request}
          </h4>
        </div>
        <div className="">
          <div className="borderBtm">
            <h5 className="text-center w-400 my-3">
              {lang.WhoShououtFor}
            </h5>
            <div className="d-flex justify-content-evenly">
              <div
                className="text-center cursorPtr"
                onClick={() => handleType(1)}
              >
                <Image
                  src={
                    activeType == 1
                      ? GIFT_ACTIVE
                      : GIFT_DEACTIVE
                  }
                  width="100px"
                  height="100px"
                  alt={lang.fanzlyActiveSection}
                />
                <div className={`pt-2 w-500 ${activeType === 1 ? "gradient_text" : "light_app_text"}`}>
                  {lang.someone_else}
                </div>
              </div>
              <div
                className="text-center cursorPtr"
                onClick={() => handleType(2)}
              >
                {activeType == 2 ? <Image
                  src={FANZLY_ACTIVE}
                  width="100px"
                  height="100px"
                  alt={lang.fanzlyActiveSection}
                /> :
                  <Icon
                    icon={`${FANZLY_DEACTIVE}#selfUserLogo`}
                    height={100}
                    width={100}
                    color={"#dfdfdf"}
                    alt="back arrow icon"
                    viewBox="0 0 101 101"
                  />
                }
                <div className={`pt-2 w-500 ${activeType === 2 ? "gradient_text" : "light_app_text"}`}>
                  {lang.my_self}
                </div>
              </div>
            </div>

            <div className="px-4 mb-3">
              <div className="mb-2">
                <label>{lang.from}</label>
                <div className="borderStroke radius_8 p-2">
                  {userProfile?.username}
                </div>
              </div>
              {activeType == 1 &&
                <div className="d-flex flex-column">
                  <DVinputText
                    labelTitle={`${lang.bookingFor}`}
                    className="background_none borderStroke radius_8 text-app p-2"
                    id="bookingFor"
                    name="bookingFor"
                    autoComplete='off'
                    placeholder={`${lang.enterNameShoutout}`}
                    autoFocus
                    type="text"
                    onChange={(e) =>
                      activeType == 1 && handelOtherUser("To", e.target.value)
                    }
                    value={
                      activeType == 2
                        ? userProfile.username
                        : selectedUserName
                          ? selectedUserName
                          : payload?.To || ""
                    }
                  />
                </div>}
            </div>
          </div>
          {getSectionsField()}
          <div
            className="col-12 d-flex py-4"
            style={{ background: "#252525 !important" }}
          >
            <div className="pr-4">{`${lang.displayShoutoutMsg} ${otherUserData.username}'s ${lang.profile}`}</div>
            <Switch onChange={() => setIsHide(!isHide)} />
          </div>
        </div>
        <div className="w-100">
          <div className="d-flex col-10 py-2 mx-auto cursorPtr">
            <Button
              type="submit"
              onClick={() => isShoutoutEnabledApi()}
              fclassname="gradient_bg rounded-pill white"
              disabled={!handleBtn()}
            >
              <CoinPrice price={otherUserData?.shoutoutPrice?.price} prefixText={lang.request_shoutout_for} showCoinText={false} size={14} />
            </Button>
          </div>
        </div>
        <style jsx>{`
          :global(.renderSectionDiv .occDiv) {
            flex: 0 0 20%;
          }
          .shoutoutContenDiv{
            height: calc(80vh - 27px);
            overflow-y: auto;
            overflow-x: hidden;
          }
          :global(.open_desktop_shoutout .MuiDialog-paper) {
			      min-height: calc(100% - 12px) !important;
		      }
          .suggestionRes {
            border-bottom: 1px solid ${theme.type == "light" ? palette.l_border : palette.d_border};
            background : ${theme?.sectionBackground}
            color : ${theme?.text}
          }
          
          :global(.renderSectionDiv .fromInpField) {
            height: 40px;
            border-radius: 5px;
            border: 1px solid #c0c0c0;
            background: ${theme.shoutoutDialogBg};
          }
          :global(.renderSectionDiv .textAreaCss) {
            height: 40px;
            border-radius: 5px;
            border: 1px solid #c0c0c0;
            padding-bottom: 25px;
            background: ${theme.shoutoutDialogBg};
          }
          :global(.renderSectionDiv .introYourSelf) {
            height: 70px;
            border-radius: 5px;
            border: 1px solid #c0c0c0;
            overflow-wrap: break-word;
          }
          :global(.renderSectionDiv .tagColor) {
            color: ${activeType == 1 ? theme?.appColor : "#8C959D"};
          }
          :global(.renderSectionDiv .tagCol) {
            color: ${activeType == 2 ? theme?.appColor : "#8C959D"};
          }
          :global(.renderSectionDiv .reqBtn) {
            color: ${theme.palette.white};
            width: 100%;
            border: none;
            display: block;
            padding: 10px 15px;
            border-radius: 22px;
            background-color: ${theme?.appColor};
          }
          #shoutout_id {
            scroll-behavior: smooth;
          }
          :global(.suggestion_box) {
            width: 96%;
            box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);
            max-height: 180px;
            z-index: 10;
            background : ${theme?.sectionBackground};
            color: ${theme.text};
            border: 1px solid
              ${theme.type == "light" ? "none" : palette.d_border};
            border-radius: 5px;
          }
          :global(.dynamicAttImgCss) {
            width: 55px;
            border-radius: 50%;
            padding: 5px;
          }
          :global(.radioTextArea){
            background: ${theme.shoutoutDialogBg} !important;
            border-radius: 5px !important;
            border: 1px solid #c0c0c0 !important;
          }
          :global(.iconWidth > .MuiSvgIcon-root){
            width:3em !important;
            height:3em !important;
           }
        `}</style>
      </div>
    </React.StrictMode>
  );
};

export default ShoutOut;
