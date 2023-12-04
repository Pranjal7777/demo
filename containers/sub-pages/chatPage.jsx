import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
import { getCookie } from "../../lib/session";
import { open_drawer } from "../../lib/global";
import ChatContext from "../../context/chat";
import Message from "../../containers/message/message";

class Chat extends Component {

  state = {
    auth: getCookie("auth"),
    showSingleChatPage: ""
  };

  handleNavigationMenu = () => {
    open_drawer("SideNavMenu",
      {
        paperClass: "backNavMenu", setActiveState: this.props.setActiveState, noBorderRadius: true
      },
      "right"
    );
  };

  componentDidMount() {
    // reConnectionSubject.next();
  }

  render() {
    return (
      <Wrapper>
        {/* <div className="dv_wrap_home">
            <div className="col-12 pt-5">
              <div className="row justify-content-between">
                  <div className="col-auto">
                    <h6 className="mv_subHeader_title mb-3">Chat</h6>
                  </div>
                  <div className="col-auto">
                    <FigureImage
                        fclassname="mb-0 pointer"
                        src={config.HUMBERGER_ICON}
                        width={20}
                        alt="notification"
                        style={{ marginLeft: "10px" }}
                        onClick={() => {
                          this.state.auth ? this.handleNavigationMenu() : authenticate().then();
                        }}
                      />
                  </div>
              </div> */}

        {/* <div className="row "> */}
        <ChatContext.Provider
          value={{
            ...this.props.profile,
            ...this.props.reduxState,
            query: this.props.router.query,
          }}
        >
          <Message {...this.props} />
        </ChatContext.Provider>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userProfileData: state.profileData,
    profile: state.profileData,
    reduxState: state,
  };
};

export default connect(mapStateToProps)(withRouter(Chat));
