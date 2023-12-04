import React from "react";
import * as env from "../../lib/config";
import { getFollowees, getFollowing } from "../../services/profile";
import { connect } from "react-redux";
import { open_progress, stopLoader } from "../../lib/global";
import Loader from "../loader/loader";
import Router from "next/router";
import { LanguageSet } from "../../translations/LanguageSet";
import dynamic from "next/dynamic";
import CustomDataLoader from "../loader/custom-data-loading";
import Icon from "../image/icon";
import { setCookie } from "../../lib/session";
import { close_dialog } from "../../lib/global/loader";
import { isAgency } from "../../lib/config/creds";

const UserTile = dynamic(() => import("./UserTile"), { ssr: false });
const SearchBar = dynamic(
  () => import("../../containers/timeline/search-bar"),
  { ssr: false }
);
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });

class FollowFollowing extends React.Component {
  state = {
    skip: 0,
    limit: 10,
    scrolling: true,
    pagingLoader: false,
    loading: false,
    totalCount: 10,
    value: "",
    webSearchFollowObj: {
      padding: "0 0 0 50px",
      background: "#8e8e931f",
      border: `1px solid #8e8e931f`,
      borderRadius: "20px",
      height: "44px",
      fontSize: "16px",
      fontFamily: `"Roboto", sans-serif !important`,
      color: "#000",
    },
  };
  ref = React.createRef();

  handlerScroll = () => {
    // console.log("scolly ", this.ref.current.scrollTop);
    // console.log("scrollY ", this.ref.current.clientHeight);
    // console.log("offsetHeight ", this.ref.current.scrollHeight);

    if (
      this.ref.current.scrollTop + this.ref.current.clientHeight + 5 >=
      this.ref.current.scrollHeight &&
      this.state.scrolling &&
      this.state.userData &&
      this.state.userData.length > 0
    ) {
      // console.log("scollsddad ", this.state.userData.length, this.state.total);
      let stateObject = { ...this.state };
      stateObject.skip = this.state.userData ? this.state.userData.length : 0;
      stateObject.scrolling = false;
      stateObject.loading = true;
      this.setState(stateObject, () => {
        this.ref.current.scrollTop = this.ref.current.scrollHeight;
        this.getUserData();
      });
    }
  };
  async componentDidMount() {
    this.ref.current.addEventListener("scroll", this.handlerScroll);
    this.getUserData(this.props.type, true, true);
  }

  handleOtherProfileRedirection(item) {
    if(item.userType === "MODEL"){
      open_progress();
      (!(this.props.profileData._id == (item?.userId || item?.userid || item?._id)) && setCookie("otherProfile", `${item?.username || item?.userName}$$${item?.userId || item?.userid || item?._id}`));
      (this.props.profileData._id == (item?.userId || item?.userid || item?._id) ? (Router.push('/profile')) : Router.push(`${item.username}`));
      close_dialog("followers");
    }
  }

  getUserData = async (type, flag = true, loader = false) => {
    try {
      let data = [];
      if (this.props.type == 2) {
        data = await getFollowees(
          !this.props.other ? null : this.props.id,
          this.state.skip,
          this.state.limit,
          this.state.value,
          isAgency() ? this.props.selectedCreatorId : ""
        );
      } else {
        data = await getFollowing(
          !this.props.other ? null : this.props.id,
          this.state.skip,
          this.state.limit,
          this.state.value,
          isAgency() ? this.props.selectedCreatorId : ""
        );
      }
      if (data.status == 204) {
        data = [];
        this.setState({
          scrolling: false,
          loading: false,
          pagingLoader: true,
        });
        return;
      } else {
        data = data && data.data && data.data.data;
      }
      let userData = this.state.userData ? this.state.userData : [];
      if (type == "search") {
        userData = [];
      }
      loader && stopLoader();
      this.setState({
        userData: [...userData, ...data],
        scrolling: true,
        loading: false,
        pagingLoader: true,
      });
    } catch (e) {
      loader && stopLoader();
      let userData = this.state.userData ? this.state.userData : [];
      this.setState({
        userData: [...userData],
        scrolling: true,
        loading: false,
        pagingLoader: true,
      });
    }
  };

  componentWillUnmount() {
    this.props.callWhenUnmount && this.props.callWhenUnmount();
    this.ref.current.removeEventListener("scroll", this.handlerScroll);
  }

