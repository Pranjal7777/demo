import React from "react";
import * as env from "../../lib/config";
import { connect } from "react-redux";
import { authenticate, open_progress, stopLoader } from "../../lib/global";
import Loader from "../loader/loader";
import Router from "next/router";
import { getPopularSearch, getSuggetions } from "../../services/explore";
import { getCookie, setCookie } from "../../lib/session";
import { LanguageSet } from "../../translations/LanguageSet";
import dynamic from "next/dynamic";
const UserTile = dynamic(() => import("./UserTile"), { ssr: false });
const SearchBar = dynamic(
  () => import("../../containers/timeline/search-bar"),
  { ssr: false }
);
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });

class PopularUserSearch extends React.Component {
  state = {
    skip: 0,
    limit: 10,
    scrolling: true,
    pagingLoader: false,
    loading: false,
    totalCount: 10,
    value: "",
    userid: getCookie("uid"),
  };
  ref = React.createRef();

  handlerScroll = () => {
    if (
      this.ref.current.scrollTop + this.ref.current.clientHeight + 5 >=
        this.ref.current.scrollHeight &&
      this.state.scrolling
    ) {
      let stateObject = { ...this.state };
      stateObject.skip = this.state.value
        ? this.state.userData
          ? this.state.userData.length
          : 0
        : this.state.popularUser
        ? this.state.popularUser.length
        : 0;
      stateObject.scrolling = false;
      stateObject.loading = true;
      this.setState(stateObject, () => {
        this.state.value ? this.getUserData() : this.getPopularUser();
      });
    }
  };
  async componentDidMount() {
    this.ref.current.addEventListener("scroll", this.handlerScroll);
    this.getPopularUser(this.props.type, true, true);
  }

  getPopularUser = async (type, flag = true, loader = false) => {
    try {
      let data = [];
      // loader && startLoader();

      data = await getPopularSearch(this.state.limit, this.state.skip);
      // data = await getSuggetions("a", this.state.limit, this.state.skip);

      let totalCount = 0;
      if (data.status == 204) {
        data = [];
        totalCount = 0;
        let popularUser = this.state.popularUser ? this.state.popularUser : [];
        this.setState(
          {
            popularUser: [...popularUser],
            scrolling: false,
            loading: false,
            pagingLoader: false,
          },
          () => {}
        );
        return;
      } else {
        totalCount = data.data.data && data.data.data.totalCount;
        data = data.data.data && data.data.data;
      }

      let popularUser = this.state.popularUser ? this.state.popularUser : [];
      if (type == "search") {
        popularUser = [];
      }
      loader && stopLoader();
      this.setState({
        popularUser: [...popularUser, ...data],
        totalCount: totalCount,
        scrolling: true,
        loading: false,
        pagingLoader: loader,
      });
    } catch (e) {
      loader && stopLoader();
      let popularUser = this.state.popularUser ? this.state.popularUser : [];
      this.setState({
        popularUser: [...popularUser],
        scrolling: false,
        loading: false,
        pagingLoader: false,
      });
    }
  };

  getUserData = async (type, flag = true, loader = false) => {
    try {
      let data = [];
      // loader && startLoader();

      data = await getSuggetions(
        this.state.value,
        this.state.limit,
        this.state.skip
      );

      let totalCount = 0;
      if (data.status == 204) {
        data = [];
        totalCount = 0;
        loader && stopLoader();
        let userData = this.state.userData ? this.state.userData : [];
        this.setState({
          userData: [...userData],
          scrolling: false,
          loading: false,
          pagingLoader: false,
        });

        return;
      } else {
        totalCount = data.data.data && data.data.data.totalCount;
        data = data.data.data && data.data.data;
      }

      let userData = this.state.userData ? this.state.userData : [];
      if (type == "search") {
        userData = [];
      }
      loader && stopLoader();
      this.setState({
        userData: [...userData, ...data],
        totalCount: totalCount,
        scrolling: true,
        loading: false,
        pagingLoader: loader,
      });
    } catch (e) {
      console.error("Popular Search Error", e);
    }
  };

