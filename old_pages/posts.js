import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "@material-ui/core";
import Router, { useRouter } from "next/router";
import { createPopper } from "@popperjs/core";
import { css } from "emotion";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux"
import moment from "moment";
import Head from "next/head";

import { creatorSearch } from "../services/assets";
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
import {
  INFO,
  defaultCurrency,
  defaultCurrencyCode,
  PROFILE_INACTIVE_ICON,
  IMAGE_TYPE,
} from "../lib/config";
import {
  close_drawer,
  drawerToast,
  open_drawer,
  startLoader,
  stopLoader,
} from "../lib/global";
import { s3ImageLinkGen } from "../lib/UploadAWS/uploadAWS";
import { getCookiees } from "../lib/session";
import { generaeVideThumb } from "../lib/image-video-operation";
import { uploadPost } from "../lib/postingTask";
import useLang from "../hooks/language";
import CustomHead from "../components/html/head";
import Wrapper from "../components/wrapper/wrapper";
import { ValidateTwoDecimalNumber } from "../lib/validation/validation";
import { getPopularHashtagsAPI } from "../services/hashtag";

const Header = dynamic(() => import("../components/header/header"), { ssr: false });
const PlaceholerComponent = dynamic(() => import("../containers/post/placeholderContainer"), { ssr: false });
const ImageContainer = dynamic(() => import("../containers/post/imageContainer"), { ssr: false });
const Image = dynamic(() => import("../components/image/image"), { ssr: false });
const Switch = dynamic(() => import("../components/formControl/switch"), { ssr: false });
const VideoContainer = dynamic(() => import("../containers/post/videoContainer"), { ssr: false });
const TextAreaContainer = dynamic(() => import("../containers/post/textAreaContainer"), { ssr: false });
const RadioButtonsGroup = dynamic(() => import("../components/radio-button/radio-button-group"), { ssr: false });

