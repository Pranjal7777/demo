import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import { useTheme } from "react-jss";
import { TextField } from "@material-ui/core";
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/core/styles';

import useLang from "../hooks/language";
import isMobile from "../hooks/isMobile";
import { getProfile, updateProfile } from "../services/auth";
import { getCookie } from "../lib/session";
import { close_dialog, close_drawer, open_dialog, startLoader, stopLoader, Toast } from "../lib/global";
import { autoMessageplaceholder, } from "../lib/config";
import Wrapper from "../hoc/Wrapper";
import Button from "../components/button/button";
import Header from "../components/header/header";
import Icon from "../components/image/icon";
import Image from "../components/image/image";
import { changeCrmSetting } from "../redux/actions/crmChange";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import { setProfile, updateReduxProfile } from "../redux/actions";
import { isAgency } from "../lib/config/creds";
import { open_drawer } from "../lib/global/loader";
import { s3ImageLinkGen } from "../lib/UploadAWS/s3ImageLinkGen";
import RouterContext from "../context/RouterContext";

const Switch = dynamic(() => import("../components/formControl/switch"), { ssr: false });

// CRM constants
// const follow = "followMessage";
// const post = "postPurchase";
// const subscription = "subscriptionPurchase";
// const allowOption = "allowFreeMessage";

const useStyles = makeStyles((theme) => ({
  notchedOutline: {
    borderColor: `var(--l_border)`,
    borderRadius: "12px",
  },
  customLabel: {
    color: 'var(--l_app_text)', // Replace with your desired label color
    '&.Mui-focused': {
      color: 'var(--l_base)', // Replace with your desired focused label color
    },
  },
  textFieldRoot: {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: 'var(--l_border)', // Replace with your hover color
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--l_border)', // Replace with your focus color
      },
    },
  }
}));

