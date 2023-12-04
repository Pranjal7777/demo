import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { follow as followAPI, unfollow as unfollowAPI } from "../../services/profile";
import {
  close_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global/loader";
import { getCookie, setCookie } from "../../lib/session";
import { blockChatUser } from "../../services/chat";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { useRouter } from "next/router";
import { useTheme } from "react-jss";

import Icon from "../image/icon";
import { useDispatch, useSelector } from "react-redux";
import useProfileData from "../../hooks/useProfileData";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import { Creator_Icon } from "../../lib/config/header";
import { isAgency } from "../../lib/config/creds";
import Button from "../button/button";
import { UPDATE_PROFILE_FOLLOWING } from "../../redux/actions/auth";
const Image = dynamic(() => import("../image/image"), { ssr: false });
const ConfirmDialog = dynamic(() => import("./confirmDialog"), { ssr: false });
const Avatar = dynamic(() => import("@material-ui/core/Avatar"), {
  ssr: false,
});

/**
 * Updated By @author Bhavleen Singh
 * @date 17/04/2021
 * @description Used Redux to Update Profile Following Dynamically
 */

const UserTile = (props) => {
  const theme = useTheme();
  let [follow, setFollow] = useState(props.isFollow);
  const [isLoading, setIsLoading] = useState(false)
  const userCurrentId = getCookie("uid");
  const { blockUsr } = props;
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const router = useRouter();

  const [currProfile] = useProfileData();
  const dispatch = useDispatch();

  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    setFollow(props.isFollow);
  }, [props.isFollow]);

  const followingUser = async (e) => {
    e.stopPropagation();
    props.auth(router.asPath).then(async () => {
      try {
        let reqPayload = {
          followingId: props.userId,
        };
        if (isAgency()) {
          reqPayload["userId"] = selectedCreatorId;
        }
        setIsLoading(true)
        let followingData = await followAPI(reqPayload);
        dispatch(UPDATE_PROFILE_FOLLOWING(currProfile.totalFollowing + 1));
        setCookie("profileData", JSON.stringify({
          ...currProfile,
          totalFollowing: currProfile.totalFollowing + 1
        }))
        setIsLoading(false)
        // if (props.updateCount) {

        //   props.updateFollowing({ type: 1, id: props.userId });
        // }
        Toast(followingData.data.message);
        setFollow(true);

      } catch (e) {
        setIsLoading(false)
        e.response && Toast(e.response.data.message, "error");
        console.error(e);
      }
    });
  };

  const unFollow = async (e) => {
    e.stopPropagation();

    props.auth().then(async () => {
      try {
        let reqPayload = {
          followingId: props.userId,
        };
        if (isAgency()) {
          reqPayload["userId"] = selectedCreatorId;
        }
        startLoader();
        await unfollowAPI(reqPayload);

        // dispatch(UPDATE_PROFILE_FOLLOWING(currProfile.totalFollowing - 1));
        Toast(`${lang.unfollowMsg} ${props.username}`)
        setFollow(false);
        stopLoader();

      } catch (e) {
        e.response && Toast(e.response.data.message, "error");
        stopLoader();

        console.error(e);
      }
    });
  };

  const handleUnBlock = async () => {
    let payload = {
      opponentUserId: props.blockedUserId,
      trigger: "UNBLOCK",
    };
    try {
      let response = await blockChatUser(payload);

      if (response.status == 200) {
        props.handleGetBlockedList();
        mobileView ? "" : props.updateScreen();
        Toast(response.data.message, "success");
        close_dialog();
      } else {
        Toast("No Data Found", "error");
      }
    } catch (e) {
      Toast(
        e.response
          ? e?.response?.data?.message || e?.response?.data
          : "Unblocking Failed!",
        "error"
      );
    }
  };

  return (
    <li
      className={`nav-item${mobileView
        ? ""
        : ` ${props.storyViews && props.isMobile
          ? "dv_story-view_hover"
          : "dv_link_hover"
        }`
        }`}
    >
      <div className="nav-link px-2 w-100">
        <div className="row align-items-end w-100 mx-0">
          <div className="col-12 px-0">
            <div className="form-row row m-0 align-items-center">
              <div
                className={`col-auto pl-0 pr-3 ${props.userType == "MODEL" ||
                  props.searchBar ||
                  props.userTypeCode == 2
                  ? " cursorPtr"
                  : ""
                  }`}
              >
                {props?.profilePic && props.profilePic[0] !== "h" ? (
                  <Image
                    src={s3ImageLinkGen(S3_IMG_LINK, props.profilePic, 50, 70, 70)}
                    width={70}
                    className={
                      mobileView ? "follow-profile" : "dv__follow-profile"
                    }
                  />
                ) : (
                  <Avatar
                    className={
                      mobileView ? "mui-cust-avatar" : "mui-cust-avatar-dv"
                    }
                  >
                    {props?.fullName
                      ? props.fullName[0]
                      : props?.firstName
                        ? props.firstName[0]
                        : "av"}
                  </Avatar>
                )}
                {blockUsr ? (
                  ""
                ) : props.userType == "MODEL" ? (
                  <div>
                    <Image
                      src={Creator_Icon}
                      width={20}
                      height={20}
                      style={{
                        position: "absolute",
                        top: "0px",
                        right: "12px",
                      }}
                    />
                  </div>
                ) : ""
                }
              </div>

              <div className="col px-0 pb-2 borderBtm">
                <div className="row mx-0 justify-content-between align-items-center">
                  <div
                    className={`col-8 pl-0 ${props.userType == "MODEL" ||
                      props.searchBar ||
                      props.userTypeCode == 2
                      ? " cursorPtr"
                      : ""
                      }`}
                    onClick={
                      blockUsr &&
                        (props.userType === "MODEL" || props.userTypeCode == 2)
                        ? () => {
                          startLoader();
                          setCookie("otherProfile", `${item?.username || item?.userName}$$${item?.userId || item?.userid || item?._id}`)
                          router.push(
                            `${item.username || item.userName}`
                            // `/user/${item._id}`
                          );
                          close_dialog();
                        }
                        : () => { }
                    }
                  >
                    <div
                      title={`${props.fullName
                        ? props.fullName
                        : props.username
                        }`}
                      className={

                        mobileView
                          ? "mv_chat_pro_name"
                          : `dv__fnt18 txt-roman${props.storyViews && props.isMobile
                            ? " text-light"
                            : ""
                          }`
                      }
                    >
                      {" "}
                      {props.username || props.userName}

                      {/* {props.fullName
                        ? props.fullName
                        : props.firstName + " " + props.lastName} */}
                    </div>
                    <div
                      className={
                        mobileView
                          ? "mv_chat_pro_status"
                          : // : "txt-roman dv__fnt12 dv__Grey_var_10"
                          `txt-roman dv__fnt12${props.storyViews && props.isMobile
                            ? " text-light"
                            : " dv__Grey_var_10"
                          }`
                      }
                    >
                      {props.username || props.userName}
                    </div>
                  </div>
                  <div className="col-4 px-0">
                    {blockUsr
                      ? <div className="d-flex justify-content-end align-items-center">
                        <button
                          className={
                            mobileView
                              ? "btn btn-default btn_follow"
                              : "btn btn-default dv__blueborderBtn"
                          }
                          style={
                            mobileView
                              ? {}
                              : {
                                height: "1.903vw",
                                borderRadius: "0.878vw",
                                fontSize: "0.805vw",
                                width: "5.783vw",
                              }
                          }
                          onClick={
                            mobileView
                              ? () => {
                                open_drawer("confirmDrawer", {
                                  title: `Are you sure you want to unblock ${props.fullName
                                    ? props.fullName
                                    : props.firstName +
                                    " " +
                                    props.lastName
                                    }? `,
                                  btn_class: "dangerBgBtn",
                                  cancelT: "Cancel",
                                  submitT: "Unblock",
                                  yes: handleUnBlock,
                                },
                                  "bottom"
                                );
                              }
                              : () => {
                                props.updateScreen(
                                  <ConfirmDialog
                                    title={`Are you sure you want to unblock ${props.fullName
                                      ? props.fullName
                                      : props.firstName +
                                      " " +
                                      props.lastName
                                      }? `}
                                    btn_class="dangerBgBtn"
                                    cancelT="Cancel"
                                    submitT="Unblock"
                                    yes={handleUnBlock}
                                    onClose={() => props.updateScreen()}
                                  ></ConfirmDialog>
                                );
                              }
                          }
                        >
                          {lang.unblock}
                        </button>
                      </div>
                      : props.searchBar
                        ? <div className="d-flex justify-content-end align-items-center">
                          {!props?.recentSearch && userCurrentId != props.userId && !follow &&
                            <div>
                              <Button
                                fclassname={`rounded-pill px-3 py-1 btnGradient_bg`}
                                onClick={followingUser}
                                children={lang.follow}
                                isLoading={isLoading}
                              />
                            </div>
                          }
                        </div>
                        : props.userId != userCurrentId &&
                        props.userType === "MODEL" && (
                          <div className="d-flex justify-content-end align-items-center">
                            {!follow &&
                              <Button
                                fclassname={`rounded-pill px-3 py-1 btnGradient_bg`}
                                onClick={followingUser}
                                children={lang.follow}
                                isLoading={isLoading}
                              />
                            }
                          </div>
                        )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>
          {`
   :global(.btn_following){
    padding: 5px 8px !important;
    width: 91px !important;
    font-size: 12px !important;
   }
   `}
        </style>
      </div>
    </li>
  );
};

export default UserTile;
