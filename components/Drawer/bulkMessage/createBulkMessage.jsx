import React, { useEffect, useState } from "react";
import { useTheme } from "react-jss";
import { useDispatch } from "react-redux";

import useLang from "../../../hooks/language";
import Wrapper from "../../../hoc/Wrapper";
import BulkMessageHeader from '../../header/bulkMessage';
import Img from "../../ui/Img/Img";
import { defaultCurrency, defaultCurrencyCode, IMAGE_POST, IMAGE_POST_ACTIVE, LOCKED_POST, LOCKED_POST_ACTIVE, TEXT_POST, TEXT_POST_ACTIVE, IMAGE_POST_DESKTOP, IMAGE_POST_ACTIVE_DESKTOP, LOCKED_POST_DESKTOP, LOCKED_POST_ACTIVE_DESKTOP, TEXT_POST_DESKTOP, TEXT_POST_ACTIVE_DESKTOP } from "../../../lib/config";
import isMobile from "../../../hooks/isMobile";
import ImagePost from './image_Post';
import LockedPost from './locked_post';
import TextPost from './text_post';
import { getCookie } from "../../../lib/session";
import { uploadPost } from "../../../lib/postingTask";
import InputBox from "../../input-box/input-box";
import Button from "../../button/button";
import { close_dialog, close_drawer, startLoader, stopLoader, Toast } from "../../../lib/global";
import { postBulkMessage, shareLockedPost } from "../../../services/bulkMessage";
import { sendChatMessage } from "../../../lib/chat";
import { newMessage } from "../../../redux/actions/chat/action";
import { getCognitoToken } from "../../../services/userCognitoAWS";
import fileUploaderAWS from "../../../lib/UploadAWS/uploadAWS";
import isTablet from "../../../hooks/isTablet";

