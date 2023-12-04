import React, { Component } from "react";
import SalesMessage from "./singleMessage";
import WebChat from "./webChat";
import Context from "../../context/context";
import { connect } from "react-redux";
import Wrapper from "../../hoc/Wrapper";
import DvHeader from "../DvHeader/DvHeader";
import MarkatePlaceHeader from "../markatePlaceHeader/markatePlaceHeader";
import DvHomeLayout from "../DvHomeLayout";

class Message extends Component {
  render() {
    return (
      <div text="message" className="p-0 col" style={{ height: "inherit" }}>
        <Context.Consumer>
          {(ctx) => {
            return (
              <div className="w-100 vh-100">
                <div className="w-100 profile-setting font-weight-bold">
                  {/* Message */}
                </div>
                <div
                  className="h-100 navigation-tab-container"
                >
                  {this.props.redux.isMobile ? (
                    <SalesMessage
                      active={true}
                      {...this.props}
                      isMobile={true}
                      {...ctx}
                    />
                  ) : (
                    <Wrapper>
                        {/* <MarkatePlaceHeader
                        setActiveState={this.props.setActiveState}
                        {...this.props}
                      /> */}
                      <div
                        // className="websiteContainer"
                        // style={{ paddingTop: "5.930vw" }}
                      >
                        <div
                          // className="col-12 p-0 mt-3 pt-2 pt-sm-5 pt-lg-2"
                        // style={{ backgroundColor: "#1e2432" }}
                        >
                            <div
                              className="row m-0 align-items-start justify-content-between"
                            >
                              <DvHomeLayout
                                activeLink="Chat"
                                pageLink="/chat"
                                {...this.props}
                              // ctx={...ctx}
                              />
                          </div>
                        </div>
                      </div>
                    </Wrapper>
                  )}
                </div>
              </div>
            );
          }}
        </Context.Consumer>
        <style jsx>{`
          .message {
            position: fixed;
            left: 7%;
            width: calc(100% - 7%);
          }
        `}</style>
      </div>
    );
  }
}

const maptoState = (state) => {
  return {
    redux: state,
  };
};

const dispatchAction = (dispatch) => {
  return {
    getChats: (dispatchAction) => dispatch(dispatchAction),
    getMessages: (dispatchAction) => dispatch(dispatchAction),
    changeReadStatus: (dispatchAction) => dispatch(dispatchAction),
    deleteChat: (dispatchAction) => dispatch(dispatchAction),
    reduxDispatch: (dispatchAction) => dispatch(dispatchAction),
  };
};

export default connect(maptoState, dispatchAction)(Message);
