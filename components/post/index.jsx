import React, { useEffect, useRef, useState } from "react";
import Head from 'next/head';
import { creatorSearch, getPostById, posting, updatePost } from "../../services/assets";
import {
  defaultCurrency,
  defaultCurrencyCode,
  IMAGE_TYPE,
  CLOSE_ICON_BLACK,
  CLOSE_WHITE,
} from "../../lib/config";
import Router, { useRouter } from "next/router";
import {
  open_dialog,
  startLoader,
  stopLoader,
  close_dialog,
  close_drawer,
  updateModelCardPost
} from "../../lib/global/loader";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import { getCookie, getCookiees, removeCookie, setCookie } from "../../lib/session";
import { generaeVideThumb } from "../../lib/image-video-operation";
import { css } from "emotion";
import useLang from "../../hooks/language";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import { useDispatch, useSelector } from "react-redux"
import moment from "moment";
import { NumberValidator, ValidateTwoDecimalNumber } from "../../lib/validation/validation";
import { getPopularHashtagsAPI } from "../../services/hashtag";
import { Avatar } from "@material-ui/core";
import { PostPlaceHolder } from "./PostPlaceHolder";
import Button from "../button/button";
import S3Upload from "../FileUploadS3/S3Upload";
import { FOLDER_NAME_IMAGES } from "../../lib/config/creds";
import Image from "next/image";
import isMobile from "../../hooks/isMobile";
import SelectMediaFrom from "./SelectMediaFrom";
import SelectFromVault from "./SelectFromVault";
import { unionBy } from "lodash";
import { Toast } from "../../lib/global/loader";
import { uploadStory } from "../../services/assets";
import { ExclusiveCoverImage } from "./ExclusiveCoverImage";
import { isAgency } from "../../lib/config/creds";
import { getUserId } from "../../lib/global";
import { updateOtherProfileData } from "../../redux/actions/otherProfileData";
import RadioButtonsGroup from "../radio-button/radio-button-group";
import Switch from "../formControl/switch";
import { DateAndTimePicker } from "../DateAndTimePicker";
import { postUpadteSubject, refreshStoryApi } from "../../lib/rxSubject";
import { getFileType } from "../../lib/helper";
const TextAreaContainer = dynamic(() => import("../../containers/post/textAreaContainer"), { ssr: false });


