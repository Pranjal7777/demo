import dynamic from "next/dynamic";
import Router from "next/router";
import React from "react";
import { connect } from "react-redux";
import * as env from "../../lib/config";
import { authenticate, open_progress, stopLoader } from "../../lib/global";
import { getCookie, setCookie } from "../../lib/session";
import { getPopularSearch, getSuggetions } from "../../services/explore";
import Icon from "../image/icon";
// import Loader from "../loader/page-loader";
//import { updateFollowing } from "../../../store/reducer/userData/action";
const FigureImage = dynamic(
  () => import("../../components/image/figure-image"),
  { ssr: false }
);
const Image = dynamic(() => import("../image/image"), { ssr: false });
const Loader = dynamic(() => import("../loader/loader"), { ssr: false });
const PageLoader = dynamic(() => import("../loader/loader"), {
  ssr: false,
});
const UserTile = dynamic(() => import("./UserTile"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
const InputBox = dynamic(() => import("../input-box/input-box"), {
  ssr: false,
});

class ExloreSearch extends React.Component {
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
  inputRef = React.createRef();

  resetPagination = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        skip: 0,
        limit: 10,
        scrolling: true,
        pagingLoader: false,
        loading: false,
        userData: null,
        totalCount: 10,
      };
    });
  };

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
    // this.inputRef.current.focus();
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
          () => {
            // console.log("sadasdjkasd", this.state);
          }
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
      console.error("ERROR IN getUserData > ", e);
    }
  };

  componentWillUnmount() {
    this.ref.current.removeEventListener("scroll", this.handlerScroll);
  }

  handleSearch = (e) => {
    if (!e.target.value) {
      this.resetPagination();
      this.getPopularUser("search", false);
    }
    this.setState(
      {
        ...this.state,
        value: e.target.value,
        skip: 0,
        userData: null,
      },
      () => {
        this.state.value && this.getUserData("search", false);
      }
    );
  };
  // handlerScroll = (...arges) => {
  //   console.log("following user", arges);
  // };
  render() {
    let title = "";

    let placeholder = "";
    const { theme } = this.props;
    // console.log("fwid", theme);
    return (
      <div className="mv_wrap_home overflow-hidden">
        <div className="mv_header">
          <div className="py-4">
            <form className="col-12" onSubmit={(e)=> e.preventDefault()}>
              <div className="form-group">
                <div className="row align-items-center">
                  <div className="col-auto pr-0">
                    <Icon
                      icon={`${env.P_CLOSE_ICONS}#cross_btn`}
                      color={theme.type === "light" ? "#000" : "#fff"}
                      width={24}
                      height={25}
                      onClick={() => {
                        this.props.onClose();
                      }}
                    />
                  </div>

                  <div className="col">
                    <div className="position-relative ">
                      {this.state.value && (
                        <div className="clear-button">
                          {/* <Image
                            src={env.P_CLOSE_ICONS}
                            width={15}
                            onClick={() => {
                              this.handleSearch({
                                target: {
                                  value: "",
                                },
                              });
                            }}
                          ></Image> */}
                          <Icon
                            icon={`${env.P_CLOSE_ICONS}#cross_btn`}
                            color={theme.type === "light" ? "#000" : "#fff"}
                            width={15}
                            onClick={() => {
                              this.handleSearch({
                                target: {
                                  value: "",
                                },
                              });
                            }}
                            // height={25}
                          />
                        </div>
                      )}
                      <InputBox
                        value={this.state.value}
                        onChange={this.handleSearch.bind(this)}
                        fclassname="form-control"
                        cssStyles={theme.search_input}
                        placeholder="Search"
                        autoComplete="off"
                        inputRef={this.inputRef}
                        autoFocus
                      />

                      <Icon
                        icon={`${env.SEACH_WHITE}#search_icon`}
                        color={theme.type === "light" ? "#000" : "#fff"}
                        width={18}
                        alt="search_inactive_icon"
                        style={theme.searchIcon}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* <div style={{ height: "132px" }}></div> */}
        <ul
          className="list-of-user overflow-auto bg-dark-custom px-2"
          ref={this.ref}
          style={{ height: "90%" }}
        >
          {this.state.value ? (
            this.state.userData ? (
              this.state.userData.length > 0 ? (
                <>
                  {[...this.state.userData].map((item) => {
                    return (
                      <div
                        key={item._id}
                        onClick={() => {
                          setCookie("otherProfile", `${item?.username || item?.userName}$$${item?.userId || item?.userid || item?._id}`)
                          open_progress();
                          Router.push(
                            `/${item.username || item.userName}`
                            // `/user/${item.userId || item._id}`
                          );
                        }}
                      >
                        <UserTile
                          auth={authenticate}
                          uUserId={this.state.userid}
                          userId={item._id}
                          isFollow={item.follow == 1 ? true : false}
                          searchBar={true}
                          {...item}
                        />
                      </div>
                    );
                  })}
                  {this.state.loading && (
                    <div className="d-flex  justify-content-center align-items-center mt-4">
                      <PageLoader start={true} />
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
                      alt="Follow Following SVG Icon"
                    />
                    <p className="my-3">No Creater Found</p>
                  </div>
                </div>
              )
            ) : (
              <div className="loader-follow d-flex justify-content-center align-items-center">
                <div className="mb-5 pb-5">
                  <Loader />
                </div>
              </div>
            )
          ) : this.state.popularUser ? (
            this.state.popularUser.length > 0 ? (
              <>
                {[...this.state.popularUser].map((item) => {
                  return (
                    <div
                      key={item._id}
                      onClick={() => {
                        setCookie("otherProfile", `${item?.username || item?.userName}$$${item?.userId || item?.userid || item?.user_id}`)
                        open_progress();
                        Router.push(
                          `/${item.username || item.userName }`
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
                    <PageLoader start={true} />
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
                    alt="Follow Following SVG Icon"
                  />
                  <p className="my-3">No Creater Found</p>
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
        `}</style>
      </div>
    );
  }
}

const dispatchAction = (dispatch) => {
  return {
    // updateFollowing: (data) => dispatch(updateFollowing(data)),
    updateFollowing: (data) => 0,
  };
};

export default connect(null, dispatchAction)(ExloreSearch);