  handleSearch = (e) => {
    this.setState(
      {
        ...this.state,
        value: e.target.value,
        skip: 0,
        userData: null,
        pagingLoader: false,
      },
      () => {
        this.state.value == ""
          ? this.getUserData()
          : this.getUserData("search", false);
      }
    );
  };

  render() {
    let title = "";

    let placeholder = "";
    if (this.props.other) {
      if (this.props.type == 1) {
        title = this.props.dialogTitle || "Following";
        placeholder = "Not Following any Creator";
      } else {
        title = this.props.dialogTitle || "Followers";
        placeholder = "No Followers";
      }
    } else {
      if (this.props.type == 1) {
        title = this.props.dialogTitle || "Following";
        placeholder = "You are not following any Creator";
      } else {
        title = this.props.dialogTitle || "Followers";
        placeholder = "No Followers";
      }
    }
    // console.log("fhefu", this.state.userData);

    const { mobileView, langCode = "en" } = this.props;
    const lang = LanguageSet[langCode];
    return (
      <div className={mobileView ? "mv_wrap_home overflow-hidden" : ""}>
              {mobileView ? (
                ""
              ) : (
                <button
                  type="button"
                  className="close dv_modal_close pt-2"
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
                  <div className="d-flex position-relative align-items-center justify-content-center py-3 mb-3">
                    <figure className="mb-0">
                      <a onClick={this.props.onClose}>
                        {/* <Img
                          src={env.MOBILE_NAV_BACK2}
                          alt="leftarrow"
                          className="pg_hdr_back_icon_mv"
                          width={22}
                        /> */}
                        <Icon
                          icon={`${env.MOBILE_NAV_BACK2}#left_back_arrow`}
                          color={this.props.theme === "light" ? "#000" : "#fff"}
                          width={24}
                          height={22}
                          alt="leftarrow"
                          class="pg_hdr_back_icon_mv"
                        />
                      </a>
                    </figure>
                    <h4 className="font20 w-600 fontFamily medium m-0">
                      {title}
                    </h4>
                  </div>

                  <SearchBar
                    value={this.state.value}
                    handleSearch={this.handleSearch.bind(this)}
                    onlySearch={true}
                  />
                </div>
              ) : (
                <div className="col-11">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="txt-black dv__fnt26 content_heading px-1 py-3 m-0">
                      {title}
                    </h5>
                    <div style={{ width: "12.884vw" }}>
                      <SearchBar
                        value={this.state.value}
                        handleSearch={this.handleSearch.bind(this)}
                        webSearchFollowObj={this.state.webSearchFollowObj}
                        onlySearch={true}
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* <div style={{ height: "132px" }}></div> */}
              <ul
                className={`list-of-user overflow-auto px-2 ${mobileView ? "pb-4 drawerBgCss" : "mb-0 pb-3"
                  }`}
                ref={this.ref}
                style={
                  mobileView
                    ? { height: "90%" }
                    : { height: "400px", borderTop: "1px solid #C4C4C4" }
                }
              >
                {this.state.pagingLoader ? (
                  this.state.userData && this.state.userData.length > 0 ? (
                    <>
                      {[...this.state.userData].map((item, index) => {
                        return (
                          <div
                          key={index}
                          onClick={()=> this.handleOtherProfileRedirection(item)}
                          >
                            <UserTile
                              // updateFollowing={this.props.updateFollowing}
                              updateCount={this.props.id ? false : true}
                              auth={this.props.auth}
                              uUserId={this.props.userId}
                              {...item}
                            />
                          </div>
                        );
                      })}
                      {this.state.loading && (
                        <div className="d-flex justify-content-center align-items-center mb-5">
                          <CustomDataLoader type="normal" isLoading={true} />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="no-users d-flex justify-content-center align-items-center w-700 text-color-gray">
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <Img
                          key="empty-placeholder"
                          className="text"
                          src={env.FOLLOW_FOLLOWING}
                          alt="follow_following_icon"
                        />
                        <div className="my-3 text-center px-2">{placeholder}</div>
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
    theme: store.theme,
    langCode: store.language,
    profileData: store.profileData,
  };
};

const dispatchAction = (dispatch) => {
  return {
    // updateFollowing: (data) => dispatch(updateFollowing(data)),
    updateFollowing: (data) => 0,
  };
};

export default connect(mapStateToProps, dispatchAction)(FollowFollowing);
