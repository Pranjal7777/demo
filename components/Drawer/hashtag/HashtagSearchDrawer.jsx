import { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import { useSelector } from "react-redux";
import { makeStyles, Paper, Tab, Tabs } from "@material-ui/core";
import { useTheme } from "react-jss";
import Router from "next/router";

import Wrapper from "../../../hoc/Wrapper";
import useLang from "../../../hooks/language";
import isMobile from "../../../hooks/isMobile";
import { authenticate, close_drawer, open_drawer, open_dialog, close_progress, open_progress, startLoader, stopLoader, Toast } from "../../../lib/global";
import ModelSearchBar from "../../../containers/timeline/search-bar";
import Img from "../../ui/Img/Img";
import * as env from "../../../lib/config";
import { getHashtagAPI, getPopularHashtagsAPI, getRecentSearchAPI, recentSearchAPI } from "../../../services/hashtag";
import { getSuggetions } from "../../../services/explore";
import Icon from "../../image/icon";
import InputBox from "../../input-box/input-box";
import UserTile from "../../Drawer/UserTile";
import { getCookie, setCookie } from "../../../lib/session";
import { commonHeader } from "../../../lib/request";
import DvSearchBar from "../../../containers/DvSearchBar";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";
import { getRecentSearches } from "../../../redux/actions";
import { getblockChatUser } from "../../../services/chat";
// import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";

const tabStyles = makeStyles({
  customTabs: {
    backgroundColor: "var(--l_app_bg)", // Change the background color of tabs
    color: 'var(--l_app_text)', // Change the text color of tabs
  },
  tab:{
    color: "var(--l_app_text)",
    textTransform: "capitalize",
    fontWeight: "bold",
    fontSize: "16px"
  },
  selectedTab: {
    color: "var(--l_base)",
    textTransform: "capitalize",
    fontWeight: "bold",
    fontSize: "16px"
  }
})

const HashtagSearchDrawer = (props) => {
  const [lang] = useLang();
  const theme = useTheme();
  const userId = getCookie("uid");
  const tabClass = tabStyles();
  const [mobileView] = isMobile();

  const [searchValue, setSearchValue] = useState("");
  const [hashtagList, setHashtagList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [apiData, setApiData] = useState(null);
  const [value, setValue] = useState(0);

  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const RECENT_SEARCHES = useSelector((state) => state?.desktopData?.hashtagPage?.recentSearches);

  useEffect(() => {
    getRecentSearch();
  }, [])

  useEffect(() => {
    if (searchValue) {
      searchResult();
    }
  }, [searchValue, value]);

  // useEffect(() => {
  //   searchResult();
  // }, [value]);

  const searchResult = async () => {
    try {
      startLoader();

      if (value) {
        // API Call
        if (searchValue.startsWith("#")) {
          setUsersList([])
          stopLoader();
          return
        }
        const res = await getSuggetions(searchValue, 10, 0);

        // if (res.status == 200) {
        // setPage(pageCount);
        // if (!pageCount) {
        setUsersList(res?.data?.data)
        // } else {
        // setUsersList((prev) => [...prev, ...res.data.data])
        // }
        // }
      } else {
        const payload = {
          limit: 10,
          set: 0,
          searchValue: searchValue.startsWith("#") ? searchValue.slice(1) : searchValue,
        };

        // API Call
        const res = await getPopularHashtagsAPI(payload);

        // if (res.status == 200) {
        // setPage(pageCount);
        // if (!pageCount) {
        setHashtagList(res.data.result)
        // } else {
        // setHashtagList((prev) => [...prev, ...res.data.data])
        // }
        // }
      }
      stopLoader();

    } catch (err) {
      console.error("ERROR IN searchResult >", err);
      Toast(err?.response?.data?.message || lang.errorMsg, "error");
      stopLoader();
    }
  };

  const getRecentSearch = async (pageCount) => {
    try {
      startLoader();

      // API Calling (GET)
      const res = await getRecentSearchAPI();
      if (res.status == 200) {
        setApiData(res?.data?.data);
        dispatch(getRecentSearches(res?.data?.data));
      }
      stopLoader();

    } catch (err) {
      stopLoader();
      console.error("ERROR IN getRecentSearches", err);
      // Toast(err?.response?.data?.message, "error");
    }
  }

  const postRecentSearch = async (data, typeSearch) => {
    try {
      startLoader();

      let payload = {
        platform: Number(commonHeader.platform),
        ipAddress: commonHeader.ipAddress,
        latitude: commonHeader.latitude,
        longitude: commonHeader.longitude,
        city: commonHeader.city,
        country: commonHeader.country
      };

      if (typeSearch === "hashtagSearch") {
        let { name, noOfPost } = data;
        name = name.slice(1);

        payload = {
          ...payload,
          searchTag: name,
          type: 2,
          searchId: name
        }
      } else {
        payload = {
          ...payload,
          searchTag: searchValue,
          type: 1,
          searchId: data._id
        }
      }

      // API Calling (POST)
      const res = await recentSearchAPI(payload);
      stopLoader();

    } catch (err) {
      stopLoader();
      console.error("ERROR IN postRecentSearch", err);
      Toast(err?.response?.data?.message, "error");
    }
  }

  // const pageEventHandler = (e) => {
  //   setIsLoading(true);
  //   getPopularHashtag(page + 1);
  // };

  const drawerRedirection = (data) => {
    if (searchValue) postRecentSearch(data, "hashtagSearch");

    mobileView
      ? open_drawer("HashtagFollow", {
        hashtag: {
          name: `${data.searchIn ? `#${data?.searchIn}` : data?.name}`,
        },
        S3_IMG_LINK,
      }, "right")
      : ""
  }

  const redirectToProfile = (data) => {
    open_progress();
    if (searchValue) postRecentSearch(data);
    setCookie("otherProfile", `${data?.username?.trim() || data?.userName?.trim()}$$${data?.userId || data?.userid || data?._id}`)
    setSearchValue("");
    if (userId === data._id) {
      Router.push("/profile")
    } else {
      Router.push(`/${data.username || data.userName}`);
    }
  }

  const redirectrecentToProfile = async (data) => {
    open_progress();
    let userid = userId === userId ? data.userId : userId;
    let getBlockUser = await getblockChatUser(userid);
    let blockdata = getBlockUser.data.data.blocked;

    if (searchValue) postRecentSearch(data);
    setCookie("otherProfile", `${data?.username?.trim() || data?.userName?.trim()}$$${data?.userId || data?.userid || data?._id}`)
    setSearchValue("");
    if (userId === data._id || userId === data.userId) {
      Router.push("/profile")
    }
    else {
      !blockdata ? Router.push(`/${data.username || data.userName}`) : open_dialog("successOnly", {
        wraning: true,
        label: "You can't view to this user you're blocked.",
      })
    }
    blockdata && close_progress();
  }

  const SearchTile = () => {
    return (
      <div className="d-flex pt-3" style={{ borderBottom: "1px solid rgb(200, 207, 224)" }}>
        <div className="col-1 mt-2">
          <Icon
            icon={`${env.backArrow}#left_back_arrow`}
            color={theme.type === "light" ? "#000" : "#fff"}
            width={24}
            height={25}
            onClick={() => close_drawer("HashtagSearchDrawer")}
          />
        </div>
        <div className="col-11 p-0">
          <ModelSearchBar
            value={searchValue}
            handleSearch={(e) => setSearchValue(e.target.value)}
            onlySearch={true}
            autoFocus
          />
        </div>
      </div>
    )
  };

  const TabPanel = (props) => {
    const { children, value, index } = props;
    return <>{value === index && <div>{children}</div>}</>;
  };

  const HashtagSearch = () => {
    return (
      <ul className="list-unstyled m-0">
        {hashtagList?.map((data, index) => (
          <div
            key={index}
            className="d-flex justify-content-center align-items-center py-1 my-1"
            onClick={() => drawerRedirection(data)}
          >
            <div className="col-2">
              <Avatar className="hashtags" style={{ color: '#fff' }}>#</Avatar>
            </div>
            <div className="col-10">
              <p className="m-0 bold fntSz14" style={{ color: `${theme.type === "light" ? theme.palette.black : theme.palette.white}` }}>{data.name}</p>
              <p className="m-0 fntSz10" style={{ color: `${theme.type === "light" ? theme.palette.black : theme.palette.white}` }}>{`${data.noOfPost} ${data.noOfPost > 1 ? lang.posts : lang.post}`}</p>
            </div>
          </div>
        ))}
      </ul>
    );
  };

  const UsersSearch = () => {
    return (
      <ul className="list-unstyled m-0">
        {usersList?.map((data) => (
          <div
            key={data._id}
            onClick={() => redirectToProfile(data)}
          >
            <UserTile
              auth={authenticate}
              uUserId={userId}
              userId={data._id}
              isFollow={data.follow == 1 ? true : false}
              {...data}
              searchBar={true}
            />
          </div>
        ))}
      </ul>
    );
  };

  const TabsFunction = () => {
    return (
      <Tabs
        value={value}
        variant="fullWidth"
        onChange={() => setValue(value ? 0 : 1)}
        className={tabClass.customTabs}
      >
        <Tab
          className={value === 0 ? tabClass.selectedTab : tabClass.tab}
          label="Hashtags"
        />
        <Tab
          className={value === 1 ? tabClass.selectedTab : tabClass.tab}
          label="Users"
        />
      </Tabs>
    );
  };

  const NoDataPlaceholder = () => {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <div className="text-center">
          {searchValue === ""
            ? <Icon
              icon={`${env.NO_RECENT_SEARCH}#no_recent_search`}
              color={theme.palette.l_base}
              width={150}
              height={150}
              viewBox="0 0 152 152"
            />
            : value
              ? <Img
                key="empty-placeholder"
                className="text"
                src={env.FOLLOW_FOLLOWING}
              />
              : <Icon
                icon={`${env.NO_HASHTAG}#hashtag_svg`}
                color={theme.palette.l_base}
                width={150}
                height={150}
                viewBox="0 0 152 152"
              />
          }
          <p className="bold mt-3 dv_appTxtClr">
            {searchValue === ""
              ? lang.noRecentSearch
              : value
                ? lang.noUserFound
                : lang.noHashtagFound}
          </p>
        </div>
      </div>
    );
  };

  const TabsPanelFunction = () => {
    return (
      <>
        <TabPanel value={value} index={0}>
          {hashtagList?.length ? <HashtagSearch /> : <NoDataPlaceholder />}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {usersList?.length ? <UsersSearch /> : <NoDataPlaceholder />}
        </TabPanel>
      </>
    );
  };

  const RecentSearchUI = () => {
    return (
      <>
        <div className="col-12">
          <p className="bold px-4 py-2 dt__el">{lang.recent}</p>
        </div>

        {apiData?.length
          ? <ul className="list-unstyled m-0 overflow-auto" style={{ height: "calc(100% - 80px - 75px)" }}>
            {apiData?.map((data, index) => (
              data.type == 1
                ? <div
                  key={index}
                  className="d-flex justify-content-center align-items-center py-1 my-1"
                  onClick={() => redirectrecentToProfile(data)}
                >
                  <div className="col-2">
                    <Avatar src={s3ImageLinkGen(S3_IMG_LINK, data.profilePic, 50)} alt="profilePic" />
                  </div>
                  <div className="col-10">
                    <p className="m-0 bold fntSz14" style={{ color: `${theme.type === "light" ? theme.palette.black : theme.palette.white}` }}>{data.username || data.userName}</p>
                  </div>
                </div>
                : <div
                  key={index}
                  className="d-flex justify-content-center align-items-center py-1 my-1"
                  onClick={
                    data.postCount == 0
                      ? null
                      : () => drawerRedirection(data)}
                >
                  <div className="col-2">
                    <Avatar className="hashtags">#</Avatar>
                  </div>
                  <div className="col-10">
                    <p className="m-0 bold fntSz14" style={{ color: `${theme.type === "light" ? theme.palette.black : theme.palette.white}` }}>{data.searchIn}</p>
                    <p className="m-0 fntSz10" style={{ color: `${theme.type === "light" ? theme.palette.black : theme.palette.white}` }}>{`${data.postCount} ${data.postCount > 1 ? lang.posts : lang.post}`}</p>
                  </div>
                </div>
            ))}
          </ul>
          : <NoDataPlaceholder />
        }
        {/* {apiData?.map((data, index) => {
          <div key={index}>

          </div>
        })} */}
        {/* <div
          // key={data._id}
          onClick={() => {
            Router.push(`/otherProfile?userId=${data.userId || data._id}&status=1`);
          }}
        >
          <UserTile
            auth={authenticate}
            uUserId={userId}
            userId={data._id}
            isFollow={data.follow == 1 ? true : false}
            {...data}
            searchBar={true}
          />
        </div> */}
      </>
    )
  }

  return (
    <Wrapper>
      {mobileView
        ? <div className="h-100 card_bg">
          {SearchTile()}
          {searchValue
            ? <>
              <Paper>{TabsFunction()}</Paper>
              {TabsPanelFunction()}
            </>
            : RecentSearchUI()
          }
        </div>
        : <DvSearchBar theme={theme} lang={lang} />
      }

      <style jsx>{`
        .headessr{
          position: sticky;
          top: 0;
          background: #fff;
          z-index: 999;
        }
         :global(.MuiAvatar-colorDefault, .hashtags) {
          font-family: cursive;
          background-color: ${theme.appColor};
          color: ${theme.background};
        }

        :global(.MuiTab-textColorPrimary) {
          color: ${theme.type === "light"
          ? "#000"
          : "#fff"
        };
        }

        :global(.MuiTab-textColorPrimary.Mui-selected){
          color: var(--l_base) !important;
        }
      `}</style>
    </Wrapper >
  );
};

export default HashtagSearchDrawer;
