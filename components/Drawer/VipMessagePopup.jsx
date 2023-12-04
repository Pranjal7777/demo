import React from "react";
import { CLOSE_ICON_BLACK, CLOSE_ICON_WHITE } from "../../lib/config";
import { authenticateUserForPayment, open_dialog, open_drawer, startLoader, stopLoader } from "../../lib/global";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { useTheme } from "react-jss";
import Button from "../button/button";
import { isAgency } from "../../lib/config/creds";
import Icon from "../image/icon";
import { Toast } from "../../lib/global/loader";
import { getProfile } from "../../services/auth";
import { getCookie } from "../../lib/session";
import { startChat } from "../../lib/chat";
import useProfileData from '../../hooks/useProfileData';
import { handleContextMenu } from "../../lib/helper";

const VipMessagePopup = (props) => {
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const theme = useTheme();
  const [profile] = useProfileData()

  const txtForVip = () => (
    <>
      <div
        className={`txt-book fntSz16 mb-3 text-app`}
      >
        <p className={`txt-book fntSz16 mb-3 text-app text-center`}>{lang.vipMsgGreet1}</p>
        <p className={`txt-book fntSz16 mb-3 text-app text-center`}>{lang.vipMsgGreet}</p>
      </div>
      {/* <div
        className={`txt-book fntSz16 mb-3 text-app`}
      >
        {lang.vipMsgCaution}
      </div> */}
      <div className="txt-book d-flex fntSz18 mb-4 dv_base_color">
        <span className="mr-2">Tip:</span><span className="text-center">{lang.vipMsgPlacement}</span>
      </div>
    </>
  );

  const VipActions = () => (
    <div className={mobileView ? "btnPosBtm" : ""}>
      <Button
        onClick={handlePurchasePlan}
        fixedBtnClass={"active"}
        style={{ marginBottom: "20px" }}
        isDisabled={isAgency()}
      >
        {lang.buyVIPMsg}
      </Button>
      <Button
        fixedBtnClass={"inactiveClr"}
        onClick={handleClose}
        style={{ marginBottom: "20px" }}
      >
        {lang.sendRegularMsg}
      </Button>
    </div>
  );

  const handlePurchasePlan = () => {
    authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => {
      mobileView
        ? open_drawer(
          "VIP_MESSAGE_PLANS",
          {
            handleSubmit: props.handleSubmit,
            chatId: props.chatId,
            withChatUserId: props?.withChatUserId,
            creatorId: props.creatorId,
            userName: props.userName,
            noRedirect: props.noRedirect
          },
          "bottom"
        )
        : open_dialog("VIP_MESSAGE_PLANS", {
          handleSubmit: props.handleSubmit,
          chatId: props.chatId,
          withChatUserId: props?.withChatUserId,
          creatorId: props.creatorId,
          userName: props.userName,
          noRedirect: props.noRedirect
        });
    })
  };
  const handleClose = async (type) => {
    startLoader()
    try {
      const profileRes = await getProfile(props.creatorId || props?.withChatUserId, getCookie('token'), getCookie('selectedCreatorId'))
      const profileData = profileRes.data?.data;
      await startChat({ userId: profileData.isometrikUserId, userName: profileData.username, userProfileImage: "/default-pic.png", searchableTags: [profile.username, profileData.username] })
      props.onClose && props.onClose();
      stopLoader()
    } catch (e) {
      console.log("errrrrrrrrrrrrrrrrrrrrr", e)
      stopLoader()
      Toast("Something went wrong")
    }

    // let vipChat = {
    //   isVip: false,
    //   chatId: props.chatId,
    //   chatCount: 0,
    // };
    // props.handleSubmit && props.handleSubmit(vipChat);
  };
  return (
    <>
      {mobileView ? (
        <div
          className={`vh-100  ${mobileView
            ? theme.type == "light"
              ? "bg-white"
              : "background-color"
            : "bg-white"
            } btmModal py-3 vip_chat_popup`}
        >
          <div className="col-12 w-330 mx-auto">
            <figure
              onClick={props.onClose}
              className="text-right op5 drawer_close_icon"
            >
              {theme.type == "light" ? (
                <img
                  src={CLOSE_ICON_BLACK}
                  width="16"
                  className="logoutCrtr callout-none"
                  onContextMenu={handleContextMenu}
                  alt="close_icon"
                />
              ) : (
                <Icon
                  icon={`${CLOSE_ICON_WHITE}#close-white`}
                  width="16"
                  height="16"
                  color="#fff"
                  className="logoutCrtr"
                  alt="close_icon"
                />
              )}
            </figure>
            <h4
              className={`mb-5 text-center ${mobileView
                ? theme.type == "light"
                  ? "text-black"
                  : "text-white"
                : "text-black"
                }`}
            >
              Message {`${props.userName ? props.userName : "Username"}`}
            </h4>
            {txtForVip()}
            {VipActions()}
          </div>
        </div>
      ) : (
        <div className="py-3 px-5">
          <div className="text-center pb-3">
            <h4 className="txt-black dv__fnt34 mt-3">
              Message {`${props.userName ? props.userName : "Username"}`}
            </h4>
          </div>
          <button
            type="button"
            className="close dv_modal_close"
            onClick={() => props.onClose()}
          >
            {theme.type == "light" ? (
              <img
                src={CLOSE_ICON_BLACK}
                width="16"
                className="logoutCrtr callout-none"
                onContextMenu={handleContextMenu}
                alt="close_icon"
              />
            ) : (
              <Icon
                icon={`${CLOSE_ICON_WHITE}#close-white`}
                width="16"
                height="16"
                color="#fff"
                className="logoutCrtr"
                alt="close_icon"
              />
            )}
          </button>
          {txtForVip()}
          {VipActions()}
        </div>
      )}
    </>
  );
};

export default VipMessagePopup;
