import React, { Component } from "react";

import { drawerToast, close_drawer } from "../lib/global";

export default function (ComposedComponent) {
  class NetworkDetector extends Component {
    state = {
      isDisconnected: false,
    };

    static getInitialProps(ctx) {
      if (ComposedComponent.getInitialProps) {
        return ComposedComponent.getInitialProps(ctx);
      }
    }

    componentDidMount() {
      // this.handleConnectionChange();
      setTimeout(() => {
        window.addEventListener("online", this.handleConnectionChange);
        window.addEventListener("offline", this.handleConnectionChange);
      }, 2000);
    }

    componentWillUnmount() {
      window.removeEventListener("online", this.handleConnectionChange);
      window.removeEventListener("offline", this.handleConnectionChange);
    }

    handleConnectionChange = () => {
      // console.log("navigator", navigator.onLine);
      const condition = navigator.onLine ? "online" : "offline";

      //checking for valid connection
      if (condition === "online") {
        const webPing = setInterval(() => {
          fetch("//google.com", {
            mode: "no-cors",
          })
            .then(() => {
              close_drawer('drawerToaster');
              return clearInterval(webPing);
            })
            .catch(() => {
              drawerToast({
                title: "Internet issue",
                desc: "You'r connected to very poor internet connection",
                closeIconVisible: false,
                isMobile: true,
                onClose: () => close_drawer('drawerToaster')
              });
            });
        }, 2000);
        return;
      }

      return drawerToast({
        title: "Internet issue",
        desc: "Please check your internet connection.",
        closeIconVisible: false,
        noClass: true,
        isMobile: true,
        onClose: () => close_drawer('drawerToaster')
      });
    };

    render() {
      return (
        <div>
          <ComposedComponent {...this.props} />
        </div>
      );
    }
  }
  return NetworkDetector;
}