const PostDialog = ({ sendLocked = false, onSuccessApi = () => { return }, ...props }) => {
  const theme = useTheme();
  const dispatch = useDispatch()
  const [mobileView] = isMobile()
  const params = useRouter();
  const { query = {} } = params;

  const subscriptionPlanCount = useSelector((state) => state?.profileData?.subscriptionData?.planCount);
  const subscriptionPlan = useSelector((state) => state?.subscriptionPlan);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const isNSFWAllow = useSelector((state) => state?.profileData?.isNSFWAllow);
  const minPostValue = useSelector((state) => state?.appConfig?.minPurchasePost);
  const minLockedPostValue = useSelector((state) => state?.appConfig?.minLockedPostValue);
  const maxPurchasePost = useSelector((state) => state.appConfig.maxPurchasePost);
  const maxLockedPostValue = useSelector((state) => state.appConfig.maxLockedPostValue);
  const userId = getCookiees("uid");
  const userType = useSelector(state => state.profileData.userTypeCode)
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const [type, setType] = useState();
  const [file, setFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedFolder, setSelectedFolder] = useState()
  const [selectedFiles, setSelectedFiles] = useState([])
  const [autoUpload, setAutoUpload] = useState(false);
  const [previewUpload, setPreviewUpload] = useState(false)
  const [removeFile, setRemoveFile] = useState(false)
  const [openFileInput, setOpenFileInput] = useState(false);
  const postTpe = useRef(1);
  const [lang] = useLang();
  const [videoDuration, setVideoDuration] = useState(0)
  const [textPost, setTextPost] = useState('')
  const [textAlignPicker, setTextAlignPicker] = useState(false)
  const [textAlign, setTextAlign] = useState("left")

  const [textColor, setTextColor] = useState('#fff')
  const [bgColor, setBgColor] = useState("#003973")
  const [colorPicker, setColorPicker] = useState(false)
  const [fontStylePicker, setFontStylePicker] = useState(false)
  const [font, setFont] = useState()
  const [lowesPostPrice, setLowesPostPrice] = useState(minPostValue);
  const [NSFW, setNSFW] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(new Date());
  const [previewData, setPreviewData] = React.useState([])
  const [coverStep, setCoverStep] = React.useState()
  const [scheduleTimePayload, setScheduleTimePayload] = useState(new Date());
  const [isScheduled, setIsScheduled] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  let today = new Date().toISOString().slice(0, 16);
  const [postTo, setPostTo] = useState(query.type === 'story' || props.story ? 1 : 2)
  const [isValidPrice, setValidPrice] = useState()
  const isStory = query.type === 'story' || parseInt(postTo) === 1

  // Select the Media/Text post Type 
  const [selectedPostType, setSelectedPostType] = useState('3');
  const [postStatus, setPostStatus] = useState(0)
  const oldCursorPos = useRef(0)
  const currentTagWord = useRef("")
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentTime(moment().unix());
  //   }, 3000);
  //   return () => clearInterval(intervalId);
  // }, []);
  const isDateValid = () => moment().unix() <= scheduleTimePayload ? true : false;
  const handleScheduleTimeChange = (time) => {
    setScheduleTimePayload(time)
    setScheduleTime(moment(time).format("YYYY-MM-DD[T]HH:mm"));
  }

  const handleStep = (step) => {
    setCurrentStep(step)
  }

  const drawerss = {
    1: {
      title: lang.exclusivePost,
      desc: lang.exclusivePostDesc,
    },
    2: {
      title: lang.feedPost,
      desc: lang.feedPostDesc,
    },
    3: {
      title: lang.teaserPost,
      desc: lang.teaserPostDesc,
    },
    4: {
      title: lang.lockedPost,
      desc: lang.lockedPostDesc,
    },
  };
  const [selectedTags, setSelectedTags] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [isUserTagged, setIsUserTagged] = useState(0);

  // Hashtag States
  const [selectedHashTags, setSelectedHashTags] = useState([]);
  const [hashtags, setHashtags] = useState([]);

  const [postingData, setPostingPayload] = useState({
    postType: isStory ? 3 : subscriptionPlan?.length > 0 ? 2 : 3,
  });
  const [sharedType, setSharedType] = useState('')
  const fileSelect = useRef(null);
  const videoSelect = useRef(null);
  const textSelect = useRef(null);
  const fileObject = useRef([]);

  const pushDataInPostingPayload = async (key, value) => {
    if (value == 2 && key == "postType" && !(subscriptionPlan?.length > 0 || subscriptionPlanCount)) {

      open_dialog("confirmDialog", {
        title: lang.feedPostConfirm,
        subtitle: lang.feedPostConfirmSubtitlte,
        cancelT: lang.notNow,
        submitT: lang.yes,
        yes: () => {
          startLoader();
          Router.push("/subscription-settings")
          close_dialog("confirmDialog")
          stopLoader();
        }
      });
      value = 3;
    }

    if (key == "price") {
      const regex = ValidateTwoDecimalNumber(value);
      const decimalRegex = /^(?:\d*\.\d{0,2}|\d+)$/.test(value);
      if (regex || !value) {
        setValidPrice(regex)
        setPostingPayload((prevData) => {
          return {
            ...prevData,
            [key]: value,
          };
        });
      } else if (decimalRegex) {
        setValidPrice(false)
        setPostingPayload((prevData) => {
          return {
            ...prevData,
            [key]: value,
          };
        });
      } else {
        return;
      }
    }

    setPostingPayload((prevData) => {
      return {
        ...prevData,
        [key]: value,
      };
    });
  };

  // price validation
  useEffect(() => {
    if (postingData) {
      const currPrice = Number(postingData['price'])
      if ((postingData['postType'] == 4 || sendLocked) && isLocked) {
        if ((currPrice < minLockedPostValue) || (currPrice > maxLockedPostValue)) {
          setValidPrice(false)
        } else if ((currPrice < lowesPostPrice) || (currPrice > maxPurchasePost)) {
          setValidPrice(false)
        }
      } else {
        setValidPrice(true)
      }
    }
  }, [postingData, isLocked])

  useEffect(() => {
    setLowesPostPrice(minPostValue)
    pushDataInPostingPayload("price", minPostValue)
  }, [minPostValue])

  const handleTexPostChange = (text) => {
    if (text.length <= 300) {
      setTextPost(text)
    }
    return;
  }

  const handleColorPicker = () => {
    setColorPicker(!colorPicker);
    setFontStylePicker(false)
    setTextAlignPicker(false)
  }

  const handleTextStyleChange = () => {
    setFontStylePicker(!fontStylePicker);
    setColorPicker(false)
    setTextAlignPicker(false)
  }

  const handleTextAlignPicker = () => {
    setTextAlignPicker(!textAlignPicker)
    setFontStylePicker(false)
    setColorPicker(false)
  }

  useEffect(() => {
    validaPosting();
  }, [textPost]);

  useEffect(() => {
    setSuggestions([]);
  }, [NSFW]);

  useEffect(() => {
    validaPosting();
  }, [fileObject.current.length, postingData, , file?.files, isValidPrice]);

  const InputCurrency = ({ type }) => {
    return (
      <div className="d-flex align-items-center posting-input-block">
        <label className="postLabelLight mr-2">Add Price</label>
        <div className="position-relative">
          <div
            className="posting-currency text-app">
            {defaultCurrency}
          </div>
          <input
            type="text"
            readOnly={props.mode === 'edit' && postStatus === 1}
            inputMode="numeric"
            placeholder="0"
            value={postingData.price}
            onKeyPress={NumberValidator}
            onChange={(e) => pushDataInPostingPayload(
              "price",
              e.target.value
            )}
            className="exclusive-post-txtBx"
          />
        </div>
        {type == 4
          ? ((postingData.price < minLockedPostValue) || (postingData.price > maxLockedPostValue)) ?
            (sendLocked && Number(postingData['price']) === 0) ? "" : <p className="bold position-absolute fntSz12 dv__red_var_1 mt-1 managerMarginPost">
              {lang.lockedPostLeastAmt} {defaultCurrency} {minLockedPostValue} {lang.maxText} {defaultCurrency} {maxLockedPostValue}
            </p> : ""
          : ((postingData.price < lowesPostPrice) || (postingData.price > maxPurchasePost)) ?
            (sendLocked && Number(postingData['price']) === 0) ? "" : <p className="bold position-absolute fntSz12 dv__red_var_1 managerMarginPost">
              {lang.exclusivePostLeastAmt} {defaultCurrency} {lowesPostPrice} {lang.maxText} {defaultCurrency} {maxPurchasePost}
            </p> : ""
        }
        <style jsx>
          {`
    .managerMarginPost{
      margin-top: 77px !important;
    }
    .posting-currency {
      position: absolute;
      left: 20px;
      top: 9px;
      font-size: 18px;
      font-weight: bold;
    }
    .exclusive-post-txtBx {
      border: 2px solid var(--l_border) !important;
      background: transparent !important;
      margin-bottom:10px !important;
    }
    .posting-input-block {
      width: 100%
    }
    `}
        </style>
      </div>
    )
  }

  const GetPostType = (data) => {
    const { label, name, value } = data;
    return (
      <div className="row justify-content-start align-items-center mb-1 mt-2">
        <div className="col-5">
          <RadioButtonsGroup
            radioLabelClass="m-0 mb-3"
            radioClass="text-muted"
            formLabelClass={css`
                        height: 30px;
                        color: var(--l_app_text);
                      `}
            labelPlacement="end"
            value={postingData.postType}
            onRadioChange={(selectedPostType) => {
              if (props.mode === 'create')
                setIsLocked(selectedPostType === 4)
              if (selectedPostType) {
                postingData?.price && setPostingPayload(prev => ({ ...prev, price: minPostValue }))
                pushDataInPostingPayload("postType", value);
              } else {
                pushDataInPostingPayload("postType", 0);
              }
            }}
            buttonGroupData={[
              { value: value, label: label },

            ]}
            checked={postingData.postType == value}
            disabled={props.mode === 'edit'}
          />
          {/* <Switch
            onChange={(val) => {
              setIsLocked(val.value && +value===4)
              if (val.value) {
                postingData?.price && setPostingPayload(prev => ({ ...prev, price: minPostValue }))
                pushDataInPostingPayload("postType", value);
              } else {
                pushDataInPostingPayload("postType", 0);
              }
            }}
            checked={postingData.postType == value}
          /> */}
        </div>
        {/* <div className="col-7 text-left">
          <h6 className="fntSz14 dv_appTxtClr txt-medium mt-3">
            {}{" "}
          </h6>
        </div> */}

        {/* <div className="col-11 ml-auto">
          <p className="text-muted fntSz12">
            {drawerss[value].desc}
          </p>
        </div> */}
      </div>
    );
  };

  const postUploadSuccess = async () => {
    if (props.onUploadSuccess) {
      props.onUploadSuccess()
      return
    }
    const successMsg = localStorage.getItem("postSuccess")
    if (props.data?.postId) {
      startLoader()
      try {
        const res = await getPostById(props.data.postId)
        const newPostData = res?.data?.result?.[0];
        stopLoader()
        if (newPostData) {
          postUpadteSubject.next({ isUpload: true, postData: newPostData })
          updateModelCardPost(props.data.postId, newPostData)
          dispatch(updateOtherProfileData({ postId: props.data.postId, newData: newPostData, replace: true }));
        } else {
          postUpadteSubject.next({ isUpload: true })
        }
      } catch (e) {
        stopLoader()
      }

    } else {
      postUpadteSubject.next({ isUpload: true })
    }
    Toast(successMsg);
    stopLoader()
    close_dialog()
    close_drawer()
  }
  const handleBeforeUpload = (filesArr, startUpload) => {
    submitPost(filesArr, startUpload)
  }

  const submitPost = async (filesArr, startUpload) => {
    const userId = isAgency() ? selectedCreatorId : getUserId();
    let taggedUserIds = [];
    // Removed Tagged Users if Content is NSFW
    if (!NSFW) {
      Object.keys(selectedTags).map((item) => {
        if (postingData["description"].includes("@" + item)) {
          return taggedUserIds.push(selectedTags[item].userId);
        }
      });
    }

    let hashTags = []
    if (postingData?.description) {
      let desc = postingData?.description?.replace(/(\r\n|\n|\r)/gm, " ");

      let hashtagFinder = desc?.split(" ");
      hashtagFinder?.map((hasht) => {
        if (hasht[0] === "#") {
          return hashTags.push(hasht)
        }
      });
    }

    const textPostPayload = [{
      seqId: 1,
      type: parseInt(selectedPostType),
      text: textPost,
      bgColorCode: bgColor,
      font: font || "undefined",
      colorCode: textColor,
      textAlign
    }]


    // const prevpostingPayload = {
    //   assetType: "1",
    //   postedOn: "2",
    //   userId: userId,
    //   sharedOnGroupFeed: false,
    //   platform: "3",
    //   currency: {
    //     currency_code: defaultCurrencyCode,
    //     symbol: defaultCurrency,
    //   },
    //   taggedUserIds,
    //   videoDuration,
    //   ...postingData,
    // };

    const postingPayload = {
      "postType": selectedPostType.toString(),
      "mediaType": 1,
      "description": "",
      "postData": [
        {
          "type": 1,
          "seqId": 0,
          "url": "",
          "thumbnail": "",
          "text": "",
          "colorCode": "",
          "bgColorCode": "",
          "font": "",
          "textAlign": ""
        }
      ],
      "price": 0,
      "videoDuration": videoDuration,
      "currency": {
        currency_code: defaultCurrencyCode,
        symbol: defaultCurrency,
      },
      "isScheduled": false,
      "scheduledTimestamp": 0,
      "isNSFW": false,
      "userId": userId,
      "hashTags": hashTags,
      ...postingData
    }

    if (sendLocked && !isLocked) {
      delete postingPayload['price']
    }
    // console.log(hashTags, "hashTags")
    // if (hashTags?.length > 0) {
    //   postingPayload["hashTags"] = hashTags
    // }
    if (taggedUserIds?.length > 0) {
      if (props.mode === "edit") {
        postingPayload["taggedUserIds"] = [...props?.data?.taggedUserIds, ...taggedUserIds]
      } else {
        postingPayload["taggedUserIds"] = taggedUserIds
      }
    }

    if (selectedPostType == 4 || type == 4) {
      postingPayload['postData'] = textPostPayload
      delete postingPayload["videoDuration"];
      postingPayload.mediaType = 3;
      // postingPayload.mediaCount = 0;
    }
    if (type == 1) {
      postingPayload.mediaType = 1;
    }
    if (type == 2) {
      postingPayload.mediaType = 2;
    }

    if (postingData.postType == "2" || postingData.postType == "3") {
      delete postingPayload["price"];
    }
    if (NSFW) {
      postingPayload["isNSFW"] = NSFW;
    }
    if (isScheduled) {
      postingPayload["isScheduled"] = isScheduled;
      postingPayload["scheduledTimestamp"] = scheduleTimePayload;
    }

    const storyPayload = {
      storyType: parseInt(postingPayload.postType),
      storyData: selectedPostType == 4 || type == 4 ? textPostPayload : fileObject.current,
      price: postingPayload.price,
      currency: postingPayload.currency,
      userId: userId
    };

    if (
      postingPayload.taggedUserIds &&
      postingPayload.taggedUserIds.length
    ) {
      storyPayload["taggedUserIds"] =
        postingPayload.taggedUserIds;
    }
    if (postingPayload.description) {
      storyPayload["description"] =
        postingPayload.description;
    }
    if (hashTags?.length > 0) {
      storyPayload["hashTags"] = hashTags
    }
    if (NSFW) {
      storyPayload["isNSFW"] = NSFW;
    }

    if (selectedPostType == 4 || type == 4) {
      delete postingPayload["description"];
      delete storyPayload["description"];
      delete postingPayload["hashTags"]
      delete storyPayload["hashTags"]
      delete postingPayload["taggedUserIds"]
      delete storyPayload["taggedUserIds"]
    }
    if (selectedFiles.filter(f => !f.isEdit).length > 0) {
      if (postTo === 1) {
        storyPayload['storyData'] = selectedFiles.map((file, index) => {
          if (file.mediaContentId) {
            return ({
              "seqId": index + 1,
              "type": file.type === "VIDEO" ? 2 : 1,
              "mediaContentId": file.mediaContentId,
              "url": file.file,
              "thumbnail": file.preview
            })
          }
          if (file.type === "VIDEO") {
            return (
              {
                "seqId": index + 1,
                "type": 2,
                "url": "",
                "thumbnail": file.preview
              }
            )
          }
          return ({
            "seqId": index + 1,
            "type": 1,
            "url": filesArr.find(f => f.id === file.id)?.meta.key
          })
        })
      }
      postingPayload['postData'] = selectedFiles.map((file, index) => {
        if (file.isEdit) {
          const ePost = postingData['postData'].find(pf => pf.seqId === file.id);
          delete ePost.mobile;
          return { ...ePost }
        }
        if (file.mediaContentId) {
          return ({
            "seqId": index + 1,
            "type": file.type === "VIDEO" ? 2 : 1,
            "mediaContentId": file.mediaContentId,
            "url": file.file,
            "thumbnail": file.preview
          })
        }
        if (file.type === "VIDEO") {
          return (
            {
              "seqId": index + 1,
              "type": 2,
              "url": "",
              "thumbnail": file.preview
            }
          )
        }
        return ({
          "seqId": index + 1,
          "type": 1,
          "url": filesArr.find(f => f.id === file.id)?.meta.key,
          "thumbnail": filesArr.find(f => f.id === file.id)?.meta.key
        })
      })
    } else {
      postingPayload['postData'] = selectedFiles.map((file, index) => {
        const fData = postingData['postData'].find(pf => pf.seqId === file.id)
        delete fData.mobile;
        return fData
      })
    }



    if (previewData && previewData.filter(f => !f.isEdit).length > 0) {
      postingPayload['previewData'] = previewData.map((file, index) => {
        if (file.isEdit) {
          const ePost = postingData['previewData'].find(pf => pf.seqId === file.id);
          delete ePost.mobile;
          return { ...ePost }
        }
        if (file.mediaContentId) {
          return ({
            "seqId": index + 1,
            "type": file.type === "VIDEO" ? 2 : 1,
            "mediaContentId": file.mediaContentId,
            "url": file.file,
            "thumbnail": file.preview
          })
        }
        if (file.type === "VIDEO") {
          return (
            {
              "seqId": index + 1,
              "type": 2,
              "url": "",
              "thumbnail": file.preview
            }
          )
        }
        return ({
          "seqId": index + 1,
          "type": 1,
          "url": file.url,
          "thumbnail": file.url,
        })
      })
    } else {
      postingPayload['previewData'] = previewData.map((file, index) => {
        const fData = postingData['previewData'].find(pf => pf.seqId === file.id)
        delete fData.mobile;
        return fData
      })
    }
    if (postingPayload['previewData'] && postingPayload['previewData'].length === 0) {
      delete postingPayload['previewData']
    }
    postingPayload['postType'] = postingPayload['postType'].toString()
    if (!isAgency()) {
      delete postingPayload['userId']
      delete storyPayload['userId']
    }
    startLoader()

    if (props.mode === 'edit') {
      localStorage.setItem("postSuccess", "Post has been updated successfully!")
    } else {
      if (postTo == 1) {
        localStorage.setItem("postSuccess", "New story created successfully");
      } else {
        if (!isScheduled) {
          localStorage.setItem("postSuccess", lang.newPostCreated);
        }
        if (isScheduled) {
          localStorage.setItem("postSuccess", lang.newSchPostCreated)
        }
        const isVideo = selectedFiles.find(f => !f.mediaContentId && f.type === "VIDEO")
        if (isVideo && postTo == 2) {
          localStorage.setItem("postSuccess", lang.postAddedInQueue)
        }
      }

    }

    if (props.mode === 'edit') {
      if (postStatus === 1) {
        delete postingPayload["isScheduled"]
        delete postingPayload["scheduledTimestamp"]
      }
      if (postingPayload['taggedUserIds']?.length === 0) {
        delete postingPayload['taggedUserIds']
      }
      // if (postingPayload['hashTags']?.length === 0) {
      //   delete postingPayload['hashTags']
      // }
      delete postingPayload['postType']
      postingPayload['postId'] = props.data.postId;
      updatePost(postingPayload)
        .then((res) => {
          stopLoader();
          const postId = res.data.data.postId;
          let tempFilesArr = filesArr.filter(file => selectedFiles.find(f => f.id === file.id))
          const newFilesArr = tempFilesArr.map((f, index) => {
            if (f.meta.type === "VIDEO") {
              const nFile = { ...f }
              nFile.meta.name = `${postId}_post_${selectedFiles.find(sf => sf.id === f.id).seqId}.mp4`
              return nFile
            } else {
              return f;
            }
          })
          if (filesArr && filesArr.length > 0) {
            startUpload(newFilesArr)
          } else {
            postUploadSuccess()
          }
        })
        .catch((e) => {
          console.error(e);
          stopLoader();
          Toast(
            e.response
              ? e.response.data.message || e.response.data
              : "Faild to update post",
            "error"
          );
        });
    } else {
      if (postTo === 1) {
        uploadStory(storyPayload).then((res) => {
          stopLoader()
          if (res.status === 200) {
            const storyData = res.data.data;
            let tempFilesArr = filesArr.filter(file => selectedFiles.find(f => f.id === file.id))
            if (storyData && storyData.length > 0) {
              const newFilesArr = storyData.map((f, index) => {
                const storyId = selectedFiles.find(fs => fs.seqId === f.seqId)?.id
                const fileIndex = tempFilesArr.findIndex(f => f.id === storyId)
                if (fileIndex !== -1) {
                  tempFilesArr.splice(fileIndex, 1, {
                    ...tempFilesArr[fileIndex],
                    meta: {
                      ...tempFilesArr[fileIndex].meta,
                      name: `${f._id}_story_${f.seqId}.mp4`
                    }
                  })
                }
                return f
              })
            }
            onSuccessApi()

            if (tempFilesArr && tempFilesArr.length > 0) {
              startUpload(tempFilesArr)
            } else {
              postUploadSuccess()
            }
            refreshStoryApi.next({ isUploading: true });
          }

        })
      } else {
        if (sendLocked) {
          if (props.sendLockPost) {
            if (postingPayload['postData'].filter(p => p.type == 2 && !p.mediaContentId).length === 0) {
              if (postingPayload['postData'].filter(p => !p.mediaContentId).length > 0) {
                startUpload(filesArr);
              } else {
                props.sendLockPost(postingPayload).then(() => {
                  postUploadSuccess()
                });

              }
              setCookie('tempPostPayload', JSON.stringify(postingPayload))

            } else {
              props.sendLockPost(postingPayload).then((res) => {
                if (res.status === 200) {
                  const postId = res?.data?.data?.postId || Date.now();
                  let tempFilesArr = filesArr.filter(file => selectedFiles.find(f => f.id === file.id))
                  const newFilesArr = tempFilesArr.map((f, index) => {
                    if (f.meta.type === "VIDEO") {
                      const nFile = { ...f }
                      nFile.meta.name = `${postId}_post_${selectedFiles.find(sf => sf.id === f.id).seqId}.mp4`
                      return nFile
                    } else {
                      return f;
                    }
                  })
                  localStorage.setItem('postTo', postTo)
                  localStorage.setItem('postSuccess', "Locked Message sent successfully")
                  if (filesArr && filesArr.length > 0) {
                    startUpload(newFilesArr)
                  } else {
                    postUploadSuccess()
                  }
                }
              })
            }

          }
        } else {
          posting(postingPayload).then((res) => {
            stopLoader()
            if (res.status === 200) {
              const postId = res.data.data.postId;
              let tempFilesArr = filesArr.filter(file => selectedFiles.find(f => f.id === file.id))
              const newFilesArr = tempFilesArr.map((f, index) => {
                if (f.meta.type === "VIDEO") {
                  const nFile = { ...f }
                  nFile.meta.name = `${postId}_post_${selectedFiles.find(sf => sf.id === f.id).seqId}.mp4`
                  return nFile
                } else {
                  return f;
                }
              })
              localStorage.setItem('postTo', postTo)
              if (filesArr && filesArr.length > 0) {
                startUpload(newFilesArr)
              } else {
                postUploadSuccess()
              }
            }
          })
        }

      }
    }


    // if (selectedPostType != 4) {
    //   uploadPost({
    //     lang,
    //     fileObject: fileObject.current,
    //     type: parseInt(type),
    //     isStory: isStory,
    //     videoDuration: parseInt(videoDuration),
    //     requestPayload: isStory
    //       ? storyPayload
    //       : postingPayload,
    //   });
    // }
    // else {
    //   uploadPost({
    //     lang,
    //     mobileView: false,
    //     isStory: isStory,
    //     type: parseInt(selectedPostType),
    //     requestPayload: isStory
    //       ? storyPayload
    //       : postingPayload,
    //   });
    // }
    // close_dialog();
  };

  const validaPosting = () => {
    const {
      postType,
      sharedOnPersonalFeed,
      sharedOnStory,
      price,
    } = postingData;
    if (!postType) { setIsValid(false); return false };
    // if (textPost != '') {
    //   if (postType == 2 || postType == 3) { return setIsValid(true) }
    //   else if ((postType == 1 && !isValidPrice)) { return setIsValid(false) }
    //   else { return setIsValid(price >= lowesPostPrice) }
    // }
    if (selectedFiles.length === 0) { setIsValid(false); return false }
    // if (!sharedOnPersonalFeed && !sharedOnStory) return setIsValid(false);
    if ((postType == 1 && !isValidPrice)) { setIsValid(false); return false }
    if (((postType == 4 || sendLocked) && !isValidPrice)) { setIsValid(false); return false }
    if ((postType == 1 && price < lowesPostPrice) || (postType == 1 && isZero(price))) { setIsValid(false); return false }
    if (isScheduled) {
      if (typeof scheduleTimePayload == "object") { setIsValid(false); return false }
      if (!isDateValid()) { setIsValid(false); return false }
    }
    setIsValid(true);
    return false
  };

  const isZero = (input) => {
    let value = Number(input);
    return value == 0.00 || value == 0.0 || value == 0 ? true : false;
  }


  const postToSelectHandler = (val) => {
    setPostTo(val)
    pushDataInPostingPayload("postType", 3);
  };

  useEffect(() => {
    if (sendLocked) {
      pushDataInPostingPayload("postType", 4);
    }
  }, [sendLocked])

  useEffect(() => {
    if (isLocked) {
      document.getElementById('postWrap').scrollTo({ top: document.getElementById('postWrap').scrollHeight - 500 })
    }
  }, [isLocked])



  const remove = (e) => {
    e && e.stopPropagation();
    fileObject.current = [];
    validaPosting()
    setFile(null);
  };

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

  const onVideoSelect = async (e) => {
    const file = e && e.target.files;
    if (file && file[0]) {
      startLoader();
      const url = URL.createObjectURL(file[0]);
      const video = document.createElement("video");
      video.src = url;
      try {
        await fileCallbackToPromise(video);
        setVideoDuration(video.duration)
        await generaeVideThumb(file[0], (thumbs) => {
          stopLoader();
          setFile({
            seqId: 1,
            filesObject: file[0],
            files:
              typeof thumbs[0] != "undefined" && thumbs[0],
            selectedThumb: 0,
            thumb: thumbs,
            videoDuration: video.duration || 10
          });
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
          validaPosting()
        }, video.videoWidth, video.videoHeight);
      } catch (err) {
        Toast("For this file, Please Select Custom Cover !", "info");
        setFile({
          seqId: 1,
          filesObject: file[0],
          files: null,
          selectedThumb: 0,
          thumb: [],
          videoDuration: video.duration || 10
        })

        fileObject.current = [
          {
            seqId: 1,
            filesObject: file[0],
            files: null,
            selectedThumb: 0,
            thumb: [],
            videoDuration: video.duration || 10
          }
        ];
        stopLoader();
        validaPosting();
      }
    }
  };

  const changeThumbanail = (thumb, index) => {
    setFile((prevState) => {
      return {
        ...prevState,
        selectedThumb: index,
        files: thumb,
      };
    });

    fileObject.current[0] = {
      ...fileObject.current[0],
      files: thumb,
    };
    validaPosting();
  };

  const itemSelectHandler = async (item) => {
    const words = postingData["description"].split("\n").join(" ").split(" ");
    let caption = postingData["description"];
    const taggedWords = currentTagWord.current
    if (
      Object.keys(selectedTags).includes(item.username) &&
      postingData["description"].includes(item.username)
    ) {
      caption = caption.slice(0, oldCursorPos.current - taggedWords.length).replace("@" + item.username, "") + caption.slice(oldCursorPos.current - taggedWords.length).replace("@" + item.username, "").replace(taggedWords, "@" + item.username + " ")
    } else {
      caption = caption.slice(0, oldCursorPos.current - taggedWords.length) + caption.slice(oldCursorPos.current - taggedWords.length).replace(taggedWords, "@" + item.username + " ")
    }
    await pushDataInPostingPayload("description", caption);
    setSuggestions([]);
    await setSelectedTags({
      ...selectedTags,
      [item.username]: item,
    });
    const postElem = document.getElementById(
      "post-caption"
    );
    postElem.focus();
    const selRange = parseInt(caption.length * 2);
    postElem.setSelectionRange(
      selRange,
      selRange,
      "forward"
    );
  };

  const hashTagHandler = (hashtag) => {
    const words = postingData["description"].split("\n").join(" ").split(" ");
    let caption = postingData["description"];
    const taggedWords = currentTagWord.current
    if (selectedHashTags.includes(hashtag.name) &&
      postingData["description"].includes(hashtag.name)) {
      caption = caption.slice(0, oldCursorPos.current - taggedWords.length).replace(hashtag.name, "") + caption.slice(oldCursorPos.current - taggedWords.length).replace(hashtag.name, "").replace(taggedWords, hashtag.name + " ")
    } else {
      caption = caption.slice(0, oldCursorPos.current - taggedWords.length) + caption.slice(oldCursorPos.current - taggedWords.length).replace(taggedWords, hashtag.name + " ")
    }
    pushDataInPostingPayload("description", caption);
    setHashtags([]);
    setSelectedHashTags([...selectedHashTags, hashtag.name]);
    const postElem = document.getElementById("post-caption");
    postElem.focus();
    const selRange = parseInt(caption.length * 2);
    postElem.setSelectionRange(selRange, selRange, "forward");
  }

  const handleCaptionChange = (e, val) => {
    pushDataInPostingPayload("description", val);

    if (val) {
      let words;
      let { selectionStart } = e.target
      oldCursorPos.current = selectionStart
      words = val.slice(0, oldCursorPos.current).split("\n").join(" ").split(" ");
      const tagWord = words[words.length - 1];
      currentTagWord.current = tagWord

      if (tagWord.startsWith("@") && tagWord.slice(1) && !NSFW) {
        setIsUserTagged(1);
        getCreatorsList(tagWord.slice(1));
      } else {
        setSuggestions([]);
      }

      if (tagWord.includes("#") && tagWord.slice(1)) {
        setIsUserTagged(2);
        getHashtag(tagWord.slice(1));
      }
    } else {
      setSuggestions([]);
      setHashtags([])
      // getHashtag([]);
    }
  };

  const getCreatorsList = async (searchText) => {
    const list = {
      search: searchText || "",
    };
    if (isAgency()) {
      list["userId"] = selectedCreatorId;
    }
    creatorSearch(list)
      .then((res) => {
        if (res && res.data) {
          setSuggestions(res?.data?.data);
        } else {
          setSuggestions([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setSuggestions([]);
      });
  };

  const getHashtag = async (searchText) => {
    try {
      const payload = {
        limit: 10,
        set: 0,
        searchValue: searchText || "",
      };
      // API CALLING
      const res = await getPopularHashtagsAPI(payload);

      if (res.status === 200) {
        setHashtags(res?.data?.result);
      } else {
        setHashtags([]);
      }
    } catch (err) {
      console.error(err);
      setHashtags([]);
    }
  }

  const hashtagUI = () => {
    return (
      <div className="position-absolute drawerBgColor shadowBoxTaged"
        style={{ width: '92%', zIndex: 1, top: '70px', maxHeight: '190px', overflowY: 'scroll', overflowX: 'hidden' }}>
        {hashtags?.length
          ? hashtags.map((hashtag, index) => (
            <div key={index} className="d-flex flex-row tagTile justify-content-start align-items-center py-1 cursorPtr border-bottom"
              onClick={() => hashTagHandler(hashtag)}
            >
              <div className="px-3">
                <Avatar className="hashtags" style={{ color: theme.palette.white }}>#</Avatar>
              </div>
              <div className="">
                <p className="m-0 bold fntSz14 text-app">{hashtag.name}</p>
                <p className="m-0 fntSz10 text-app">{`${hashtag.noOfPost} ${hashtag.noOfPost > 1 ? lang.posts : lang.post}`}</p>
              </div>
              <hr className="m-0" />
            </div>
          ))
          : ""}
      </div>
    )
  }

  const TagUserUI = () => {
    return (
      <div className="position-absolute drawerBgColor shadowBoxTaged"
        style={{ width: '92%', zIndex: 1, top: '70px', maxHeight: '190px', overflowY: 'scroll', overflowX: 'hidden' }}>
        {suggestions?.length
          ? suggestions.map((item, index) => (
            <div key={index} className="d-flex flex-row  tagTile justify-content-start align-items-center py-1 cursorPtr border-bottom"
              onClick={() => itemSelectHandler(item)}
            >
              <div className="px-3 hoverContainer">
                {item.profilePic ? <Avatar alt={item.firstName} src={s3ImageLinkGen(S3_IMG_LINK, item?.profilePic)} />
                  :
                  <div className="tagUserProfileImage">{item?.firstName[0] + (item?.lastName && item?.lastName[0])}</div>
                }
              </div>
              <div className="">
                <p className="m-0 fntSz16 font-weight-400">@{item.username}</p>
              </div>
              <hr className="m-0" />
            </div>
          ))
          : ""
        }
      </div>
    )
  }

  const NSFWComponent = () => {
    return (
      <div className="row mb-4">
        <div className="col-10">
          <h6 className="nsfw__title">{lang.nsfwConfig}</h6>

          <p className="text-muted fntSz12">{lang.nsfwText}</p>
        </div>
        <div className="col-2 text-right">
          <Switch
            onChange={() => setNSFW(!NSFW)}
            checked={NSFW}
          />
        </div>
      </div>
    )
  }
  useEffect(() => {
    if (!isScheduled) {
      setScheduleTimePayload(new Date())
      setScheduleTime(moment(new Date()).format("YYYY-MM-DD[T]HH:mm"));
    }
  }, [isScheduled])

  useEffect(() => {
    if (props.mode === 'edit') {
      close_dialog("PostSlider")
      startLoader()
      getPostById(props.data.postId)
        .then((res) => {
          const data = res?.data?.result[0];
          if (data) {
            // setSelectedTags([...data.taggedUserIds])
            setSelectedPostType(data.mediaType == 4 ? 4 : 3)
            setBgColor(data.postData[0].bgColorCode)
            setFont(data.postData[0].font)
            setTextPost(data.postData[0].text || '')
            setTextAlign(data.postData[0].textAlign)
          }
          setScheduleTimePayload(data.scheduledTimestamp)
          setScheduleTime(moment(new Date(data.scheduledTimestamp)).format("YYYY-MM-DD[T]HH:mm"));
          setPostingPayload((prevData) => {
            return {
              ...prevData,
              postId: data.postId,
              postType: data.postType,
              // assetType: data.assetType,
              // postTo: postTo,
              price: data.price,
              // sharedOnPersonalFeed: data.sharedOnPersonalFeed,
              // sharedOnStory: data.sharedOnStory,
              description: data.description,
              postData: data.postData,
              previewData: data.previewData || [],
              taggedUserIds: data.taggedUserIds || undefined,
              scheduledTimestamp: data.scheduledTimestamp
            };
          });
          setPostStatus(data.status)
          const fileList = data.postData || [];
          const oSelectedFiles = fileList.map((ff, index) => {
            const f = { ...ff }
            return ({
              seqId: index + 1,
              preview: f.type === 1 ? s3ImageLinkGen(S3_IMG_LINK, f.url, 60, 120, 120) : S3_IMG_LINK + "/" + f.thumbnail,
              id: f.seqId,
              isEdit: true,
              type: f.type === 1 ? "IMAGE" : "VIDEO"
            })
          })
          setSelectedFiles(oSelectedFiles)

          //set preview Filesa Data
          const pfileList = data.previewData || [];
          const opSelectedFiles = pfileList.map((ff, index) => {
            const f = { ...ff }
            return ({
              seqId: index + 1,
              preview: f.type === 1 ? s3ImageLinkGen(S3_IMG_LINK, f.url, 60, 120, 120) : S3_IMG_LINK + "/" + f.thumbnail,
              id: f.seqId,
              isEdit: true,
              type: f.type === 1 ? "IMAGE" : "VIDEO"
            })
          })
          setPreviewData(opSelectedFiles)

          fileObject.current[0] = {
            ...data.postData[0],
          };
          setIsScheduled(data.isScheduled)
          validaPosting();
          if (data.price) {
            pushDataInPostingPayload("price", data.price);
          }
          stopLoader()
        })
        .catch((err) => {
          stopLoader()
          console.error("ERROR IN POST_EDIT UseEffect", err);
        });
    }
  }, [props.data, props.mode])


  useEffect(() => {
    validaPosting()
  }, [isScheduled, scheduleTimePayload, selectedFiles, postTo])

  const handleFileSelect = (files) => {
    const filesArr = files.map(file => {
      return {
        file: file.data,
        seqId: selectedFiles.length + 1,
        type: file.meta.type,
        preview: file.meta.type === "VIDEO" ? file.meta.thumb : URL.createObjectURL(file.data),
        thumb: file.meta.type === "VIDEO" ? file.meta.thumb : null,
        id: file.id,
      }
    })
    let allFiles = [...unionBy(selectedFiles, filesArr, 'id')].map((f, index) => {
      return {
        ...f,
        seqId: index + 1
      }
    })
    if (
      allFiles.length > 25
    ) {
      allFiles = allFiles.slice(0, 25)
      Toast("Maximum 25 media files are allowed")
    }
    setSelectedFiles([...allFiles])
    setCurrentStep(1)
  }

  const handleSelectFrom = (type) => {
    if (coverStep) {
      if (type === 1) {
        setCoverStep(2)
      } else {
        setCoverStep(3)
      }
    } else {
      if (type === 1) {
        setOpenFileInput(true)
      } else {
        setCurrentStep(3)
      }
    }

  }

  const handleSelectFromVault = (vdata) => {
    setSelectedFolder(vdata);
  }

  const handleSelectFromDevice = () => {
    setOpenFileInput(true)
    setCurrentStep(1);
  }
  const handleFileSelectVault = (filesArr, isClose) => {
    if (coverStep) {
      if (filesArr.length > 0) {
        let allFiles = [...unionBy(previewData, filesArr, 'id')].map((f, index) => {
          return {
            ...f,
            seqId: index + 1
          }
        })
        if (
          allFiles.length > 25
        ) {
          allFiles = allFiles.slice(0, 25)
          Toast("Maximum 25 media files are allowed")
        }
        setPreviewData([...allFiles])
        if (isClose) {
          setCoverStep()
        }
      }
    } else {
      let allFiles = [...unionBy(selectedFiles, filesArr, 'id')].map((f, index) => {
        return {
          ...f,
          seqId: index + 1
        }
      })
      if (
        allFiles.length > 25
      ) {
        allFiles = allFiles.slice(0, 25)
        Toast("Maximum 25 media files are allowed")
      }
      setSelectedFiles([...allFiles])
      if (isClose) {
        setCurrentStep(1)
      }
    }

  }

  const handleRemoveFile = (id) => {
    const currentFile = selectedFiles.find(f => f.id === id);
    const currentFileIndex = selectedFiles.findIndex(f => f.id === id);
    if (currentFile) {
      const allFiles = [...selectedFiles]
      allFiles.splice(currentFileIndex, 1)
      setSelectedFiles([...allFiles])
      setRemoveFile(id)
    }
  }

  const handleSuccess = (files) => {
    if (sendLocked && files && files.filter(f => getFileType(f.data) === 'VIDEO').length === 0) {
      props.sendLockPost(JSON.parse(getCookie('tempPostPayload'))).then(() => {
        postUploadSuccess()
      })
      removeCookie('tempPostPayload')
    } else {
      postUploadSuccess()
    }

    setOpenFileInput(false);
    // setAutoUpload(false);
  }

  useEffect(() => {
    let newSharedType = '';

    if (props.isBulk) {
      newSharedType = 'BULK_POST'
    } else if (sendLocked) {
      newSharedType = 'LOCKED_POST'
    } else if (postingData['postType'] == 3) {
      newSharedType = 'TEASER'
    } else if (postingData['postType'] == 2) {
      newSharedType = 'FEED'
    } else if (postingData['postType'] == 1) {
      newSharedType = 'PREMIUM'
    }
    setSharedType(newSharedType)
  }, [postingData])

  return (
    <div className="position-relative postModal">
      <Head>
        <script defer={true} src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" />
      </Head>
      <S3Upload
        autoProceed={autoUpload}
        showUploadButton={false}
        targetId={'postUpload'}
        handleClose={() => setOpenFileInput(false)}
        open={openFileInput}
        folder={`${userId}/${FOLDER_NAME_IMAGES.post}`}
        successCallback={handleSuccess}
        removeFile={removeFile}
        theme={theme.type}
        beforeUpload={(files, startUpload) => handleBeforeUpload(files, startUpload)}
        onAddFiles={handleFileSelect}
      />
      {
        currentStep === 1 && !coverStep || coverStep === 2 ? <div className="bg__dt h-100 " style={{ maxWidth: '600px', position: 'relative' }}>
          {/* <div style={{height:"2rem" , width:"2rem", position:"absolute" , right:"-1rem" }} className="ml-auto rounded-circle  text-center  bg-danger">x</div> */}
          <div className="myPostSubscription h-100">

            <div
              className="h-100 d-flex flex-column"
              style={{ padding: "0 10px 10px 10px" }}>
              <div className="postHeader p-4">
                <h3 className="mainTitle text-center dv_appTxtClr">{sendLocked ? lang.createLockedMsg : postTo === 1 ? lang.createStory : props.mode === 'edit' ? lang.editPost : lang.createPost}</h3>
                <div className='close_icon'>
                  <Image
                    src={`${theme.type == "light" ? CLOSE_ICON_BLACK : CLOSE_WHITE}`}
                    onClick={() => props.onClose()}
                    color="white"
                    width="20"
                    height="20"
                    alt="close_icon"
                    style={{ marginBottom: "4px" }}
                  />
                </div>
              </div>
              <div id="postWrap" className="text__color mx-md-3 px-3" style={{ paddingBottom: '70px', overflowY: 'auto', overflowX: 'hidden', maxHeight: mobileView ? '74vh' : '60vh' }}>
                {/* <div className="d-flex">
                  <RadioButtonsGroup
                    radioLabelClass="m-0 mb-3"
                    radioClass="text-muted"
                    formLabelClass={css`
                        height: 30px;
                        color: var(--l_app_text);
                      `}
                    labelPlacement="start"
                    value={selectedPostType}
                    onRadioChange={(selectedPostType) => {
                      setFile(null)
                      setTextPost('')
                      setIsValid(false)
                      setSelectedPostType(selectedPostType);
                    }}
                    buttonGroupData={[
                      { value: 3, label: "Media post" },
                      { value: 4, label: "Text post" },
                    ]}
                  />
                </div> */}
                {/* {file ? (
                  type == 1 ? (
                    <ImageContainer
                      defaultImage={[file]}
                      onChange={(imgs) => {
                        fileObject.current =
                          imgs &&
                          imgs.filter((_) =>
                            _.files ? true : false
                          );
                        validaPosting();
                        if (fileObject.current.length == 0) {
                          remove();
                        }
                      }}
                    />
                  ) : (
                    <VideoContainer
                      defaultImage={[file]}
                      onChange={onVideoSelect}
                      remove={remove}
                      changeThumbanail={changeThumbanail}
                      file={file}
                    />
                  )
                ) : (
                  selectedPostType == 4 ? (
                    <TextAreaContainer
                      textPost={textPost}
                      bgColor={bgColor}
                      setBgColor={setBgColor}
                      font={font}
                      textColor={textColor}
                      setFont={setFont}
                      colorPicker={colorPicker}
                      handleColorPicker={handleColorPicker}
                      fontStylePicker={fontStylePicker}
                      handleTexPostChange={handleTexPostChange}
                      handleTextStyleChange={handleTextStyleChange}
                      onClick={setColorPicker}
                      textAlignPicker={textAlignPicker}
                      handleTextAlignPicker={handleTextAlignPicker}
                      textAlign={textAlign}
                      setTextAlign={setTextAlign}
                    />
                  ) : ""
                )} */}
                <PostPlaceHolder isEdit={(postingData['postType'] == "3") || (isScheduled && postStatus !== 1) || props.mode === 'create'} setFiles={setSelectedFiles} handleRemoveFile={handleRemoveFile} onClick={() => handleStep(2)} files={selectedFiles} />

                {/* image select */}
                {/* <input
                  style={{ display: "none" }}
                  type="file"
                  accept={IMAGE_TYPE}
                  ref={(el) => (fileSelect.current = el)}
                  onChange={(e) => {
                    const file = e && e.target.files;
                    if (file && file[0]) {
                      const fileUrl = URL.createObjectURL(
                        file[0]
                      );
                      setFile({
                        seqId: 1,
                        filesObject: file[0],
                        files: fileUrl,
                      });
                    }
                  }}
                /> */}

                {/* video select */}
                {/* <input
                  style={{ display: "none" }}
                  type="file"
                  rows={1}
                  accept={"video/*"}
                  ref={(el) => (videoSelect.current = el)}
                  onChange={onVideoSelect}
                /> */}

                {/* text select */}
                {/* <textarea
                  style={{ display: "none" }}
                  value={postingData["description"]}
                  className="form-control dv_textarea_lightgreyborder"
                  ref={(el) => (textSelect.current = el)}
                  rows={3}
                  autoFocus={true}
                  list="creators"
                  id="post-caption"
                  placeholder={lang.caption}
                /> */}
                <div style={{ overflow: 'auto' }} className="container scrollbar_hide position-relative">
                  {isUserTagged === 1 ? TagUserUI() : isUserTagged === 2 ? hashtagUI() : ""}
                  <div className="row ">
                    <h6 className="postLabel my-2">{lang.addCaption}</h6>
                    <div className="p-0 col-12 newBox1">
                      {selectedPostType != 4
                        ? <textarea
                          value={postingData["description"]}
                          className="txt_area"
                          // autoFocus={true}
                          autoComplete="false"
                          list="creators"
                          id="post-caption"
                          rows={5}
                          placeholder={lang.addCaption}
                          onChange={(e) => handleCaptionChange(e, e.target.value)}
                        />
                        : ""
                      }
                    </div>
                    {props.mode === 'edit' && <div className="text-app mb-2 w-300 fntSz13">
                      <strong>Note:</strong> You can only edit the description field and add/remove media.
                    </div>}
                  </div>

                  {
                    !sendLocked ? <div className="row postTo">
                      <h6 className="postLabel">{lang.postTo}</h6>
                      <div className="col-12 p-0">
                        <div className="d-flex my-2">
                          <Button
                            type="button"
                            cssStyles={{
                              background: "none",
                              border: `2px solid ${postTo === 1 ? 'var(--l_base)' : 'var(--l_border)'}`,
                              color: 'var(--l_light_app_text)'
                            }}
                            fclassname='postTobtn rounded-pill mr-2 py-0 d-flex align-items-center justify-content-center'
                            btnSpanClass={`${postTo === 1 ? 'gradient_text' : 'postLabelLight'} font-weight-500 letterSpacing3`}
                            onClick={() => props.mode === 'create' ? postToSelectHandler(1) : ""}
                            children={'Story'}
                            leftIcon={
                              {
                                src: 'Bombshell/images/icons/StoryLine.svg',
                                id: 'storyLine'
                              }
                            }
                            iconClass='postToIcon mr-2'
                            iconColor={postTo === 1 ? theme.appColor : theme.iconColor}
                            iconHeight={14}
                            iconWidth={14}
                            disabled={props.mode === 'edit'}
                          />
                          <Button
                            type="button"
                            cssStyles={{
                              background: "none",
                              border: `2px solid ${postTo === 2 ? 'var(--l_base)' : 'var(--l_border)'}`,
                              color: 'var(--l_light_app_text)'
                            }}
                            fclassname='postTobtn rounded-pill mr-2 py-0 d-flex align-items-center justify-content-center'
                            btnSpanClass={`${postTo === 2 ? 'gradient_text' : 'postLabelLight'} font-weight-500 letterSpacing3`}
                            onClick={() => props.mode === 'create' ? postToSelectHandler(2) : ""}
                            children={'Feed'}
                            leftIcon={
                              {
                                src: 'Bombshell/images/icons/galleryadd.svg',
                                id: 'galleryAdd'
                              }
                            }
                            iconClass='postToIcon mr-2'
                            iconColor={postTo === 2 ? theme.appColor : theme.iconColor}
                            iconHeight={14}
                            iconWidth={14}
                            disabled={props.mode === 'edit'}
                          />
                        </div>
                      </div>
                    </div> : ""
                  }
                  <div className="row my-2">
                    {
                      !sendLocked ? < h6 className="postLabel w-100">{lang.postType}</h6> : ""}
                    {
                      !sendLocked ? <div className="col-12 px-0 d-flex position-relative postType mb-2" style={{
                        overflowY: 'auto'
                      }}>
                        <div>
                          <GetPostType
                            label={lang.teaserPost}
                            name={lang.teaserPost}
                            value="3" />
                        </div>
                        <GetPostType
                          label={lang.feedPost}
                          name={lang.feedPost}
                          value="2" />

                        {!isStory &&
                          <GetPostType
                            label={lang.exclusivePost}
                            name={lang.exclusivePost}
                            value="1" />
                        }
                      </div> : ""
                    }
                    {
                      sendLocked ? <div className="row my-2 w-100">
                        <div className="col-10">
                          <h6 className="nsfw__title">{lang.lockedPost}</h6>
                        </div>
                        <div className="col-2 text-right px-0">
                          <Switch
                            checked={isLocked}
                            onChange={(e) => {
                              if (props?.isFanUser || props?.isBulk) {
                                setIsLocked(!isLocked)
                              } else {
                                Toast(lang.lockedMessageDisableText, 'error', 3000)
                              }
                            }}
                            disabled={props.mode === 'edit'}
                          />
                        </div>
                      </div> : ""
                    }
                    {(postingData.postType == 4 && userType != 1 && isLocked) && InputCurrency(postingData.postType)}
                    {
                      postingData.postType == 1 || (props.mode == 'edit' && (previewData && previewData.length > 0)) || (sendLocked && isLocked) ?
                        <ExclusiveCoverImage
                          title={lang.addPreviewContent}
                          isEdit={true}
                          selectedFile={previewData}
                          setSelectedFile={setPreviewData}
                          setCoverStep={setCoverStep}
                          fromDevice={coverStep === 2}
                        /> : ""
                    }
                    {(postingData.postType == 1) && InputCurrency(postingData.postType)}
                  </div>

                  {/* {isNSFWAllow && <hr />} */}


                  {!isLocked && !isStory && !sendLocked && <>
                    <div className="row my-2">

                      {<>
                        <hr className="" />
                        <div className="col-10 px-0">
                          <h6 className="nsfw__title">{lang.SchedulePost}</h6>
                          {/* <p className="text-muted fntSz12">{lang.SchedulePostPara}</p> */}
                        </div>
                        <div className="col-2 text-right px-0">
                          <Switch
                            checked={isScheduled}
                            onChange={(e) => {
                              setIsScheduled(!isScheduled)
                              if (e.value == "false") {
                                setScheduleTimePayload(new Date())
                                setScheduleTime(moment(new Date()).format("YYYY-MM-DD[T]HH:mm"));
                              }
                            }}
                            disabled={props.mode === 'edit'}
                          />
                        </div>
                        {(isScheduled && props.mode !== 'edit') || (isScheduled && postStatus !== 1) ? <div className="form-group col-12 mt-2 px-0">
                          <div>
                            <div className="dateTimePickerContainer">
                              <DateAndTimePicker value={scheduleTime} dateTimeStamp={moment(scheduleTime, "YYYY-MM-DD[T]HH:mm").unix() * 1000} setDateTimeStamp={(time) => { handleScheduleTimeChange(time) }} />
                            </div>
                            {typeof scheduleTimePayload !== "object" && !isDateValid() ? <span className="fntSz10 text-danger font-weight-bold">Enter valid Date and Time</span> : ""}
                          </div>

                        </div> : ""}
                      </>}
                      {/* <div className="col-12">

                      {isNSFWAllow && <NSFWComponent />}
                    </div> */}
                    </div>

                  </>
                  }
                  {/* <div className="my-4">
                <div style={{ width: "10%", margin: "0 0 0 auto" }}>
                  <Button
                    cssStyles={theme.blueButton}
                    onClick={() => submitPost()}
                    disabled={!isValid}>
                    {lang.share}
                  </Button>
                </div>
              </div> */}
                </div>
              </div>
              <div className="submit-button specific_section_bg">
                <Button
                  type="button"
                  fclassname='gradient_bg rounded-pill py-3 d-flex align-items-center justify-content-center text-white createBtn'
                  btnSpanClass='text-white'
                  btnSpanStyle={{ lineHeight: '0px', paddingTop: '2.5px' }}
                  onClick={() => {
                    if (selectedFiles.find(f => !f.mediaContentId && !f.isEdit)) {
                      setOpenFileInput(true);
                      setAutoUpload(Date.now())
                    } else {
                      handleBeforeUpload([], () => { })
                    }
                  }}
                  disabled={!isValid} coverStep
                  children={sendLocked ? lang.send : props.mode === 'edit' ? "Update" : lang.create}
                />
              </div>
            </div>
          </div>
        </div> : ""
      }
      {
        currentStep === 2 || coverStep === 1 ? (<SelectMediaFrom handleSelect={handleSelectFrom} onClose={() => { setCurrentStep(1); setCoverStep() }} />) : ""
      }

      {
        currentStep === 3 || coverStep === 3 ? (<div className={`${mobileView ? 'overflow-auto' : ""} sectionWrap`} id="sectionWrap">
          <SelectFromVault
            removePostFile={handleRemoveFile}
            selectedFiles={coverStep === 3 ? previewData.filter(f => f.mediaContentId) : selectedFiles.filter(f => f.mediaContentId)}
            handleSelectFiles={handleFileSelectVault}
            selectedFolder={selectedFolder}
            uploadFromDevice={handleSelectFromDevice}
            handleSelect={handleSelectFromVault}
            onClose={() => { setCurrentStep(1); setCoverStep(); setSelectedFolder() }}
            sharedTo={sendLocked ? props.sendTo : ''}
            sharedType={sharedType}
          />
        </div>) : ""
      }

      <style jsx>{`
          .close_icon {
            top: 0.75rem;
            right: 1.5rem;
          }
        :global(.POST_DIALOG .MuiDialog-paper){
            min-width:600px !important;
            max-height:90vh !important;
        }
        :global(.MuiFormGroup-root){
            margin-bottom:0 !important;
        }
        .custom_mui_selector :global(.MuiFormGroup-root){
            flex-direction:row;
        }
        .custom_mui_selector :global(.MuiFormControlLabel-labelPlacementStart){
            flex-direction:row;
        }
        :global(.POST_DIALOG .MuiDialogContent-root){
            padding:0 0px !important;
            border-radius:5px;
            background: ${theme.background};   
            overflow-y: ${currentStep === 1 ? 'hidden' : 'auto'} !important;
        }
        :global(.MuiTypography-body1){
          font-size :15px !important;
        }
        .cancel__icon{
            font-size:2rem;
            color: var(--l_app_text);
        }
        :global(.MuiAvatar-colorDefault, .hashtags) {
          font-family: cursive;
          font-size: x-large;
          background-color: ${theme.appColor};
          color: ${theme.background};
        }
         .suggestion__box {
          height: auto;
          position: absolute;
          padding-right: 20px;
          padding-left: 10px;
          top: 100px;
          left: 0px;
          border: 2px solid #7d7a7a;
          border-radius: 8px;
          background: ${theme.background};
          color: ${theme.text};
          z-index: 1;
        }
        .tag__box {
          background: ${theme.background};
          color: ${theme.text};
        }
        .text__color{
          color: #000 !important;
        }
        :global(.nsfw__title){
          color: var(--l_app_text);
          font-size: 14px !important;
        }
        
        
        .txt_area{
          border-radius: 8px;
          background: #2D2639;
          border:none
        }
        .bg__dt{
          background: ${theme.background};
        }
        :global(input[type=datetime-local]::-webkit-calendar-picker-indicator){
          filter: ${theme.type === "light" ? "" : "invert(1)"};
          cursor:pointer;
        }
        .newBox{
          border-radius: 8px;
          background: #2D2639;
          padding-top: 10px;
          padding-bottom: 10px;
          margin-bottom:10px !important;
        }
        .newBox1 textarea {
          border-radius: 8px;
          border: 2px solid var(--l_border);
          background: transparent;
          margin-bottom:10px !important;
        }
        .buttonColor{
          background: var(--l_base);
          color: #fff !important;
          border-radius: 150px;
         
        }
        :global( .MuiFormGroup-root) {
          display: flex;
           flex-direction: row! important;
      }
      .cancel__icon{
        font-size: 1.3rem; 
      }
      .myPostSubscription{
        background: var(--l_profileCard_bgColor);
        
      }
      .postModal {
        font-family: "Roboto", sans-serif !important;
        font-size: 14px !important;
        color: var(--l_app_text) !important;
        overflow-y: ${mobileView ? 'scroll !important' : 'inherit'};
        max-height: 100vh;
      }
      :global(.postModal .close_icon) {
        right: 10px !important;
        top: 0 !important;
      }
      :global(.img-style){
        object-fit: contain !important;
        background: #2D2639;
      }
      :global(.postLabel) {
        color: var(--l_app_text);
        font-weight: 400;
        font-size: '16px';
      }
      
      :global(.postLabelLight) {
        color: var(--l_light_app_text) !important;
        font-weight: 400;
        font-size: 16px;
      }
      :global(.postTobtn) {
        height: 44px
      }
      :global(.postTobtn span) {
        font-size: 14px
      }
      :global(.postType .MuiFormControlLabel-label) {
        font-size: 12px;
        text-wrap: nowrap;
        white-space: nowrap;
        font-weight: 500;
      }
      :global(.postType .MuiSvgIcon-root) {
        fill: var(--l_light_app_text);
        height: 20px;
        width: 20px;
      }
      .postHeader {
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .submit-button {
        position: ${mobileView ? 'fixed' : ' sticky'};
        width: ${mobileView ? 'calc(100% - 1rem)' : '100%'};
        bottom: 0;
        padding: 1rem;
        background: var(--l_profileCard_bgColor) !important;
      }
      :global(.CREATE_POST .MuiDrawer-paper) {
        border-top-left-radius: 20px !important;
        border-top-right-radius: 20px !important;
      }
      :global(.MuiDrawer-paperAnchorBottom) {
        bottom: -1px !important;
      }
      :global(.mainTitle) {
        font-size: ${mobileView ? '1.3rem' : '1.75rem'} !important;
        font-weight: 500 !important;
      }
      :global(.POST_EDIT_DIALOG) {
        min-width: 600px !important;
      }
      :global(.postType .MuiFormControlLabel-label.Mui-disabled) {
        color: var(--l_light_app_text);
      }
      `}</style>
    </div >
  );
};

export default PostDialog;