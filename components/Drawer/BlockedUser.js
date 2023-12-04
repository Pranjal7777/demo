import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useLang from "../../hooks/language";
import { startLoader, stopLoader, Toast } from "../../lib/global";
import { getBlockedUsers } from "../../services/profile";
import { No_Blocked_User } from "../../lib/config";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";
const Header = dynamic(() => import("../header/header"), { ssr: false });
const SearchBar = dynamic(
  () => import("../../containers/timeline/search-bar"),
  { ssr: false }
);
const UserTile = dynamic(() => import("./UserTile"), { ssr: false });
const Pagination = dynamic(() => import("../../hoc/divPagination"), {
  ssr: false,
});
const Loader = dynamic(() => import("../loader/loader"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });

export default function BlockedUser(props) {
  const [lang] = useLang();
  const router = useRouter();
  const [blockedList, setBlockedList] = useState([]);
  const [loading, setLoader] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [mobileView] = isMobile();
  const [currentScreen, setCurrentScreen] = useState();
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const [themeStyle, setThemeStyle] = useState({
    padding: "0 0 0 50px",
    background: "#8e8e931f",
    border: `1px solid #8e8e931f`,
    borderRadius: "20px",
    height: "44px",
    fontSize: "16px",
    fontFamily: `"Roboto", sans-serif !important`,
    color: "#000",
  });

  // Function for changing screen
  const updateScreen = (screen) => {
    setCurrentScreen(screen);
  };

  useEffect(() => {
    handleGetBlockedList();
  }, []);

  const handleGetBlockedList = async (
    offset = 0,
    limit = 15,
    loader = false,
    searchKey = "",
    type = ""
  ) => {
    !loader && startLoader();
    return new Promise(async (res, rej) => {
      try {
        if (type == "search") {
          setBlockedList([]);
        }
        let response = await getBlockedUsers({
          offset: offset * limit,
          limit,
          searchText: searchKey,
          uid: isAgency() ? selectedCreatorId : ""
        });
        // console.log("response", response);
        setLoader(false);
        stopLoader();
        let oldList = [];
        if (offset != 0) {
          oldList = [...blockedList];
        }
        if (response.status == 200) {
          setBlockedList([
            ...oldList,
            ...(response?.data?.data?.blockData),
          ]);
        } else if (response.status == 204) {
          setBlockedList([]);
        } else {
          return rej();
        }
        res();
      } catch (e) {
        stopLoader();
        Toast(e?.response?.data?.message, "error");
        setBlockedList([]);
      }
    });
  };

  const getList = (page = 0, loading) => {
    setLoader(loading);
    return new Promise(async (res, rej) => {
      try {
        await handleGetBlockedList(page, 15, true);
        res();
      } catch (e) {
        rej();
      }
    });
  };

  const handleSearch = (e) => {
    setSearchKey(e.target.value);
    handleGetBlockedList(0, 15, false, e.target.value, "search");
  };

  return (
    <Wrapper>
      {currentScreen ? (
        currentScreen
      ) : (
        <Wrapper>
          {mobileView ? (
            ""
          ) : (
            <button
              type="button"
              className="close dv_modal_close pt-1"
              data-dismiss="modal"
              onClick={() => props.onClose()}
            >
              {lang.btnX}
            </button>
          )}
          <Pagination
            id={"blockedList"}
            items={blockedList}
            getItems={getList}
          />
          <div
            className={
              mobileView
                ? "drawerBgCss h-100 d-flex flex-column"
                : "d-flex flex-column"
            }
          >
            <div  className="card_bg">
              {mobileView ? (
                <Header
                  title={lang.blockedUser}
                  back={() => {
                    router.back();
                  }}
                ></Header>
              ) : (
                <div className="col-11">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="txt-black dv__fnt26 content_heading px-1 py-3 m-0">
                      {lang.blockedUser}
                    </h5>
                    <div style={{ width: "12.884vw" }}>
                      <SearchBar
                        value={searchKey}
                            onlySearch
                        handleSearch={handleSearch.bind(this)}
                        webSearchFollowObj={themeStyle}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div
                style={
                  mobileView
                    ? { paddingTop: "70px" }
                    : { borderTop: "1px solid #C4C4C4" }
                }
              >
                {mobileView ? (
                  <SearchBar
                    value={searchKey}
                    onlySearch
                    handleSearch={handleSearch.bind(this)}
                  />
                ) : (
                  ""
                )}
                <ul
                  id="blockedList"
                  className={
                    mobileView
                      ? "list-of-user overflow-auto bg-dark-custom px-2"
                      : "list-of-user overflow-auto p-2"
                  }
                  style={{ height: "90%" }}
                >
                  {blockedList ? (
                    blockedList.length > 0 ? (
                      <>
                        {[...blockedList].map((item) => {
                          return (
                            <div key={item._id}>
                              <UserTile
                                blockUsr={true}
                                // // updateFollowing={this.props.updateFollowing}
                                // updateCount={this.props.id ? false : true}
                                // auth={this.props.auth}
                                // uUserId={this.props.userId}
                                {...item}
                                updateScreen={updateScreen}
                                handleGetBlockedList={handleGetBlockedList}
                              />
                            </div>
                          );
                        })}
                        {loading && (
                          <div className="d-flex justify-content-center align-items-center mt-4">
                            <Loader></Loader>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="no-users pt-4 d-flex justify-content-center align-items-center w-700 text-color-gray">
                        <div className="text-center">
                          <Img
                            key="empty-placeholder"
                            className="text"
                            src={No_Blocked_User}
                          />
                          <div className="my-3">{lang.noBlockUser}</div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="loader-follow   d-flex justify-content-center align-items-center">
                      <div className="mb-5 pb-5">
                        <Loader />
                      </div>
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </Wrapper>
      )}
      <style jsx>
        {`
          :global(.MuiDialog-paper) {
            min-width: 530px !important;
          }
          :global(.dangerBgBtn:hover) {
            border-radius:6px;
            background: rgb(115, 33, 244);
          }
        `}
      </style>
    </Wrapper>
  );
}
