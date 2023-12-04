import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { EMPTY_PROFILE } from "../../lib/config/placeholder";
import { getCookie } from "../../lib/session";
import { getStories } from "../../services/assets";
import { close_drawer, open_drawer } from "../../lib/global/loader";
import isMobile from "../../hooks/isMobile";
import { useTheme } from "react-jss";
import { handleContextMenu } from "../../lib/helper";
const FigureCloudinayImage = dynamic(
    () => import("../../components/cloudinayImage/cloudinaryImage"),
    { ssr: false }
);
/**
 * @description This is to show the Story Tiles on profile
 * @author Kashinath
 * @date 16/05/2023
 * @param {*} props
 * @return {*}
 */
const OtherProfileStories = (props) => {
    const { profile, isStickyHeader = false } = props;
    const theme = useTheme();
    const limit = 7;
    const userType = getCookie("userType");
    const { handleRefresh, setActiveState } = props;
    const [stories, setStories] = useState([]);
    const [mobileView] = isMobile();

    useEffect(() => {
        getAllStories();
    }, [handleRefresh, profile]);

    const getAllStories = (skip = 0) => {
        getStories(skip * limit)
            .then((res) => {
                if (res && res.data) {
                    const resData = res.data.data.filter((data) => data?.userId === profile?._id)
                    if (skip) {
                        setStories([...stories, ...resData]);
                    } else {
                        setStories(resData);
                    }
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const storyClickHandler = (list, index) => {
        if (mobileView) {
            open_drawer("STORY_CAROUSEL_MOB", {
                drawerData: list,
                activeStory: index,
                theme: theme,
                setActiveState: setActiveState,
                back: () => back(),
            }, "right"
            );
        } else {
            open_drawer("STORY_CAROUSEL_DESKTOP", {
                drawerData: list,
                activeStory: index,
                setActiveState: setActiveState,
                theme: theme,
                back: () => back(),
            }, "right"
            );
        }
    };

    const back = () => {
        getAllStories();
        close_drawer();
    };

    return (
        <div className={`${mobileView ? "" : "col-12 p-0"} callout-none`} onContextMenu={handleContextMenu}>
            {(profile?.isFollow && stories?.length)
                ?
                stories?.map((user, i) => {
                    return (
                        <div
                            key={i}
                            onClick={() => {
                                storyClickHandler(stories, i);
                            }}
                        >
                            <div className="position-relative d-flex justify-content-around callout-none" onContextMenu={handleContextMenu}>
                                <FigureCloudinayImage
                                    publicId={user.profilePic}
                                    errorImage={EMPTY_PROFILE}
                                    style={{ marginTop: "5px" }}
                                    width={"100%"}
                                    ratio={1}
                                    className={`tileRounded ${!user.isViewed && "active"} mv_profile_logo cursorPtr`}
                                />
                            </div>
                        </div>
                    );
                }) :
                <FigureCloudinayImage
                    publicId={profile.profilePic}
                    width={"100%"}
                    style={{ marginTop: "5px" }}
                    ratio={1}
                    alt={`${profile.firstName} ${profile.lastName} - ${profile.country}`}
                    className="mv_profile_logo solid_circle_border"
                    visibleByDefault={true}
                />
            }
            <style>{`
                .story_loader {
                    position: absolute;
                    right: 5px;
                    height: 80px;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    transform: rotate(90deg);
                }
                .mv_profile_logo {
                    width:${mobileView ? "80px !important" : isStickyHeader ? "65px !important" : "112px !important"};
                    height: ${mobileView ? "80px !important" : isStickyHeader ? "65px !important" : "112px !important"};
                  }
            `}</style>
        </div>
    );
};

export default OtherProfileStories;
