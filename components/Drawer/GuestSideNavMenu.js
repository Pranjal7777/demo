import React from "react";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
// import PlaceholderImg from "../../public/images/mobile/nav-menu/faqs.svg";
// Asstes
import {Placeholder_PROFILE_IMG, Report_Problem_Icon, Language_Icon, FAQs_Icon, shoutoutIcon} from "../../lib/config";
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

export default function GuestSideNavMenu(props) {
  const [lang] = useLang();
  const theme = useTheme();
  const classes = useStyles(theme);

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

  return (
    <Wrapper>
      <div className="sideNavMenu">
        <div className="scr wrap-scr drawerBgCss">
          <div
            className="header-top-secion pt-4 pb-3"
            style={{
              border: `${
                theme.type == "light"
                  ? `1px solid ${theme.palette.l_grey_border}`
                  : ""
              }`,
            }}
          >
            <div className="col-12">
              <div
                className="row align-items-center m-0"
                onClick={() => {
                  authenticate().then(() => {});
                  close_drawer("GuestSideNavMenu");
                }}
              >
                <div className="col-auto pl-0">
                  <Image
                    src={Placeholder_PROFILE_IMG}
                    height="70px"
                    width="70px"
                  ></Image>
                  {/* <PlaceholderImg /> */}
                </div>
                <div className="col-auto p-0">
                  <p className="m-0">{lang.Login_Signup}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="sideNav mx-auto content-secion py-3">
            <div className="col-12">
              <ul className="nav flex-column">
                <li>
                  <EmailShareButton
                    onClick={() => handleEmailShare()}
                    style={{ textAlign: "left" }}
                  >
                    <ListItem button className={classes.root}>
                      <ListItemIcon className={classes.listIconDiv}>
                        <Icon
                          icon={`${Report_Problem_Icon}#noun_Error_log_1236835`}
                          color={theme.type === "light" ? "#000" : "#fff"}
                          width={24}
                          height={22}
                          style={{ width: "5.466vw" }}
                          viewBox="0 0 20 20"
                          alt="report_problem_icon"
                        />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.primary}
                        primary={lang.reportProblem}
                      />
                    </ListItem>
                  </EmailShareButton>
                </li>
                <li>
                  <CustomLink href="/change-language">
                    <ListItem button className={classes.root}>
                      <ListItemIcon className={classes.listIconDiv}>
                        <Icon
                          icon={`${Language_Icon}#Group_9998`}
                          color={theme.type === "light" ? "#000" : "#fff"}
                          width={24}
                          height={22}
                          style={{ width: "4.8vw" }}
                          alt="lang_icon"
                          viewBox="0 0 18 18"
                        />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.primary}
                        primary={lang.language}
                      />
                    </ListItem>
                  </CustomLink>
                </li>
                <li>
                  <CustomLink href="/faqs">
                    <ListItem button className={classes.root}>
                      <ListItemIcon className={classes.listIconDiv}>
                        <Icon
                          icon={`${FAQs_Icon}#Group_10005`}
                          color={theme.type === "light" ? "#000" : "#fff"}
                          width={24}
                          height={22}
                          style={{ width: "4.266vw" }}
                          alt="faqs_icon"
                          viewBox="0 0 18 16"
                        />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.primary}
                        primary={lang.faqs}
                      />
                    </ListItem>
                  </CustomLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
          }
          :global(.MuiDrawer-paper > div) {
          }
          .sideNavMenu {
            width: 75vw;
            height: 100vh;
            position: relative;
            float: right;
          }
          .iconDiv {
            width: 9.506vw;
          }
          :global(.MuiListItemText-primary){
            font-size: 4.266vw !important;
            font-family: "Roboto"; sans-serif !important;
            opacity: 1 !important;
            color: ${theme.text} !important;
            line-height: 0.8 !important;
            vertical-align: text-bottom !important;
          }
        `}
      </style>
    </Wrapper>
  );
}
