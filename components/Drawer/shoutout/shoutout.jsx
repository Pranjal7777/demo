import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Header from "../../header/header"
import Route, { useRouter } from "next/router";
import { makeStyles } from '@material-ui/core/styles';

import isMobile from "../../../hooks/isMobile";
import * as config from "../../../lib/config";
import { useTheme } from "react-jss";
import { open_drawer, close_drawer, backNavMenu, stopLoader } from '../../../lib/global'
import useLang from "../../../hooks/language";
import useProfileData from "../../../hooks/useProfileData";

import Button from "../../../components/button/button";
const Avatar = dynamic(() => import("@material-ui/core/Avatar"), {
  ssr: false,
});

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Input } from "@material-ui/core";
import HomeIcon from '@material-ui/icons/Home';
import Icon from "../../image/icon";
import Image from "../../image/image";
import { handleContextMenu } from "../../../lib/helper";
import { CoinPrice } from "../../ui/CoinPrice";

const OtherProfileHeader = dynamic(
  () => import("../../../containers/DvHeader/OtherProfileHeader"),
  { ssr: false }
);
const MoreVertIcon = dynamic(() => import("@material-ui/icons/MoreVert"), {
  ssr: false,
});
const CircularProgress = dynamic(
  () => import("@material-ui/core/CircularProgress"),
  { ssr: false }
);
const StickyHeader = dynamic(
  () => import("../../../components/sticky-header/StickyHeader"),
  { ssr: false }
);
const FigureCloudinayImage = dynamic(
  () => import("../../../components/cloudinayImage/cloudinaryImage"),
  { ssr: false }
);


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: "30px",
    height: "30px",
    marginRight: '5px',
    border: `2px solid ${config.PRIMARY}`,
    backgroundColor: "#fff",
  },
  initial: {
    fontSize: "13px",
    color: `${config.PRIMARY}`,
    letterSpacing: "1px",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
}));

const Shoutout = (props) => {
  const classes = useStyles();
  const Pageref = useRef(null);
  const [mobileView] = isMobile();
  const theme = useTheme();
  const router = useRouter();
  const [lang] = useLang();
  const [btnLoading, setBtnLoading] = useState(false);
  const [profile] = useProfileData();
  const [otherProfile, setOtherProfile] = useState(props.profile);
  const [isSticky, setIsSticky] = useState(false);
  const [forFriend, setForFriend] = useState(false)
  const [friendName, setFriendName] = useState("")

  useEffect(() => {
    stopLoader()
  }, [])

  const howItWorksDrawer = () => {
    open_drawer(
      "howItWorksDrawer", {
      title: lang.howDoesItWorks,
      subtitle: `${lang.howDoesItWorksSubtitle} ${config.APP_NAME.toLowerCase()} shoutout?`,
    }, "bottom");
  }

  const FrndShoutoutDrawer = () => {
    open_drawer("FrndShoutout", { profile: props.profile }, "right");
  }

  const handleFriendShoutout = () => {
    setForFriend(true)
    if (friendName) {
      setBtnLoading(true);
      open_drawer(
        "ShoutoutForm", {
        profile: props.profile,
        thirdUserProfile: friendName,
        isThirdUser: true,
      },
        "right"
      )
    }
  }

  return (
    <>
      {mobileView
        ? <div>
          <Header title={lang.shoutOutRequest} back={props.onClose} />
          <div className='shoutout__down text-center content-secion'>
            <div className='d-flex flex-column align-items-center justify-content-center mt-5 callout-none' onContextMenu={handleContextMenu}>
              {otherProfile.profilePic ? (
                <FigureCloudinayImage
                  publicId={otherProfile.profilePic}
                  // width={70}
                  ratio={1}
                  className="mv_profile_logo mb-1"
                />
              ) : (
                <Avatar className="mv_profile_logo  solid_circle_border">
                  {otherProfile && otherProfile.firstName && otherProfile.lastName && (
                    <span className="initial">
                      {otherProfile.firstName[0] + otherProfile.lastName[0]}
                    </span>
                  )}
                </Avatar>
              )}
              <span className='bold fntSz16 text-capitalize text-app'>{otherProfile.fullName}</span>
              <span className="bold mb-4"><CoinPrice price={props?.profile?.shoutoutPrice?.price} showCoinText={false} size={14} /></span>
              <div className='d-flex flex-column align-items-center w-100 px-5'>
                <Button
                  type="button"
                  fclassname={`rounded-pill mb-2 py-2 ${!forFriend ? "btnGradient_bg" : "background_none borderStroke"}`}
                  onClick={() => {
                    setForFriend(false)
                    setBtnLoading(true);
                    open_drawer(
                      "ShoutoutForm", {
                      profile: props.profile,
                    },
                      "right"
                    )
                  }}
                >
                  <span className='text-capitalize'>
                    {`${profile.firstName} ${profile.lastName} (MySelf)`}
                  </span>
                </Button>
                <Button
                  type="button"
                  fclassname={`rounded-pill py-2 ${forFriend ? "btnGradient_bg" : "background_none borderStroke"}`}
                  onClick={handleFriendShoutout}
                >
                  <Icon
                    icon={`${config.shoutoutForFriend}#Group_55823`}
                    size={28}
                    viewBox="0 0 29 29"
                    class="pr-2"
                  />
                  {friendName ? `For ${friendName}` : lang.forAFriend}
                </Button>
                {forFriend && <label className="d-flex flex-column mt-3 w-100 align-items-center dv_appTxtClr" >
                  {lang.bookingFor}
                  <div className="w-75 position-relative">
                    <Input placeholder="Enter Name" className="mt-3 w-100 dv_appTxtClr" onChange={(e) => setFriendName(e.target.value)} />
                    <Image
                      onClick={handleFriendShoutout}
                      src={config.rightSideIcon}
                      className="position-absolute"
                      style={{ bottom: "7px", right: "0px", height: "20px" }}
                      alt="rightArrow"
                    />
                  </div>
                </label>}
              </div>
            </div>
            <div className='shoutout__footer'>
              <p onClick={() => howItWorksDrawer()}>
                <InfoOutlinedIcon className="mr-1 mb-1 fntSz15" />
                {lang.howItWorks}
              </p>
            </div>
          </div>
        </div>
        : ""
      }

      <style jsx="true">{`
        .shoutout__down {
          position: absolute;
          top: 9.5vh;
          width: 100%;
          height: 90%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          }
          .shoutout__footer {
            font-size: 3.5vw;
            font-weight: 500;
            color: #868383;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          :global(.MuiInput-underline:after){
            border-bottom: 2px solid var(--l_base);
          }
          :global(.MuiInput-underline:before){
            border-bottom: 2px solid ${theme.type == "light" ? "#dee2e6" : "#818ca3"};
          }
      `}</style>
    </>
  )
}

export default Shoutout
