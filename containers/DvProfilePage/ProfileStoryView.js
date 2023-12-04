import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { SET_OWN_STORIES } from "../../redux/actions/actionTypes";
import { getAllOwnStoriesApi, getOwnStories } from "../../services/assets";
import { useDispatch, useSelector } from "react-redux";
import isMobile from "../../hooks/isMobile";
import { refreshStoryApi } from "../../lib/rxSubject";
import { useTheme } from "react-jss";
const Avatar = dynamic(() => import("@material-ui/core/Avatar"), { ssr: false });
import useLang from "../../hooks/language";
import FigureCloudinayImage from "../../components/cloudinayImage/cloudinaryImage";
import { close_drawer, open_dialog, open_drawer } from "../../lib/global/loader";
import { EMPTY_PROFILE } from "../../lib/config/placeholder";
import { PLUS_ICONS } from "../../lib/config";
import Icon from "../../components/image/icon";
import { isAgency } from "../../lib/config/creds";
import { handleContextMenu } from "../../lib/helper";

const OwnProfileStoryPage = (props) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { handleRefresh, handleClick, isStickyHeader = false } = props;
    const [story, setStory] = useState(null);
    const profile = useSelector((state) => state.profileData);
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
    const [successApi, setSuccessApi] = useState(false);

    const [mobileView] = isMobile();
    const [lang] = useLang();

    const userData = {
        userId: profile._id,
        profilePic: profile.profilePic,
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
    };

    useEffect(() => {
        if (profile?.userTypeCode !== 1) {
            getActiveStories();
        }
    }, [handleRefresh, successApi]);

    useEffect(() => {
        const refresh = refreshStoryApi.subscribe((params) => {
            getActiveStories()
        });
        return refresh.unsubscribe()
    }, [])

    const getActiveStories = () => {
        let payload = {
        }
        if (isAgency()) {
            payload["userId"] = selectedCreatorId;
        }
        getAllOwnStoriesApi(payload)
            .then((res) => {
                if (res && res.data && res.data.data) {
                    setStory(res.data.data);
                    dispatch({
                        type: SET_OWN_STORIES,
                        payload: res.data.data,
                    });
                }
                res.data === "" && setStory("")
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const onSuccessApi = () => {
        setSuccessApi(!successApi)
    }

    const storyClickHandler = (data) => {
        open_drawer("OWN_STORY", {
            stories: story,
            ownStory: true,
            creator: userData,
            theme,
            lang: lang,
            setActiveState: props.setActiveState,
            S3_IMG_LINK,
            back: () => back(),
        },
            "right"
        );
    };

    const handleCreatePost = () => {
        mobileView ? open_drawer('CREATE_POST', {
            onSuccessApi: onSuccessApi,
            story: true,
        }, "bottom")
            : open_dialog("POST_DIALOG", {
                onSuccessApi: onSuccessApi,
                story: true,
            })
    }

    const back = () => {
        getActiveStories();
        close_drawer();
    };

    return (
        <div className="col-auto">
            <div className="py-1 my-1 justify-content-between align-items-center">
                <div className="col-12 p-0">
                    <div className="row">
                        <div className="col-auto">
                            <div className="position-relative callout-none" onContextMenu={handleContextMenu}>
                                {props.profilePic
                                    ? <FigureCloudinayImage
                                        publicId={props.profilePic}
                                        errorImage={EMPTY_PROFILE}
                                        width={76}
                                        ratio={1}
                                        crop="mpad"
                                        style={isStickyHeader ? {} : { marginTop: "-55px" }}
                                        className={`${story ? "tileRounded cursorPtr" : "solid_circle_border"} active mv_profile_logo`}
                                        onClick={story ? storyClickHandler : handleClick}
                                    />
                                    : <Avatar className="username__avatar mb-1 mv_profile_logo  solid_circle_border" style={isStickyHeader ? {} : { marginTop: "-55px" }}>
                                        {profile && profile.username && profile.lastName && (
                                            <span className="avatar__initial">
                                                {profile.firstName[0] + profile.lastName[0]}
                                            </span>
                                        )}
                                    </Avatar>
                                }
                                {profile?.userTypeCode === 2 && !isStickyHeader && <span onClick={handleCreatePost}
                                    className={
                                        mobileView
                                            ? "add_story_option"
                                            : "dv__add_story_option"
                                    }>
                                    <Icon
                                        icon={`${PLUS_ICONS}#plus_icon`}
                                        height={26}
                                        width={26}
                                        color={"var(--l_base)"}
                                        alt="back arrow icon"
                                        style={{ bottom: mobileView ? "-2px" : "-1px", right: mobileView ? "-8px" : "-20px", zIndex: "999" }}
                                        class="cursorPtr position-absolute"
                                    />
                                </span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .mv_profile_logo {
                    width:${isStickyHeader ? "65px !important" : ""};
                    height: ${isStickyHeader ? "65px !important" : ""};
                  }
            `}</style>
        </div>
    );
};
export default OwnProfileStoryPage;
