import React, { useEffect, useState, useRef } from 'react'
import { useTheme } from "react-jss";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux"

import Header from "../../header/header"
import useLang from "../../../hooks/language"
import * as env from "../../../lib/config";
import * as config from "../../../lib/config";
import isMobile from "../../../hooks/isMobile";
import CustButton from "../../button/button";
import { open_drawer, close_drawer, backNavMenu } from '../../../lib/global'
import useProfileData from "../../../hooks/useProfileData";
import { postReqCreator, getShoutoutReqAttr, isShoutoutEnabled } from '../../../services/shoutout';
import useReduxData from "../../../hooks/useReduxState";
import { getAddress } from "../../../redux/actions/address";
import { getCookiees } from "../../../lib/session";
import usePg from "../../../hooks/usePag";
import { startLoader, stopLoader, close_dialog, Toast } from "../../../lib/global";
import { generaeVideThumb } from "../../../lib/image-video-operation";
import VideoContainer from '../../../containers/post/shoutoutVideoContainer';

// MUI Icons
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DownArrowIcon from '@material-ui/icons/KeyboardArrowDown';
import { shoutoutOutgoing } from '../../../lib/rxSubject';
import { getCognitoToken } from '../../../services/userCognitoAWS';
import fileUploaderAWS from '../../../lib/UploadAWS/uploadAWS';
import Wrapper from '../../../hoc/Wrapper';
import { drawerToast } from '../../../lib/global/loader';
import { sendMail } from '../../../lib/global/routeAuth';
import { CoinPrice } from '../../ui/CoinPrice';
import { purchaseSuccessFromWallet } from '../../../redux/actions/wallet';
import { handleContextMenu } from '../../../lib/helper';
import Button from '../../button/button';

const Avatar = dynamic(() => import("@material-ui/core/Avatar"), { ssr: false });
const FigureCloudinayImage = dynamic(() => import("../../../components/cloudinayImage/cloudinaryImage"), { ssr: false });
const PlaceholerComponent = dynamic(() => import("../../../containers/post/shoutoutVideoUploader"), { ssr: false });
const Switch = dynamic(() => import("../../../components/formControl/switch"), { ssr: false });

