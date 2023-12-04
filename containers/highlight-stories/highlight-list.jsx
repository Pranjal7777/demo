import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import isMobile from "../../hooks/isMobile";
import {
  close_drawer,
  open_drawer,
  CustomPageLoader,
  open_dialog,
} from "../../lib/global/loader";
import { scrollToView } from "../../lib/global/scrollToView";
import { getCookie } from "../../lib/session";
import { getFeaturedStoryApi } from "../../services/assets";
const CustomDataLoader = dynamic(() => import("../../components/loader/custom-data-loading"), { ssr: false });
const HorizonatalPagination = dynamic(() => import("../../components/pagination/horizonatalPagination"), { ssr: false });
import { useTheme } from "react-jss";
import Icon from "../../components/image/icon";
import useLang from "../../hooks/language";
import { ParseToken } from "../../lib/parsers/token-parser";
import { COLLECTION_PLUS } from "../../lib/config/profile";
import { isAgency } from "../../lib/config/creds";
const HighlightSlider = dynamic(() => import("./HighlightSlider"));

const HighlightedStories = (props) => {
  const theme = useTheme();
  const { otherProfile } = props;
  const [featuredStoryList, setFeaturedStoryList] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [profile, setProfile] = useState(otherProfile);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const ownProfile = useSelector((state) => state.profileData);
  const auth = getCookie('auth');
  const guestToken = useSelector(state => state.guestToken);
  const uid = isAgency() ? selectedCreatorId : getCookie("uid");
  const [mobileView] = isMobile();
  const [lang] = useLang();

  useEffect(() => {
    if (!otherProfile || !otherProfile._id) {
      setProfile(ownProfile);
    }
    setRefreshLoading(true);
    // getHighlightedStories();
  }, []);

  useEffect(() => {
    setProfile(props.otherProfile)
    setFeaturedStoryList([])
    if (!otherProfile || !otherProfile._id) {
      setProfile(ownProfile);
    }
    setRefreshLoading(true);
    getHighlightedStories();
  }, [props.otherProfile?._id]);

  useEffect(() => {
    if (page === 1) {
      getHighlightedStories(page)
    }
  }, [page, props.otherProfile?._id])


  const handleClose = () => {
    // console.log("handleClose");
  };
  const handleClickNewHighlight = () => {
    mobileView
      ? open_drawer(
        "ADD_HIGHLIGHT_STORY",
        {
          handleClose: handleClose,
          data: {},
          back: () => back(),
        },
        "right"
      )
      : open_dialog("ADD_HIGHLIGHT_STORY", {
        handleClose: handleClose,
        data: {},
        back: () => back(),
        closeAll: true,
      });
  };



  const getHighlightedStories = (pageCount = 0) => {
    const list = {
      limit: 10,
      offset: pageCount * 10,
      userId: (otherProfile && otherProfile._id) || ownProfile._id,
    };
    if (isAgency()) {
      list["creatorId"] = selectedCreatorId;
    }
    getFeaturedStoryApi(list, auth ? {} : { authorization: ParseToken(guestToken) })
      .then((res) => {
        // console.log("res", res);
        if (res && res.data && res.data.data) {
          if (res.data.data?.length > 9) {
            setPage(prev => prev + 1);
          }
          if (pageCount) {
            setFeaturedStoryList((prev) => [...prev, ...res.data.data]);
          } else {
            setFeaturedStoryList(res.data.data);
            setLoading(false);
          }

        } else if (pageCount == 0 && res?.status == 204) {
          setFeaturedStoryList(res?.data);
          setLoading(false);
        }
        // else {
        //   setFeaturedStoryList([]);
        // }
        CustomPageLoader(false);
        setRefreshLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setRefreshLoading(false);
        console.error(err);
      });
  };

  const back = () => {
    setRefreshLoading(true);
    setTimeout(() => {
      getHighlightedStories(0);
    }, 1000);
    close_drawer();
  };

  const storyClickHandler = (list, index) => {
    if (mobileView) {
      open_drawer(
        "STORY_CAROUSEL_MOB",
        {
          drawerData: list,
          activeStory: index,
          theme: theme,
          ownStory: profile && profile._id == uid,
          creator: {
            userId: (profile && profile._id) || "",
            profilePic: (profile && profile.profilePic) || "",
            username: (profile && profile.username) || "",
            firstName: (profile && profile.firstName) || "",
            lastName: (profile && profile.lastName) || ""
          },
          setActiveState: props.setActiveState,
          back: () => back(),
          fromHighlightStories: true,
        },
        "right"
      );
    } else {
      open_drawer(
        "STORY_CAROUSEL_DESKTOP",
        {
          drawerData: list,
          activeStory: index,
          ownStory: profile && profile._id == uid,
          creator: {
            userId: (profile && profile._id) || "",
            profilePic: (profile && profile.profilePic) || "",
            username: (profile && profile.username) || "",
            firstName: (profile && profile.firstName) || "",
            lastName: (profile && profile.lastName) || ""
          },
          setActiveState: props.setActiveState,
          theme: theme,
          back: () => back(),
          fromHighlightStories: true,
        },
        "right"
      );
    }
  };

  return (
    <React.Fragment>
      {featuredStoryList && featuredStoryList.length && !otherProfile ? <div className={`mb-2 mt-1 fntSz15 fntWeight700 highlightedStoryText ${mobileView && "adjustSidePadding mb-1"}`}>{lang.highlightedStories}</div> : ""}
      <div
        className={
          mobileView ? "col-12 my-2 d-flex " : `col-12 p-0 ${otherProfile ? "" : "p-0 d-flex "}`
        }
      >
        {!otherProfile && (
          <div className="col-auto p-0 d-flex flex-column align-items-center" style={!mobileView ? { marginTop: "8px" } : {}} >
            <div
              onClick={handleClickNewHighlight}
              className="position-relative active add_highlight pointer d-felx rounded-pill"

            >
              <Icon
                icon={`${COLLECTION_PLUS}#Add_Collection`}
                color={theme.palette.l_base}
                width={19.5}
                height={56}
                viewBox="0 0 19.499 19.498"
              />
            </div>
            {!otherProfile && <p className="gradient_text w-600 d-flex justify-content-center mb-0 mt-1 fntSz12">{lang.create}</p>}
          </div>
        )}

        <div
          id="featured_list"
          className="form-row alignStories position-relative w-100"
          style={{ flexWrap: "nowrap", overflowX: "auto", marginLeft: "4px", maxHeight: "92px" }}
        >

          {refreshLoading && (
            <span className="feat_refresh_loading">
              <span className="feat_ref_loader">
                <CustomDataLoader
                  size={35}
                  borderWidth="10px"
                  loading={true}
                  type="ClipLoader"
                ></CustomDataLoader>
              </span>
            </span>
          )}
          <div className={`highlightSlider position-relative ${!mobileView && "mt-2"}`}>
            {featuredStoryList && featuredStoryList.length ? (
              <HighlightSlider storyClickHandler={storyClickHandler} mobileView={mobileView} featuredStoryList={featuredStoryList} otherProfile={otherProfile} theme={theme} />
            ) : null}
          </div>
          <span id="feat_loader" className="story_loader">
            {loading && (
              <CustomDataLoader
                size={7}
                margin={2}
                loading={loading}
                type="PulseLoader"
              ></CustomDataLoader>
            )}
          </span>
        </div>

        <HorizonatalPagination
          id="featured_list"
          pageEventHandler={() => {
            !loading && getHighlightedStories(page);
            setLoading(true);
            scrollToView("feat_loader");
          }}
        ></HorizonatalPagination>
      </div>

      <style jsx>{`
        .add_highlight {
          border: 1px dashed ${theme.palette.l_base};
          display: flex;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 8px;
        }
  
        .feat_refresh_loading {
          justify-content: center;
          align-items: center;
          display: flex;
          position: absolute;
          width: 100%;
          height: 100%;
        }
        .feat_ref_loader {
          z-index: 100;
        }
       
        :global(.form-row::-webkit-scrollbar){
          display:none !important
        }
        .alignStories{
          justify-content:${mobileView ? "left" : "center"}
        }

        :global(.alignStories>div){
          width:100%;
        }
    
        .adjustSidePadding{
          padding:${otherProfile ? "0 24px" : "0 15px"};
        }
        
      `}</style>
    </React.Fragment>
  );
};
export default HighlightedStories;
