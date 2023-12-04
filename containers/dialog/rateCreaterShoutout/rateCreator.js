import React, { useState } from "react";
import Wrapper from "../../../hoc/Wrapper";
import CloseIcon from "@material-ui/icons/Close";
import { useTheme } from "react-jss";
import useLang from "../../../hooks/language";
import FigureCloudinayImage from "../../../components/cloudinayImage/cloudinaryImage";
import Avatar from "@material-ui/core/Avatar";
import Button from "../../../components/button/button";
import isMobile from "../../../hooks/isMobile";
import Header from "../../../components/header/header";
import { backArrow } from "../../../lib/config";
import RatingComp from "../rateCreaterShoutout/ratingComponent";
import { shoutoutRating } from "../../../services/shoutout";
import { close_dialog, close_drawer, startLoader, stopLoader, Toast } from "../../../lib/global";
import { palette } from "../../../lib/palette";
import { handleContextMenu } from "../../../lib/helper";

const RateCreator = (props) => {

  const theme = useTheme();
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const [ratings, setRatings] = useState(0);
  const [shoutoutRatingText, setShoutoutRatingText] = useState("");

  const handleRating = async () => {
    startLoader();
    try {
      let payload = {
        rating: ratings,
        virtualOrderId: props?.orderId,
      };
      if (shoutoutRatingText.length > 0) {
        payload["review"] = shoutoutRatingText;
      }
      const res = await shoutoutRating(payload);
      props?.handleRating(ratings);
      setShoutoutRatingText("");
      setRatings(0);
      mobileView ? close_drawer("rateCreator") : close_dialog("rateCreator");
      Toast(`Successfully rated this ${props?.orderType === "VIDEO_CALL" ? "VideoCall" : "Shoutout"} order`);
      stopLoader();
    } catch (e) {
      Toast("Something went wrong", "error");
      stopLoader();
      console.error("Error in handleRating", e)
    }
  };

  const handleRatingStars = (ratings) => {
    setRatings(ratings);
  };

  return (
    <Wrapper>
      {!mobileView ? (
        <>
          <div
            className="d-flex align-items-center px-3 py-2"
            style={{ borderBottom: "1px solid #f1f1f1" }}
          >
            <CloseIcon
              className="cursorPtr"
              onClick={() => props?.onClose()}
              style={{ color: `${theme?.text}` }}
            />
            <div className="w-100 d-flex justify-content-center fntSz22 fntWeight700">
              {lang.rateNow}
            </div>
          </div>
          <div className="px-5 py-4 text-center callout-none" onContextMenu={handleContextMenu}>
            {props?.profilePic ? (
              <FigureCloudinayImage
                publicId={props?.profilePic}
                ratio={1}
                className="order_and_profile mb-1"
              />
            ) : (
              <Avatar className="dv_profile_logo_requestShoutout mb-1 h-100 w-100 solid_circle_border">
                {props && props?.firstName && props?.lastName && (
                  <span className="initials_order">
                    {props?.firstName[0] + props?.lastName[0]}
                  </span>
                )}
              </Avatar>
            )}
            <div className="fntSz18 fntWeight700">
              {props?.firstName} {props?.lastname}
            </div>
            <div>
              <RatingComp handleRatingStars={handleRatingStars} />
            </div>
            <div>
              <textarea
                className="p-2 m-0 w-100 mt-4 videoInfoCss mb-3"
                type="text"
                rows={2}
                value={shoutoutRatingText}
                onChange={(e) => setShoutoutRatingText(e.target.value)}
                style={{
                  background: theme.sectionBackground,
                  color: theme?.text,
                  borderRadius: "14px",
                }}
                placeholder="Say Something..."
                required={true}
              />
            </div>
            <Button
              type="button"
              cssStyles={theme.dv_blueButton}
              onClick={handleRating}
              isDisabled={!(ratings && shoutoutRatingText)}
            >
              {lang.submit}
            </Button>
          </div>
        </>
      ) : (
        <>
          <Header
            title={lang.rateShoutExp}
            icon={backArrow}
            back={props.onClose}
          />
          <div className="d-flex flex-column justify-content-between" style={{ height: "85vh" }}>
            <div style={{ marginTop: "90px" }}>
                <div className="col-12  w-100 d-flex justify-content-center callout-none" onContextMenu={handleContextMenu}>
                {props?.profilePic ? (
                    <div>
                  <FigureCloudinayImage
                    publicId={props?.profilePic}
                    ratio={1}
                    width={60}
                    height={60}
                    className="order_and_profile"
                  />
                    </div>
                ) : (
                  <Avatar className="dv_profile_logo_requestShoutout mb-1 h-100 w-100 solid_circle_border">
                    {props && props?.firstName && props?.lastName && (
                      <span className="initials_order">
                        {props?.firstName[0] + props?.lastName[0]}
                      </span>
                    )}
                  </Avatar>
                )}
              </div>
              <div className="fntSz16 text-center pb-3 appTextColor fntWeight700">
                {props?.firstName} {props?.lastname}
              </div>
                {/* <div className="sepeatorCss"></div> */}
              <div className="pt-3">
                <RatingComp handleRatingStars={handleRatingStars} />
              </div>
              <div className="col-12">
                <textarea
                  className="p-2 m-0 w-100 videoInfoCss mb-3"
                  type="text"
                  rows={3}
                  value={shoutoutRatingText}
                  onChange={(e) => setShoutoutRatingText(e.target.value)}
                  style={{
                    background: theme.sectionBackground,
                    border: "none",
                    color: theme?.text,
                    borderRadius: "14px",
                  }}
                  placeholder="Leave a review"
                  required={true}
                />
              </div>
            </div>
            <div className="mx-3">
              <Button
                type="button"
                cssStyles={theme.blueButton}
                onClick={handleRating}
                isDisabled={!(ratings && shoutoutRatingText)}
              >
                {lang.submit}
              </Button>
            </div>
          </div>
        </>
      )}
      <style jsx>{`
        .shoutoutImg {
          width: 53px !important;
          height: 53px !important;
          border-radius: 50% !important;
          object-fit: cover;
          background-color: #fff !important;
        }

        .sepeatorCss {
          width: 100%;
          background: ${theme.type === "light" ? "silver" : palette.d_light_grey2};
          height: 6px;
        }
      `}</style>
    </Wrapper>
  );
};

export default RateCreator;
