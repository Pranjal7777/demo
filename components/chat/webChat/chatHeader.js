import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserAvatarTile from "../userAvatar/userAvatarTile";
import { RED, MORE_ICON, DIAMOND_COLOR } from "../../../lib/config";
import Img from "../../ui/Img/Img";
import ChatShareDropDown from "../chatShare/chatShareDrawer";
import Button from "../../button/button";
import { close_progress, open_dialog, open_drawer, startLoader, stopLoader, Toast } from "../../../lib/global";
import { useTheme } from "react-jss";
// import { useDispatch } from "react-redux";
// import { ACTIVE_CHAT } from "../../../redux/actions/chat/action";
import useLang from "../../../hooks/language";
import BlockIcon from "@material-ui/icons/Block";
import DeleteOutlineIcon from "@material-ui/icons/DeleteForever";
import Icon from "../../image/icon";
import { getBulkMessages } from "../../../services/bulkMessage";
import isMobile from "../../../hooks/isMobile";
import useProfileData from "../../../hooks/useProfileData";
import { isAgency } from "../../../lib/config/creds";

const ChatHeader = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [profileData] = useProfileData();
  const [inputDisabled, setInputDisabled] = useState(false);

  // const dispatch = useDispatch()
  let { isUserblock, validateChat = {}, bulkMsgDetail } = props;
  const [report, setReport] = useState(false);
  const toggle = (flag) => {
    setReport(flag);
  };
  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const { assetDetail = {}, userStatus = "" } = props.chatData;

  // Local State
  const [allBulkMessages, setAllBulkMessages] = useState([]);
  let userId =
    props.chatData &&
      props.chatData.senderId == props.userData._id
      ? props.chatData.receiverId
      : props.chatData.senderId;

  useEffect(() => {
    if (profileData && [5, 6].includes(profileData.statusCode)) {
      setInputDisabled(true);
    }
  }, [])

  const handleClickVipPlans = () => {
    if (props.vipChatCount) return;
    if (props.authenticateChatUser(userStatus)) return
    // purchase plan here
    if (isUserblock) {
      return props.unBlock();
    } else {
      return open_dialog("VIP_MESSAGE_POPUP", {
        handleSubmit: (res) => {
          handleAfterPlanPurchase(res);
        },
        withChatUserId: props?.withChatUserId,
        userName: props.userName,
        chatId: props.chatData.chatId,
        creatorId: userId,
      });
    }
  };

  const handleAfterPlanPurchase = (res) => {
    const chatCount = res.chatCount;
    props.handleChangeVipMessageCount?.(chatCount);
  };

  const onSuccess = () => {
    close_progress();
    props.bulkMsgListRef?.refreshList?.({});
  }

  const addBulkMessageHandler = () => {
    open_dialog("bulkMessage", {
      close: () => close_dialog("bulkMessage"),
      onSuccess
    });
  }

  return (
    <div style={bulkMsgDetail ? { height: '60px', justifyContent: 'center' } : { justifyContent: 'space-between' }} className="title-header align-items-center d-flex px-3 py-2 specific_section_bg">
      {bulkMsgDetail ?
        <div className="row justify-content-between px-0 col-12 align-items-center">
          <div className="custom_status">
            <p style={{ fontSize: '20px' }} className="txt-black mb-0">
              {lang.myList}
            </p>
          </div>
          <div className="custom_addbulkmessage_button">
            <Button
              type="button"
              fclassname='gradient_bg rounded-pill'
              btnSpanClass='text-white'
              style={{padding: "6px 20px"}}
              onClick={addBulkMessageHandler}
              disabled={inputDisabled}
              children={lang.addBulkMessage}
            />
            {/* <Button cssStyles={theme.bulkButton} onClick={addBulkMessageHandler} disabled={inputDisabled}>{lang.addBulkMessage}</Button> */}
          </div>
        </div> :
        <>
          <UserAvatarTile userStatus={userStatus} disabledRate={true} {...props} isUserblock={isUserblock} />
          <div className="d-flex">
            {props.userTypeCode != 1 ? (
              <Button
                onClick={handleClickVipPlans}
                className="row btn py-1 mx-2 dv_vip_chat_count gradient_bg rounded-pill"
                btnSpanClass="text-app"
                isDisabled={isAgency()}
              >
                <Img
                  src={DIAMOND_COLOR}
                  width={16}
                  className="mr-1"
                  alt="Vip chat user icon"
                />
                VIP {props.vipChatCount > 0 ? props.vipChatCount : "Msgs"}
              </Button>
            ) : (
              <></>
            )}
            <div className="position-relative menu-icon-button cursorPtr row m-0 align-items-center">
              {assetDetail && !validateChat.block && (
                <ChatShareDropDown
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
                  <Icon
                    icon={`${MORE_ICON}#more_icon`}
                    color={theme.type === "light" ? "#000" : "#fff"}
                    height={25}
                    width={20}
                  />
                </div>
                {report && (
                  <React.Fragment>
                    <div className="position-absolute report-container">
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
          </div>
        </>
      }
      <style jsx>{`
            .title-header {
                border-bottom: 1.5px solid var(--l_border);
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                height:70px;
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
