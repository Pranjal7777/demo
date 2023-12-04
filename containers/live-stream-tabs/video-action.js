import React, { useState } from "react";
import Img from "../../components/ui/Img/Img";
import Icon from "../../components/image/icon";
import * as config from "../../lib/config";
import Heart from "./LikeComponent/Heart";
import { authenticateUserForPayment } from "../../lib/global";
import useLang from "../../hooks/language";

const VideoAction = (props) => {
  const { handleLike, heartCount = 1, mobileView, handleTipSend, toggleMute, isMuted, openBroadcastSettings } = props;
  const [hearts, setHearts] = useState([]);
  const [lang] = useLang()

  const animateLike = () => {
    for (let i = 0; i < heartCount; i++) {
      setTimeout(() => {
        setHearts((hearts) => [...hearts, {
          id: Date.now(),
          color: 'red'
        }]);
      }, i * 200);
    }
  };

  const removeHeart = () => {
    const activeHearts = [...hearts];
    activeHearts.shift();

    setHearts(activeHearts);
  };

  // const [isOpenProduct, setIsOpenProduct] = useState(false);
  // const arr = [0, 0, 0, 0, 0];

  // const openLiveStream = () => {
  //   open_drawer(
  //     "handleUserAdd",
  //     {
  //       close: () => close_drawer("handleUserAdd"),
  //     },
  //     "bottom"
  //   );
  // };

  // const emojiHandler = () => {
  //   open_drawer(
  //     "emojis",
  //     {
  //       close: () => close_drawer("emojis"),
  //     },
  //     "bottom"
  //   );
  // };

  // const handleProductTag = () => {
  //   open_drawer(
  //     "handleProductTg",
  //     {
  //       close: () => close_drawer("handleProductTg"),
  //     },
  //     "bottom"
  //   );
  // };

  // const handleProduct = () => {
  //   setIsOpenProduct(!isOpenProduct);
  // };

  return (
    <div className="mb-3">
      <div className="col-12" style={{ position: 'absolute', right: mobileView ? '10px' : '15px', bottom: mobileView ? '4px' : '0', width: 'auto' }}>
        <div className="row h-100">
          {/* <div className="col comment__sec">
            <p><span>Hello : lorem ipsum...!</span></p>
            <p><span>Hello : ipsum</span></p>
            <p><span>Hello : lorem ipsum sitamet</span></p>
            <p><span>Hello : Hey?</span></p>
            <p><span>Hello : lorem ipsum...!</span></p>
            <p><span>Hello : ipsum</span></p>
            <p><span>Hello : lorem ipsum sitamet</span></p>
            <p><span>Hello : Hey?</span></p>
            <p><span>Hello : lorem ipsum...!</span></p>
            <p><span>Hello : ipsum</span></p>
            <p><span>Hello : lorem ipsum sitamet</span></p>
            <p><span>Hello : Hey?</span></p>
            <p><span>Hello : lorem ipsum...!</span></p>
            <p><span>Hello : ipsum</span></p>
            <p><span>Hello : lorem ipsum sitamet</span></p>
            <p><span>Hello : Hey?</span></p>
            <p><span>Hello : lorem ipsum...!</span></p>
            <p><span>Hello : ipsum</span></p>
            <p><span>Hello : lorem ipsum sitamet</span></p>
            <p><span>Hello : Hey?</span></p>
          </div> */}
          {/* <div>
          <Img
            className="cursorPtr"
            src={config.IMOGI}
            onClick={handleProductTag}
          ></Img>
        </div> */}
          <div className="col-auto justify-content-end d-flex flex-column px-0 ml-auto">
            <div className="mt-3 position-relative">
              <div className="settings_ico d-flex align-items-center justify-content-center" onClick={openBroadcastSettings}>
                <Icon
                  icon={`${config.SETTINGS_SVG}#subscription_settings`}
                  color="#ffffff"
                  height={22}
                  width={22}
                  class="cursorPtr d-flex align-items-center justify-content-center"
                  viewBox="0 0 17.235 17.23"
                />
              </div>
            </div>
            <div className="mt-3" onClick={() => {
              authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => { handleTipSend() })
            }}>
              <Img
                className="cursorPtr"
                src={config.PAYMENT_IMG}
              ></Img>
            </div>
            {/* {mobileView && <div className="mt-3">
              <Img className="cursor-pointer" src={config.SHARE_IMG}></Img>
            </div>} */}
            <div className="mt-3" onClick={toggleMute}>
              {/* <Img width={45} height={45} className="cursor-pointer" src={config.GO_LIVE_SCREEN.muteIcon}></Img> */}
              <Icon
                class="cursor-pointer"
                icon={`${config.GO_LIVE_SCREEN.muteIcon}#mute_icon_svg`}
                viewBox="0 0 50 50"
                color={isMuted ? "var(--l_base_o60)" : "#00000080"}
                width={45}
                height={45}
              />
            </div>
            <div className="mt-3 position-relative" onClick={animateLike}>
              <Img className="cursorPtr" src={config.LIKE_INACTIVE_IMG} onClick={handleLike}></Img>
              {hearts.map(({ id, color }) => (
                <Heart key={id} color={color} removeHeart={removeHeart} />
              ))}
              {/* <p className="txt__title">{currentAnalytics?.uniqueHeartsCount}</p> */}
            </div>
            {/* <div className="mb-3" onClick={() => emojiHandler()}>
              <Img className="cursorPtr" src={config.GIFT_IMG}></Img>
            </div> */}
            {/* <div className="mb-3" onClick={() => handleProduct()}>
              <Img className="cursorPtr" src={config.PAID_IMG}></Img>
              <p className="txt__title">Tagged</p>
            </div> */}

            {/* {arr.map((item, index) => (
            <div onClick={() => handleProduct()}>
              <Img className="cursorPtr" src={config.IMOGI}></Img>
            </div>
          ))} */}
          </div>
        </div>
      </div>
      {/* {isOpenProduct && (
        <div className="col-12 px-0 d-flex productDiv">
          {arr.map((ite, index) => (
            <div className="col-8 align-items-center bg-white mr-2 p-2 mainDiv">
              <div className="d-flex insideCard bg-white">
                <div className="col-auto px-0">
                  <img
                    src="/images/livestrem-static/sofia2.jpg"
                    className="productCartCss"
                  />
                </div>
                <div className="col pr-0 pl-2 text-truncate">
                  <p className="m-0 cardInfoCss productInfo text-truncate">
                    Vehicula lobortis Vehicula
                  </p>
                  <p className="m-0 cardInfoPrice font-weight-900 fntSz10">
                    $535.52{" "}
                    <span className="originalPrice font-weight-400">
                      $535.52
                    </span>
                  </p>
                  <div className="buyBtn" onClick={openLiveStream}>
                    Buy Now
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )} */}

      <style jsx>{`
        .productDiv {
          overflow-x: auto;
        }
        .productDiv::-webkit-scrollbar {
          display: none !important;
        }
        .productCartCss {
          width: 61px;
          height: 61px;
          border-radius: 5px;
          border: 1px solid #fff;
          object-fit: cover;
        }

        .mainDiv {
          border-radius: 7px;
        }

        .productInfo {
          font-size: 11px;
          font-weight: bold;
        }

        .buyBtn {
          font-size: 10px;
          background: var(--l_base);
          color: #fff;
          padding: 5px;
          text-align: center;
          border-radius: 5px;
          margin-top: 4px;
          font-weight: bold;
          width: 75px;
        }

        .originalPrice {
          color: #8a8a8a;
          text-decoration: line-through;
        }

        .txt__title{
          text-shadow: 0px 0px 8px #000000C9;
          font-size: 13px;
          font-family: 'Roboto',sans-serif !important;
          text-align: center;
          margin: 0;
          color: #ffffff;
        }

        .settings_ico {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background-color: #0009;
        }
      `}</style>
    </div>
  );
};

export default VideoAction;
