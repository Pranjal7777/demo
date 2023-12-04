import React, {useState, useEffect} from "react";
import Wrapper from "../../hoc/Wrapper";
import Router from "next/router";
import {
  shoutoutPlayBtn,
  shoutoutShareBtn,
  shoutoutBackBtn,
  shoutoutMoreBtn,
} from "../../lib/config";
import { authenticate, close_drawer, open_dialog, open_drawer, open_progress, startLoader } from "../../lib/global";
import Icon from "../image/icon";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import useLang from "../../hooks/language";
import FigureCloudinayImage from "../cloudinayImage/cloudinaryImage";
import Avatar from "@material-ui/core/Avatar";
import isMobile from "../../hooks/isMobile";
import { getProfile } from "../../services/auth";
import { getCookie, setCookie } from "../../lib/session";
import { handleContextMenu } from "../../lib/helper";

const ShoutoutDetail = (props) => {
  const { shoutoutDetail } = props;
  const [mobileView] = isMobile();
  const [isVideoPlayed, setIsVideoPlayed] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState({});
  const [videoUrl, setVideoUrl] = useState("");
  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);
  const [lang] = useLang();
  const theme = useTheme();
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const videoThumbnail = s3ImageLinkGen(S3_IMG_LINK, shoutoutDetail?.thumbnailUrl, null, "100vw", "100vh");

  useEffect(()=>{
    handleCreatorProfile();
    getVideoUrl()
  }, [])

  const getVideoUrl = () => {
    if(shoutoutDetail?.otherUrls){
      setVideoUrl(mobileView ? shoutoutDetail?.otherUrls?.mobile : shoutoutDetail?.otherUrls?.web);
    }else{
      setVideoUrl(`${APP_IMG_LINK}/${shoutoutDetail?.videoUrl}`);
    }
  }

  const handleProfileRedirection = () => {
    mobileView ? startLoader() : open_progress();
    if(getCookie("uid") == shoutoutDetail?.creator?.id){
      Router.push("/profile")
    }else{
      setCookie("otherProfile", `${shoutoutDetail?.creator?.username || shoutoutDetail?.creator?.userName || shoutoutDetail?.creator?.profilename}$$${shoutoutDetail?.creator?.creatorId || shoutoutDetail?.creator?.userid || shoutoutDetail?.creator?._id}`);
      Router.push(`/${shoutoutDetail?.creator?.username || shoutoutDetail?.creator?.username}`);
    }
  }

  const handleShareItem = () => {
    mobileView
        ? open_drawer(
            "SHARE_ITEMS",
            {
                sharedUserId: shoutoutDetail?.creator?._id,
                shareType: "profile",
                username: shoutoutDetail?.creator?.username,
                back: () => close_drawer("SHARE_ITEMS"),
            },
            "bottom"
        )
        : open_dialog("SHARE_ITEMS", {
            sharedUserId: shoutoutDetail?.creator?._id,
            shareType: "profile",
            username: pshoutoutDetail?.creator?.username,
            back: () => close_dialog("SHARE_ITEMS"),
        });
    };

    const handleCreatorProfile = async () => { 
      try{
        const token = getCookie("token");
        const response = await getProfile(shoutoutDetail?.creator?._id, token, getCookie('selectedCreatorId'));
        setCreatorProfile(response?.data?.data)
      }catch(e){
        console.error("Error in handleCreatorProfile", e)
      }
    }
    
    const handleCloseDrawer = () => {
      Router.back();
    };

  return (
    <Wrapper>
      <div className="position-relative h-100 shoutoutThumb">
        {isVideoPlayed &&  
        <video
            src={
              videoUrl?.includes("m3u8")
                ? videoUrl?.slice(0, -4) + "mp4"
                : videoUrl
            }
            autoPlay
            height="100%"
            width="100%"
            id="shoutoutVideo"
          controlsList="nodownload"
            muted
            style={{background: "#000"}}
            className="object-fit-cover"
            onEnded={() => setIsVideoPlayed(false)}
          />}
        <div className="d-flex position-fixed px-0 align-items-center w-100 justify-content-between"
          style={{top: "20px"}}
        >
          <div onClick={() => close_drawer("shoutoutDetail")}>
            <Icon
              icon={`${shoutoutBackBtn}#Back`}
              size={35}
              color={theme.palette.white}
              viewBox="0 0 25 25"
              onClick={() => close_drawer("shoutoutDetail")}
              class="px-3"
            />
          </div>
          <div>
            <Icon
              icon={`${shoutoutMoreBtn}#moreIcon`}
              size={38}
              color={theme.text}
              viewBox="0 0 34 34"
              class="px-3"
            />
          </div>
        </div>
       {!isVideoPlayed && <div>
          <Icon
            icon={`${shoutoutPlayBtn}#Icon_ionic-ios-play-2`}
            size={70}
            color={theme.text}
            viewBox="0 0 56.725 66.4"
            class="playBtn"
            onClick={() => setIsVideoPlayed(true)}
          />
        </div>}
        <div className="position-fixed w-100 py-4" style={{ bottom: "0" }}>
          <div className="d-flex align-items-center pb-4">
            <div className="col-auto white callout-none" onContextMenu={handleContextMenu}>
              {shoutoutDetail?.creator?.profilePic ? (
                <FigureCloudinayImage
                  publicId={`${shoutoutDetail?.creator?.profilePic}`}
                  ratio={1}
                  quality={100}
                  className="shoutoutImg mb-1"
                />
              ) : (
                <Avatar className="mv_profile_logo_requestShoutout mb-1 solid_circle_border">
                  {shoutoutDetail?.creator?.username && (
                    <span className="initials_order">
                      {shoutoutDetail?.creator?.username[0]}
                    </span>
                  )}
                </Avatar>
              )}
            </div>
            <div className="col d-flex pl-0 flex-column white">
              <div className="fntSz17 font-weight-500">
                {shoutoutDetail?.creator?.username}
              </div>
              <div className="fntSz15" style={{ color: "#848082" }}
                onClick={()=> handleProfileRedirection()}
              >
                {lang.viewProfile}
              </div>
            </div>
            <div className="col-auto white">
              <Icon
                icon={`${shoutoutShareBtn}#shoutoutShareBtn`}
                size={33}
                color="#fff"
                viewBox="0 0 34 34"
                onClick={(e) => handleShareItem()}
              />
            </div>
          </div>
          {creatorProfile?.shoutoutPrice?.price && <div className="col-12 shoutoutBtn d-flex justify-content-center align-items-center white"
              onClick={() => {
                    authenticate().then(() => {
                        open_drawer("Shoutout",
                            {
                                handleCloseDrawer: handleCloseDrawer,
                                profile: creatorProfile,
                            },
                            "right"
                        )
                    });
                }}
          >
            <p
              className="m-0 w-100 text-center py-2"
              style={{ border: "1px solid #fff", borderRadius: "10px" }}
            >
              {`${lang.requestShoutoutVideoFor} ${creatorProfile?.shoutoutPrice?.currencySymbol}${creatorProfile?.shoutoutPrice?.price}`}
            </p>
          </div>}
        </div>
        <style jsx>{`
          .shoutoutThumb {
            background-image: linear-gradient(
                rgb(0 0 0 / 30%),
                rgb(255 255 255 / 20%),
                rgb(0 0 0 / 73%)
              ),
              url(${videoThumbnail});
            background-repeat: no-repeat;
            background-attachment: inherit;
            background-size: cover;
          }
          :global(.playBtn) {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
          }
          .shoutoutImg {
            width: 53px !important;
            height: 53px !important;
            border-radius: 50% !important;
            object-fit: cover;
            background-color: #fff !important;
          }
          .mv_profile_logo_requestShoutout {
            width: 17px !important;
            height: 17px !important;
            border-radius: 50% !important;
            object-fit: cover;
            background-color: #fff !important;
          }
        `}</style>
      </div>
    </Wrapper>
  );
};

export default ShoutoutDetail;
