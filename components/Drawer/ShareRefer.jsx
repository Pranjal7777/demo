import React, { useState, useEffect, useRef } from "react";
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
    TumblrIcon,
    TumblrShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
} from "react-share";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { FACEBOOK_ID, WEB_LINK } from "../../lib/config/creds";
import { getBitlyUrl } from "../../services/assets";
import { collection_icon_white } from "../../lib/config/profile";
import { getCookie, getLocalStorage, setLocalStorage } from "../../lib/session";

const Wrapper = dynamic(() => import("../../hoc/Wrapper"), { ssr: false });
const CopyToClipboard = dynamic(() => import("react-copy-to-clipboard"), { ssr: false });
const Image = dynamic(() => import("../image/image"), { ssr: false });
const Tooltip = dynamic(() => import("@material-ui/core/Tooltip"), { ssr: false });

const ShareRefer = (props) => {
    const theme = useTheme();
    const profile = useSelector((state) => state.profileData);
    const [sharedUrl, setSharedUrl] = useState({});
    const [lang] = useLang();
    const [mobileView] = isMobile();
    const [tooltipShow, setToolTipShow] = useState(false);
    const userType = getCookie("userType");
    const quote = lang.referFrnd
    const title = lang.referFrnd
    const referSources = ["copyPaste", lang.facebook, lang.tumblr, lang.pinterest, lang.messenger, lang.linkedin, lang.whatsapp, lang.twitter]

    useEffect(() => {
        referSources.forEach(source => {
            getBitlyUrl(
                `${mobileView
                    ? `${WEB_LINK}/signup-as-user?type=${userType == 2 ? "model" : "user"}&referId=${profile.referralCode}&referralSource=${source}`
                    : `${WEB_LINK}/signup-as-user?referId=${profile.referralCode}&referralSource=${source}`
                }`
            )
                .then((url) => {
                    setSharedUrl(prev => ({ ...prev, [source]: url }));
                })
                .catch((err) => console.error(err));

        })

    }, []);

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
                                    text={quote ? `${quote} ${sharedUrl["copyPaste"]}` : sharedUrl["copyPaste"]}
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



                                <FacebookShareButton
                                    url={sharedUrl[lang.facebook]}
                                    quote={quote}
                                    title={title}
                                    hashtag="#juicy"
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
                                    url={sharedUrl[lang.twitter]}
                                    quote={quote}
                                    title={title}
                                    hashtags={["juicy"]}
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
                                    url={sharedUrl[lang.whatsapp]}
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
                                    url={sharedUrl[lang.linkedin]}
                                    title={title}
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
                                    url={sharedUrl[lang.messenger]}
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
                                    url={sharedUrl[lang.pinterest]}
                                    title={title}
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
                                    url={sharedUrl[lang.tumblr]}
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
export default ShareRefer;
