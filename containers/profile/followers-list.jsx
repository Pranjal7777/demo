import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import List from "../../components/timeline-control/list";
import useLang from "../../hooks/language";
import {
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global/loader";
import { follow, getFollowCount, getProfile } from "../../services/profile";
const ShowMore = dynamic(() => import("../../components/show-more-text/ShowMoreText"));
import Wrapper from "../../hoc/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "../../lib/session";
import { setProfile } from "../../redux/actions";
import isMobile from "../../hooks/isMobile";
import { UPDATE_PROFILE_FOLLOWING } from "../../redux/actions/auth";
import useProfileData from "../../hooks/useProfileData";
import { authenticate } from "../../lib/global/routeAuth";
import { isAgency } from "../../lib/config/creds";
/**
 * @description component to show follower/posts/followings list
 * @author Jagannath
 * @date 2020-12-24
 * @param props {
 *  showPost: boolean,
 *  showFollowers: boolean,
 *  showFollowings: boolean,
 *  followersCount: number,
 *  followingCount: number,
 *  postCount: number,
 *  id: string - (userid)
 *  bio: string
 * }
 * Updated By @author Bhavleen Singh
 * @date 17/04/2021
 * @description Used Redux to Update Profile Following Dynamically
 */

export default function FanFollowersList(props) {
  const [lang] = useLang();
  let title = props.isFollow ? lang.follow : lang.following;
  const [followTitle, setfollowTitle] = useState(title);
  const [bioWidth, setBioWidth] = useState(0);
  const [mobileView] = isMobile();
  const [currProfile] = useProfileData();
  const userType = getCookie("userType");
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.bio) {
      var bioSec = document.getElementById("bioSec");
      setBioWidth(
        mobileView ? window.innerWidth - 50 || 0 : bioSec.offsetWidth - 50
      );
    }
  }, []);

  const callFollow = async () => {
    // console.log("mans", props.id);
    let payload = {
      followingId: props.id,
    };

    startLoader();
    follow(payload)
      .then(async (res) => {
        if (res.status === 200) {
          Toast(res.data && res.data.message, "success");
          // console.log("follow", res);
          setfollowTitle("Following");
          stopLoader();
          dispatch(UPDATE_PROFILE_FOLLOWING(currProfile.totalFollowing + 1));
        }
      })
      .catch(async (err) => {
        if (err.response) {
          stopLoader();
          console.error(err.response.data.message);
        }
        console.error(err);
      });
  };


  return (
    <Wrapper>
      {props.sideMenu ? (
        <Wrapper>
          {props.showPosts && (
            <List count={props.postCount} title="Posts" otherProfile={props.otherProfile} {...props} />
          )}
          {props.showFollowers && (
            <List
              count={props.followersCount}
              title="Followers"
              otherProfile={props.otherProfile}
              onClick={() => {
                if (props.otherProfile) return;
                open_drawer(
                  "followers",
                  {
                    userId: props.id,
                    type: 2,
                    id: props.id,
                    auth: authenticate,
                    other: props.otherProfile ? true : false,
                    mobileView: mobileView,

                    // setFollowFollowingCount: setFollowFollowingCount,
                  },
                  "right"
                );
              }}
              {...props}
            />
          )}
          {props.showFollowings && (
            <List
              count={props.followingCount}
              title="Following"
              otherProfile={props.otherProfile}
              onClick={() => {
                if (props.otherProfile) return;
                open_drawer(
                  "following",
                  {
                    userId: props.id, //props.profile._id,
                    type: 1,
                    id: undefined,
                    auth: authenticate,
                    other: false,
                    mobileView: mobileView,

                    // setFollowFollowingCount: setFollowFollowingCount,
                  },
                  "right"
                );
              }}
              {...props}
            />
          )}
        </Wrapper>
      ) : (
        <div
          className={
            props.otherProfile && !mobileView
              ? ""
              : `col-12 ${mobileView ? "" : "pl-0"}`
          }
        >
          <div className={props.otherProfile && !mobileView ? "" : "row"}>
            <div
              className={
                props.otherProfile && !mobileView
                    ? "websiteContainer other_profile centerList"
                  : "container"
              }
            >
                <div className={`row justify-content-between align-items-center ${props.otherProfile && !mobileView ? "" : "mb-2"}`}>
                  <div className={`${props.otherProfile && !mobileView ? "col-12 d-flex align-items-center" : "col-auto"} `}>
                    <div className="row text-center manageList">
                    {props.showPosts && (
                        <List count={props.postCount} title="Posts" otherProfile={props.otherProfile} {...props} />
                    )}
                      {/* {props.showDots && userType == 2 && <div className="d-flex align-items-center bck3 greyColor" style={{ marginTop: '-15px', paddingTop: "4px" }}>.</div>} */}
                    {props.showFollowers && (
                      <List
                        count={props.followersCount}
                        title="Followers"
                          otherProfile={props.otherProfile}
                          // managePadding={true}
                        onClick={() => {
                          if (props.otherProfile) return;
                          mobileView
                            ? open_drawer(
                              "followers",
                              {
                                userId: props.id,
                                type: 2,
                                id: props.id,
                                auth: authenticate,
                                selectedCreatorId: selectedCreatorId,
                                other: props.otherProfile ? true : false,
                                mobileView: mobileView,
                                // setFollowFollowingCount: setFollowFollowingCount,
                              },
                              "right"
                            )
                            : open_dialog("followers", {
                              userId: props.id,
                              selectedCreatorId: selectedCreatorId,
                              type: 2,
                              id: props.id,
                              auth: authenticate,
                              other: props.otherProfile ? true : false,
                              mobileView: mobileView,
                              // setFollowFollowingCount: setFollowFollowingCount,
                            });
                        }}
                        {...props}
                      />
                    )}
                      {/* {props.showDots && userType == 2 && <div className="d-flex align-items-center bck3 greyColor" style={{ marginTop: '-15px', paddingTop: "4px" }}>.</div>} */}
                    {props.showFollowings && (
                      <List
                        count={props.followingCount}
                          managePadding={true}
                          otherProfile={props.otherProfile}
                        title="Following"
                          className="managePaddingForUser managePaddingForUser "
                        onClick={() => {
                          if (props.otherProfile) return;
                          {
                            mobileView
                              ? open_drawer(
                                "following",
                                {
                                  userId: props.id, //props.profile._id,
                                  type: 1,
                                  id: props.id,
                                  selectedCreatorId: selectedCreatorId,
                                  auth: authenticate,
                                  other: props.otherProfile ? true : false,
                                  mobileView: mobileView,
                                  // setFollowFollowingCount: setFollowFollowingCount,
                                },
                                "right"
                              )
                              : open_dialog("followers", {
                                userId: props.id, //props.profile._id,
                                type: 1,
                                id: props.id,
                                auth: authenticate,
                                selectedCreatorId: selectedCreatorId,
                                other: props.otherProfile ? true : false,
                                mobileView: mobileView,
                                // setFollowFollowingCount: setFollowFollowingCount,
                              });
                          }
                        }}
                        {...props}
                      />
                    )}
                  </div>
                </div>
                {/* {
              <div className="col-auto">
                <div className="form-row">
                  {props.others ? (
                    <div className="text-center row">
                      <div className=" col-auto pad-left-0">
                        <button
                          type="button"
                          className="btn btn-default dv_liveBtnProfile_big"
                        >
                          {lang.Chat}
                        </button>
                      </div>
                      <div className=" col-auto pad-left-0">
                        <button
                          type="button"
                          className="btn btn-default dv_liveBtnProfile_big followfollowing px-2"
                          onClick={() => {
                            callFollow();
                          }}
                        >
                          {followTitle}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="col-auto">
                      <button
                        type="button"
                        className="btn btn-default dv_liveBtnProfile_big mv-edit-profile"
                        onClick={() => {
                          Route.push(`/profile/edit`);
                        }}
                      >
                        {lang.edit}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            }{" "} */}
              </div>
              {props.bio && (
                  <div className="row justify-content-between align-items-center manageBioWidth">
                  <div className="col-12" id="bioSec">
                    {
                      <ShowMore
                        width={bioWidth}
                        text={props.bio}
                        className={
                          mobileView
                            ? ""
                            : props.otherProfile
                              ? "txt-roboto dv__fnt16 dv_appTxtClr d-block m-auto adjustWidth"
                              : "dv__count"
                        }
                      />
                    }
                  </div>
                </div>
              )}
                {props?.otherProfile && mobileView && <div className={`my-2 d-flex flex-nowrap overflow-auto scrollbar-hidden`}>
                  {props?.categoryData?.map((data) => (
                    <span className="categoryData_css px-2 ml-2">{data?.title}</span>
                  ))}
                </div>}
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
      :global(.managePadding){
        padding: 0px 5px;
      }
      :global(.managePaddingForUser){
        padding-left:${userType != 2 && "1rem"};
      }
      .categoryData_css{
        border:1px solid var(--l_base);
        border-radius:6px;
        min-width:fit-content;
        overflow:hidden
      }
      `}</style>
    </Wrapper>
  );
}
