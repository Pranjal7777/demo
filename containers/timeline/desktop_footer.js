import React from "react";
import Router from "next/router";
import Wrapper from "../../hoc/Wrapper";
import {
  JUICY_FACEBOOK,
  JUICY_INSTAGRAM,
  JUICY_LINKEDIN,
  JUICY_TWITTER,
  JUICY_YOUTUBE,
  JUICY_TIKTOK,
  JUICY_REDDIT,
  JUICY_HEADER_LOGO,
} from "../../lib/config";
import CopyrightIcon from "@material-ui/icons/Copyright";
import { useSelector } from "react-redux";
import useLang from "../../hooks/language";
import Image from "../../components/image/image";
import Icon from "../../components/image/icon";

const DesktopFooter = () => {
  const [lang] = useLang();
  const seoSettingData = useSelector((state) => state.seoSetting);
  const socialUrls = {
    facebook_url: seoSettingData?.facebook?.link,
    insta_url: seoSettingData?.instagram?.link,
    linkdin_url: seoSettingData?.linkedIn?.link,
    twitter_url: seoSettingData?.twitter?.link,
    youtube_url: seoSettingData?.youtube?.link,
    tiktok_url: seoSettingData?.tiktok?.link,
    reddit_url: seoSettingData?.reddit?.link,
  };
  const socialLogos = {
    facebook_logo: JUICY_FACEBOOK,
    insta_logo: JUICY_INSTAGRAM,
    linkdin_logo: JUICY_LINKEDIN,
    twitter_logo: JUICY_TWITTER,
    youtube_logo: JUICY_YOUTUBE,
    tiktok_logo: JUICY_TIKTOK,
    reddit_logo: JUICY_REDDIT,
  };
  const hrefUrlIcon = [
    { url: socialUrls.facebook_url, socialIcon: socialLogos.facebook_logo },
    { url: socialUrls.twitter_url, socialIcon: socialLogos.twitter_logo },
    { url: socialUrls.insta_url, socialIcon: socialLogos.insta_logo },
    // { url: socialUrls.linkdin_url, socialIcon: socialLogos.linkdin_logo },
    { url: socialUrls.youtube_url, socialIcon: socialLogos.youtube_logo },
    { url: socialUrls.tiktok_url, socialIcon: socialLogos.tiktok_logo },
    { url: socialUrls.reddit_url, socialIcon: socialLogos.reddit_logo },
  ];
  return (
    <Wrapper>
      <div
        className="px-0 container-fluid w-100 footer_main_section"
        style={{
          background: "#231E29",
          letterSpacing: "0.39996px",
          fontFamily: "Roboto",
          padding: '2rem 0px',
        }}
      >
        <div
          className="mainFooterDiv row m-auto justify-content-between justify-content-md-start  justify-content-lg-between"
          style={{ width: "82%", letterSpacing: '0.69999px' }}
        >
          <div className="col-12 col-md-4 d-flex flex-column pl-0 pl-md-1 pr-0 pr-lg-5 text-center text-sm-left">
            <div>
              <img
                src={`${JUICY_HEADER_LOGO}`}
                // viewBox="0 0 96 45"
                width="150"
                height="75"
              />
            </div>
            <div className="pr-0 pr-md-5 pt-3 footerTextCss">
              <p className="mb-3 mb-md-0 text-center text-sm-left" style={{ padding: '8px' }}>
                {lang.footerDesc}
              </p>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 d-flex flex-column text-center text-sm-left mb-4 mb-sm-0">
            <div className="font-weight-500 cursorPtr pt-4 follow_links">{lang.followLinks}</div>
            <div className="row mx-0">
              <div className="col-12 col-sm-6 pl-0">
                <div
                  className="anchorCss"
                >
                  <a href="/support">
                    {lang.support}
                  </a>
                </div>
                <div
                  className="anchorCss"
                >
                  <a href="/blog">
                    {lang.blog}
                  </a>
                </div>
                {/* <div
                  className="anchorCss"
                >
                  <a href="legal-content">
                    {lang.legal}
                  </a>
                </div> */}
                <div
                  className="anchorCss position-relative"
                >
                  <a href="dmca" target='_blank'>
                    {lang.dmca}
                  </a>
                </div>
                <div
                  className="anchorCss position-relative"
                >
                  <a href="usc2257" target='_blank'>
                    {lang.usc2257}
                  </a>
                </div>
              </div>
              <div className="col-12 col-sm-6 px-0 px-md-1">
                <div
                  className="anchorCss"
                >
                  <a href="privacy-policy" target='_blank'>
                    {lang.privacyAndPolicy}
                  </a>
                </div>
                <div
                  className="anchorCss"
                >
                  <a href="terms-and-conditions" target='_blank'>
                    {lang.termsCondition}
                  </a>
                </div>
                <div
                  className="anchorCss"
                >
                  <a href="contact-us" target='_blank'>
                    {lang.contactUs}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3 d-flex flex-column justify-content-between align-items-center align-items-sm-start px-0 pr-sm-0 pl-sm-4 fntSz11">
            <div className="d-flex flex-column justify-content-between follow_social">
              <div className="text-center text-sm-left font-weight-500 follow_links pt-4 pt-sm-0">{lang.followUs}</div>
              <div className="d-flex pt-3 align-items-center justify-content-center justify-content-sm-start">
                {hrefUrlIcon.map((urlIcon, ind) => {
                  return (
                    <div
                      key={ind}
                      className="col-2 cursorPtr px-0 footer_icons_section"
                    >
                      <a
                        className="anchorCss"
                        href={urlIcon.url}
                        target="_blank"
                      >
                        <Image
                          src={urlIcon.socialIcon}
                          className="cursorPtr socialIconCss"
                          alt="facebook_logo"
                        />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              className="d-flex font-weight-400 fntSz10 text-nowrap align-items-center"
              style={{ color: "#E1E1E1" }}
            >
              <span>
                <CopyrightIcon className="fntSz12" />
              </span>
              <span className="fntSz10">2023 Bombshell. All rights reserved</span>
            </div>
          </div>
        </div>
        <style jsx>{`
        .footer_main_section{
          font-size: 12px;
        }
        .follow_links{
          font-size: 18px;
        }
          .mainFooterDiv {
            // min-height: 190px;
            color: #e1e1e1;
          }
          .impLinks {
            padding-top: 5px;
            color: #e1e1e1 !important;
          }
          .anchorCss{
            text-decoration: none;
            color: #AAAAAA !important;
            padding-top: 9px;
          }
          .anchorCss a{
            text-decoration: none;
            color: #AAAAAA !important;
            cursor: pointer;
          }
          .footer_icons_section{
            max-width: 15%;
          }
          :global(.socialIconCss) {
            width: 45px;
            height: 38px;
          }
          .footerTextCss {
            color: #e1e1e1 !important;
            font-weight: 300;
            font-family: Roboto;
          }
          @media screen and (max-width: 576px) {
            .mainFooterDiv {
              width: 90% !important;
            }
            :global(.socialIconCss) {
              width: 60px;
              height: 50px;
            }
            .footerTextCss{
              font-size: 12px;
            }
            .footer_main_section{
              font-size: 14px;
              min-height: calc(var(--vhCustom, 1vh) * 100 - 68px);
            }
            .follow_links{
              font-size: 20px;
            }
            .follow_social{
              border-bottom: 1.5px solid #3B3344;
              padding-bottom: 25px;
              margin-bottom: 25px;
              width: 100%;
              padding-right: 10px;
            }
          }
        `}</style>
      </div>
    </Wrapper>
  );
};

export default DesktopFooter;
