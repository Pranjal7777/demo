import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "react-jss";
import dynamic from "next/dynamic";

import {
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  TelegramIcon,
  TelegramShareButton,
  TumblrIcon,
  TumblrShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { APP_NAME, FACEBOOK_ID, WEB_LINK } from "../../lib/config";
import { close_drawer } from "../../lib/global";
import {
  getBitlyUrl,
  getShortUrl,
  sharePostOrProfile,
} from "../../services/assets";
import { collection_icon_white } from "../../lib/config";
import { getCookie } from "../../lib/session";

const Wrapper = dynamic(() => import("../../hoc/Wrapper"), { ssr: false });
const CopyToClipboard = dynamic(() => import("react-copy-to-clipboard"), { ssr: false });
const Image = dynamic(() => import("../image/image"), { ssr: false });
const Tooltip = dynamic(() => import("@material-ui/core/Tooltip"), { ssr: false });

const ShareItems = (props) => {
  // console.log("props", props);
  const theme = useTheme();
  const { postId = "", shareType, sharedUserId = "", username = "", streamId, scheduledStream = false } = props;
  const profile = useSelector((state) => state.profileData);
  const [sharedUrl, setSharedUrl] = useState("");
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [tooltipShow, setToolTipShow] = useState(false);
  const userType = getCookie("userType");

  const quote = shareType == "referFren"
    ? `${lang.referFrnd}`
    : `${lang.referFrnd2} ${shareType == "post" || shareType == 'stream' ? shareType : "creator"
    } on ${APP_NAME} ${shareType == 'stream' ? 'by ' : ''}@${username || profile.username} `;

  // const inviteText = shareType == "referFren" ? `${lang.inviteText}` : "";

  const title = shareType == "referFren"
    ? `${lang.referFrnd}`
    : `${lang.referFrnd2} ${shareType == "post" || shareType == 'stream' ? shareType : "creator"
    } on ${APP_NAME} ${shareType == 'stream' ? 'by ' : ''}@${username || profile.username} `;

  useEffect(() => {
    if (shareType == "post") {
      /**
       * @author Bhoomika A
       * @date 21-04-2021
       * @description Changed url according to site-map urls
       */
      getBitlyUrl(
        // `${WEB_LINK}/shared-post?postId=${postId}&referId=${profile.referralCode}`
        `${WEB_LINK}/post/${postId}/${profile.referralCode ? profile.referralCode : ""
        }`
      )
        .then((url) => {
          setSharedUrl(url);
        })
        .catch((err) => console.error(err));
    } else if (shareType == "referFren") {
      // This will uncomment if site is live on Fanzly.app
      // getBitlyUrl(
      //   `${mobileView
      //     ? `${WEB_LINK}/registration?type=${userType == 2 ? "model" : "user"}&referId=${profile.referralCode}`
      //     : `${WEB_LINK}/registration?referId=${profile.referralCode}`
      //   }`
      // )
      //   .then((url) => {
      //     // console.log("url", url);
      //     setSharedUrl(url);
      //   })
      //   .catch((err) => console.error(err));

      // For staging.fanzly.app
      getBitlyUrl(
        `${mobileView
          ? `${WEB_LINK}/registration?type=${userType == 2 ? "model" : "user"}&referId=${profile.referralCode}`
          : `${WEB_LINK}/registration?referId=${profile.referralCode}`
        }`
      )
        .then((url) => {
          setSharedUrl(url);
        })
        .catch((err) => console.error(err));
    } else if (shareType == 'stream') {
      getBitlyUrl(`${WEB_LINK}/live/detail/${streamId}${scheduledStream ? '?q=true' : ''}`)
        .then((url) => {
          setSharedUrl(url);
        })
        .catch((err) => console.error(err));
    } else {
      /**
       * @author Bhoomika A
       * @date 21-04-2021
       * @description Changed url according to site-map urls
       */
      getBitlyUrl(
        // `${WEB_LINK}/shared-profile?userId=${sharedUserId}&referId=${profile.referralCode}`
        // `${WEB_LINK}/profile/${username}/${sharedUserId}/${profile.referralCode}`
        `${WEB_LINK}/${username}`
      )
        .then((url) => {
          setSharedUrl(url);
        })
        .catch((err) => console.error(err));
    }
  }, [props]);

  const handleSharePost = (type) => {
    if (shareType == 'stream') return;
    const payload = {
      refferId: profile.referralCode || "",
      queryString: sharedUrl,
      sharedUserId: sharedUserId || "",
      userId: profile._id || "",
      source: type || "",
      sharedPostId: postId || "",
    };

    sharePostOrProfile(payload)
      .then((res) => {
        close_drawer();
      })
      .catch((err) => {
        console.error("err", err);
        close_drawer();
      });
  };

  return (
    <Wrapper>
      <div className={mobileView ? "btmModal" : ""}>
        <div className={mobileView ? "modal-dialog" : ""}>
          {mobileView ? (
            ""
          ) : (
            <button
              type="button"
              className="close dv_modal_close"
              onClick={() => props.onClose()}
            >
              {lang.btnX}
            </button>
          )}
          <div
            className={
              mobileView
                ? "modal-content-mobile pt-4 pb-4"
                : "modal-content pt-4 pb-4"
            }
          >
            <div
              className={mobileView ? "col-12 w-330 mx-auto" : "col-11 mx-auto"}
            >
              <h5
                className={`${theme.type == "light" ? "txt-black" : "txt-white"
                  } dv__fnt24 ${mobileView
                    ? theme.type == "light"
                      ? "dv__black_color"
                      : "dv__white_color"
                    : theme.palette.l_app_text
                  }  px-1 py-3 m-0`}
              >
                {lang.shareTo}
              </h5>
              <div className="d-flex justify-content-between">
                <CopyToClipboard
                  text={quote ? `${quote} ${sharedUrl}` : sharedUrl}
                  onCopy={() => {
                    setToolTipShow(true);
                    setTimeout(() => setToolTipShow(false), 1000);
                  }}
                >
                  <Tooltip open={tooltipShow} title="Copied" placement="top">
                    <div>
                      <div className="clipboard-copy">
                        <Image
                          src={collection_icon_white}
                          width={mobileView ? 20 : 25}
                          height={mobileView ? 20 : 25}
                        />
                      </div>
                      <p className="text-muted fntSz10 text-center">
                        {lang.copyURL}
                      </p>
                    </div>
                  </Tooltip>
                </CopyToClipboard>

                {/* <TelegramShareButton
                  url={sharedUrl}
                  onShareWindowClose={(e) => handleSharePost(lang.telegram)}
                  quote={quote}
                  title={title}
                >
                  <TelegramIcon size={mobileView ? 40 : 50} round={true} />
                  <p
                    className={
                      mobileView ? "text-muted fntSz10" : "txt-roman dv__fnt12"
                    }
                  >
                    {lang.telegram}
                  </p>
                </TelegramShareButton> */}

                <FacebookShareButton
                  url={sharedUrl}
                  onShareWindowClose={(e) => handleSharePost(lang.facebook)}
                  // className="px-2"
                  quote={quote}
                  title={title}
                  hashtag="#fanzly"
                >
                  <FacebookIcon size={mobileView ? 40 : 50} round={true} />
                  <p
                    className={
                      mobileView ? "text-muted fntSz10" : "txt-roman dv__fnt12"
                    }
                  >
                    {lang.facebook}
                  </p>
                </FacebookShareButton>

                <TwitterShareButton
                  url={sharedUrl}
                  onShareWindowClose={(e) => handleSharePost(lang.twitter)}
                  // className="px-2"
                  quote={quote}
                  title={title}
                  hashtags={["fanzly"]}
                >
                  <TwitterIcon size={mobileView ? 40 : 50} round={true} />
                  <p
                    className={
                      mobileView ? "text-muted fntSz10" : "txt-roman dv__fnt12"
                    }
                  >
                    {lang.twitter}
                  </p>
                </TwitterShareButton>

                <WhatsappShareButton
                  url={sharedUrl}
                  onShareWindowClose={() => handleSharePost(lang.whatsapp)}
                  // className="px-2"
                  quote={quote}
                  title={title}
                >
                  <WhatsappIcon size={mobileView ? 40 : 50} round={true} />
                  <p
                    className={
                      mobileView ? "text-muted fntSz10" : "txt-roman dv__fnt12"
                    }
                  >
                    {lang.whatsapp}
                  </p>
                </WhatsappShareButton>
              </div>
              <div className="d-flex justify-content-between">
                <LinkedinShareButton
                  url={sharedUrl}
                  onShareWindowClose={() => handleSharePost(lang.linkedin)}
                  title={title}
                  // className="px-2"
                  quote={quote}
                >
                  <LinkedinIcon size={mobileView ? 40 : 50} round={true} />
                  <p
                    className={
                      mobileView ? "text-muted fntSz10" : "txt-roman dv__fnt12"
                    }
                  >
                    {lang.linkedin}
                  </p>
                </LinkedinShareButton>

                <FacebookMessengerShareButton
                  url={sharedUrl}
                  onShareWindowClose={() => handleSharePost(lang.messenger)}
                  // className="px-2"
                  appId={FACEBOOK_ID}
                  quote={quote}
                  title={title}
                >
                  <FacebookMessengerIcon
                    size={mobileView ? 40 : 50}
                    round={true}
                  />
                  <p
                    className={
                      mobileView ? "text-muted fntSz10" : "txt-roman dv__fnt12"
                    }
                  >
                    {lang.messenger}
                  </p>
                </FacebookMessengerShareButton>

                <PinterestShareButton
                  media={"https://i.imgur.com/ARMxyC4.png"}
                  url={sharedUrl}
                  title={title}
                  onShareWindowClose={() => handleSharePost(lang.pinterest)}
                >
                  <PinterestIcon size={mobileView ? 40 : 50} round={true} />
                  <p
                    className={
                      mobileView ? "text-muted fntSz10" : "txt-roman dv__fnt12"
                    }
                  >
                    {lang.pinterest}
                  </p>
                </PinterestShareButton>

                <TumblrShareButton
                  url={sharedUrl}
                  onShareWindowClose={() => handleSharePost(lang.tumblr)}
                  // className="px-2"
                  quote={quote}
                  title={title}
                >
                  <TumblrIcon size={mobileView ? 40 : 50} round={true} />
                  <p
                    className={
                      mobileView ? "text-muted fntSz10" : "txt-roman dv__fnt12"
                    }
                  >
                    {lang.tumblr}
                  </p>
                </TumblrShareButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .maxWidth70 {
            max-width: 70%;
          }
          .clipboard-copy {
            width: ${mobileView ? "40px" : "50px"};
            height: ${mobileView ? "40px" : "50px"};
            background-color: #00aced;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          }
        `}
      </style>
    </Wrapper>
  );
};
export default ShareItems;
