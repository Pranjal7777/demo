import React, { useState, useEffect, useCallback, useRef } from "react";
import Header from "../../header/header";
import useLang from "../../../hooks/language";
import isMobile from "../../../hooks/isMobile";
import dynamic from "next/dynamic";
import debounce from "lodash/debounce";
import { getUserSuggestionShoutout } from "../../../services/shoutout";
import FigureCloudinayImage from "../../cloudinayImage/cloudinaryImage";
import { open_drawer, startLoader, stopLoader } from "../../../lib/global";
import { getProfile } from "../../../services/auth";
import { getCookie } from "../../../lib/session";
import { getFollowCount } from "../../../services/profile";
import PaginationIndicator from "../../pagination/paginationIndicator";
import { isAgency } from "../../../lib/config/creds";
import { handleContextMenu } from "../../../lib/helper";

const SearchBar = dynamic(
  () => import("../../../containers/timeline/search-bar"),
  {
    ssr: false,
  }
);

const ShoutoutContact = (props) => {
  const searchBox = useRef(null);
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [searchKey, setSearchKey] = useState("");
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userSuggestion, setUserSuggestion] = useState([]);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [isUserAPIDone, setIsUserAPIDone] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalPostCount, setTotalPostCount] = useState(0);

  useEffect(() => {
    handelOtherUser(0, searchKey);
    searchKey.length == 0 && setUserSuggestion({});
  }, [searchKey]);

  useEffect(() => {
    isUserAPIDone && gotoPage();
  }, [selectedUserProfile]);

  const gotoPage = () => {
    open_drawer(
      "ShoutoutForm",
      {
        profile: props.profile,
        thirdUserProfile: selectedUserProfile,
        isThirdUser: true,
      },
      "right"
    );
  };

  const handelOtherUser = (page = 0, userName) => {
    const list = {
      limit,
      offset: page * 10,
      searchText: userName || "",
    };
    getUserSugge(list);
  };

  const getUserSugge = useCallback(
    debounce((list) => {
      startLoader();
      getUserSuggestionShoutout(list)
        .then((res) => {
          setUserSuggestion([...userSuggestion, ...res?.data?.data]);
          setTotalPostCount(res?.data?.length);
          setIsLoading(false);
          setPageCount(page);
          stopLoader();
        })
        .catch((e) => {
          setIsLoading(false);
          setPageCount(page);
          setUserSuggestion({});
          stopLoader();
        });
    }, 600),
    [] // will be created only once initially
  );

  const gotoShoutoutForm = (users) => {
    getSelectedUserProfile(users._id);
  };

  const getSelectedUserProfile = async (uId) => {
    const token = getCookie("token");
    try {
      startLoader();
      const userProfile = await getProfile(uId, token, getCookie('selectedCreatorId'));
      let followCount = await getFollowCount(uId, token, isAgency());
      setIsUserAPIDone(true);
      setSelectedUserProfile({
        ...userProfile.data.data,
        ...followCount.data.data,
      });
      stopLoader();
    } catch (error) {
      stopLoader();
    }
  };

  return (
    <>
      {mobileView ? (
        <>
          <div
            style={{ height: "100vh", overflowY: "auto" }}
            ref={searchBox}
            id="home-page"
          >
            <Header back={props.onClose} title={lang.contacts} />
            <div style={{ paddingTop: "80px" }} className="container">
              <div className="col-12 px-0">
                <SearchBar
                  value={searchKey}
                  className="px-0"
                  onlySearch
                  handleSearch={(e) => setSearchKey(e.target.value)}
                />
              </div>
            </div>
            {userSuggestion?.length &&
              userSuggestion.map((users, index) => (
                <div
                  className="col-12 d-flex align-items-center py-1 callout-none" onContextMenu={handleContextMenu}
                  style={{ borderBottom: "2px solid #707070" }}
                  key={index}
                  onClick={() => gotoShoutoutForm(users)}
                >
                  <FigureCloudinayImage
                    publicId={users?.profilePic}
                    width={65}
                    ratio={1}
                    className="userContactCard mb-1 col-auto px-0"
                  />
                  <div className="col">
                    <div className="fntSz18 text-white" style={{ fontWeight: "500" }}>
                      {`${users?.firstName} ${users?.lastName}`}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {userSuggestion && userSuggestion.length ? (
            <PaginationIndicator
              id="home-page"
              elementRef={searchBox}
              totalData={userSuggestion}
              totalCount={userSuggestion.length || 500}
              pageEventHandler={() => {
                if (!isLoading && totalPostCount) {
                  handelOtherUser(pageCount + 1);
                }
              }}
            />
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default ShoutoutContact;
