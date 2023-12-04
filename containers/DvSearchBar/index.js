import React from "react";
import { FOLLOW_FOLLOWING, SEACH_WHITE } from "../../lib/config";
import { getCookie, setCookie } from "../../lib/session";
import { getPopularSearch, getSuggetions } from "../../services/explore";
import { authenticate, open_progress, stopLoader } from "../../lib/global";
import PageLoader from "../../components/loader/page-loader";
import UserTile from "../../components/Drawer/UserTile";
import Img from "../../components/ui/Img/Img";
import Loader from "../../components/loader/loader";
import OutsideAlerter from "../OutsideAlerter";
import Router from "next/router";
import Icon from "../../components/image/icon";
import InputBox from "../../components/input-box/input-box";

class Index extends React.Component {
  state = {
    skip: 0,
    limit: 10,
    scrolling: true,
    pagingLoader: false,
    loading: false,
    totalCount: 10,
    value: "",
    userid: getCookie("uid"),
    searchResults: false,
    auth: getCookie("auth"),
  };
  ref = React.createRef();

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

  getPopularUser = async (type, flag = true, loader = false) => {
    if (this.state.auth) {
      try {
        let data = [];

        data = await getPopularSearch(this.state.limit, this.state.skip);

        let totalCount = 0;

        if (data.status == 204) {
          data = [];
          totalCount = 0;
          let popularUser = this.state.popularUser
            ? this.state.popularUser
            : [];

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
          totalCount = data?.data?.data?.length;
          data = data?.data?.data;
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
    }
  };

  getUserData = async (type, flag = true, loader = false) => {
    try {
      let data = [];

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
        totalCount = data?.data?.data?.length;
        data = data?.data?.data;
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

  handleSearch = (e) => {
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

  handleFocus = () => {
    this.resetPagination();
    this.getPopularUser("search", false);
    this.setState({
      searchResults: true,
    });
  };

  handleCloseSearch = () => {
    this.setState({
      searchResults: false,
      value: "",
    });
  };

  async componentDidMount() {
    this.ref?.current?.addEventListener("scroll", this.handlerScroll);
    // this.getPopularUser(this.props.type, true, true);
  }

  componentWillUnmount() {
    this.ref?.current?.removeEventListener("scroll", this.handlerScroll);
  }

  PlaceholderCmp = () => {
    return (
      <div style={{ marginTop: "25%", textAlign: "center" }}>
        <Img
          key="empty-placeholder"
          className="text"
          src={FOLLOW_FOLLOWING}
          alt="Follow Following SVG Icon"
        />
        <p className="my-3 bold">{this.props.lang.noCreator}</p>
      </div>
    )
  }

  render() {
    const { theme } = this.props;
    return (
      <>
        <>
          <InputBox
            type="text"
            name="search"
            value={this.state.value}
            onChange={this.handleSearch.bind(this)}
            onClick={() =>
              this.state.auth ? this.handleFocus() : Router.push("/login")
            }
            autoComplete="off"
            cssStyles={theme.dv_search_input}
            fclassname="form-control"
            placeholder="Search"
          />
          {/* <Image src={SEACH_WHITE} className="dv__search__icon" /> */}
          <Icon
            icon={`${SEACH_WHITE}#search_icon`}
            color={theme.text}
            size={14}
            class="dv__search__icon"
            viewBox="0 0 511.999 511.999"
          />
        </>
        <OutsideAlerter onClose={this.handleCloseSearch}>
          <div
            className={`dv__search__bar ${this.state.searchResults ? "d-block" : "d-none"
              }`}
            ref={this.ref}
          >
            <ul className="list-of-user overflow-auto p-2">
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
                                // `/user/${item?.userId || item._id}`
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
                  ) : (this.PlaceholderCmp())
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
                              `/${item.userName || item.username}`
                              // `/user/${item?.user_id}`
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
                ) : (this.PlaceholderCmp())
              ) : (
                <div className="loader-follow   d-flex justify-content-center align-items-center">
                  <div className="mb-5 pb-5">
                    <Loader />
                  </div>
                </div>
              )}
            </ul>
          </div>
        </OutsideAlerter>
      </>
    );
  }
}

export default Index;