const AutoMessage = (props) => {
  const [lang] = useLang();
  const theme = useTheme();
  const [mobileView] = isMobile();
  const dispatch = useDispatch();
  const classes = useStyles();
  const selectedCreatorId = useSelector((state) => state?.selectedCreator.creatorId);

  // follow message media assets
  const fileSelectFollow = useRef(null);
  const videoSelectFollow = useRef(null);
  const fileObject = useRef([]);


  // mediaType 1 => Image
  // mediaType 2 => Video
  // mediaType 3 => Text
  const InitialCRMPayload = {
    followMessage: {
      isEnable: false,
      type: "",
      text: "",
      url: "",
      thumbnail: "",
      msgLabel: lang.welcomeMsgFollow,
      fieldImageRef: fileSelectFollow,
      fieldVideoRef: videoSelectFollow,
      file: {},
      mediaType: 3,
      label: "Follow Message",
      charLength: 0,
    },
    postPurchase: {
      isEnable: false,
      type: "",
      text: "",
      url: "",
      thumbnail: "",
      msgLabel: lang.thankYouMsg,
      fieldImageRef: fileSelectFollow,
      fieldVideoRef: videoSelectFollow,
      file: {},
      mediaType: 3,
      label: "Post Purchase",
      charLength: 0,
    },
    subscriptionPurchase: {
      isEnable: false,
      type: "",
      text: "",
      url: "",
      thumbnail: "",
      msgLabel: lang.thankYouSubscription,
      fieldImageRef: fileSelectFollow,
      fieldVideoRef: videoSelectFollow,
      file: {},
      mediaType: 3,
      label: "Subscription Purchase",
      charLength: 0,
    },
    // [allowOption]: {
    //   allowFreeMessage: true,
    //   msgLabel: lang.sendMsgFree,
    // },
  };



  let crmPayloadInitial = React.useRef(null);

  const [crmPayload, setCrmPayload] = useState(InitialCRMPayload);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [isBtnEnable, setIsBtnEnable] = useState(true);

  const selectedData = useSelector((state) => state?.profileData?.userPreference);
  const S3_IMG_LINK_NON_URL = useSelector((state) => state?.appConfig?.baseUrl);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  useEffect(() => {
    if (documentUploaded) {
      crmAPIFunction();
      setDocumentUploaded(false);
    }
  }, [documentUploaded]);

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport.height < window.innerHeight) {
        setIsBtnEnable(false);
      } else {
        setIsBtnEnable(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    fecthProfileDetails();
  }, [])
  const fecthProfileDetails = async () => {
    console.log('Calling Profile API to Refresh Data::');
    const uid = isAgency() ? selectedCreatorId : getCookie("uid");
    const res = await getProfile(uid, getCookie("token"), getCookie('selectedCreatorId'));
    dispatch(setProfile({ ...res?.data?.data })
    );
  };

  const crmAPIFunction = async () => {
    startLoader();
    try {
      const payload = {};

      for (let keyName in crmPayload) {
        if (crmPayload[keyName].isEnable) {
          if (crmPayload[keyName].mediaType == 1) {
            payload[keyName] = {
              isEnable: crmPayload[keyName].isEnable,
              url: crmPayload[keyName].url,
              type: "IMAGE",
            }
          }
          if (crmPayload[keyName].mediaType == 2) {
            payload[keyName] = {
              isEnable: crmPayload[keyName].isEnable,
              url: crmPayload[keyName].url,
              thumbnail: crmPayload[keyName].thumbnail,
              type: "VIDEO",
            }
          }
          if (crmPayload[keyName].mediaType == 3) {
            payload[keyName] = {
              isEnable: crmPayload[keyName].isEnable,
              type: "TEXT",
            }
          }

          if (crmPayload[keyName].charLength > 0) {
            payload[keyName].text = crmPayload[keyName].text;
          }
        } else {
          payload[keyName] = {
            isEnable: false,
          }
          if (crmPayload[keyName].url) {
            payload[keyName] = {
              ...payload[keyName],
              // url: crmPayload[keyName].url,
              url: "",
              type: "IMAGE",
            }
          }
          if (crmPayload[keyName]?.thumbnail) {
            payload[keyName] = {
              ...payload[keyName],
              thumbnail: "",
              // thumbnail: crmPayload[keyName]?.thumbnail,
              type: "VIDEO",
            }
          }
          if (crmPayload[keyName]?.text.length > 0) {
            payload[keyName] = {
              ...payload[keyName],
              type: "TEXT",

            }
          }
        }
      }
      if (isAgency()) {
        payload["userId"] = selectedCreatorId;
      }

      const response = await updateProfile(payload);

      Toast(response?.data?.message, "success");
      dispatch(updateReduxProfile(payload));
      dispatch(changeCrmSetting(payload));
      stopLoader();

    } catch (e) {
      console.error("Error in crmAPIFunction", e);
      Toast(e.response?.data?.message || lang.somethingWrong, "error");
      stopLoader();
    }
  }

  const handleChange = (e) => {
    let payload = { ...crmPayload };

    payload.followMessage = {
      ...payload.followMessage,
      isEnable: selectedData?.followMessage?.isEnable || false,
      text: selectedData?.followMessage?.text || "",
      file: {},
      url: selectedData?.followMessage?.url || "",
      mediaType: selectedData?.followMessage?.type == "IMAGE" ? 1 : selectedData?.followMessage?.type == "VIDEO" ? 2 : 3,
      thumbnail: selectedData?.followMessage?.thumbnail || "",
      isUrlAvailable: selectedData?.followMessage?.url ? true : false,
      charLength: selectedData?.followMessage?.text?.length || 0,
    }

    payload.postPurchase = {
      ...payload.postPurchase,
      isEnable: selectedData?.postPurchase?.isEnable || false,
      text: selectedData?.postPurchase?.text || "",
      file: {},
      url: selectedData?.postPurchase?.url || "",
      mediaType: selectedData?.postPurchase?.type == "IMAGE" ? 1 : selectedData?.postPurchase?.type == "VIDEO" ? 2 : 3,
      thumbnail: selectedData?.postPurchase?.thumbnail || "",
      isUrlAvailable: selectedData?.postPurchase?.url ? true : false,
      charLength: selectedData?.postPurchase?.text?.length || 0,
    }

    payload.subscriptionPurchase = {
      ...payload.subscriptionPurchase,
      isEnable: selectedData?.subscriptionPurchase?.isEnable || false,
      text: selectedData?.subscriptionPurchase?.text || "",
      file: {},
      url: selectedData?.subscriptionPurchase?.url || "",
      mediaType: selectedData?.subscriptionPurchase?.type == "IMAGE" ? 1 : selectedData?.subscriptionPurchase?.type == "VIDEO" ? 2 : 3,
      thumbnail: selectedData?.subscriptionPurchase?.thumbnail || "",
      isUrlAvailable: selectedData?.subscriptionPurchase?.url ? true : false,
      charLength: selectedData?.subscriptionPurchase?.text?.length || 0,
    }

    crmPayloadInitial.current = cloneDeep(payload);

    setCrmPayload(payload);
  };

  useEffect(() => {
    handleChange();
    console.log("selected dataaa", selectedData)
  }, [selectedData]);

  const handelAPIPayload = (value, keyName) => {
    setCrmPayload({
      ...crmPayload,
      [keyName]: {
        ...crmPayload[keyName],
        text: value,
        charLength: value.length
      },
    });
  };

  const backNavMenu = () => {
    close_drawer("auto_message");
    Router.push('/');
  };


  const handleAutoMessageAPI = async () => {
    try {
      startLoader();
      setDocumentUploaded(true);
      stopLoader();

    } catch (e) {
      console.error("Error in handleAutoMessageAPI", e);
      Toast(lang.somethingWrong, "error");
      stopLoader();
    }
  };

  const handleUploadSuccess = (files, keyName) => {
    console.log(files);
    if (files.length > 0) {
      setCrmPayload(prev => ({
        ...prev,
        [keyName]: {
          ...prev[keyName],
          url: files[0].file,
          isUrlAvailable: true,
          thumbnail: (files[0]?.thumb || files[0]?.preview),
          mediaType: files[0].type === 'VIDEO' ? 2 : 1
        },
      }));
      close_dialog("S3Uploader")
    }
  }
  const SelectType = (keyName) => {
    {
      mobileView ? open_drawer(
        "AttachVaultMedia",
        {
          currenStep: 2,
          selectedFiles: (files) => handleUploadSuccess(files, keyName),
          targetId: "s3Upload",
          fileTypeVideo: false,
          isTransForm: false,
          folderName: "crmMedia",
        },
        "bottom"
      ) :
        open_dialog(
          "AttachVaultMedia",
          {
            currenStep: 2,
            selectedFiles: (files) => handleUploadSuccess(files, keyName),
            targetId: "s3Upload",
            fileTypeVideo: false,
            isTransForm: false,
            folderName: "crmMedia",
          }
        )
    }
  };

  const remove = (e, keyName) => {
    e && e.stopPropagation();
    setCrmPayload({
      ...crmPayload,
      [keyName]: {
        ...crmPayload[keyName],
        file: {},
        url: "",
        thumbnail: "",
        isUrlAvailable: false,
        mediaType: 3
      },
    });
    // handelBtnValidation();
    fileObject.current = [];
  };



  const handleToggle = (keyName) => {
    let copyPayload = { ...crmPayload };

    Object.keys(copyPayload)?.length > 0 &&
      Object.keys(copyPayload).filter((key) => {
        if (keyName === key) {
          copyPayload[key].isEnable = !copyPayload[key].isEnable
        }
      });
    setCrmPayload({ ...copyPayload });
  };

  const btnInitialCheck = () => {
    return isEqual(crmPayloadInitial.current, crmPayload)
  }

  const crmFollowMessageVerify = () => {
    return crmPayload.followMessage.isEnable && !((Object.keys(crmPayload.followMessage.file).length || crmPayload.followMessage.isUrlAvailable) || crmPayload.followMessage.charLength >= 20 || !crmPayload.followMessage.charLength && crmPayload.isEnable);
  };

  const crmPostPurchaseVerify = () => {
    return crmPayload.postPurchase.isEnable && !((Object.keys(crmPayload.postPurchase.file).length || crmPayload.postPurchase.isUrlAvailable) || crmPayload.postPurchase.charLength >= 20);
  };

  const crmSubscriptionPurchaseVerify = () => {
    return crmPayload.subscriptionPurchase.isEnable && !((Object.keys(crmPayload.subscriptionPurchase.file).length || crmPayload.subscriptionPurchase.isUrlAvailable) || crmPayload.subscriptionPurchase.charLength >= 20);
  };

  const getImgUrl = (imgUrl) => {
    let vaultUpload = (imgUrl).includes("vaultMedia")
    if (vaultUpload) {
      return s3ImageLinkGen(S3_IMG_LINK, imgUrl, 80, 300, 300);
    } else {
      return S3_IMG_LINK_NON_URL + '/' + imgUrl;
    }
  }

  const getVideoUrl = (imgUrl) => {
    let vaultUpload = (imgUrl).includes("http")
    if (vaultUpload) {
      return imgUrl;
    } else {
      return S3_IMG_LINK + '/' + imgUrl;
    }
  }

  return (
    <RouterContext forLogin={true} forUser={false} forCreator={true} forAgency={true} {...props}>
      <Wrapper>
        <Head>
          <script defer={true} src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" />
        </Head>

        <div
          className={`${mobileView ? "pt-5 overflow-auto dynamicHeight text-white" : "vh-100"} `}
          style={{ background: theme.d_drawer_bg }}
        >
          {mobileView
            ? <div className="p-3">
              <Header back={() => backNavMenu()} title={lang.crmAutomation} />
            </div>
            : <div className="d-flex py-3 px-0 align-items-center justify-content-between myAccount_sticky__section_header">
              <p className="font-weight-700 fntSz20 mb-0 sectionHeading">
                {lang.crmAutomation}
              </p>
              <div className="">
                <Button
                  fclassname="gradient_bg rounded-pill py-2 px-4"
                  isDisabled={btnInitialCheck() || crmFollowMessageVerify() || crmPostPurchaseVerify() || crmSubscriptionPurchaseVerify()}
                  onClick={handleAutoMessageAPI}
                >
                  {lang.save}
                </Button>
              </div>
            </div>
          }

          <div className={`${mobileView ? "px-2" : ""}`}>
            {Object.keys(crmPayload).length > 0 &&
              Object.keys(crmPayload).map((keyName) => (
                <div className="py-2">
                  <div className="d-flex align-items-center">
                    <h6 className="col m-0 px-0 appTextColor">
                      {crmPayload[keyName]?.msgLabel}
                    </h6>
                    <Switch
                      className="col-auto"
                      onChange={() => handleToggle(keyName)}
                      checked={crmPayload[keyName]?.isEnable}
                    />
                  </div>
                  {crmPayload[keyName]?.isEnable && (
                    <>
                      <div
                        className="borderStroke radius_12 d-flex position-relative mt-2 p-3 "
                      >
                        <div className="position-relative d-flex align-items-center">
                          {!crmPayload[keyName]?.isUrlAvailable && (
                            <div onClick={() => SelectType(keyName)}>
                              <Icon
                                icon={autoMessageplaceholder + "#addPlaceholder"}
                                width="100"
                                height="101"
                                color={theme.dialogSectionBg}
                                viewBox="0 0 100 100"
                                class="cursorPtr"
                              />
                            </div>
                          )}
                          {crmPayload[keyName]?.file?.files || crmPayload[keyName]?.url
                            ? crmPayload[keyName]?.mediaType == 1
                              ? <>
                                <div
                                  className="position-absolute cursorPtr rounded-circle d-flex bg-light border border-dark"
                                  style={{ bottom: "0", zIndex: "1", right: "0" }}
                                  onClick={(e) => remove(e, keyName)}
                                >
                                  <ClearIcon className="svgIconColor" fontSize="small" />
                                </div>
                                <Image
                                  src={crmPayload[keyName]?.url ? getImgUrl(crmPayload[keyName]?.url) : ""}
                                  errorImageLink={crmPayload[keyName]?.url}
                                  className="my-auto object-fit-cover crmImageContainer position-relative radius_12"
                                  alt={crmPayload[keyName].label}
                                />
                              </>
                              : crmPayload[keyName]?.thumbnail?.length > 0
                                ? <>
                                  <div
                                    className="position-absolute cursorPtr rounded-circle d-flex bg-light border border-dark"
                                    style={{ bottom: "0", zIndex: "1", right: "0" }}
                                    onClick={(e) => remove(e, keyName)}
                                  >
                                    <ClearIcon className="svgIconColor" fontSize="small" />
                                  </div>

                                  <Image
                                    src={getVideoUrl(crmPayload[keyName]?.thumbnail)}
                                    className="my-auto object-fit-cover crmImageContainer position-relative radius_12"
                                    alt={crmPayload[keyName]}
                                  />
                                </>
                                : ""
                            : ""
                          }
                        </div>
                        <div className={`mx-2 w-100 ${!crmPayload[keyName].url && "mt-1"}`}>
                          <TextField
                            rows={2}
                            label={crmPayload[keyName]?.label}
                            multiline
                            variant="outlined"
                            fullWidth
                            helperText={!crmPayload[keyName].file?.files ? crmPayload[keyName].charLength > 20 ? "" : crmPayload[keyName].url ? "" : `${crmPayload[keyName].charLength}/${lang.crmCharacterLimit}` : ""}
                            onChange={(e) => handelAPIPayload(e.target.value, keyName)}
                            value={crmPayload[keyName]?.text}
                            className={classes.textFieldRoot}
                            InputProps={{
                              classes: { notchedOutline: classes.notchedOutline }
                            }}
                            InputLabelProps={{
                              classes: {
                                root: classes.customLabel,
                              },
                            }}
                            error={!crmPayload[keyName].file?.files ? "" : crmPayload[keyName].charLength < 20}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )
              )}
          </div>

          {mobileView && (
            <div className="col-12 px-3 py-2 mobileSendBtn">
              {isBtnEnable &&
                <Button
                  fclassname="btnGradient_bg rounded-pill"
                  isDisabled={btnInitialCheck() || crmFollowMessageVerify() || crmPostPurchaseVerify() || crmSubscriptionPurchaseVerify()}
                  onClick={handleAutoMessageAPI}
                >
                  {lang.save}
                </Button>}
            </div>
          )}
        </div>

        <style jsx>{`
        .mobileSendBtn {
          position: fixed;
          background: var(--l_app_bg);
          right: 0;
          left: 0;
          bottom: 0;
          z-index: 1;
        }
        .cellBorder {
          border-bottom: 1px solid #c9c9c9;
        }
        :global(.cancelBtn) {
          left: ${mobileView ? "73" : "84"}px !important;
        }
        :global(.crmImageContainer) {
          width: 84px;
          height: 84px;
        }
        :global(.cover-pill-crm-mobile){
          background-color: var(--l_base);
          position: absolute;
          font-size: 0.5rem;
          left: 38px !important;
          bottom: 0px !important;
          padding: 4px 11px;
          border-radius: 200px;
          color: #fff;
        }
        :global(.svgIconColor) {
          fill: #000000;
        }
        :global(.MuiInputBase-root){
          color: var(--l_app_text);
        }
        :global(.MuiFormLabel-root){
          color: var(--l_app_text);
        }
        :global(.MuiFormHelperText-root){
          color: var(--l_app_text);
        }
        .dynamicHeight {
          height: calc(calc(var(--vhCustom, 1vh) * 100) - 60px) !important;
          }
      `}</style>
      </Wrapper>
    </RouterContext>
  );
};

export default AutoMessage;
