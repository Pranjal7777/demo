import React from "react";
import FigureCloudinayImage from "../../../components/cloudinayImage/cloudinaryImage";
import ImagePicker from "../../../components/formControl/imagePicker";
import Image from "../../../components/image/image";
import * as config from "../../../lib/config";
import useProfileData from "../../../hooks/useProfileData";
import ImageGallery from "../image-gallery";
import isMobile from "../../../hooks/isMobile";
import { Avatar } from "@material-ui/core";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";
import { isAgency } from "../../../lib/config/creds";
import Icon from "../../../components/image/icon";
import { handleContextMenu } from "../../../lib/helper";

export default function EditProfileCoverImageHeader(props) {
  const [profile] = useProfileData();
  const [mobileView] = isMobile();
  const theme = useTheme();
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK)
  // const CLOUD_NAME = useSelector((state) => state?.cloudinaryCreds?.cloudName)

  return (
    <div
      // className="row dv_pro_banner mv_pro_banner"
      className={`row${mobileView ? " mv_pro_banner" : " dv_pro_banner mx-1 w-100"}`}
      style={
        mobileView
          ? {
            aspectRatio: "1/0.33",
            height: "100%",
            backgroundImage: `url(${props.bannerImage
              ? props.bannerImage
              : profile.bannerImage
                ? profile.bannerImage.startsWith(`http`)
                  ? profile.bannerImage
                  : s3ImageLinkGen(S3_IMG_LINK, profile.bannerImage, null, null, mobileView ? '40vw' : 500)
                : config.BANNER_PLACEHOLDER_IMAGE
              })`,
          }
          : {
            aspectRatio: "1/0.33",
            height: "100%",
            backgroundImage: `url(${props.bannerImage
              ? props.bannerImage
              : profile.bannerImage
                ? profile.bannerImage.startsWith(`http`)
                  ? profile.bannerImage
                  : s3ImageLinkGen(S3_IMG_LINK, profile.bannerImage, null, null, mobileView ? '21vw' : 500)
                : config.BANNER_PLACEHOLDER_IMAGE_COVER
              })`,
            // maxHeight: "fit-content", //its not working on safari macbook
          }
      }
    >
      <div className="container position-relative">
        <ImagePicker
          // aspectRatio={15 / 6}
          aspectRatio={1 / 0.33}
          onChange={props.onBannerImageChange}
          render={() => {
            return (
              <span
                className="mv_edit_profile_icon_top_sec"
                style={{ cursor: "pointer" }}
              >
                <Icon
                  icon={config.EDIT_PROFILE_ICON + "#edit_prfile"}
                  size={22}
                  color={"var(--l_app_text)"}
                  viewBox="0 0 22 22"
                />
                {/* <ImageGallery src={config.EDIT_PROFILE_ICON} width={24}/> */}
              </span>
            );
          }}
        ></ImagePicker>
        {/* profile pic */}
        <div className="mv_pos_btm_sec">
          <div className="position-relative callout-none" onContextMenu={handleContextMenu}>
            {props.profileImage ? (
              <Image
                src={props.profileImage}
                className="mv_profile_logo mv_profile_round_border"
              ></Image>
            ) : !profile.profilePic ? (
              <Avatar className="mv_profile_logo solid_circle_border">
                {profile && profile.firstName && profile.lastName && (
                  <span className="initials">
                    {profile.firstName[0] + (profile.lastName ? profile.lastName[0] : '')}
                  </span>
                )}
              </Avatar>
            ) : (
              <FigureCloudinayImage
                publicId={profile.profilePic}
                width={84}
                ratio={1}
                style={
                  mobileView
                    ? {}
                    : {
                      maxWidth: "70px",
                      maxHeight: "70px",
                      // border: `1px dashed ${theme.appColor}`,
                    }
                }
                className="mv_profile_logo mv_profile_round_border"
              />
            )}
            {/* <ImagePicker
              onChange={props.onProfileImageChange}
              render={() => {
                return (
                  <span className="mv_edit_profile_icon_btm_sec">
                    <Image src={config.EDIT_PROFILE_ICON} width={22}/>
                  </span>
                );
              }}
            ></ImagePicker> */}
            <ImagePicker
              aspectRatio={1 / 1}
              cropRoundImg={false}
              onChange={props.onProfileImageChange}
              render={() => {
                return (
                  <span
                    className="mv_edit_profile_icon_btm_sec"
                    style={{ cursor: "pointer" }}
                  >
                    {/* <Image src={config.EDIT_PROFILE_ICON} width={22} /> */}
                    <Icon
                      icon={config.EDIT_PROFILE_ICON + "#edit_prfile"}
                      size={14}
                      color={"var(--l_app_text)"}
                      viewBox="0 0 14 14"
                    />
                  </span>
                );
              }}
            ></ImagePicker>
          </div>
        </div>
      </div>
      <style jsx>
        {`
        .mv_edit_profile_icon_btm_sec{
          bottom:10px !important;
          right: 0px !important;
          border-bottom: 1px solid var(--l_app_text);
        }
        :global(.mv_pos_btm_sec){
          bottom:6px !important;
        }
        `}
      </style>
    </div>
  );
}
