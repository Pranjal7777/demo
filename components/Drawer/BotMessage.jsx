import { useEffect, useRef } from "react";
import { useTheme } from "react-jss";
import { useDispatch, useSelector } from "react-redux";

import { close_drawer, open_drawer, startPageLoader, stopLoader, stopPageLoader, Toast } from "../../lib/global";
import useLang from "../../hooks/language";
import * as env from "../../lib/config";
import Icon from "../image/icon";
import AvatarImage from "../image/AvatarImage";
import { sendUpdates } from "../../services/chat";
import { dateFormate } from "../../lib/chat";
import { appUpdateBot } from "../../redux/actions/auth"
import { handleContextMenu } from "../../lib/helper";

const BotMessage = () => {
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

  useEffect(() => {
    getBotMessage();
  }, []);

  const getBotMessage = async (pageCount = 0, loader) => {
    if (loader) startPageLoader();

    try {
      const payload = {
        limit: 10,
        offset: pageCount * 10,
      }

      // API Call
      const res = await sendUpdates(payload);

      if (res?.status == 200) {
        // setPage(pageCount);

        if (payload.offset == 0) {
          dispatch(appUpdateBot(res?.data?.data?.sendUpdates.reverse()))
        } else {
          dispatch(appUpdateBot([...APP_UPDATE_BOT, ...res?.data?.data?.sendUpdates.reverse()]))
        }
        stopPageLoader();
        return;
      }
      stopLoader();
      // setIsLoading(false);

    } catch (err) {
      console.error("ERROR IN getBotMessage >", err);
      Toast(err?.response?.data?.message || lang.errorMsg, "error");
      stopLoader();
    }
  };

  const imgFullScreenView = (message) => {
    open_drawer("imgFullScreenView", {
      imgLink: message?.message?.includes("http") ? message?.message : `${S3_IMG_LINK}/${message?.message}`,
      imgDescription: message.description,
    }, "bottom");
  };

  const ChatActions = () => {
    return (
      <>
        <div ref={scrollEvent} style={{ height: "89vh", overflowY: "scroll" }}>
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
                            className="object-fit-cover callout-none"
                            onContextMenu={handleContextMenu}
                            src={botChat?.message?.includes("http") ? botChat?.message : `${S3_IMG_LINK}/${botChat.message}`} alt="Image__content"
                            width="100%"
                            height="100%"
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
            color: var(--l_app_text);
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
    <div className="parent__container pl-3">
      {/* Header */}
      <div className="header__section d-flex align-items-center mb-2 pl-3 position-fixed w-100">
        <Icon
          icon={`${env.backArrow}#left_back_arrow`}
          color={theme.type == "light" ? "#000" : "#fff"}
          width={25}
          height={25}
          onClick={() => close_drawer("BotMessage")}
          alt="backArrow"
        />
        <div className="header__text__content d-flex align-items-center">
          <div className="logo__content d-flex justify-content-center align-items-center position-relative ml-3 rounded-circle">
            <AvatarImage src={env.FAV_ICON36} alt="voyr_lens" />
          </div>
          <div className="active__people_name d-flex justify-content-center flex-column ml-2">
            <p className="people__name">{env.APP_NAME}</p>
            <p className="people__status">{lang.active}</p>
          </div>
        </div>
      </div>

      {ChatActions()}

      <style jsx>{`
        .parent__container, .custom__container{
          padding-top: 70px;
        }
        .header__section{
          z-index: 1;
          left: 0;
          top: 0;
          height:60px;
          border-bottom:1px solid #C9C9C9;
        }
        .active__people_name {
          height: 50px;
          /* border: 1px solid black; */
        }
        .active__people_name p {
          margin: 0;
        }
        .people__name {
          font-size: 14px;
          font-weight: bold;
          color: ${theme.text};
        }
        .people__status {
          color: #666666;
          font-size: 12px;
         }
      `}</style>
    </div>
  );
};

export default BotMessage;
