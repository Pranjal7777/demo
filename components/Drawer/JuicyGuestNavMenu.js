import React from "react";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
// import PlaceholderImg from "../../public/images/mobile/nav-menu/faqs.svg";
// Asstes
import {
  Placeholder_PROFILE_IMG,
  Report_Problem_Icon,
  Language_Icon,
  FAQs_Icon,
  shoutoutIcon,
  MENUBAR_ICON,
  CLOSE_ICON_WHITE,
  JUICY_HEADER_LOGO,
} from "../../lib/config";
import {
  authenticate,
  close_drawer,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import { getLanguages } from "../../services/auth";
import { EmailShareButton } from "react-share";
import { handleEmailShare } from "../../lib/share/handleShare";
import dynamic from "next/dynamic";
const CustomLink = dynamic(() => import("../Link/Link"), { ssr: false });
const Image = dynamic(() => import("../image/image"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "react-jss";
import Icon from "../image/icon";
import Link from "next/link";
import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
import { handleContextMenu } from "../../lib/helper";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "9px 0 !important",
  },
  listIconDiv: {
    minWidth: "40px !important",
  },
  primary: (props) => ({
    fontSize: "4.266vw !important",
    fontFamily: "Roboto, sans-serif !important",
    opacity: "1 !important",
    color: `${props.text} !important`,
    lineHeight: "0.8 !important",
    verticalAlign: "text-bottom !important",
  }),
}));

export default function JuicyGuestNavMenu(props) {
  const [lang] = useLang();
  const theme = useTheme();
  const classes = useStyles(theme);
  const router = useRouter();

  const handleGetLanguages = async () => {
    startLoader();
    try {
      const response = await getLanguages();
      if (response.status == 200) {
        stopLoader();
        let arr = response && response.data && response.data.data;
        open_drawer("ChangeLanguage", { languages: arr }, "right");
      }
    } catch (e) {
      stopLoader();
      Toast(e.response.data.message, "error");
    }
  };

  const hrefUrls = [
    { text: "Home", url: "/" },
    { text: "Who We Are", url: "/who-we-are" },
    { text: "Affiliates", url: "/affiliates" },
    { text: "Agency", url: "/agency" },
    { text: "Blog", url: "/blog" },
    { text: "Support", url: "/support" },
  ];

  return (
    <Wrapper>
      <div className="sideNavMenu">
        <div className="scr wrap-scr card_bg text-app vh-100">
          <div
            className="header-top-secion d-flex align-items-center"
          >
            <div className="col-12 d-flex align-items-center justify-content-between">
              <div>
                <img
                  src={`${JUICY_HEADER_LOGO}`}
              // viewBox="0 0 96 45"
              width="90"
              height="40"
                  contextMenu={handleContextMenu}
                  className='callout-none'
            />
              </div>
              <div className="mx-1">
                <Icon
                  icon={`${CLOSE_ICON_WHITE}#close-white`}
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  onClick={() => {
                    close_drawer("JuicyGuestNavMenu");
                  }}
                />
              </div>
            </div>
          </div>
          <div className="body-section">
            <div className="row mx-0 my-3">
              {hrefUrls?.map((urls, index) => {
                return (
                  <div
                    className="col-12 col-sm-7 mx-auto juicy_header_tabs"
                    onClick={() => {
                      close_drawer("JuicyGuestNavMenu");
                    }}
                  >
                    <Link href={urls?.url}>{urls?.text}</Link>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="footer_section">
            <div className="row mx-0">
              <Button
                onClick={() => {
                  window.open("/login", '_self'), close_drawer("JuicyGuestNavMenu");
                }}
                className="sidebar_button login col-12 col-sm-8 mx-auto"
              >
                Log In
              </Button>
              <Button
                onClick={() => {
                  window.open("/signup-as-user", '_self'), close_drawer("JuicyGuestNavMenu");
                }}
                className="sidebar_button join col-12 col-sm-8 mx-auto"
              >
                Signup as a User
              </Button>
              <Button
                onClick={() => {
                  window.open("/signup-as-creator", '_self'), close_drawer("JuicyGuestNavMenu");
                }}
                className="sidebar_button join col-12 col-sm-8 mx-auto"
              >
                Signup as a Creator
              </Button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
          }
          :global(.backNavMenu), :global(.backNavMenu > div) {
            max-width: 100vw !important;
            border: none !important;
          }
          :global(.MuiDrawer-paper > div) {
            width: 100vw !important;
          }
          // .sideNavMenu {
          //   width: 100vw;
          //   height: 100vh;
          //   position: relative;
          //   float: right;
          // }
          .iconDiv {
            width: 9.506vw;
          }
          :global(.juicy_header_tabs){
            padding: 10px;
          }
          :global(.header-top-secion){
            background: #121212;
            height: 4rem;
          }
          :global(.body-section) {
            padding: 1rem;
            height: calc(calc(var(--vhCustom, 1vh) * 100) - 18rem);
            overflow-y: auto;
          }
          :global(.juicy_header_tabs a){
            background: rgba(144, 99, 253, 0.1);
            border-radius: 8px;
            color: #ffffff !important;
            padding: 12px;
            white-space: nowrap;
            letter-spacing: 0.35px;
            text-decoration: none;
            width: 100%;
            display: flex;
            justify-content: center;
          }
          :global(.MuiListItemText-primary){
            font-size: 4.266vw !important;
            font-family: "Roboto"; sans-serif !important;
            opacity: 1 !important;
            color: ${theme.text} !important;
            line-height: 0.8 !important;
            vertical-align: text-bottom !important;
          }
          :global(.footer_section) {
            padding: 1rem;
            position: sticky;
            bottom: 0px;
            height: 14rem;
            z-index: 55;
            background: #121212;
          }
          :global(.sidebar_button){
              color: #ffffff !important;
              box-sizing: border-box;
              border-radius: 50px !important;
              padding: 10px;
              letter-spacing: 0.5999px;
              text-transform: none;
              margin: 10px;
          }
        `}
      </style>
    </Wrapper>
  );
}
