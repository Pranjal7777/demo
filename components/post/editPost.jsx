import Router, { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Head from 'next/head';
import Header from "../../components/header/header";
import Wrapper from "../../components/wrapper/wrapper";
import { getCookiees } from "../../lib/session";
import {
  close_dialog,
  close_drawer,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
  UploadImage,
} from "../../lib/global";
import ImageContainer from "../../containers/post/imageContainer";
import VideoContainer from "../../containers/post/videoContainer";
import TextAreaContainer from "../../containers/post/textAreaContainer";
import {
  creatorSearch,
  getPostById,
  updatePost,
} from "../../services/assets";
import TextArea from "../../components/formControl/textArea";
import Image from "../../components/image/image";
import {
  defaultCurrency,
  defaultCurrencyCode,
  EMPTY_PROFILE,
  FOLDER_NAME_IMAGES,
  IMAGE_TYPE,
  INFO,
  PROFILE_INACTIVE_ICON,
} from "../../lib/config";
import { createPopper } from "@popperjs/core";
import { css } from "emotion";
import CustomHead from "../../components/html/head";
import Img from "../../components/ui/Img/Img";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import DvHeader from "../../containers/DvHeader/DvHeader";

import Button from "../../components/button/button";
import { ValidateTwoDecimalNumber } from "../../lib/validation/validation";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { getHashtagAPI, getPopularHashtagsAPI } from "../../services/hashtag";
import { getCognitoToken } from "../../services/userCognitoAWS";
import fileUploaderAWS, { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import Switch from "../../components/formControl/switch";
import PlaceholerComponent from "../../containers/post/placeholderContainer";
import { Avatar } from "@material-ui/core";
import moment from "moment";
import { isAgency } from "../../lib/config/creds";

const RadioButtonsGroup = dynamic(
  () => import("../../components/radio-button/radio-button-group"), { ssr: false }
);
const CancelIcon = dynamic(() => import("@material-ui/icons/Cancel"), { ssr: false });

const EditPost = (props) => {
  const theme = useTheme();
  const router = useRouter();
  const fileObject = useRef([]);
  const [file, setFile] = useState(null);
  const postTpe = useRef(1);
  const [postingData, setPostingData] = useState({});
  const [randomCount, setRandomCount] = useState(0);
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const [textPost, setTextPost] = useState('')
  const [isUserTagged, setIsUserTagged] = useState(false);
  const [textColor, setTextColor] = useState('#fff');
  const [bgColor, setBgColor] = useState("#003973")
  const [colorPicker, setColorPicker] = useState(false)
  const [fontStylePicker, setFontStylePicker] = useState(false)
  const [font, setFont] = useState();
  const [NSFW, setNSFW] = useState(false);
  const [mediaType, setMediaType] = useState(null);
  const [selectedPostType, setSelectedPostType] = useState(null);
  const [isScheduled, setIsScheduled] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [scheduleTime, setScheduleTime] = useState(new Date());
  const [type, setType] = useState();
  const fileSelect = useRef(null);
  const videoSelect = useRef(null);
  const textSelect = useRef(null);
  const [textAlignPicker, setTextAlignPicker] = useState(false)
  const [textAlign, setTextAlign] = useState()
  const [postTo, setPostTo] = useState(2)
  const [isValidPrice, setValidPrice] = useState()
  const isStory = parseInt(postTo) === 1
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

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

  // Redux Tools
  const subscriptionPlanCount = useSelector(
    (state) => state?.profileData?.subscriptionData?.planCount
  );
  const subscriptionPlan = useSelector((state) => state?.subscriptionPlan);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const isNSFWAllow = useSelector((state) => state?.profileData?.isNSFWAllow);
  let today = new Date().toISOString().slice(0, 16);
  const [currentTime, setCurrentTime] = useState(moment().unix());
  const drawerss = {
    2: {
      title: lang.feedPost,
      desc: lang.feedPostDesc,
    },
    1: {
      title: lang.exclusivePost,
      desc: lang.exclusivePostDesc,
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

  // Hashtag States
  const [selectedHashTags, setSelectedHashTags] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const oldCursorPos = useRef(0)
  const currentTagWord = useRef("")

  const [postingPayload, setPostingPayload] = useState({
    postType: "2",
  });
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().unix());
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);
  const isDateValid = currentTime <= moment(scheduleTime).unix() ? true : false;
  useEffect(() => {
    // const popcorn = document.querySelector("#post-caption");
    // const tooltip = document.querySelector("#tooltip");
    // createPopper(popcorn, tooltip);
    startLoader()
    getPostById(props.postId)
      .then((res) => {
        const data = res?.data?.result[0];
        if (data) {
          getCreatorsList(data.taggedUserIds || []);
          setMediaType(data.mediaType);
          setSelectedPostType(data.mediaType == 4 ? 4 : 3)
          setPostingData(data);
          setBgColor(data.postData[0].bgColorCode)
          setFont(data.postData[0].font)
          setTextPost(data.postData[0].text || '')
          setTextAlign(data.postData[0].textAlign)
        }
        setPostingPayload((prevData) => {
          return {
            ...prevData,
            postId: data.postId,
            postType: data.postType,
            assetType: data.assetType,
            // postTo: postTo,
            price: data.price,
            // sharedOnPersonalFeed: data.sharedOnPersonalFeed,
            // sharedOnStory: data.sharedOnStory,
            description: data.description,
            postData: data.postData,
            taggedUserIds: data.taggedUserIds || undefined
          };
        });
        fileObject.current[0] = {
          ...data.postData[0],
        };
        validatePosting();
        if (data.price) {
          pushDataInPostingPayload("price", data.price);
        }
        stopLoader()
      })
      .catch((err) => {
        stopLoader()
        console.error("ERROR IN POST_EDIT UseEffect", err);
      });
  }, []);

  useEffect(() => {
    if (fileObject.current.length) {
      validatePosting();
    }
  }, [
    fileObject.current.length,
    postingPayload.postType,
    postingPayload.price,
    isValidPrice,
  ]);

  useEffect(() => {
    setSuggestions([]);
  }, [NSFW]);

  const handleCloseDialouge = () => {
    Router.reload()
    close_dialog()
  }

  const submitPost = async (description) => {
    const userId = isAgency() ? selectedCreatorId : getCookiees("uid");
    const posts = [];
    startLoader();
    close_dialog();
    const cognitoToken = await getCognitoToken();
    const tokenData = cognitoToken?.data?.data;
    if (parseInt(mediaType) == 4) {
      posts.push({
        type: 4,
        text: textPost,
        bgColorCode: bgColor,
        font: font || 'undefined',
        colorCode: textColor,
        textAlign
      }
      );
    }
    else {
      const imgFolderName = `${userId}/${FOLDER_NAME_IMAGES.post}`;
      const thumbFolderName = `${userId}/${FOLDER_NAME_IMAGES.videoThumb}`;
      for (let i = 0; i < fileObject.current.length; i++) {
        let url;
        if (fileObject.current[i].url) {
          url = fileObject.current[i].url;
        } else {
          const imgFileName = `${Date.now() + fileObject.current[i]?.filesObject?.name}`;
          url =
            parseInt(mediaType) == 1
              ? await fileUploaderAWS(fileObject.current[i].filesObject, tokenData, imgFileName, false, imgFolderName, false, true)
              : "";
        }
        var postImage = {
          seqId: i + 1,
          type: parseInt(mediaType),
          url: url,
        };
        if (parseInt(mediaType) == 2) {
          const thumb = fileObject.current[i].thumbnail
            ? fileObject.current[i].thumbnail
            : await fileUploaderAWS(fileObject.current[i].files, tokenData, `thumb_${Date.now()}.png`, false, thumbFolderName, true);
          postImage["thumbnail"] = thumb || "";
        }
        posts.push(postImage);
      }
    }

    let taggedUserIds = [...postingPayload.taggedUserIds];

    // Removed Tagged Users if Content is NSFW
    if (!NSFW) {
      Object.keys(selectedTags).map((item) => {
        if (postingPayload["description"].includes("@" + item) &&
          !taggedUserIds.includes(selectedTags[item].userId)
        ) {
          return taggedUserIds.push(selectedTags[item].userId);
        }
      });
    }

    let hashTags = []
    if (description) {
      let desc = description?.replace(/(\r\n|\n|\r)/gm, " ");
      let hashtagFinder = desc?.split(" ");
      hashtagFinder?.map((hasht) => {
        if (hasht[0] === "#") {
          return hashTags.push(hasht)
        }
      });
    }

    const payload = {
      "mediaType": mediaType,
      "videoDuration": 0,
      "isScheduled": false,
      "scheduledTimestamp": 0,
      "isNSFW": false,
      ...postingPayload,
      assetType: postingPayload.assetType,
      currency: {
        currency_code: defaultCurrencyCode,
        symbol: defaultCurrency,
      },
      postData: posts,
    }
    

    // const payload = {
    //   postedOn: "2",
    //   userId: userId,
    //   sharedOnGroupFeed: false,
    //   platform: "3",
    //   hashTags: [],
    //   ...postingPayload,
    //   assetType: postingPayload.assetType,
    //   currency: {
    //     currency_code: defaultCurrencyCode,
    //     symbol: defaultCurrency,
    //   },
    //   taggedUserIds,
    //   postData: posts,
    // };

    if (postingPayload.postType != "1") {
      delete payload["price"];
    }
    if (NSFW) {
      payload["isNSFW"] = NSFW;
    }

    if (hashTags?.length > 0) {
      payload["hashTags"] = hashTags
    }
    if (isScheduled) {
      payload["isScheduled"] = isScheduled;
      payload["scheduledTimestamp"] = moment(scheduleTime).unix();
    }
    if(payload["taggedUserIds"] && !payload["taggedUserIds"].length) {
      delete payload.taggedUserIds
    }
    if(payload["hashTags"] && !payload["hashTags"].length) {
      delete payload.hashTags
    }
    delete payload.postType
    updatePost(payload)
      .then((data) => {
        stopLoader();
        mobileView
          ? 
          Router.push("/profile")
          : handleCloseDialouge()
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
          // validatePosting()
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
        validatePosting();
      }
    }
  };


  const SelectType = () => {
    mobileView
      ? open_drawer("radioSelectore", {
        button: lang.continue,
        title: lang.upload,
        value: type,
        data: [
          {
            name: "posting",
            value: 1,
            label: lang.uploadPhoto,
          },
          {
            name: "posting",
            value: 2,
            label: lang.uploadVideo,
          },
          {
            name: "posting",
            value: 4,
            label: lang.uploadText,
          },
        ].map((option) => {
          return option;
          ``;
        }),
        onSelect: (type) => {
          setType(type);
          postTpe.current = type;
          type == 1
            ? fileSelect.current.click()
            : type == 2
              ? videoSelect.current.click()
              : textSelect.current.click()
        },
      },
        "bottom"
      )
      : open_dialog("radioSelector", {
        button: lang.continue,
        title: lang.upload,
        value: type,
        data: [
          {
            name: "posting",
            value: 1,
            label: lang.photos,
          },
          {
            name: "posting",
            value: 2,
            label: lang.video,
          },
          // {
          //     name: "posting",
          //     value: 4,
          //     label: lang.text,
          // },
        ].map((option) => {
          return option;
          ``;
        }),
        onSelect: (type) => {
          setType(type);
          postTpe.current = type;
          type == 1
            ? fileSelect.current.click()
            : videoSelect.current.click()
          // type == 2
          // ? videoSelect.current.click()
          //     : textSelect.current.click()
        },
      });
  };

  const pushDataInPostingPayload = async (key, value) => {
    if (
      value == 2 && key == "postType" &&
      !(subscriptionPlan?.length > 0 || subscriptionPlanCount)
    ) {
      mobileView
        ? open_drawer(
          "confirmDrawer",
          {
            title: lang.feedPostConfirm,
            subtitle: lang.feedPostConfirmSubtitlte,
            cancelT: lang.notNow,
            submitT: lang.yes,
            yes: () =>
              setTimeout(() => {
                open_drawer("SubscriptionSettings", {}, "right");
              }, 500),
          },
          "bottom"
        )
        : open_dialog("confirmDialog", {
          title: lang.feedPostConfirm,
          subtitle: lang.feedPostConfirmSubtitlte,
          cancelT: lang.notNow,
          submitT: lang.yes,
          yes: () => {
            startLoader();
            Router.push("/subscription-settings");
            close_dialog("confirmDialog");
            stopLoader();
          },
        });
      value = 3;
    }

    if (key == "price") {
      const regex = ValidateTwoDecimalNumber(value);
      const decimalRegex = /^(?:\d*\.\d{0,2}|\d+)$/.test(value);
      if (regex || !value) {
        setValidPrice(regex)
        await setPostingPayload((prevData) => {
          return {
            ...prevData,
            [key]: value,
          };
        });
      } else if (decimalRegex) {
        setValidPrice(false)
        await setPostingPayload((prevData) => {
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

  const inputCurrency = (type) => {
    return (
      <div className="relative d-flex align-items-center posting-input-block ml-3">
        <div className="DV_posting-currency">
          {defaultCurrency}
        </div>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={postingPayload.price || ""}
          onChange={(e) => pushDataInPostingPayload("price", e.target.value)}
          className="exclusive-post-txtBx"
          disabled
        />
      </div>
    )
  }

  const getPostType = (data) => {
    const { label, name, value } = data;
    return (
      <div className="row justify-content-between mb-1">
        <div className="col-6">
          <h6 className={`mv_create_post_toggler mb-0 `}>
            {label}{" "}
            {mobileView && (
              <Image src={INFO} width={12} className="align-top ml-1" />
            )}
          </h6>
        </div>
        <div className="col-6 text-right">
          <Switch
            onChange={(val) => {
              if (val.value) {
                pushDataInPostingPayload("postType", value);
              } else {
                pushDataInPostingPayload("postType", 3);
              }
            }}
            disabled
            checked={postingPayload.postType == value}
          />
        </div>
        {!mobileView && (
          <div className="col-12">
            <p className="text-muted" style={{ fontSize: "13px" }}>
              {drawerss[value].desc}
            </p>
          </div>
        )}

        {postingPayload.postType == 1 && value == 1 && inputCurrency(value)}
        {postingPayload.postType == 4 && value == 4 && inputCurrency(value)}
      </div>
    );
  };

  const postToSelectHandler = (val) => {
    setPostTo(val)
    // pushDataInPostingPayload("sharedOnPersonalFeed", val == 2);
    // pushDataInPostingPayload("sharedOnStory", val == 1);
    pushDataInPostingPayload("postType", 3);
  };

  
  const handleScheduleTimeChange = (dateObj) => {
    setScheduleTime(moment(dateObj.target?.value).format("YYYY-MM-DDTHH:mm"))
  }

  const hashtagUI = () => {
    return mobileView
      ?
      <div
        className="position-absolute drawerBgColor shadowBoxTaged"
        style={{ width: '92%', zIndex: 1, top: '90px', maxHeight: '200px', overflowY: 'scroll', overflowX: 'hidden' }}>
        {hashtags && hashtags?.length
          ? hashtags.map((hashtag, index) => (
            <div key={index} className="d-flex justify-content-center tagTile align-items-center py-1 my-1 cursorPtr"
              onClick={() => hashTagHandler(hashtag)}
            >
              <div className="col-2">
                <Avatar className="hashtags" style={{ color: theme.palette.white }}>#</Avatar>
              </div>
              <div className="col-10">
                <p className="m-0 bold fntSz14 text-app">{hashtag.name}</p>
                <p className="m-0 fntSz10 text-app">{`${hashtag.noOfPost} ${hashtag.noOfPost > 1 ? lang.posts : lang.post}`}</p>
              </div>
              <hr className="m-0" />
            </div>
          ))
          : ""}
      </div>
      : <div
        className="position-absolute drawerBgColor"
        style={{ width: '92%', zIndex: 1, top: '70px', maxHeight: '190px', overflowY: 'scroll', overflowX: 'hidden' }}>
        {hashtags?.length
          ? hashtags.map((hashtag, index) => (
            <div key={index} className="d-flex flex-row justify-content-start align-items-center py-1 my-1 cursorPtr"
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
  }

  const TagUserUI = () => {
    return mobileView
      ? <div id=""
        className="w-100 position-absolute drawerBgColor shadowBoxTaged"
        style={{ zIndex: 1, transform: "translateY(-100%)", position: 'absolute', top: '-10px !important', maxHeight: '150px', overflowY: 'scroll', overflowX: 'hidden' }}>
        {suggestions?.length
          ? suggestions.map((item) => (
            <div key={item.userId} className="d-flex flex-row tagTile justify-content-start align-items-center py-1 my-1"
              onClick={() => itemSelectHandler(item)}
            >
              <div className="px-3">
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
          : ""}
      </div>
      : <>
        <div
          className="position-absolute drawerBgColor"
          style={{ width: '92%', zIndex: 1, top: '70px', maxHeight: '190px', overflowY: 'scroll', overflowX: 'hidden' }}>
          {suggestions?.length
            ? suggestions.map((item, index) => (
              <div key={index} className="d-flex flex-row justify-content-start align-items-center py-1 my-1 cursorPtr"
                onClick={() => itemSelectHandler(item)}
              >
                <div className="px-3">
                {item.profilePic ? <Avatar alt={item.firstName} src={s3ImageLinkGen(S3_IMG_LINK, item?.profilePic)} />
                    : 
                    <div className="tagUserProfileImage">{item?.firstName[0] + (item?.lastName && item?.lastName[0])}</div>
                    }
                </div>
                <div className="">
                  <p className="m-0 bold fntSz14 text-app">{item.username}</p>
                  <p className="m-0 fntSz10 text-app">@{item.username}</p>
                </div>
                <hr className="m-0" />
              </div>
            ))
            : ""}
        </div>
      </>
  }


  const changeThumbanail = (thumb, index) => {
    setFile((prevState) => {
      return {
        ...prevState,
        selectedThumb: index,
        files: thumb,
      };
    });
    if (thumb) {
      fileObject.current[0] = {
        ...postingPayload.postData[0],
        files: thumb,
      };
      delete fileObject.current[0].thumbnail;
    }
    close_drawer();
  };

  const itemSelectHandler = async (item) => {
    const words = postingPayload["description"].split("\n").join(" ").split(" ");
    let caption = postingPayload["description"];
    const taggedWords = currentTagWord.current
    if (
      Object.keys(selectedTags).includes(item.username) &&
      postingPayload["description"].includes(item.username)
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
    const words = postingPayload["description"].split("\n").join(" ").split(" ");
    let caption = postingPayload["description"];
    const taggedWords = currentTagWord.current
    if (selectedHashTags.includes(hashtag.name) &&
      postingPayload["description"].includes(hashtag.name)) {
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

  const remove = (e) => {
    e && e.stopPropagation();
    fileObject.current = [];
    validatePosting();
    setFile(null);
  };

  const getCreatorsList = async (searchText, initialData) => {
    if (searchText?.length > 0) {
      const list = {
        search: searchText || "",
      };
      if (isAgency()) {
        list["userId"] = selectedCreatorId;
      }

      creatorSearch(list)
        .then((res) => {
          if (res && res?.data) {
            setSuggestions(res?.data?.data);
            if (initialData) {
              setSuggestions([]);
              res.data.data.map((item) => {
                if (postingPayload["taggedUserIds"].includes(item.userId)) {
                  setSelectedTags({
                    ...selectedTags,
                    [item.username]: item,
                  });
                }
              });
            }
          } else {
            return setSuggestions([]);
          }
        })
        .catch((err) => {
          console.error("ERROR IN getCreatorsList", err);
          setSuggestions([]);
        });
    }
  };

    useEffect(()=>{
      if(!isScheduled){
        setScheduleTime(new Date())
      }
        },[isScheduled])

      useEffect(()=>{
        validatePosting()
          },[isScheduled,scheduleTime])

  const validatePosting = () => {
    const {
      postType,
      title,
      sharedOnPersonalFeed,
      sharedOnStory,
      price,
    } = postingPayload;

    if (fileObject.current.length <= 0) return setIsValid(false);
    if (!postType) return setIsValid(false);
    // if (!sharedOnPersonalFeed && !sharedOnStory) return setIsValid(false);
    if (postType == 1 && !isValidPrice) return setIsValid(false);
    if(isScheduled){
      if(typeof scheduleTime=="object") return setIsValid(false)  
      if (!isDateValid) return setIsValid(false);
      if (!scheduleTime || scheduleTime === "Invalid date") return setIsValid(false); 
     }

    return setIsValid(true);
  };

  const NSFWComponent = () => {
    return (
      <div className="row mb-4">
        <div className="col-10">
          {mobileView
            ? <h6 className="mv_create_post_title">
              {lang.nsfwConfig}
            </h6>
            : <h5 className="fntSz14">{lang.nsfwConfig}</h5>
          }


          <p className="text-muted fntSz12">{lang.nsfwText}</p>
        </div>
        <div className={`col-2${mobileView ? "" : " text-right"}`}>
          <Switch
            onChange={() => setNSFW(!NSFW)}
            checked={NSFW}
          />
        </div>
      </div>
    )
  }

          useEffect(()=>{
            setScheduleTime(moment(postingData.creationTs).format("dd mm yy"))
             if(postingData.isScheduled){
               setIsScheduled(true)
               setScheduleTime(postingData.creationTs)
             }
           },[postingData])

  return (
    <Wrapper>
      {!mobileView &&
        <>
          <Head>
            <script defer={true} src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" />
          </Head>

          <div className="bg__dt h-100">
            <div className="mySubscription h-100">
              <div
                className="h-100"
                style={{ padding: "0 10px 10px 10px" }}>
                <div className="py-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="cancel__button">
                      <p
                        className="cancel__icon mb-0 cursorPtr"
                        data-dismiss="modal"
                        onClick={() => props.onClose()}
                      >
                        {lang.btnX}
                      </p>
                    </div>
                    <div className="newpost__title">
                      <p className="txt-black mb-0">{lang.editPost}</p>
                    </div>
                    <div className="share__button">
                      <p
                        style={isValid ? { opacity: 1 } : { opacity: 0.6 }}
                        onClick={isValid ? ()=>submitPost(postingPayload.description) : () => { }}
                        className={`mb-0 txt-medium dv_base_color ${isValid ? 'cursorPtr' : ''}`} >{lang.update}</p>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="col-lg-6 custom_mui_selector pl-0 mb-4 mb-lg-0">
                    <div className="d-flex">
                      <RadioButtonsGroup
                        radioLabelClass="m-0 dv_appTxtClr post_label mb-3"
                        radioClass="text-muted"
                        formLabelClass={css`
                        height: 30px;
                      `}
                        labelPlacement="start"
                        value={selectedPostType}
                        onRadioChange={(selectedPostType) => {
                          setSelectedPostType(selectedPostType);
                        }}
                        disabled
                        buttonGroupData={[
                          mediaType != 4
                            ? { value: 3, label: "Media post" }
                            : { value: 4, label: "Text post" }
                        ]}
                      />
                    </div>
                    {mediaType == 1 && postingPayload.postData && (
                      <ImageContainer
                        defaultImage={
                          postingPayload.postData ? postingPayload.postData : []
                        }
                        onChange={(imgs) => {
                          setRandomCount(Math.random());
                          fileObject.current =
                            imgs &&
                            imgs.filter((_) => (_.files || _.url ? true : false));
                          validatePosting();
                          if (fileObject.current.length == 0) {
                            remove();
                          }
                        }}
                      />
                    )}
                    {mediaType == 2 && postingPayload.postData && (
                      <VideoContainer
                        defaultImage={
                          fileObject.current[0]
                            ? fileObject.current
                            : postingPayload.postData
                        }
                        editPost={true}
                        onChange={onVideoSelect}
                        changeThumbanail={changeThumbanail}
                      />
                    )}
                    {mediaType == 4 && postingPayload.postData && (
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
                    )}

                    {/* image select */}
                    <input
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
                    />

                    {/* video select */}
                    <input
                      style={{ display: "none" }}
                      type="file"
                      rows={1}
                      accept={"video/*"}
                      ref={(el) => (videoSelect.current = el)}
                      onChange={onVideoSelect}
                    />

                    {/* text select */}
                    <textarea
                      style={{ display: "none" }}
                      value={postingPayload["description"]}
                      className="form-control dv_textarea_lightgreyborder"
                      ref={(el) => (textSelect.current = el)}
                      rows={3}
                      autoFocus={true}
                      list="creators"
                      id="post-caption"
                      placeholder={lang.caption}
                    />


                  </div>
                  <div className="col-lg-6 scrollbar_hide modal__scroll">
                  <p className="m-0 fntSz13 font-weight-bold text-app">{lang.editPostDesc}</p>
                  {TagUserUI()}
                  {hashtagUI()}
                    <div className="position-relative">
                      {
                        selectedPostType != 4
                          ? (
                            <textarea
                              value={postingPayload["description"]}
                              className="txt_area my-3"
                              // autoFocus={true}
                              autoComplete="false"
                              list="creators"
                              id="post-caption"
                              placeholder={lang.addCaption}
                              onChange={(e) =>
                                handleCaptionChange(e, e.target.value)
                              }
                            />
                          )
                          : <></>
                      }

                      <div
                        id=""
                        className="w-100"
                        style={{
                          position: "absolute",
                          top: "-130px",
                          left: "0px",
                          maxHeight: '190px',
                          overflowY: 'scroll',
                          overflowX: 'hidden',
                        }}>
                        {suggestions.length ? (
                          <div
                            style={{
                              width: "fit-content",
                              minWidth: "250px",
                            }}
                            className="p-0"
                            id="match-list">
                            {suggestions.map((item) => {
                              return (
                                <div key={item.userid}>
                                  <p
                                    onClick={() =>
                                      itemSelectHandler(item)
                                    }
                                    className="tag__box p-1 m-0 d-flex flex-row justify-content-start align-items-center">
                                    <div className="px-3">
                                      <Avatar className="hashtags">
                                      {item.profilePic ? 
                                        <Img
                                          src={ s3ImageLinkGen(S3_IMG_LINK, item?.profilePic)}
                                          style={{
                                            backgroundColor: "white",
                                          }}
                                          onError={(e) => {
                                            e.target.style.backgroundColor =
                                              "black";
                                            e.target.style.padding =
                                              "4px";
                                            e.target.src = EMPTY_PROFILE;
                                          }}
                                          width={'100%'}
                                          height={'100%'}
                                          className="rounded"
                                          alt="profile"
                                        />: <div className="tagUserProfileImage" style={{width: "25px", height: "25px", fontSize: "0.865rem"}}>{item?.firstName[0] + item?.lastName[0]}</div>}
                                      </Avatar>
                                    </div>
                                    <div className="">
                                      <p className="m-0 fntSz14">
                                        {item.username}
                                        <span
                                          style={{
                                            fontSize: "12px",
                                          }}
                                          className="text-muted">
                                          (@{item.username})
                                        </span>
                                      </p>
                                    </div>
                                  </p>
                                  <hr className="m-0" />
                                </div>
                              );
                            })}
                          </div>
                        ) : ""}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <div className="my-2">
                          <h6 style={{ fontSize: '16px' }} className="mb-2 txt-heavy">{lang.postTo}</h6>
                          <RadioButtonsGroup
                            radioLabelClass="m-0 dv_appTxtClr post_label mb-3"
                            radioClass="text-muted"
                            formLabelClass={css`
                        height: 30px;
                      `}
                      disabled
                            labelPlacement="start"
                            value={postTo}
                            onRadioChange={(val) => postToSelectHandler(val)}
                            buttonGroupData={[
                              { value: 1, label: "Story" },
                              { value: 2, label: "Feed" },
                            ]}
                          />
                        </div>
                      </div>
                    </div>

                    {!mobileView && <hr />}

                    <div className="row">
                      <div className="col-12">
                        <div>
                          <h6 style={{ fontSize: '16px' }} className="mb-3 txt-heavy">{lang.postType}</h6>
                          {getPostType({
                            label: lang.teaserPost,
                            name: lang.teaserPost,
                            value: "3",
                          })}
                        </div>

                        {getPostType({
                          label: lang.feedPost,
                          name: lang.feedPost,
                          value: "2",
                        })}

                        {/* { !postingData.isScheduled &&  getPostType({
                          label: lang.lockedPost,
                          name: lang.lockedPost,
                          value: "4",
                        })} */}

                      {
                          getPostType({
                            label: lang.exclusivePost,
                            name: lang.exclusivePost,
                            value: "1",
                          })}
                      </div>
                    </div>

                    {!isLocked && !isStory && <>
                  <div className="row mb-4 newBox">
                  {/* <div className="col-12">
                    {isNSFWAllow && <NSFWComponent />}
                    </div> */}
                    {postingPayload.postType !== "4" && postingData.status != 1 && <>
                      <div className="col-10">
                        <h6 className="nsfw__title">{lang.SchedulePost}</h6>
                        <p className="text-muted fntSz12">{lang.SchedulePostPara}</p>
                      </div>
                      <div className="col-2 text-right">
                        <Switch
                           onChange={(e) => {
                            setIsScheduled(!isScheduled)
                            if(e.value =="false"){
                              setScheduleTime(new Date())
                            }
                           
                          } }
                          checked={isScheduled}
                            disabled
                        />
                      </div>
                      {isScheduled && <div className="form-group col-12 mt-2">
                      <input
                          type="datetime-local"
                          className="form-control ipt__brod mv_form_control_Input"
                          onChange={handleScheduleTimeChange}
                            value={moment(scheduleTime).format("YYYY-MM-DDTHH:mm")}
                            min={today}
                          />
                      </div>}
                        {typeof scheduleTime !== "object" && !isDateValid ? <span className="fntSz10 col-12 text-danger font-weight-bold">Enter valid Date and Time</span> : ""}

                    </>}
                  
                  </div>
                </>
                }
                    {/* {isNSFWAllow && !mobileView && <hr />} */}

                    {/* {isNSFWAllow && <NSFWComponent />} */}

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
              </div>
            </div>
          </div>
        </>
      }
      <style jsx>
        {`
         :global(.MuiDialog-paper){
            min-width:70vw !important;
            height:80vh !important;
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

          :global(.MuiDialogContent-root){
              padding:0 0px !important;
              overflow-y:hidden !important;
              border-radius:5px;
          }

          .cancel__icon{
              font-size:2rem;
              // font-weight:700;
              font-weight:500;
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
          :global(input[type=datetime-local]::-webkit-calendar-picker-indicator){
            filter: ${theme.type === "light" ? "" : "invert(1)"};
            cursor:pointer;
          }
          .tag__box {
            background: ${theme.background};
            color: ${theme.text};
          }
          .bg__dt{
            background: ${theme.background};
          }
        `}
      </style>
    </Wrapper>
  );
};

export default EditPost;