  componentWillUnmount() {
    this.props.callWhenUnmount && this.props.callWhenUnmount();
    this.ref.current.removeEventListener("scroll", this.handlerScroll);
  }

  handleSearch = (e) => {
    if (!e.target.value) {
      this.getPopularUser("search", false);
    }
    this.setState(
      { ...this.state, value: e.target.value, skip: 0, userData: null },
      () => {
        this.getUserData("search", false);
      }
    );
  };

  render() {
    let title = "Popular Creators";
    let placeholder = "No Creator Found";

    const { mobileView, langCode = "en" } = this.props;
    const lang = LanguageSet[langCode];
    return (
      <div className={mobileView ? "mv_wrap_home overflow-hidden" : ""}>
              {mobileView ? (
                ""
              ) : (
                <button
                  type="button"
                  className="close dv_modal_close"
                  data-dismiss="modal"
                  onClick={() => this.props.onClose()}
                >
                  {lang.btnX}
                </button>
              )}
              {mobileView ? (
                <div
                  className="mv_header"
                  //style="border-bottom: 1px solid #242A37 !important"
                >
                  <div className=" d-flex position-relative align-items-center justify-content-center py-3 mb-3">
                    <figure className="mb-0">
                      <a onClick={this.props.onClose}>
                        <Img
                          src={env.MOBILE_NAV_BACK2}
                          alt="leftarrow"
                          className="pg_hdr_back_icon_mv"
                          width={22}
                        />
                      </a>
                    </figure>
                    <h4 className="font20 w-600 fontFamily medium m-0">
                      {title}
                    </h4>
                  </div>

                  <SearchBar
                    value={this.state.value}
                    onlySearch
                    handleSearch={this.handleSearch.bind(this)}
                  />
                </div>
              ) : (
                <div className="col-11">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="txt-black dv__fnt26 dv__black_color px-1 py-3 m-0">
                      {title}
                    </h5>
                    <div style={{ width: "12.884vw" }}>
                      <SearchBar
                        value={this.state.value}
                        onlySearch
                        handleSearch={this.handleSearch.bind(this)}
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* <div style={{ height: "132px" }}></div> */}
              <ul
                className={`list-of-user overflow-auto px-2 ${
                  mobileView ? "pb-4 drawerBgCss" : "mb-0 pb-3"
                }`}
                ref={this.ref}
                style={
                  mobileView
                    ? { height: "90%" }
                    : { height: "400px", borderTop: "1px solid #C4C4C4" }
                }
              >
                {this.state.value ? (
                  this.state.userData ? (
                    this.state.userData.length > 0 ? (
                      <>
                        {[...this.state.userData].map((item, index) => {
                          return (
                            <div
                              onClick={() => {
                                open_progress();
                                setCookie("otherProfile", `${item?.username || item?.userName || item?.profilename}}$$${item?.userId || item?.userid || item?._id}`)
                                Router.push(
                                  `${item.username || item.profilename}`
                                  // `/user/${item.userId || item._id}`
                                );
                              }}
                            >
                              <UserTile
                                auth={authenticate}
                                userId={item._id}
                                {...item}
                                isFollow={item.follow == 1 ? true : false}
                                searchBar={true}
                              />
                            </div>
                          );
                        })}
                        {this.state.loading && (
                          <div className="d-flex justify-content-center align-items-center mt-4">
                            <Loader></Loader>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="no-users d-flex justify-content-center align-items-center w-700 text-color-gray">
                        {/* <Follow></Follow> */}
                        <div className="d-flex justify-content-center align-items-center flex-column">
                          <Img
                            key="empty-placeholder"
                            className="text"
                            src={env.FOLLOW_FOLLOWING}
                          />
                          <div className="my-3">{placeholder}</div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="loader-follow   d-flex justify-content-center align-items-center">
                      <div className="mb-5 pb-5">
                        <Loader></Loader>
                      </div>
                    </div>
                  )
                ) : this.state.popularUser ? (
                  this.state.popularUser.length > 0 ? (
                    <>
                      {[...this.state.popularUser].map((item, index) => {
                        return (
                          <div
                            key={item.user_id}
                            onClick={() => {
                              open_progress();
                              setCookie("otherProfile", `${item?.username || item?.userName || item?.profilename}}$$${item?.userId || item?.userid || item?._id}`)
                              Router.push(
                                `${item.username || item.userName}`
                                // `/user/${item.user_id}`
                              );
                            }}
                          >
                            <UserTile
                              auth={authenticate}
                              uUserId={this.state.userid}
                              userId={item._id}
                              isFollow={item.follow == 1 ? true : false}
                              {...item}
                              searchBar={true}
                            />
                          </div>
                        );
                      })}
                      {this.state.loading && (
                        <div className="d-flex justify-content-center align-items-center mt-4">
                          <Loader></Loader>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="no-users d-flex justify-content-center align-items-center w-700 text-color-gray">
                      {/* <Follow></Follow> */}
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <Img
                          key="empty-placeholder"
                          className="text"
                          src={env.FOLLOW_FOLLOWING}
                        ></Img>

                        <div className="my-3">{placeholder}</div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="loader-follow   d-flex justify-content-center align-items-center">
                    <div className="mb-5 pb-5">
                      <Loader></Loader>
                    </div>
                  </div>
                )}
              </ul>

              <style jsx>{`
                .loader-follow {
                  height: 100%;
                  width: 100%;
                }
                .no-users {
                  height: calc(100% - 100px);
                }

                :global(.search-icon) {
                  position: absolute;
                  height: 19px;
                  bottom: 19px;
                  left: 24px;
                }
                .headerIcon {
                  height: 18px;
                  width: 22px;
                }
                .headerButton {
                  position: absolute;
                  left: 0;
                  background: #ffffff;
                  border: navajowhite;
                }
                .font20 {
                  font-size: 1.1rem;
                }
                .productHeading {
                  color: #011f3fd1;
                }
                .headerBoxshadow {
                  box-shadow: 0px 5px 8px 2px #00000008;
                  position: fixed;
                  z-index: 2;
                }
                //   end of header
                .searchIcon {
                  position: absolute;
                  right: 30px;
                  bottom: 30px;
                }
                :global(.followBotton) {
                  position: absolute;
                  right: 15px;
                  font-weight: 400 !important;
                  font-family: "Poppins", sans-serif;
                  border: 1px solid #011f3fd1 !important;
                  margin: 0;
                  font-size: 0.7rem;
                }
                .btnPadding {
                  padding: 2px 29px !important;
                  background-color: #ffff !important;
                  color: #011f3fd1;
                }
                :global(.followingBtn) {
                  padding: 2px 20px !important;
                  background-color: #011f3fd1 !important;
                  color: #ffffff;
                }
                .followIcon {
                  height: 35px;
                  width: 35px;
                }

                .btnClass {
                  background: #ffffff;
                  border: navajowhite;
                }
                :global(.font7) {
                  font-size: 0.85rem;
                }
                :global(.semiBold) {
                  font-weight: 600;
                }
                .commentContainer {
                  background-color: #666f7a;
                  border-radius: 50%;
                  width: 35px;
                  height: 35px;
                }
                :global(.headColor) {
                  color: #484848;
                }
                :global(.font5) {
                  font-size: 0.6rem;
                }
                :global(.regular1) {
                  font-weight: 500;
                }
                .fontFamily {
                  font-family: "Poppins", sans-serif;
                  text-transform: capitalize;
                }
                :global(.MuiDialog-paper) {
                  min-width: 530px !important;
                }
              `}</style>
            </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    langCode: store?.language,
  };
};

const dispatchAction = (dispatch) => {
  return {
    // updateFollowing: (data) => dispatch(updateFollowing(data)),
    updateFollowing: (data) => 0,
  };
};

export default connect(mapStateToProps, dispatchAction)(PopularUserSearch);