const Post = (props) => {
  const theme = useTheme();
  const params = useRouter();
  const { query = {} } = params;

  const subscriptionPlanCount = useSelector((state) => state?.profileData?.subscriptionData?.planCount);
  const subscriptionPlan = useSelector((state) => state?.subscriptionPlan);

  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const isNSFWAllow = useSelector((state) => state?.profileData?.isNSFWAllow);
  const minPostValue = useSelector((state) => state?.appConfig?.minPurchasePost)
  const minLockedPostValue = useSelector((state) => state?.appConfig?.minLockedPostValue);
  const maxPurchasePost = useSelector((state) => state.appConfig.maxPurchasePost);
  const maxLockedPostValue = useSelector((state) => state?.appConfig?.maxLockedPostValue);


  const [type, setType] = useState("");
  const [file, setFile] = useState(null);
  const postTpe = useRef(1);
  const [lang] = useLang();
  const [videoDuration, setVideoDuration] = useState()
  const [textPost, setTextPost] = useState('')
  const [postTo, setPostTo] = useState(query.type === 'story' ? 1 : 2)
  const [isValidPrice, setValidPrice] = useState()
  const isStory = query.type === 'story' || parseInt(postTo) === 1

  const [textColor, setTextColor] = useState('#fff')
  const [bgColor, setBgColor] = useState("#003973")
  const [colorPicker, setColorPicker] = useState(false)
  const [fontStylePicker, setFontStylePicker] = useState(false)
  const [font, setFont] = useState()
  const [lowesPostPrice, setLowesPostPrice] = useState(minPostValue);
  const [NSFW, setNSFW] = useState(false);
  const oldCursorPos = useRef(0)
  const currentTagWord = useRef("")
  const [isScheduled, setIsScheduled] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [scheduleTime, setScheduleTime] = useState(new Date());
  const [textAlignPicker, setTextAlignPicker] = useState(false)
  const [textAlign, setTextAlign] = useState("left")
  const [currentTime, setCurrentTime] = useState(moment().unix());
  let today = new Date().toISOString().slice(0, 16);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().unix());
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);
  const isDateValid = currentTime <= scheduleTime / 1000 ? true : false;
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

  // Hashtag States
  const [selectedHashTags, setSelectedHashTags] = useState([]);
  const [hashtags, setHashtags] = useState([]);

  const [postingData, setPostingPayload] = useState({
    // sharedOnStory: false,
    // sharedOnPersonalFeed: true,
    postType: isStory ? 3 : subscriptionPlan?.length > 0 ? 2 : 3,
  });

  // Product Local State
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productQualityToSell, setQaulityToSell] = useState();
  const [productMRP, setProductMRP] = useState();
  const [productDiscounted, setProductDiscounted] = useState();

  const fileSelect = useRef(null);
  const videoSelect = useRef(null);
  const textSelect = useRef(null);
  const fileObject = useRef([]);

  useEffect(() => {
    setLowesPostPrice(minPostValue)
    pushDataInPostingPayload("price", minPostValue)
  }, [minPostValue, postingData.postType])

  useEffect(() => {
    if ((fileObject.current.length > 0 || textPost != '') && postingData.postType == 1) {
      return setIsValid(postingData.price >= lowesPostPrice)
    }
  }, [postingData.postType, postingData])

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

  const handleScheduleTimeChange = (dateObj) => {
    setScheduleTime(moment(dateObj.target?.value).unix()*1000);
  }
  const pushDataInPostingPayload = async (key, value) => {
    if (value == 2 && key == "postType" && !(subscriptionPlan?.length > 0 || subscriptionPlanCount)) {

      open_drawer("confirmDrawer", {
        title: lang.feedPostConfirm,
        subtitle: lang.feedPostConfirmSubtitlte,
        cancelT: lang.notNow,
        submitT: lang.yes,
        yes: () => setTimeout(() => {
          open_drawer("SubscriptionSettings", {}, "right")
        }, 500)
      }, "bottom");

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

  useEffect(() => {
    validaPosting();
  }, [textPost]);

  useEffect(() => {
    setSuggestions([]);
  }, [NSFW]);

  useEffect(() => {
    const popcorn = document.querySelector("#post-caption");
    const tooltip = document.querySelector("#tooltip");
    createPopper(popcorn, tooltip);
  }, []);

  useEffect(() => {
    validaPosting();
  }, [fileObject.current.length, postingData.postType, postingData.price, isValidPrice, file?.files])

  const inputCurrency = (type) => {
    return (
      <div className="relative d-flex align-items-center posting-input-block ml-3">
        <div
          className="DV_posting-currency">
          {defaultCurrency}
        </div>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={postingData.price}
          onChange={(e) => pushDataInPostingPayload("price", e.target.value)}
          className="exclusive-post-txtBx"
        />
        {type == 4
          ? (postingData.price < minLockedPostValue || postingData.price > maxLockedPostValue) &&
          <p className="bold position-absolute fntSz12 dv__red_var_1 mt-1 managerMarginPost">
              {lang.lockedPostLeastAmt} {defaultCurrency} {minLockedPostValue} {lang.maxText} {defaultCurrency} {maxLockedPostValue}
          </p>
          : (postingData.price < lowesPostPrice || postingData.price > maxPurchasePost) &&
          <p className="bold position-absolute fntSz12 dv__red_var_1 managerMarginPost">
              {lang.exclusivePostLeastAmt} {defaultCurrency} {lowesPostPrice} {lang.maxText} {defaultCurrency} {maxPurchasePost}          </p>
        }
        <style jsx>
    {`
    .managerMarginPost{
      margin-top: 5.5rem !important;
    }
    `}
        </style>
      </div>
    )
  }

  const getPostType = (data) => {
    const { label, value } = data;
    return (
      <div className={`row justify-content-between ${(postingData.price < minLockedPostValue || postingData.price > maxLockedPostValue) && value === "4" && postingData.postType === "4" ? "mb-4" : "mb-2"}`}>
        <div className="col-8">
          <h6 className="mv_create_post_toggler mb-0 font-weight-bold mt-2">
            {label}{" "}
            <Image
              src={INFO}
              alt="I button to give information about Post"
              width={12}
              className="align-top ml-1"
              onClick={(e) => {
                e && e.stopPropagation();
                drawerToast({
                  ...drawerss[value],
                  // closeIconVisible: false,
                  icon: true,
                  closeIconVisible: true,
                  isMobile: true,
                });
              }}
            />
          </h6>
        </div>
        <div className="col-4 text-right">
          <Switch
            onChange={(val) => {
              if (val.value) {
                pushDataInPostingPayload("postType", value);
              } else {
                pushDataInPostingPayload("postType", 0);
              }
            }}
            checked={postingData.postType == value}
          />
        </div>
        {postingData.postType == 1 && value == 1 && inputCurrency(value)}
        {postingData.postType == 4 && value == 4 && inputCurrency(value)}
      </div>
    );
  };

  const submitPost = async () => {
    const userId = getCookiees("uid");

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

    // const postingPayload = {
    //   assetType: "1",
    //   postedOn: "2",
    //   userId,
    //   sharedOnGroupFeed: false,
    //   platform: "3",
    //   currency: {
    //     currency_code: defaultCurrencyCode,
    //     symbol: defaultCurrency,
    //   },
    //   postData: [{
    //     type: parseInt(type),
    //     text: textPost,
    //     bgColorCode: bgColor,
    //     font: font,
    //     colorCode: textColor,
    //     textAlign
    //   }],
    //   taggedUserIds,
    //   videoDuration,
    //   ...postingData,
    // };

    const postingPayload = {
      "postType": 1,
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
      ...postingData
    }

    if (hashTags?.length > 0) {
      postingPayload["hashTags"] = hashTags
    }

    if (taggedUserIds?.length > 0) {
      postingPayload["taggedUserIds"] = taggedUserIds
    }

    if (type == 4 || type == 6) {
      delete postingPayload["videoDuration"];
      delete postingPayload["description"];
      delete postingPayload["hashtags"]
    }
    if (postingData.postType == "2" || postingData.postType == "3") {
      delete postingPayload["price"];
    }
    if (NSFW) {
      postingPayload["isNSFW"] = NSFW;
    }
    if (isScheduled) {
      postingPayload["isScheduled"] = isScheduled;
      postingPayload["scheduledTimestamp"] = scheduleTime/1000;
    }

    const storyPayload = {
      storyType: parseInt(postingPayload.postType),
      storyData: postingPayload.postData,
      price: postingPayload.price,
      currency: postingPayload.currency,
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

    if (type === "6") {
      if (productDescription) {
        postingPayload.description = productDescription;
      }

      const productPayload = {
        "price": productMRP,
        "title": productName,
        "metadata": {
          "discountPrice": productDiscounted,
          "currentStock": productQualityToSell,
          // UP_FOR_SALE, NOT_FOR_SALE 
          "productStatus": "UP_FOR_SALE",
        }
      }

      postingPayload = { ...postingPayload, ...productPayload };
    }

    if (type == 4) {
      delete postingPayload["description"];
      delete storyPayload["description"];
      delete postingPayload["hashTags"]
      delete storyPayload["hashTags"]
      delete postingPayload["taggedUserIds"]
      delete storyPayload["taggedUserIds"]
    }
    if (type != 4) {
      uploadPost({
        fileObject: fileObject.current,
        type: parseInt(type),
        lang,
        isStory: isStory,
        videoDuration: parseInt(videoDuration),
        requestPayload: isStory
          ? storyPayload
          : postingPayload,
      });
    } else {
      uploadPost({
        mobileView: true,
        type: parseInt(type),
        lang,
        isStory: isStory,
        requestPayload: isStory
          ? storyPayload
          : postingPayload,
      });
    }
    Router.push("/");
  };

  const validaPosting = () => {
    const {
      postType,
      title,
      sharedOnPersonalFeed,
      sharedOnStory,
      price,
    } = postingData;

    if (!postType) return setIsValid(false);
    if (textPost != '') {
      if (postType == 2 || postType == 3) { return setIsValid(true) }
      else if ((postType == 1 && !isValidPrice) || isZero(price)) { return setIsValid(false) }
      else { return setIsValid(price >= lowesPostPrice) }
    }
    if (!file?.files) return setIsValid(false);
    if (fileObject.current.length <= 0) return setIsValid(false);
    // if (!sharedOnPersonalFeed && !sharedOnStory) return setIsValid(false);
    if ((postType == 1 && !isValidPrice) || isZero(price)) return setIsValid(false);
    if (price < lowesPostPrice || price > maxPurchasePost || price > maxLockedPostValue) return setIsValid(false)
   if(isScheduled){
    if(typeof scheduleTime=="object") return setIsValid(false)  
     if (!isDateValid) return setIsValid(false); 
   }
    return setIsValid(true);
  };

  useEffect(()=>{
validaPosting()
  },[isScheduled,scheduleTime])

  const isZero = (input) => {
    let value = Number(input);
    return value == 0.00 || value == 0.0 || value == 0 ? true : false;
  }

  const SelectType = () => {
    open_drawer("radioSelectore", {
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
        // {
        //   name: "posting",
        //   value: 6,
        //   label: lang.uploadProduct,
        // },
      ].map((option) => {
        return option;
        ``;
      }),
      onSelect: (type) => {
        setType(type);
        postTpe.current = type;
        type == 1 || type == 6
          ? fileSelect.current.click()
          : type == 2
            ? videoSelect.current.click()
            : ""
      },
    }, "bottom"
    )
  };

  const postToSelectHandler = (val) => {
    setPostTo(val)
    // pushDataInPostingPayload("sharedOnPersonalFeed", val == 2);
    // pushDataInPostingPayload("sharedOnStory", val == 1);
    pushDataInPostingPayload("postType", 3);
  };

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
    close_drawer();
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
        // setIsUserTagged(1);
        getCreatorsList(tagWord.slice(1));
      } else {
        setSuggestions([]);
      }

      if (tagWord.includes("#") && tagWord.slice(1)) {
        // setIsUserTagged(2);
        getHashtag(tagWord.slice(1));
      }
    } else {
      setSuggestions([]);
      // getHashtag([]);
    }
  };

  const getCreatorsList = async (searchText) => {
    const list = {
      search: searchText || "",
    };
    creatorSearch(list)
      .then((res) => {
        if (res && res.data) {
          setSuggestions(res.data.data);
        } else {
          setSuggestions([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setSuggestions([]);
      });
    // setSuggestions(data)
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
    return <div
      className="w-100 position-absolute drawerBgColor"
      style={{ zIndex: 1, transform: "translateY(-100%)", maxHeight: '200px', overflowY: 'scroll', overflowX: 'hidden' }}>
      {hashtags?.length
        ? hashtags.map((hashtag, index) => (
          <div key={index} className="d-flex justify-content-center align-items-center py-1 my-1"
            onClick={() => hashTagHandler(hashtag)}
          >
            <div className="col-2">
              <Avatar className="hashtags" style={{ color: theme.palette.white }}>#</Avatar>
            </div>
            <div className="col-10">
              <p className="m-0 bold fntSz14">{hashtag.name}</p>
              <p className="m-0 fntSz10">{`${hashtag.noOfPost} ${hashtag.noOfPost > 1 ? lang.posts : lang.post}`}</p>
            </div>
            {/* <hr className="m-0" /> */}
          </div>
        ))
        : ""
      }
    </div>
  }

  const TagUserUI = () => {
    return (
      <div className="w-100 position-absolute drawerBgColor shadowBoxTaged"
        style={{ zIndex: 1, transform: "translateY(-100%)", position: 'absolute', top: '-10px !important', maxHeight: '150px', overflowY: 'scroll', overflowX: 'hidden' }}>
        {suggestions?.length
          ? suggestions.map((item) => (
            <div key={item.userId} className="d-flex flex-row justify-content-start align-items-center py-1 my-1"
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
              {/* <hr className="m-0" /> */}
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
          <h6 className="mv_create_post_title" >
            {lang.nsfwConfig}
          </h6>
          <p className="text-muted fntSz12">{lang.nsfwText}</p>
        </div>
        <div className="col-2">
          <Switch
            onChange={() => setNSFW(!NSFW)}
            checked={NSFW}
          />
        </div>
      </div>
    )
  }

 useEffect(()=>{
      if(!isScheduled){
        setScheduleTime(new Date())
      }
        },[isScheduled])

  return (
    <>

      <Wrapper>
        <Head>
          <script defer={true} src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" />
        </Head>
        <CustomHead {...props.seoSettingData} />
        <Header
          title={type == 6 ? lang.addProduct : lang.addPost}
          Data={type == 6 ? lang.addProduct : lang.addPost}
          right={() => {
            return (
              <div
                className={`txtPrm ${!isValid  &&  "disabled-button"
                  }`}
                onClick={() => {
                  if (isValid) submitPost();
                }}>
                {lang.share}
              </div>
            );
          }} />

        {/* Media Upload Controls Start  */}
        <div
          style={{ background: `${theme?.background}` }}
          className="postingDiv">
          {file
            ? type == 1 || type == 6
              ? <ImageContainer
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
                }} />
              : <VideoContainer
                defaultImage={[file]}
                onChange={onVideoSelect}
                remove={remove}
                changeThumbanail={changeThumbanail}
                file={file} />

            : type == 4
              ? <TextAreaContainer
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

              : <div onClick={SelectType}>
                <PlaceholerComponent
                  ref={(el) => (textSelect.current = el)}
                />
              </div>
          }

          {/* image select */}
          <input
            style={{ display: "none" }}
            type="file"
            accept={IMAGE_TYPE}
            ref={(el) => (fileSelect.current = el)}
            onChange={(e) => {
              const file = e && e.target.files;
              if (file && file[0]) {
                const fileUrl = URL.createObjectURL(file[0]);
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
            accept={"video/*"}
            ref={(el) => (videoSelect.current = el)}
            onChange={onVideoSelect}
          />
          {/* Media Upload Controls End */}

          {type == 6
            ? <div className="mx-4 vh-100">
              <input
                type="text"
                placeholder={lang.productName}
                className="dv_base_bg_dark_color dv_appTxtClr_web border-0 w-100 p-3 mb-3 rounded fntSz19"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />

              <textarea
                type="text"
                rows="2"
                placeholder={lang.addDescription}
                className="dv_base_bg_dark_color dv_appTxtClr_web border-0 w-100 p-3 fntSz19 rounded mb-3"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />

              <input
                type="number"
                inputMode="numeric"
                placeholder={lang.qualityToSell}
                className="dv_base_bg_dark_color dv_appTxtClr_web border-0 w-100 p-3 mb-3 rounded fntSz19"
                value={productQualityToSell}
                onChange={(e) => setQaulityToSell(e.target.value)}
              />

              {/* MRP Price */}
              <div className="position-relative">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={lang.priceMRP}
                  className="dv_base_bg_dark_color dv_appTxtClr_web border-0 w-100 py-3 mb-3 rounded fntSz19"
                  style={{ paddingLeft: "10%" }}
                  value={productMRP}
                  onChange={(e) => setProductMRP(e.target.value)}
                />

                <div className="position-absolute fntSz19 font-weight-bold fntClrTheme product_price_field">
                  {defaultCurrency}
                </div>
              </div>

              {/* Discounted Price */}
              <div className="position-relative">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={lang.priceDiscounted}
                  className="dv_base_bg_dark_color dv_appTxtClr_web border-0 w-100 py-3 mb-3 rounded fntSz19"
                  style={{ paddingLeft: "10%" }}
                  value={productDiscounted}
                  onChange={(e) => setProductDiscounted(e.target.value)}
                />

                <div className="position-absolute fntSz19 font-weight-bold fntClrTheme product_price_field">
                  {defaultCurrency}
                </div>
              </div>
            </div>
            : <>
              <div className="col-12">
                <form>
                  <div>
                    {/* POST CAPTION */}
                    {hashtagUI()}
                    <div className="mb-4 mt-3">
                      {type != 4 && <textarea
                        value={postingData["description"]}
                        className="form-control dv_textarea_lightgreyborder"
                        rows={3}
                        // autoFocus={true}
                        list="creators"
                        id="post-caption"
                        placeholder={lang.caption}
                        onChange={(e) =>
                          handleCaptionChange(e, e.target.value)
                        }
                      />}
                      {TagUserUI()}
                    </div>

                    <div className="row alignCenterAndColor" >
                      <div className="col-12">
                        <div className="pb-1" >
                          <h6 className="mv_create_post_title" style={{marginTop:"1.5rem"}}>
                            {lang.postTo}
                          </h6>
                          <RadioButtonsGroup
                            radioLabelClass="m-0 dv_appTxtClr post_label mb-3"
                            radioClass="text-muted"
                            formLabelClass={css`
                            height: 30px;
                          `}
                            labelPlacement="start"
                            value={postTo}
                            onRadioChange={(val) => {
                              postToSelectHandler(val);
                            }}
                            buttonGroupData={[
                              { value: 1, label: "Story" },
                              { value: 2, label: "Feed" },
                            ]} />
                        </div>
                      </div>
                    </div>

                    <div className="row alignCenterAndColor">
                      <div className="col-12">
                        <div className="pb-1" style={{marginBottom:"1.5rem"}}>
                          <div>
                            <h6 className="mv_create_post_title" style={{marginTop:"1.5rem"}}>
                              {lang.postType}
                            </h6>

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
                          {!isStory && type !== "4" &&
                            getPostType({
                              label: lang.lockedPost,
                              name: lang.lockedPost,
                              value: "4",
                            })}
                          {!isStory &&
                            getPostType({
                              label: lang.exclusivePost,
                              name: lang.exclusivePost,
                              value: "1",
                            })}
                        </div>
                      </div>
                    </div>
                    {!isLocked && !isStory && <>
                  <div className="row mb-4 newBox">
                 
                        {/* <div className="col-12">

              {isNSFWAllow && <NSFWComponent />}
              </div> */}
                    {postingData.postType !== "4" && <>
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
                        />
                      </div>
                      {isScheduled && <div className="form-group col-12 mt-2 d-flex">
                            <input style={{ background: "var(--l_app_bg)", width: "100vw" }}
                                type="datetime-local"
                              data-date={typeof scheduleTime == "object" ? moment(scheduleTime).format("DD MMM YYYY h:mm a") : ""}
                                className="dateForMobile"
                                onChange={handleScheduleTimeChange}
                                data-date-format="DD MMMM YYYY"
                              min={today}
                              />
                              <div className="position-absolute pointerEvent" style={{right:"5%",top:"1%"}}>
                                <DateRangeOutlinedIcon
                                style={{ color: "var(--l_app_text)", width: "20px", height: "20px", backgroundColor: "var(--l_app_bg)" }} />
                            </div>
                      </div>}
                          {typeof scheduleTime !== "object" && !isDateValid ? <span className="fntSz10 col-12 text-danger font-weight-bold">Enter valid Date and Time</span> : ""}
                    </>}
                  </div>
                </>
                }
                  </div>
                </form>
              </div>
            </>
          }
        </div>
      </Wrapper>
      <style jsx>{`
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
        .newBox{
          border-radius: 8px;
          background: ${theme.type === "light" ? "#F8FAFF" : "var(--l_input_bg)"};
          padding-top: 10px;
          padding-bottom: 10px;
          margin-bottom:10px !important;
          margin:0;
          padding-top:1.5rem;
        }
        .alignCenterAndColor{
          border-radius: 8px;
          background: ${theme.type === "light" ? "#F8FAFF" : "var(--l_input_bg)"};
          margin:0;
          margin-bottom:10px;
        }
        .posting-currency{
          top: 0 !important;
        }
        .pointerEvent{
          pointer-events: none !important;
        }
        	input::placeholder {
						color: #d5d5d57a !important;
					}
      `}</style>
    </>
  );
};

export default Post;
