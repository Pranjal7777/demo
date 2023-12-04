import React, { useRef } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from 'react-jss';

import AvatarImage from '../image/AvatarImage';
import * as env from "../../lib/config";
import { dateFormate } from '../../lib/chat';
import useLang from "../../hooks/language";
import { open_drawer } from '../../lib/global';
import { handleContextMenu } from '../../lib/helper';

const UpdateBot = () => {
  const [lang] = useLang();
  const theme = useTheme();
  const dispatch = useDispatch();
  const scrollEvent = useRef(null);
  const { d_background, lightThemeColor } = theme.palette;

  const APP_UPDATE_BOT = useSelector((state) => state?.appUpdateBot);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);

  const scrollBottom = () => {
    if (scrollEvent.current) scrollEvent.current.scrollTop = scrollEvent.current.scrollHeight;
  };

  // const getBotMessage = async (pageCount = 0, loader) => {
  //   if (loader) startPageLoader();

  //   try {
  //     const payload = {
  //       limit: 10,
  //       offset: pageCount * 10,
  //     }

  //     // API Call
  //     const res = await sendUpdates(payload);

  //     if (res?.status == 200) {
  //       if (payload.offset == 0) {
  //         dispatch(appUpdateBot(res?.data?.data?.sendUpdates.reverse()))
  //       } else {
  //         dispatch(appUpdateBot([...APP_UPDATE_BOT, ...res?.data?.data?.sendUpdates.reverse()]))
  //       }
  //       stopPageLoader();
  //       return;
  //     }
  //     stopLoader();
  //     setIsLoading(false);

  //   } catch (err) {
  //     console.error("ERROR IN getBotMessage >", err);
  //     Toast(err?.response?.data?.message || lang.errorMsg, "error");
  //     stopLoader();
  //   }
  // }

  const imgFullScreenView = (message) => {
    open_drawer("imgFullScreenView", {
      imgLink: message?.message?.includes("http") ? message?.message :`${S3_IMG_LINK}/${message?.message}`,
      imgDescription: message.description,
    }, "bottom");
  };

  const ChatActions = () => {
    return (
      <>
        <div ref={scrollEvent} style={{ height: "calc(calc(var(--vhCustom, 1vh) * 100) - 85px)", overflowY: "scroll" }} className="pl-3">
          {APP_UPDATE_BOT?.map((botChat) => {
            switch (botChat.type) {
              case "TEXT":
                return (
                  <div key={botChat._id} className="chat-block">
                    <p className="chat-text m-0">
                      {botChat.message}
                    </p>
                    <p className="fntSz9 dv_appTxtClr_web ml-2 chat-time">{dateFormate(parseInt(botChat.createdTs))}</p>
                  </div>
                )
              case "IMAGE":
                return (
                  <>
                    <div key={botChat._id}
                      className="rounded cursorPtr border shadow-sm" style={{ width: "190px" }}>
                      <div className="d-flex align-items-start" style={{ height: "200px" }} onClick={() => imgFullScreenView(botChat)}>
                        <div className="h-100 w-100 position-relative">
                          <img
                            onLoad={scrollBottom}
                            className="object-fit-cover callout-none" src={botChat?.message?.includes("http") ? botChat?.message : `${S3_IMG_LINK}/${botChat.message}`}
                            alt="Image__content"
                            width="100%"
                            height="100%"
                            onContextMenu={handleContextMenu}
                          />
                        </div>
                      </div>
                      {botChat.description
                        ? <div className="bot-footer-text">
                          {botChat.description}
                        </div>
                        : ""}
                    </div>
                    <p className="fntSz9 dv_appTxtClr_web ml-2 chat-time">{dateFormate(parseInt(botChat.createdTs))}</p>
                  </>
                )
              case "VIDEO":
                return (
                  <>
                    <div key={botChat._id}
                      className="rounded cursorPtr border shadow-sm" style={{ width: "190px" }}>
                      <div className="d-flex align-items-start" style={{ height: "200px" }}>
                        <div className="h-100 w-100 position-relative">
                          <video width="189px" height="200" controls controlsList="nodownload">
                            <source src={`${APP_IMG_LINK}/${botChat.message}`} type="video/mp4" />
                          </video>
                        </div>
                      </div>
                      {botChat.description
                        ? <div className="bot-footer-text">
                          {botChat.description}
                        </div>
                        : ""}
                    </div>
                    <p className="fntSz9 dv_appTxtClr_web ml-2 chat-time">{dateFormate(parseInt(botChat.createdTs))}</p>
                  </>
                )
              default:
                break;
            }
          })}
        </div>

        <style jsx>{`
          .bot-footer-text {
            background-color: ${theme.type === "light"
            ? lightThemeColor
            : d_background
          };
            border-radius: 0 0 10px 10px;
            font-weight: 600;
            padding: 7px;
            font-size: 14px;
            word-break: break-word;
          }
          .chat-block {
						width: fit-content;
						max-width: 60%;
					}
          .chat-time {
						white-space: nowrap;
						font-size: 0.6rem;
						width: fit-content;
						margin-left: auto;
						font-weight: 500;
						margin-top: 5px;
						// color: #dedee1;
					}
          
        `}</style>
      </>
    )
  }

  return (
    <>
      <div className="title-header d-flex align-items-center mb-2 w-100">
        <div className="d-flex justify-content-center align-items-center position-relative mx-3">
          <AvatarImage src={env.FAV_ICON36} alt="voyr_lens" />
        </div>
        <div className="d-flex justify-content-center flex-column ml-3">
          <p className="fntSz14 fntWeight600 m-0">{env.APP_NAME}</p>
          <p className="m-0 fntSz10">{lang.active}</p>
        </div>
      </div>

      {ChatActions()}
    </>
  )
}

export default UpdateBot;