function ShoutoutForm(props) {
  const theme = useTheme();
  const params = useRouter();
  const [mobileView] = isMobile();
  const dispatch = useDispatch();
  const [pg] = usePg();
  const [lang] = useLang();
  const [profile] = useProfileData();
  const reduxData = useReduxData(["defaultAddress", "defaultCard"]);
  const userId = getCookiees("uid");

  const [otherProfile, setOtherProfile] = useState(props.profile);
  const [isthumbnailHas, setIsThumbnailHas] = useState(true);
  const [otherFieldText, setOtherFieldText] = useState("");
  const [file, setFile] = useState(null);
  const [isVideo, setIsVideo] = useState(false)
  const [isHide, setIsHide] = useState(false)
  const [allAttribute, setAllAttribute] = useState([])
  const [staticBookingFor, setStaticBookingFor] = useState("")
  const [localVideo, setLocalVideo] = useState(false)
  const [attributePayload, setAttributePayload] = useState({})
  const videoSelect = useRef(null);
  const fileObject = useRef([]);

  const [formData, setFormData] = useState([])

  useEffect(() => {
    setOtherProfile(props.profile);
    getShoutoutAttrAPI()
  }, [])

  useEffect(() => {
    if (file) {
      validatePosting()
    }
  }, [file])

  const getShoutoutAttrAPI = async () => {
    try {
      const res = await getShoutoutReqAttr()
      setAllAttribute(res?.data?.data);
    } catch (err) {
      console.error("ERROR IN getShoutoutAttrAPI", err);
    }
  }

  const handleGetAddress = () => {
    dispatch(getAddress({ loader: true }));
  };


  const validatePosting = () => {
    let btnBool = false;
    let boolArray = [];
    let manadatory = allAttribute.filter(data => data.isMandatory);
    if (attributePayload["Video"]?.Video?.filesObject) {
      attributePayload["Video"]?.Video?.filesObject && isthumbnailHas ? boolArray.push(true) : boolArray.push(false);
    }
    // dynamic field validation
    manadatory.map((attr, index) => {
      if (attributePayload[attr.attributeName]?.value || (attributePayload[attr.attributeName]?.Video?.filesObject && isthumbnailHas)) { //|| attributePayload[attr.attributeName]?.Video?.filesObject
        boolArray.push(true)
      } else {
        boolArray.push(false)
      }
    });

    return boolArray.findIndex(data => data === false) > -1 ? false : true
  };

  const remove = (e) => {
    e && e.stopPropagation();
    fileObject.current = [];
    setLocalVideo(false)
    attributePayload["Video"] = null;
    setFile(null);
  };

  const changeThumbanail = (thumb, index) => {
    setFile((prevState) => {
      return {
        ...prevState,
        selectedThumb: index,
        files: thumb,
      };
    });
    thumb && setIsThumbnailHas(true);

    fileObject.current[0] = {
      ...fileObject.current[0],
      files: thumb,
    };
    mobileView ? close_drawer("thumbSelectore") : close_dialog();
  };

  const onVideoSelect = async (e, attribute) => {
    const file = e && e.target.files;
    startLoader();
    if (file && file[0]) {
      const url = URL.createObjectURL(file[0]);
      if (file[0].type.includes("image")) {

        setFile({
          seqId: 1,
          filesObject: file[0],
          attributeId: attribute._id,
          attributeName: attribute.attributeName,
          type: attribute.type,
          files: url,
        });

        setAttributePayload(prev => ({
          ...prev, [attribute.attributeName]: {
            attributeId: attribute._id,
            attributeName: attribute.attributeName,
            type: attribute.type,
            isImage: true
          }
        }))
        stopLoader();
        return
      }
      const video = document.createElement("video");
      video.src = url;
      try {
        await fileCallbackToPromise(video);
        await generaeVideThumb(file[0], (thumbs) => {
          stopLoader();
          thumbs.length > 0 ? setIsThumbnailHas(true) : setIsThumbnailHas(false);
          const fileObj = {
            seqId: 1,
            filesObject: file[0],
            files: typeof thumbs[0] != "undefined" && thumbs[0],
            selectedThumb: 0,
            thumb: thumbs,
            videoDuration: video.duration || 60,
            attributeId: attribute._id,
            attributeName: attribute.attributeName,
            type: attribute.type,
          };

          let videofield = {
            attributeName: attribute?.attributeName,
            type: attribute?.type,
            _id: attribute?._id,
            Video: fileObj,
          };
          handleAttributValue(videofield)
          setFile(fileObj);
          fileObject.current = [
            {
              seqId: 1,
              filesObject: file[0],
              files:
                typeof thumbs[0] != "undefined" && thumbs[0],
              thumb: thumbs,
              videoDuration: video.duration || 10
            },
          ];
        }, video.videoWidth, video.videoHeight);
      } catch (e) {
        Toast(lang.selectCoverImage, "info");
        stopLoader();
        setIsThumbnailHas(false);
        const fileObj = {
          seqId: 1,
          filesObject: file[0],
          files: null,
          selectedThumb: 0,
          thumb: [],
          videoDuration: video.duration || 60,
          attributeId: attribute._id,
          attributeName: attribute.attributeName,
          type: attribute.type,
        };

        let videofield = {
          attributeName: attribute?.attributeName,
          type: attribute?.type,
          _id: attribute?._id,
          Video: fileObj,
        };
        handleAttributValue(videofield)
        setFile(fileObj);
        fileObject.current = [
          {
            seqId: 1,
            filesObject: file[0],
            files: null,
            thumb: [],
            videoDuration: video.duration || 10
          },
        ];
      }
    }
  }

  const fileCallbackToPromise = (fileObj) => {
    return Promise.race([
      new Promise((resolve) => {
        if (fileObj instanceof HTMLImageElement) fileObj.onload = resolve;
        else fileObj.onloadedmetadata = resolve;
      }),
      new Promise((_, reject) => {
        setTimeout(reject, 1000);
      }),
    ]);
  };

  const isShoutoutEnabledApi = () => {
    isShoutoutEnabled(otherProfile?._id).then((res) => {
      handlePaymentCards()
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
          isMobile: mobileView ? true : false,
        });
      }
    })
  }
  const handlePaymentCards = () => {
    open_drawer("purchaseConfirmWallet", {
      title: lang.almostDone,
      description: <div ><span className="d-flex fntSz14"> {`${lang.confirmShoutoutMob} `}
        <span className=""><CoinPrice price={props?.profile?.shoutoutPrice?.price} showCoinText={true} size={14} /></span>
      </span></div>,
      descriptionTwo: `from ${props.profile.username || ""}`,
      checkout: uploadVdo,
      closeAll: true,
      price: props?.profile?.shoutoutPrice?.price,
      handlePaymentUsingWallet: true,
      button: lang.confirm
    },
      "bottom"
    );
  }

  const uploadVdo = async (...args) => {
    const videoAttr = allAttribute.filter((field, index) => {
      return field.attributeName == "Video";
    });
    const isImageUpload = attributePayload?.Video?.isImage
    const isVideoFieldReq = videoAttr[0].isMandatory;

    try {
      startLoader();
      const cognitoToken = await getCognitoToken();
      const tokenData = cognitoToken?.data?.data;
      const fileVideoName = `${userId}_${Date.now()}_video`;
      const fileThumbName = `${userId}_${Date.now()}${isImageUpload ? "" : "_thumb"}`;
      const folderVideo = `${userId}/${env.FOLDER_NAME_IMAGES.shoutOut}`;
      const folderThumb = `${userId}/${env.FOLDER_NAME_IMAGES.shoutOut}`;
      // Uploading Video To AWS
      if (file || isVideoFieldReq) {
        // Uploading Video To AWS
        let url = await fileUploaderAWS(file?.filesObject, tokenData, fileVideoName, false, folderVideo, false, 'no', true, null, false);

        var postImage = {
          seqId: 1,
          type: 2,
          url: url,
        };
        let finalPayload = {
          ...attributePayload,
        };

        if (isImageUpload) {
          const thumb = await fileUploaderAWS(file.filesObject, tokenData, fileThumbName, false, folderThumb, false);
          postImage["thumbnail"] = thumb;
          finalPayload["Video"].value = postImage.thumbnail;
          finalPayload["Video"].imageUrl = postImage.thumbnail;
        } else {
          url = await fileUploaderAWS(attributePayload?.Video?.Video?.filesObject, tokenData, fileVideoName, false, folderVideo, false, 'no', true, null, false);
          // Thumb Uploading
          const thumb = await fileUploaderAWS(attributePayload?.Video?.Video?.files, tokenData, fileThumbName, false, folderThumb, true);
          postImage["thumbnail"] = thumb;
          finalPayload["Video"].value = url;
          finalPayload["Video"].thumbnail = postImage.thumbnail;
          delete finalPayload["Video"].Video;
        }
        stopLoader();
      }
      shoutOutRequest(...args);

    } catch (err) {
      console.error("ERROR IN uploadVdo", err);
      stopLoader();
      Toast("ERROR IN uploadVdo", "error")
    }
  }

  const shoutOutRequest = async (...args) => {
    const attributFinal = Object.values(attributePayload);

    attributFinal?.map((attr, index) => {
      if (attr?.value == "Others") {
        attr["value"] = attr?.otherTextValue;
      }
      delete attr["otherTextValue"]
    })

    startLoader();
    try {
      let payload = {
        creatorId: otherProfile?._id,
        orderType: "VIDEO_SHOUTOUT",
        allowProfileView: isHide,
        attribute: Object.values(attributFinal),
        requestedFor: props?.thirdUserProfile?._id || profile?._id,
        bookingFor: props?.thirdUserProfile || profile?._id
      }

      // API CALL
      const res = await postReqCreator(payload);
      // close_drawer();
      dispatch(purchaseSuccessFromWallet(+props?.profile?.shoutoutPrice?.price))
      stopLoader();
      if (res?.data) {
        shoutoutOutgoing.next({
          shoutoutOrderId: "",
          shoutoutUserId: props?.thirdUserProfile?._id || profile?._id,
          shoutoutBookingForId: otherProfile?._id,
          status: "REQUESTED"
        });
      }
      mobileView ? open_drawer("successPayment", { successMessage: lang.orderPlacedSuccessfully }, "bottom") : open_dialog("successPayment", { successMessage: lang.orderPlacedSuccessfully })
      setTimeout(() => {
        close_drawer();
        params.push("/virtual-request")
      }, 4000)
    } catch (err) {
      stopLoader();
      console.error("ERROR IN shoutOutRequest", err)
      Toast(lang.errorMsg, "error");
    }
  }

  const handleDynamicText = (currAttribute) => {
    let filterOp = formData.filter(val => currAttribute._id == val.attributeId)
    const output = attributePayload[currAttribute?.attributeName]?.value == "Others" ? otherFieldText : attributePayload[currAttribute?.attributeName]?.value
    return output
  }

  const handleAttributValue = (attribute, selectedValue, OtherTextValue = "") => {
    let payload = { ...attributePayload };
    let obj = {};

    if (attribute?.attributeName == "Video") {
      obj = {
        attributeName: attribute?.attributeName,
        type: attribute?.type,
        attributeId: attribute?._id,
        value: selectedValue || "",
        Video: { ...attribute.Video },
      }
    } else {
      selectedValue == "Others" && setOtherFieldText(OtherTextValue);

      obj = {
        attributeId: attribute?._id,
        attributeName: attribute?.attributeName,
        type: attribute?.type,
        value: selectedValue,
        otherTextValue: OtherTextValue
      }
    }
    payload[attribute?.attributeName] = obj;
    setAttributePayload(payload);
  }
  const radioBtnJsx = (attribute) => {
    let singleVal = formData.filter(val => attribute._id == val.attributeId)
    let newFormData = formData.filter(val => attribute._id != val.attributeId)
    open_drawer(
      "ShoutoutFormOccasion", {
      occasion: attributePayload[attribute?.attributeName],
      radioBttons: attribute.value,
      heading: attribute.attributeName,
      setMyVal: (value, isOtherText) => handleAttributValue(attribute, value, isOtherText),

    }, "right"
    )
  }

  const checkBoxJsx = (attribute) => {
    let singleVal = formData.filter(val => attribute._id == val.attributeId)
    let newFormData = formData.filter(val => attribute._id != val.attributeId)
    open_drawer(
      "ShoutoutFormCheckbox", {
      selectedVal: attributePayload[attribute?.attributeName]?.value,
      checkboxVal: attribute.value,
      heading: attribute.attributeName,
      setMyVal: (value) => handleAttributValue(attribute, value),
    }, "right"
    )
  }

  const txtBoxJsx = (attribute) => {
    let singleVal = formData.filter(val => attribute._id == val.attributeId)
    let newFormData = formData.filter(val => attribute._id != val.attributeId)

    open_drawer("ShoutoutFormInstruction", {
      instruction: attributePayload[attribute?.attributeName]?.value,
      heading: lang.shoutOutRequest,
      labelHeading: attribute.attributeName,
      setMyVal: (value) => handleAttributValue(attribute, value),
    },
      "right"
    )
  }

  const howItWorksDrawer = () => {
    open_drawer(
      "howItWorksDrawer", {
      title: lang.howDoesItWorks,
      subtitle: `${lang.howDoesItWorksSubtitle} ${config.APP_NAME.toLowerCase()} shoutout?`,
    }, "bottom");
  }

  const staticTextBox = () => {
    open_drawer(
      "ShoutoutFormInstructionStaticField", {
      heading: "Booking For",
      isStaticField: true,
      handleBookingForField: handleBookingForField,
      staticBookingFor: staticBookingFor
    }, "right");
  }

  const handleBookingForField = (value) => {
    setStaticBookingFor(value)
  }

  const formInputs = () => {
    return allAttribute?.map((attribute) => {
      switch (attribute.type) {
        case "RADIO_BUTTON":
          return <div
            key={attribute._id}
            className="m-2 d-flex justify-content-center"
          >
            <div
              className="py-1 row m-0 radius_8 w-100"
              style={{ backgroundColor: theme.dialogSectionBg }}
              onClick={() => radioBtnJsx(attribute)}
            >
              <div className="col-10 px-2 py-1 m-0">
                <p className="mb-2 bold fntSz14 appTextColor">
                  {`${attribute.attributeName + (attribute.isMandatory ? " *" : "")}`}
                </p>
                <p className="mb-2 fntSz14 light_app_text">
                  {handleDynamicText(attribute) || lang.radioBtnTxt}
                </p>
              </div>
              <div className="col-2 text-center m-auto m-0 p-0">
                <ArrowForwardIosIcon style={{ color: `${theme?.text}`, fontSize: '16px' }} />
              </div>
            </div>
          </div>

        case "CHECK_BOX":
          return <div
            key={attribute._id}
            className="m-2 d-flex justify-content-center rounded"
            style={{ borderRadius: '3px', background: theme.sectionBackground }}>
            <div className="py-1 row m-0 radius_8 w-100"
              style={{ backgroundColor: theme.dialogSectionBg }}
              onClick={() => checkBoxJsx(attribute)}>
              <div className="col-10 px-2 py-1 m-0">
                <p className="mb-2 bold appTextColor fntSz14">
                  {attribute.attributeName}
                </p>
                <p className="mb-2 fntSz14 light_app_text">
                  {attribute.attributeName}
                </p>
              </div>
              <div className="col-2 text-center m-auto m-0 p-0">
                <ArrowForwardIosIcon style={{ color: `${theme?.text}`, fontSize: '16px' }} />
              </div>
            </div>
          </div>

        case "TEXT_BOX": case "TEXT_AREA":
          return <div
            className="m-2 d-flex justify-content-center rounded" key={attribute._id}
            style={{ borderRadius: '3px' }}
          >
            <div
              className="py-1 row m-0 radius_8 w-100"
              style={{ backgroundColor: theme.dialogSectionBg }}
              onClick={() => txtBoxJsx(attribute)}>
              <div className="col-10 px-2 py-1 m-0">
                <p className="mb-2 bold appTextColor fntSz14">
                  {attribute.attributeName} <span style={{ color: "red" }}>{`${attribute.isMandatory ? "*" : ""}`}</span>
                </p>
                <p className="mb-2 fntSz14 light_app_text">
                  {handleDynamicText(attribute) || lang.shoutOutPlaceholder}
                </p>
              </div>
              <div className="col-2 text-center m-auto m-0 p-0">
                <ArrowForwardIosIcon style={{ color: `${theme?.text}`, fontSize: '16px' }} />
              </div>
            </div>
          </div>

        case "VIDEO_UPLOAD":
          return <div
            className="m-2 d-flex justify-content-center rounded" key={attribute._id}
            style={{ borderRadius: '3px' }}>
            <div
              className="py-1 row m-0 radius_8 w-100"
              style={{ backgroundColor: theme.dialogSectionBg }}
            >
              <div className="col-10 px-2 py-1 m-0" onClick={() => setIsVideo(!isVideo)}>
                <p className="mb-2 bold appTextColor fntSz14">{attribute.attributeName} <span style={{ color: "red" }}>{`${attribute.isMandatory ? "*" : ""}`}</span></p>
                {file ? "" : (
                  <p className="mb-2 fntSz14 light_app_text">
                    Attach a short video
                  </p>
                )}
              </div>
              <div className="col-2 text-center m-auto m-0 p-0" onClick={() => setIsVideo(!isVideo)}>
                {isVideo ? (
                  <DownArrowIcon style={{ color: theme.text }} />
                ) : (
                  <ArrowForwardIosIcon style={{ color: theme.text, fontSize: '16px' }} />
                )}
              </div>
              <div style={{ display: `${isVideo ? 'flex' : 'none'}` }} className="pl-2">
                {file ? (
                  <div className='d-flex ml-0 rounded'>
                    <VideoContainer
                      defaultImage={[file]}
                      onChange={(e) => onVideoSelect(e, attribute)}
                      remove={remove}
                      shoutoutForm={true}
                      changeThumbanail={changeThumbanail}
                      width="100px"
                      className="imgStyleShoutout"
                      height="100px"
                      file={file} />
                  </div>
                ) : (
                  <div
                    onClick={() => videoSelect.current.click()}
                    className="grid-container rounded">
                    <PlaceholerComponent width="100px" height="100px" />
                  </div>
                )}
                <input
                  style={{ display: "none" }}
                  type="file"
                  accept={"video/mp4,video/x-m4v,video/*,image/*"}
                  ref={(el) => {
                    videoSelect.current = el
                  }}
                  onChange={(e) => onVideoSelect(e, attribute)}
                />
              </div>
              {!isthumbnailHas && <div className="pt-1 pl-2" style={{ color: theme?.appColor }}>{lang.thumbnailMsg}</div>}
              <div className="font-weight-500 light_app_text fntSz13 pt-2 pl-2">{lang.videoUplaodLimit}</div>
            </div>
          </div>

        default:
          break;
      }
    })
  }


  const profilePicture = props?.isThirdUser ? (props?.thirdUserProfile?.profilePic || config.BANNER_PLACEHOLDER_IMAGE) : profile?.profilePic;
  const firstName = props?.isThirdUser ? props?.thirdUserProfile : profile?.firstName;
  const lastName = props?.isThirdUser ? "" : profile?.lastName;

  return (
    <Wrapper>
      <Head>
        <script defer={true} src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" />
      </Head>
      <div>
        {mobileView
          ? <div className='d-flex flex-column justify-content-between pb-70 card_bg'>
            <div>
              <Header title={lang.shoutOutRequest} back={() => backNavMenu(props)} icon={config.backArrow} />
              <div className='d-flex justify-content-around px-2' style={{ marginTop: "70px" }}>
                <div className='d-flex flex-column align-items-center mt-3 text-center callout-none' onContextMenu={handleContextMenu}>
                  {otherProfile.profilePic ? (
                    <FigureCloudinayImage
                      publicId={otherProfile.profilePic}
                      width={70}
                      ratio={1}
                      className="mv_profile_logo mb-1"
                    />
                  ) : (
                    <Avatar className="mv_profile_logo mb-1  solid_circle_border">
                      {otherProfile && otherProfile.firstName && otherProfile.lastName && (
                        <span className="initials">
                          {otherProfile.firstName[0] + otherProfile.lastName[0]}
                        </span>
                      )}
                    </Avatar>
                  )}
                  <p className='d-flex flex-column align-items-center'>
                    <span className='mb-1 bold' style={{ textTransform: 'capitalize', fontSize: '3.5vw', color: `${theme?.text}` }}>{otherProfile.fullName}</span>
                    <span className="bold"><CoinPrice price={props?.profile?.shoutoutPrice?.price} showCoinText={false} size={14} /></span>
                  </p>
                </div>
                <div className='d-flex flex-column align-items-center mt-3 callout-none' onContextMenu={handleContextMenu}>
                  {profilePicture ? (
                    <FigureCloudinayImage
                      publicId={profilePicture}
                      width={70}
                      ratio={1}
                      className="mv_profile_logo mb-1"
                    />
                  ) : (
                    <Avatar className="mv_profile_logo mb-1  solid_circle_border">
                      {firstName && lastName && (
                        <span className="initials">
                          {firstName[0] + lastName[0]}
                        </span>
                      )}
                    </Avatar>
                  )}
                  <p className='d-flex flex-column align-items-center'>
                    <span className='mb-1 bold' style={{ textTransform: 'capitalize', fontSize: '3.5vw', color: `${theme?.text}` }}>
                      {`${firstName} ${lastName}`}
                    </span>
                    <span className='bold' style={{ fontSize: '4.5vw', color: `${theme?.appColor}` }} onClick={() => close_drawer("ShoutoutForm")}>
                      {lang.edit}
                    </span>
                  </p>
                </div>
              </div>

              {formInputs()}

              <div className="my-4 d-flex justify-content-center pr-3">
                <div className="col-10 pl-0">
                  <p className="m-0 bold fntSz14 text-capitalize text-app">
                    {`${lang.displayShoutoutMsg} ${props.profile.username}'s ${lang.profile}`}
                  </p>
                </div>
                <Switch onChange={() => setIsHide(!isHide)} />
              </div>
            </div>
            <div className='shoutout__footer strong_app_text'>
              <span onClick={() => howItWorksDrawer()}>
                <InfoOutlinedIcon className="mr-1 mb-1 fntSz15" />
                {lang.howItWorks}
              </span>
              <div
                style={{ opacity: "1", position: "fixed", background: "white", width: '100%', textAlign: 'center', margin: 'auto', bottom: 0 }}
                className="card_bg p-3"
              >
                <Button
                  type="submit"
                  fclassname="btnGradient_bg rounded-pill py-2"
                  onClick={() => isShoutoutEnabledApi()}
                  disabled={!validatePosting()}
                >
                  {lang.shoutout + ' for'}
                  <span className="bold"><CoinPrice price={props?.profile?.shoutoutPrice?.price} showCoinText={false} size={14} /></span>
                </Button>
              </div>
            </div>
          </div>
          : ""
        }
        <style jsx>
          {`

          :global(.MuiDrawer-paper){
            overflow-y: auto !important;
          }
          :global(.coinprice){
            margin-left:0.25rem !important;
          }
          .shoutout__footer {
          font-size: 3.5vw;
          font-weight: 500;
          color: #868383;
          display: flex;
          align-items: center;
          justify-content: center;
      }`}
        </style>
      </div>
    </Wrapper>
  )
}


export default ShoutoutForm
