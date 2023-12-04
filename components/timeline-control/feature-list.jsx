import React from "react";
import Router from "next/router";
import { getCookie, setCookie } from "../../lib/session";
import { open_progress } from "../../lib/global/loader";
import { s3ImageLinkGen } from "../../lib/UploadAWS/s3ImageLinkGen";
import Image from "../image/image";
import ReactCountryFlag from "react-country-flag";
import { useSelector } from "react-redux";
import isMobile from "../../hooks/isMobile";

export default function FeatureList(props) {
  const { timeLineCards = false } = props
  // console.log("props", props);
  const [mobileView] = isMobile();
  const uid = getCookie("uid");
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);


  // console.log('uid', uid, props.userId, uid == props.userId)

  const profileClickHandler = () => {
    open_progress();
    if (uid == props.userId) {
      props.setActiveState("profile");
      Router.push(`/profile`);
    } else {
      setCookie("otherProfile", `${props?.username || props?.userName}$$${props?.userId || props?.userid || props?._id}`)
      Router.push(
        `/${props.username || props.userName}`
        // `/user/${props.userId}`
      );
    }
  };
  return (
    <React.Fragment>
      <div
        key={props.id}
        className={`position-relative cursorPtr mr-2 ${mobileView ? props?.id === 0 ? "ml-3" : "" : ""}`}
        onClick={profileClickHandler}
      >
        <div className='h-100'>
          <Image
            src={s3ImageLinkGen(S3_IMG_LINK, props?.profilePic, null, 250, 350)}
            width={timeLineCards ? "133" : "100%"}
            style={{ filter: "brightness(0.8)" }}
            className="radius_12 h-100 object-fit-cover"
          />
        </div>
        <div className='position-absolute p-2 w-100' style={{ bottom: "0px", left: "0px", zIndex: "9", borderRadius: "0px 0px 12px 12px", background: "linear-gradient(180deg, rgba(0, 0, 0, 0) -2.27%, rgba(0, 0, 0, 0.8) 100.01%)" }}>
          <div className='d-flex flex-row align-items-center'>
            <div>
              <Image
                src={s3ImageLinkGen(S3_IMG_LINK, props?.profilePic, null, 40, 40)}
                style={{ width: "36px", heigh: "36px" }}
                className="object-fit-cover rounded-pill"
              />
            </div>
            <div className='pl-2' style={{ maxWidth: "calc(100% - 35px)" }}>
              <div className='text-white text-truncate fntSz13'>{props?.username}</div>
              <div className='d-flex flex-row '>
                <ReactCountryFlag
                  countryCode={props?.countryCodeName || "us"}
                  aria-label={props?.countryName || "United States"}
                  title={props?.countryCodeName || "us"}
                  svg
                  style={{
                    width: '24px',
                    height: "14px",
                    objectFit: "cover",
                  }}
                />
                <div className='pl-1 text-truncate fntSz10 text-uppercase' style={{ color: "#bbbbbb" }}>{props?.countryName || "USA"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment >
  );
}
