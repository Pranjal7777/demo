import UserAvatarTile from "./userAvatar/userAvatarTile";
import {
  WHITE,
  UP_MENU,
  RED,
  ATTECHMENT,
  black4,
  DIAMOND_COLOR,
} from "../../lib/config";
import Img from "../ui/Img/Img";
import isMobile from "../../hooks/isMobile";
import React, { useEffect, useState } from "react";
import ChatShareDropDown from "./chatShare/chatShareDrawer";
import Router from "next/router";
import Button from "../button/button";
import { useDispatch, useSelector } from "react-redux";
import { open_drawer } from "../../lib/global";
import { ACTIVE_CHAT } from "../../redux/actions/chat/action";
import { useTheme } from "react-jss";
import Icon from "../image/icon";
import useLang from "../../hooks/language";
import BlockIcon from "@material-ui/icons/Block";
import DeleteOutlineIcon from "@material-ui/icons/DeleteForever";

const ChatHeader = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();

  const dispatch = useDispatch();
  // console.log("chat headersss", props);
  let { isUserblock, validateChat = {} } = props;
  const [report, setReport] = useState(false);
  const { vipMessage: chatCount = 0 } =
    useSelector((state) => state.chat.sale[props.chatData.chatId]) || {};
  const toggle = (flag) => {
    setReport(flag);
  };
  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  useEffect(() => {
    return () => {
      dispatch({ type: ACTIVE_CHAT, payload: "" });
    };
  }, []);

  // const handleClickVipPlans = () => {
  // 	if (props.vipChatCount) return;
  // 	// purchase plan here
  // 	return open_drawer(
  // 		"VIP_MESSAGE_POPUP",
  // 		{
  // 			handleSubmit: (res) => {
  // 				handleAfterPlanPurchase(res);
  // 			},
  // 			userName: props.userName,
  // 			chatId: props.chatData.chatId,
  // 		},
  // 		"bottom"
  // 	);
  // };

  // const handleAfterPlanPurchase = (res) => {
  // 	// console.log('chatId, chatType', res)
  // 	const chatCount = res.chatCount;
  // 	props.handleChangeVipMessageCount?.(chatCount);
  // };

  const { assetDetail = {}, userStatus = "" } = props.chatData;
  return (
    <div className="title-header align-items-center d-flex justify-content-between pl-2 pr-2 py-2">
      <UserAvatarTile userStatus={userStatus} {...props} />
      {/* {props.userTypeCode != 1 ? (
				<Button
					onClick={handleClickVipPlans}
					className="row btn py-1 vip_chat_count"
				>
					<Img
						src={DIAMOND_COLOR}
						width={16}
						className="mr-1"
						alt="Vip chat user icon"
					/>
					<span>VIP</span> {props.vipChatCount || "Msgs"}
				</Button>
			) : (
				<></>
			)} */}
      <div className="position-relative menu-icon-button cursorPtr row m-0 align-items-center">
        {assetDetail && !validateChat.block && (
          <ChatShareDropDown
            open_drawer={open_drawer}
            isUserblock={isUserblock}
            unBlock={props.unBlock}
            sendMessage={props.sendMessage}
            type={props.type}
            chatData={props.reduxData}
            hideEmoji={props.hideEmoji}
            APP_IMG_LINK={APP_IMG_LINK}
            S3_IMG_LINK={S3_IMG_LINK}
            mobileView={mobileView}
            authenticateChatUser={props.authenticateChatUser}
          />
        )}
        <div className="position-relative">
          <div onClick={toggle.bind(null, true)}>
            {/* <Img src={UP_MENU} className="menu-icon"></Img> */}
            <Icon
              icon={`${UP_MENU}#kabab_menu`}
              color={
                theme.type === "light"
                  ? theme.palette.l_app_text
                  : theme.palette.d_app_text
              }
              size={20}
              viewBox="0 0 515.555 515.555"
            />
          </div>
          {report && (
            <React.Fragment>
              <div className="position-absolute report-container shadow">
                <div
                  className="report-items"
                  style={{ color: "black" }}
                  onClick={() => {
                    props.deleteChatList();
                    toggle(false);
                    // props.open_dialog("reportDialog", {
                    //   userId: props._id,
                    //   openDialog: props.open_dialog.bind(
                    //     null,
                    //     "successDialog",
                    //     {
                    //       dialogText: "Congratulations",
                    //       dialogSubText: "the user has been reported",
                    //       dialogImg: env.REPORT_USER_SUCCES,
                    //       textClass: "successText"
                    //     }
                    //   )
                    // });
                  }}
                >
                  <DeleteOutlineIcon className="fntSz14 mr-1" />
                  {lang.dltChat}
                </div>
                {(props.self || !props.isUserblock) && (
                  <div
                    className="report-items text-danger"
                    onClick={() => {
                      {
                        !isUserblock ? props.blockUser() : props.unBlock();
                      }
                      toggle(false);
                      // props.open_dialog("reportDialog", {
                      //   userId: props._id,
                      //   openDialog: props.open_dialog.bind(
                      //     null,
                      //     "successDialog",
                      //     {
                      //       dialogText: "Congratulations",
                      //       dialogSubText: "the user has been reported",
                      //       dialogImg: env.REPORT_USER_SUCCES,
                      //       textClass: "successText"
                      //     }
                      //   )
                      // });
                    }}
                  >
                    <BlockIcon className="fntSz14 mr-1" />
                    {!isUserblock ? "Block user" : "Unblock user"}
                  </div>
                )}
                {/* <div
                  className="report-items text-color-red"
                  onClick={() => {
                    toggle(false);
                    // props.open_dialog("reportDialog", {
                    //   userId: props._id,
                    //   openDialog: props.open_dialog.bind(
                    //     null,
                    //     "successDialog",
                    //     {
                    //       dialogText: "Congratulations",
                    //       dialogSubText: "the user has been reported",
                    //       dialogImg: env.REPORT_USER_SUCCES,
                    //       textClass: "successText"
                    //     }
                    //   )
                    // });
                  }}
                >
                  Block user
                </div> */}
              </div>
              <div
                className="report-backdrop"
                onClick={toggle.bind(null, false)}
              ></div>
            </React.Fragment>
          )}
        </div>

        {/* <Fade when={report}> */}

        {/* </Fade> */}
      </div>
      <style jsx="true">{`

            :global(.menu-icon) {
              height: 20px;
            }
            :global(.user-avatar-chat){
              border-radius: 50%!important;
              border: 2px solid ${theme.palette.l_base};
            }
            .title-header {
                background-color: ${theme.type === "light"
          ? theme.palette.l_app_bg
          : theme.palette.d_app_bg
        };
                border-bottom: 2px solid ${theme.palette.l_grey_border};
                transition: 0.4s;
                box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                height:70px;
                top: 0;
                z-index: 999;
                width: 100%;
                position: fixed;
              }
              .text-color-red{
                  color:${RED}
              }
              .report-items {
                  font-size: 0.75rem;
                  padding: 8px 51px 8px 15px;s
                }
                .report-backdrop {
                  position: fixed;
                  top: 0;
                  left: 0;
                  height: 100vh;
                  width: 100vw;
                  z-index: 1;
                }
              .report-container {
                right: 100%;
                top: 0;
                white-space: nowrap;
                background-color: #f1f2f6;
                margin-right: 7px;
                border-radius: 4px;
                overflow: hidden;
                z-index: 5;
                box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
              }
              `}</style>
    </div>
  );
};
export default ChatHeader;
