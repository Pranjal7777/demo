import React, { Component } from "react";
import ReactDOM from "react-dom";

import { downloadFile } from "../../../lib/chat";
import { APP_NAME } from "../../../lib/config";
import Img from "../../ui/Img/Img";


const baseUrl = "test.com";
export default class ChatLightBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMOunt: false,
      open: false,
    };
  }

  componentDidMount() {
    if (this.props.type == "video") {
      document.getElementById("lightbox-video").play();
    }
    this.props.refs && this.props.refs(this.open_dialog);
    this.setState({
      isMOunt: true,
    });
  }

  closeButton = () => {
    return (
      <div className="light-box-buttons" onClick={this.props.close_dialog}>
        <svg
          className="light-box-buttons"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
        >
          <path
            className="light-box-buttons"
            d="M27.92 25l8.84-8.84 1.82-1.82c.27-.27.27-.71 0-.97l-1.95-1.95a.682.682 0 0 0-.97 0L25 22.08 14.34 11.42a.682.682 0 0 0-.97 0l-1.95 1.95c-.27.27-.27.71 0 .97L22.08 25 11.42 35.66c-.27.27-.27.71 0 .97l1.95 1.95c.27.27.71.27.97 0L25 27.92l8.84 8.84 1.82 1.82c.27.27.71.27.97 0l1.95-1.95c.27-.27.27-.71 0-.97L27.92 25z"
          />
        </svg>
      </div>
    );
  };
  // Handle Image Download
  toDataURL = (url) => {
    // console.log("download image file", url);
    fetch(url)
      .then((resp) => resp.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        // console.log('a------>', a)
        a.style.display = "none";
        a.href = url;
        // the filename you want
        a.download = APP_NAME + "_.png";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert("your file has downloaded!"); // or you know, something with better UX...
      })
      .catch((e) => {
        console.error("error", e);
      });
  };

  // open-dialog

  open_dialog = (url, type) => {
    this.setState((prevState) => {
      return { ...prevState, open: true, url, type };
    });
  };

  // close-dialog

  close_dialog = () => {
    this.setState((prevState) => {
      return { ...prevState, open: false, url: "", type: "" };
    });
  };

  handleImageDownload = async () => {
    // console.log("download image file ===>", this.props);
    let extension = this.props.type === "video" ? "mp4" : "png";
    downloadFile(this.props.url, extension);
  };

  downLoadButton = () => {
    return (
      <div className="light-box-buttons" onClick={this.handleImageDownload}>
        <svg
          className="light-box-buttons"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
        >
          <path
            className="light-box-buttons"
            d="M35.7 34.1c0 .6-.5 1-1.1 1-.6 0-1.1-.5-1.1-1s.5-1 1.1-1c.6 0 1.1.5 1.1 1zm-4.6-1c-.6 0-1.1.5-1.1 1s.5 1 1.1 1c.6 0 1.1-.5 1.1-1s-.5-1-1.1-1zm7.8-2.5V36c0 1.3-1.1 2.3-2.4 2.3h-23c-1.3 0-2.4-1-2.4-2.3v-5.4c0-1.3 1.1-2.3 2.4-2.3h5.4l-3.1-2.9c-1.4-1.3-.4-3.5 1.5-3.5h2.9v-8.1c0-1.1 1-2.1 2.2-2.1h5.2c1.2 0 2.2.9 2.2 2.1v8.1h2.9c1.9 0 2.9 2.2 1.5 3.5l-3.1 2.9h5.4c1.3 0 2.4 1 2.4 2.3zm-14.2.9c.2.2.4.2.6 0l7.6-7.3c.3-.3.1-.7-.3-.7H28v-9.7c0-.2-.2-.4-.4-.4h-5.2c-.2 0-.4.2-.4.4v9.7h-4.6c-.4 0-.6.4-.3.7l7.6 7.3zm12.5-.9c0-.3-.3-.6-.7-.6h-7.1l-2.8 2.7c-.8.8-2.2.8-3.1 0L20.6 30h-7.1c-.4 0-.7.3-.7.6V36c0 .3.3.6.7.6h23c.4 0 .7-.3.7-.6v-5.4z"
          />
        </svg>
      </div>
    );
  };

  render() {
    const settings = {
      dots: true,
      dotsClass: "slick-dots slick-thumb",
      infinite: false,
      speed: 10,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    let LightBox = (
      <div className="chat-light-box">
        <div className="row m-0">
          <div className="col-12 p-0">
            <div className="light-buttons  py-2 px-1">
              <div className="row m-0 justify-content-end">
                {this.props.userType == 2 ? <div>{this.downLoadButton()}</div> : ""}
                <div>{this.closeButton()}</div>{" "}
              </div>
            </div>
            <div className="lightbox-immages">
              <div className="light-box-context"></div>
              {this.props.type == "image" && (
                <Img className="light-box-asset" src={this.props.url || ""} />
              )}
              {this.props.type == "video" && (
                <video
                  id="lightbox-video"
                  className="light-box-video"
                  autoPlay={"autoplay"}
                  controls="controls"
                  controlsList="nodownload"
                >
                  <source src={this.props.url || ""}></source>
                </video>
              )}
            </div>
          </div>
        </div>
        <style jsx>{`
          :global(.light-box-buttons) {
            height: 35px;
            width: 35px;
            background-color: rgba(30, 30, 36, 0.9);
            box-shadow: none;
            cursor: pointer;
            display: inline-block;
            visibility: inherit;
            z-index: 9992;
            opacity: 1;
            position: relative;
            border-width: 0px;
            border-style: initial;
            border-color: initial;
            border-image: initial;
            border-radius: 0px;
            margin: 0px 5px 0px 0px;
            transition: opacity 0.3s ease 0s;
            fill: rgba(255, 255, 255, 0.8);
          }
          :global(.light-box-asset) {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          .chat-light-box {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            bottom: 0;
            z-index: 9999;
            left: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.8);
          }

          :global(.lightbox-immages img) {
            max-width: 80%;
            max-height: 80vh;
          }
          .light-box-video {
            width: 100%;
            height: 90%;
          }
          .light-box-video:focus {
            border: none;
            outline: none;
          }
          :global(.lightbox-immages) {
            display: flex;
            justify-content: center;

            width: 100vw;
            height: 96vh;
            // height: calc(100vh - 180px);
          }
          :global(.lighbox-assets) {
            max-height: 100%;
            max-width: 100%;
          }

          .light-box-container {
            height: 100vh;
            width: 100vw;
          }
        `}</style>
      </div>
    );
    return this.state.isMOunt && this.props.open
      ? ReactDOM.createPortal(LightBox, document.body)
      : "";
  }
}
