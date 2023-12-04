import React, { useState, useEffect } from "react";
import Wrapper from "../../../hoc/Wrapper";
import { useTheme } from "react-jss";
import useLang from "../../../hooks/language";
import InputField from "../../profile/edit-profile/label-input-field";
import isMobile from "../../../hooks/isMobile";
import Button from "../../../components/button/button";
import * as env from "../../../lib/config";
import EditProfileHeader from "../../../containers/profile/edit-profile/edit-profile-header";
import ClearIcon from "@material-ui/icons/Clear";

const SocialMediaLinks = (props) => {
  const [mobileView] = isMobile();
  const theme = useTheme();

  const webInoutStyle = {
    background: theme.border,
    color: theme.palette.l_app_text,
  };
  const [lang] = useLang();
  const [socialMediaLinkArray, setSocialMediaLinkArray] = useState([
    {
      fieldLabel: lang.instaSocialLink,
      link: "",
      error: false,
      label: lang.instagram,
      logo: env.instagram_social,
      activweLogo: env.instagram_social,
      disableLogo: env.instagram_social_disble,
    },
    {
      fieldLabel: lang.youtubeSocialLink,
      link: "",
      error: false,
      label: lang.youtube,
      logo: env.youtube_social,
      activweLogo: env.youtube_social,
      disableLogo: env.youtube_social_disble,
    },
    {
      fieldLabel: lang.facebookSocialLink,
      link: "",
      error: false,
      label: lang.Facebook,
      logo: env.facebook_social,
      activweLogo: env.facebook_social,
      disableLogo: env.facebook_social_disble,
    },
    {
      fieldLabel: lang.twitterSocialLink,
      link: "",
      error: false,
      label: lang.Twitter,
      logo: env.twitter_social,
      activweLogo: env.twitter_social,
      disableLogo: env.twitter_social_disble,
    },
    {
      fieldLabel: lang.onlyfansSocialLink,
      link: "",
      error: false,
      label: lang.tiktok,
      logo: env.onlyfans_social,
      activweLogo: env.onlyfans_social,
      disableLogo: env.onlyfans_social_disble,
    },
    {
      fieldLabel: lang.snapchatSocialLink,
      link: "",
      error: false,
      label: lang.snapchat,
      logo: env.onlyfans_social,
      activweLogo: env.snapchat_social,
      disableLogo: env.snapchat_social_disble,
    },
  ]);

  useEffect(() => {
    fillReduxLinks();
  }, []);

  const fillReduxLinks = () => {
    let reduxLinkArray = [...socialMediaLinkArray];
    reduxLinkArray[0] = {
      ...reduxLinkArray[0],
      link: props?.socialLinks?.instagram || "",
      logo: props?.socialLinks?.instagram
        ? env.instagram_social
        : env.instagram_social_disble,
    };
    reduxLinkArray[1] = {
      ...reduxLinkArray[1],
      link: props?.socialLinks?.youtube || "",
      logo: props?.socialLinks?.youtube
        ? env.youtube_social
        : env.youtube_social_disble,
    };
    reduxLinkArray[2] = {
      ...reduxLinkArray[2],
      link: props?.socialLinks?.facebook || "",
      logo: props?.socialLinks?.facebook
        ? env.facebook_social
        : env.facebook_social_disble,
    };
    reduxLinkArray[3] = {
      ...reduxLinkArray[3],
      link: props?.socialLinks?.twitter || "",
      logo: props?.socialLinks?.twitter
        ? env.twitter_social
        : env.twitter_social_disble,
    };
    reduxLinkArray[4] = {
      ...reduxLinkArray[4],
      link: props?.socialLinks?.tiktok || "",
      logo: props?.socialLinks?.tiktok
        ? env.onlyfans_social
        : env.onlyfans_social_disble,
    };
    reduxLinkArray[5] = {
      ...reduxLinkArray[5],
      link: props?.socialLinks?.snapchat || "",
      logo: props?.socialLinks?.snapchat
        ? env.snapchat_social
        : env.snapchat_social_disble,
    };
    setSocialMediaLinkArray([...reduxLinkArray]);
  };

  const submitLinks = () => {
    let linkObj = {};
    socialMediaLinkArray.map((link, index) => {
      if (link.link != "") {
        linkObj[link.label] = link.link;
      }
    });

    let socialMediaLink = { ...linkObj };
    props?.handelSocialLinksBundle(socialMediaLink);
    props.onClose();
  };

  const validatLink = (
    value,
    fieldLabel,
    linkLabel,
    index,
    logo,
    disableLogo,
    activweLogo
  ) => {
    let linkValue = value || "";
    const LinkRegex =
      /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

    if (linkValue.length == 0) {
      const test = [...socialMediaLinkArray];
      let obj = {
        fieldLabel: fieldLabel,
        link: linkValue,
        error: false,
        label: linkLabel,
        logo: disableLogo,
        activweLogo: activweLogo,
        disableLogo: disableLogo,
      };
      test.splice(index, 1, obj);
      setSocialMediaLinkArray([...test]);
      return;
    }
    if (LinkRegex.test(linkValue)) {
      const test = [...socialMediaLinkArray];
      let obj = {
        fieldLabel: fieldLabel,
        link: linkValue,
        error: false,
        label: linkLabel,
        logo: activweLogo,
        activweLogo: activweLogo,
        disableLogo: disableLogo,
      };
      test.splice(index, 1, obj);
      setSocialMediaLinkArray([...test]);
    } else {
      const test = [...socialMediaLinkArray];
      let obj = {
        fieldLabel: fieldLabel,
        link: linkValue,
        error: true,
        label: linkLabel,
        logo: disableLogo,
        activweLogo: activweLogo,
        disableLogo: disableLogo,
      };
      test.splice(index, 1, obj);
      setSocialMediaLinkArray([...test]);
    }
  };

  const socialLinksValidation = (
    value,
    fieldLabel,
    linkLabel,
    index,
    logo,
    disableLogo,
    activweLogo
  ) => {
    switch (fieldLabel) {
      case lang.instaSocialLink:
        validatLink(
          value,
          fieldLabel,
          linkLabel,
          index,
          logo,
          disableLogo,
          activweLogo
        );
        break;
      case lang.youtubeSocialLink:
        validatLink(
          value,
          fieldLabel,
          linkLabel,
          index,
          logo,
          disableLogo,
          activweLogo
        );
        break;
      case lang.facebookSocialLink:
        validatLink(
          value,
          fieldLabel,
          linkLabel,
          index,
          logo,
          disableLogo,
          activweLogo
        );
        break;
      case lang.twitterSocialLink:
        validatLink(
          value,
          fieldLabel,
          linkLabel,
          index,
          logo,
          disableLogo,
          activweLogo
        );
        break;
      case lang.onlyfansSocialLink:
        validatLink(
          value,
          fieldLabel,
          linkLabel,
          index,
          logo,
          disableLogo,
          activweLogo
        );
        break;
      case lang.snapchatSocialLink:
        validatLink(
          value,
          fieldLabel,
          linkLabel,
          index,
          logo,
          disableLogo,
          activweLogo
        );
        break;
      default:
        break;
    }
  };

  const isLinkValidate = () => {
    const Index = socialMediaLinkArray.findIndex((link) => link.error);
    return Index > -1;
  };

  return (
    <Wrapper>
      {mobileView
        ? <>
          <div className="col-12">
            <EditProfileHeader
              back={props.onClose}
              title="Add Social Media Links"
            />
          </div>
          <div className="">
            <div>
              <div className="col-12 py-4">
                {socialMediaLinkArray &&
                  socialMediaLinkArray.length &&
                  socialMediaLinkArray.map((link, index) => (
                    <div key={index}>
                      {/* <p className="fntSz12 my-2 font-weight-700">
                                    {link.fieldLabel}
                                </p> */}
                      <div className="position-relative">
                        <InputField
                          onChange={(e) =>
                            socialLinksValidation(
                              e.target.value,
                              link.fieldLabel,
                              link.label,
                              index,
                              link.logo,
                              link.disableLogo,
                              link.activweLogo
                            )
                          }
                          style={{
                            paddingRight: "36px",
                            backgroundColor: theme.sectionBackground,
                            color: "var(--l_app_text)",
                          }}
                          fclassname={
                            mobileView
                              ? "pl-5"
                              : "dv__border_bottom_profile_input pl-5"
                          }
                          value={link.link}
                          placeholder={`Enter ${link?.label} link`}
                        />
                        <img
                          src={link.logo}
                          className="socialLogo"
                          height="45"
                          width="45"
                        />
                        {link.link && (
                          <div
                            className="crossLogo cursorPtr"
                            onClick={() =>
                              socialLinksValidation(
                                "",
                                link.fieldLabel,
                                link.label,
                                index,
                                link.logo,
                                link.disableLogo,
                                link.activweLogo
                              )
                            }
                          >
                            <ClearIcon className="Mui__icon" />
                          </div>
                        )}
                      </div>
                      {/* {link.error && <div style={{ color: theme?.appColor }}>Enter valid link</div>} */}
                    </div>
                  ))}
              </div>
            </div>
            <div className="col-12 mobileBtn">
              <Button
                type="submit"
                cssStyles={theme.blueButton}
                fclassname="my-3 mobileBtn"
                onClick={() => submitLinks()}
                isDisabled={isLinkValidate()}
              >
                {lang.save || "Save"}
              </Button>
            </div>
          </div>
        </>
        : <>
          <button
            type="button"
            className="close dv__modal_close"
            onClick={() => props.onClose()}
          >
            {lang.btnX}
          </button>
          <div className="py-3">
            <h3 className="text-center pt-3">{lang.addSocialLinks}</h3>
            <div>
              <div className="col-12 py-2">
                {socialMediaLinkArray &&
                  socialMediaLinkArray.length &&
                  socialMediaLinkArray.map((link, index) => (
                    <div key={index}>
                      <div className="position-relative">
                        <InputField
                          onChange={(e) =>
                            socialLinksValidation(
                              e.target.value,
                              link.fieldLabel,
                              link.label,
                              index,
                              link.logo,
                              link.disableLogo,
                              link.activweLogo
                            )
                          }
                          style={{
                            paddingRight: "36px",
                            color: "var(--l_app_text)",
                            background: theme.border,
                            paddingLeft: "47px"
                          }}
                          classname={mobileView ? "pl-5" : "pl-5 dv__border_bottom_profile_input"}
                          placeholder={`${link.label
                            ? `Enter ${link.label} link`
                            : "Enter Url"
                            }`}
                          value={link.link}
                        />
                        <img src={link.logo} className="socialLogo" />
                        {link.link && (
                          <div
                            className="crossLogo cursorPtr"
                            onClick={() =>
                              socialLinksValidation(
                                "",
                                link.fieldLabel,
                                link.label,
                                index,
                                link.logo,
                                link.disableLogo,
                                link.activweLogo
                              )
                            }
                          >
                            <ClearIcon className="Mui__icon" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="px-3">
              <Button
                type="submit"
                cssStyles={theme.blueButton}
                fclassname="my-3"
                onClick={() => submitLinks()}
                isDisabled={isLinkValidate()}
              >
                {lang.save}
              </Button>
            </div>
          </div>
        </>
      }

      <style jsx>{`
        .socialLogo {
          position: absolute;
          top: -1px;
          left: 8px;
          height: 48px;
          width: 33px;
        }
        .mobileBtn {
          position: fixed !important;
          bottom: 0 !important;
          z-index: 999 !important;
          border: none !important;
        }
        .crossLogo {
          position: absolute;
          top: 9px;
          right: 0px;
          height: 27px;
          width: 34px;
          border-radius: 67px;
        }
        :global(.Mui__icon) {
          background: #696969 !important;
          color: #fff !important;
          border-radius: 50% !important;
          font-size: 20px !important;
          padding: 3px !important;
        }
      `}</style>
    </Wrapper>
  );
};

export default SocialMediaLinks;