const CreateBulkMessage = (props) => {
  const { filter, checkedList, onSuccess, isSelectAll } = props;
  const postSection = props?.lockedMessage ? "locked_post" : "image_post";

  const [lang] = useLang();
  const [mobileView] = isMobile()
  const [tabletView] = isTablet()
  const theme = useTheme();
  const dispatch = useDispatch();
  const uid = getCookie("uid");

  const [activeLink, setactiveLink] = useState(postSection);
  const [fileData, setFileData] = useState(null);
  const [fileRef, setFileRef] = useState();
  const [textData, setTextData] = useState([]);
  const [isDataValid, setIsDataValid] = useState(false);
  const [postCaption, setPostCaption] = useState("");
  const [postSelection, setPostSelection] = useState(1);

  // if Locked Message is from collection then show in PostId
  const [postId, setPostId] = useState();

  // If Locked Post
  const [price, setPrice] = useState();

  useEffect(() => {
    setPostCaption();
    setPrice();
  }, [activeLink])

  const back = () => {
    props.close();
  }

  const Buttons = [{
    label: "Media",
    icon: mobileView ? IMAGE_POST : IMAGE_POST_DESKTOP,
    activeIcon: mobileView ? IMAGE_POST_ACTIVE : IMAGE_POST_ACTIVE_DESKTOP,
    active: "image_post",
  }, {
    label: "Locked",
    icon: mobileView ? LOCKED_POST : LOCKED_POST_DESKTOP,
    activeIcon: mobileView ? LOCKED_POST_ACTIVE : LOCKED_POST_ACTIVE_DESKTOP,
    active: "locked_post",
  }, {
    label: "Text",
    icon: mobileView ? TEXT_POST : TEXT_POST_DESKTOP,
    activeIcon: mobileView ? TEXT_POST_ACTIVE : TEXT_POST_ACTIVE_DESKTOP,
    active: "text_post",
  },
  ];

  const getButtons = (buttons) => {
    return (
      mobileView
        ? <div
          onClick={() => {
            setactiveLink(buttons.active);
          }}
        >
          <Img
            className="cursor-pointer"
            src={activeLink === buttons.active ? buttons.activeIcon : buttons.icon}
          />
        </div>
        : <div
          style={{ borderRadius: '20px', padding: '5px 30px' }}
          className={`bulkMessageBtn cursorPtr d-flex align-items-center ${activeLink === buttons.active ? 'text-white custom_bg_bulkmsg_postType_active' : 'custom_bulkmsg_postType_border'}`}
          onClick={() => {
            setactiveLink(buttons.active);
            // setShowButton(true);
          }}
        >
          <Img
            width={20}
            height={15}
            className="cursor-pointer mr-2"
            src={activeLink === buttons.active ? buttons.activeIcon : buttons.icon}
          />
          <p style={{ fontSize: '14px' }} className="txt-medium mb-0">{buttons.label}</p>
        </div>
    );
  };

  const getType = () => {
    switch (activeLink) {
      case "locked_post":
        return <LockedPost
          fileData={fileData}
          setFileData={setFileData}
          setFileRef={setFileRef}
          setIsDataValid={setIsDataValid}
          postCaption={postCaption}
          setPostCaption={setPostCaption}
          price={price}
          setPrice={setPrice}
          postId={postId}
          setPostId={setPostId}
          postSelection={postSelection}
          setPostSelection={setPostSelection}
        />
      case "text_post":
        return <TextPost
          setIsDataValid={setIsDataValid}
          setTextData={setTextData}
        />
      default:
        return <ImagePost
          setFileData={setFileData}
          setFileRef={setFileRef}
          setIsDataValid={setIsDataValid}
          setPostCaption={setPostCaption}
          setPostId={setPostId}
          postId={postId}
        // postCaption={postCaption}
        />
    }
  };

  const handleMessageSend = async () => {
    let response;
    let postingPayload;
    try {
      startLoader();

      if (activeLink !== "text_post" && !postId) {
        var postData = await uploadPost({
          postTo: 2,
          fileObject: fileRef,
          // requestPayload: postingPayload,
          bulkMessages: true,
          type: fileData.filesObject.type.includes("image") ? 1 : 2,
        });
      } else if (activeLink === "text_post") {
        // This is Text Post
        var txtPostPayload = [{
          type: 4,
          text: textData.text,
          bgColorCode: textData.bgColor,
          font: textData.textStyle,
          colorCode: textData.color,
          textAlign: textData.textAlign
        }]
      }

      if (postId) {
        postingPayload = {
          trigger: filter,
        }
      } else {
        postingPayload = {
          trigger: filter,
          postData: activeLink != "text_post" ? postData : txtPostPayload,
        }
      }

      if (!props?.lockedMessage) {
        postingPayload.postType = activeLink === "locked_post" ? "LOCKED_POST" : "BULK_POST";
      }

      if (!isSelectAll) {
        postingPayload.userIds = checkedList;
      }

      if (activeLink != "text_post" && !postId) {
        postingPayload.mediaType = fileData?.filesObject?.type?.includes("image") ? 1 : 2;
      } else if (activeLink != "text_post" && postId) {
        postingPayload.mediaType = fileData[0].type;
      }

      if (activeLink === "text_post") {
        postingPayload.mediaType = 3;
      }

      if (postId) {
        console.warn("REMOVED CONDITION FROM HERE");
      } else if (activeLink != "text_post" && postData?.length === 1 && postData[0].type === 2) {
        postingPayload.videoDuration = fileData.videoDuration;
        delete postData[0].url;
      }

      if (postCaption) {
        postingPayload.description = postCaption;
      }

      if (activeLink == "locked_post") {
        postingPayload.price = price;
        postingPayload.currencyCode = defaultCurrencyCode;
        postingPayload.currencySymbol = defaultCurrency;
        // Trigger Hardcode
        // postingPayload.trigger = "FOLLOWERS";
      }

      if (props?.lockedMessage) {
        postingPayload.sharedTo = props.receiversId === uid ? props.recipientId : props.receiversId;
        // postingPayload.sharedTo = props.recipientId;

        // For Locked Message sent Personally
        postingPayload.lockedPostId = postId
        if (fileData?.[0]?.type === 4) postingPayload.mediaType = 3
      } else if (postId) {
        // if locked Message not personally and Post ID is available
        postingPayload.postId = postId
      }


      if (props?.lockedMessage) {
        response = await shareLockedPost(postingPayload);

        if (postingPayload.mediaType == 2) {
          handleFileUploaderAWSFunc(response.data.data.postId);
        }
      } else {
        response = await postBulkMessage(postingPayload);

        if (postingPayload.mediaType == 2) {
          handleFileUploaderAWSFunc(response.data.data.postId);
        }
      }

      stopLoader();
      mobileView ? close_drawer() : props.onClose();

      props?.lockedMessage
        ? props.onClose()
        : onSuccess();

      mobileView ? close_drawer() : close_dialog();


    } catch (err) {
      stopLoader();
      console.error("ERROR IN handleMessageSend", err);
      Toast(err?.response?.data?.message || lang.errorMsg, "error")
    }
  }

  const SendBtn = () => {
    return (
      <Button
        disabled={!isDataValid}
        type="submit"
        onClick={handleMessageSend}
        cssStyles={theme.blueButton}
      >
        {lang.send}
      </Button>
    )
  }

  const handleFileUploaderAWSFunc = async (postId) => {
    try {
      const cognitoToken = await getCognitoToken();
      const tokenData = cognitoToken?.data?.data;

      const fileName = `${postId}_post_1.mp4`;

      await fileUploaderAWS(fileData.filesObject, tokenData, fileName);

    } catch (err) {
      console.error("ERROR IN createBulkMsg > handleFileUploaderAWSFunc", err)
    }
  }

  return (
    <Wrapper>
      {mobileView
        ? <>
          <BulkMessageHeader className={theme.type === "light" ? "bg-white" : "card_bg"} back={back} title={props?.lockedMessage ? lang.lockedPost : lang.createMsg} subTitle={""} mobileView={true} />

          <div className={`d-flex flex-column justify-content-between ${theme.type === "light" ? "bg-white" : "card_bg"}`} style={{ height: "calc(100% - 60px)", overflowY: "scroll" }}>
            <div>
              <div className="d-flex justify-content-center my-2">
                <div className={`col-11${props?.lockedMessage ? " d-none" : ""}`}>
                  <div className="d-flex align-items-center justify-content-around">
                    {Buttons.map((buttons, index) => {
                      return <div key={index}>{getButtons(buttons)}</div>;
                    })}
                  </div>
                </div>
              </div>

              <div className="col-12 p-0 menu__content__Section">
                <div
                  className={`overflow-auto vw-100 ${mobileView
                    ? theme.type === "light"
                      ? "bg-white"
                      : theme.background
                    : ""
                    }`}
                >
                  {getType()}
                </div>
              </div>
            </div>

            <div className='p-3'>
              {SendBtn()}
            </div>
          </div>

        </>
        : <div style={{ minHeight: "75vh" }}>
          <div style={{ borderBottom: '2px solid #DFDFE0' }} className={`px-3${theme.type == "light" ? " bg-light" : ""}${props?.lockedMessage ? "" : " py-2"}`}>
            <BulkMessageHeader back={back} title={props?.lockedMessage ? lang.lockedPost : lang.createMsg} subTitle={""} mobileView={false} />

            <div className={`col-12 py-2 px-1${props?.lockedMessage ? " d-none" : ""}`}>
              <div className="d-flex align-items-center justify-content-between">
                {Buttons.map((buttons, index) => {
                  return <div className="px-1" key={index}>{getButtons(buttons)}</div>;
                })}
              </div>
            </div>
          </div>
          <div className={`px-3 ${theme.type == "light" ? " bg-light" : ""}`} style={{ maxHeight: `${tabletView ? 'auto' : "700px"}` }}>
            <div className="col-12 p-0 menu__content__Section">
              <div
                className={`${mobileView
                  ? theme.type === "light"
                    ? "bg-white"
                    : theme.background
                  : ""
                  }`}
              >
                {getType()}
              </div>
            </div>
          </div>

          <div className={`${postSelection == 2 ? "d-none" : `${theme.type == "light" ? "bg-light" : "bg_theme_color"}col-12 pb-3`}`}>
            <div className="px-3">
              {SendBtn()}
            </div>
          </div>
        </div>
      }

      <style jsx>{`
          :global(.createBulkMessage .MuiDialog-paper){
            max-width:30vw !important;
          }
          :global(.MuiDrawer-paper) {
            width: 100% !important;
            max-width: 100% !important;
            color: inherit;
            overflow-y: unset;
          }
          :global(.MuiDrawer-paper > div) {
            width: 100% !important;
            max-width: 100% !important;
          }
          :global(.right_chevron) {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;
            width: 7px;
          }
          /* width */
          ::-webkit-scrollbar {
            width: 0px !important;
          }

          /* Track */
          ::-webkit-scrollbar-track {
            background: #fff !important; 
          }
          
          /* Handle */
          ::-webkit-scrollbar-thumb {
            background: #fff !important; 
          }

          /* Handle on hover */
          ::-webkit-scrollbar-thumb {
            background: #fff !important; 
          }
          :global(.bg_theme_color) {
            background-color: var(--l_input_bg) !important;
          }
          :global(.menu__content__Section){
            max-width: 100%;
          }
          
        `}
      </style>
    </Wrapper>
  );
}

export default CreateBulkMessage;


