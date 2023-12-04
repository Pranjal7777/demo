import React from "react";
import isMobile from "../../hooks/isMobile";
import { circled_eye, TIP_ICON_WHITE } from "../../lib/config";
import {
  authenticateUserForPayment,
  close_dialog,
  close_drawer,
  open_dialog,
  open_drawer,
} from "../../lib/global";
import Img from "../ui/Img/Img";
import { getCookie } from "../../lib/session";
import useLang from "../../hooks/language"
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";
import { BOMBSCOIN_LOGO } from "../../lib/config/logo";
import Button from "../button/button";
import { commentParser } from "../../lib/helper/userRedirection";
import { authenticate } from "../../lib/global/routeAuth";
import { useRouter } from 'next/router';

/**
 * @description This is the custom footer used is Story Module. In this custom footer we implemented Send tip, Story View Count and Received Tip.
 * @author Paritosh
 * @date 07/04/2021
 * @param action?: f() - Used to Play and Pause the Story, If passes 'pause' as argument, story will pause. Same for 'play'
 * @param ownStory: boolean - True if the story is of logged in User, and false for story of other users.
 *
 * Updated by @author Bhavleen
 * @data April 21st, 2021
 */
const CustomFooter = (props) => {
  // console.log('footer props', props)
  const {
    action,
    item,
    ownStory,
    setActiveState,
    activeIndex,
    creator = {},
  } = props;
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const uid = isAgency() ? selectedCreatorId : getCookie("uid");
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const router = useRouter();

  // useEffect(()=>{
  //     console.log('\n\n\n',activeIndex)
  // },[])

  const handleStoryViewClick = () => {
    if (!item.totalViews) return;
    action("pause");
    mobileView
      ? open_drawer(
        "STORY_VIEWS",
        {
          data: item,
          back: (e) => {
            e == "deleted" && close_drawer("STORY_VIEWS");
          },
          handleClose: () => action("play"),
        },
        "right"
      )
      : open_dialog("STORY_VIEWS", {
        data: item,
        back: (e) => {
          e == "deleted" && close_dialog("STORY_VIEWS");
        },
        handleClose: () => action("play"),
      });
  };

  const handleSentTip = () => {
    authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => {
      mobileView
        ? open_drawer(
          "SentTip",
          {
            creatorId: creator.userId,
            creatorName: creator.username,
            postId: item._id,
            trigger: 2,
            onCloseDrawer: () => {
              action("play");
            },
            updateTip: (tipCount) => {
              // updateTipHandler &&
              // updateTipHandler(tipCount),
            },
          },
          "right"
        )
        : open_dialog("sendTip", {
          creatorId: creator.userId,
          creatorName: creator.username,
          postId: item._id,
          trigger: 2,
          handleClose: () => {
            action("play");
          },
          updateTip: (tipCount) => {
            // updateTipHandler &&
            // updateTipHandler(tipCount),
          },
        });
    })
  };

  return (
    <div
      style={{ color: "white", textAlign: "center", paddingBottom: "20px" }}
      onClick={() => {
        // action('pause');
      }}
    >
      <div
        className={mobileView ? "col-12 p-0" : "col-12"}
        style={
          mobileView
            ? { position: "absolute", bottom: "30px", width: "100%" }
            : {
              position: "absolute",
              bottom: "30px",
              width: "100%",
              padding: "0 25px",
            }
        }
      >
        {ownStory ? (
          <div
            className={mobileView ? "col-12 row m-0" : "row align-items-center"}
          >
            <p className="py-1 mb-2 d-flex">
              <Img className="mr-1" src={TIP_ICON_WHITE} width={18} alt="tip" />
              {/* {(item.currency && item.currency.symbol) || "$ "} */}
              {item.totalTipReceived || 0} Tips
            </p>
            <button
              type="button"
              onClick={() => handleStoryViewClick(item)}
              className="btn btn-outline-light highlight_btn ml-auto px-2"
            >
              <Img className="mr-1" src={circled_eye} width={18} alt="view" />
              {item.totalViews || 0}
            </button>
          </div>
        ) : (
          <>
            {item.isVisible
              ? <div
                className={mobileView ? "col-12 row m-0" : "row align-items-center"}
              >
                {/* <button
                  onClick={() => {
                    if (isAgency()) return;
                    action("pause");
                    handleSentTip(item);
                  }}
                  className="btn btn-default d-flex align-items-center dv__sendTip"
                >
                  <Img className="mr-1" src={TIP_ICON_WHITE} width={18} alt="tip" />
                  <span style={mobileView ? { fontSize: "15px" } : {}}>{lang.sendTip}</span>
                </button> */}
                <div>
                  <Button
                    type="button"
                    fclassname="d-flex flex-row btnGradient_bg rounded-pill py-1 px-2"
                    leftIcon={{ src: BOMBSCOIN_LOGO, id: "bombscoin" }}
                    iconWidth={18}
                    iconHeight={18}
                    iconClass="mr-2"
                    iconViewBox="0 0 20 20"
                    disabled={isAgency()}
                    onClick={() => {
                      authenticate(router.asPath).then(() => {
                        if (isAgency()) return;
                        action("pause");
                        handleSentTip(item);
                      })
                    }}
                    children={lang.sendTip}
                  />
                </div>
              </div>
              : <></>
            }

          </>
        )}
        <br />
        {/* {item.description} */}

        {item.taggedUserIds?.length > 0
          ? commentParser(item.description, item.taggedUserIds)
          : commentParser(item.description, item.taggedUsers)
        }

        {/* {commentParser(item.description, item.taggedUsers)} */}
      </div>
    </div>
  );
};

export default CustomFooter;
