import React, { useEffect, useState } from "react";
import MarkatePlaceHeader from "../containers/markatePlaceHeader/markatePlaceHeader";
import DesktopFooter from "../containers/timeline/desktop_footer";
import TimelineHeader from "../containers/timeline/timeline-header";
import Wrapper from "../hoc/Wrapper";
import isMobile from "../hooks/isMobile";
import useLang from "../hooks/language";
import { useTheme } from "react-jss";
import {
  section1AboutLight,
  section1AboutDark,
  section2AboutLight,
  section2AboutDark,
  section3AboutLight,
  section3AboutDark,
  section4AboutLight,
  section4AboutDark,
  section5AboutLight,
  section5AboutDark,
  aboutSection1,
  aboutSection2,
  aboutSection3,
  aboutSection4,
  sectionEarth,
  sectionLive,
  sectionTrue,
  sectionFlash,
  live,
  section6AboutLight,
  section6AboutDark,
  sectionLiveTv,
} from "../lib/config";
import Img from "../components/ui/Img/Img";
import Icon from "../components/image/icon";
import { useRouter } from "next/router";

const AboutUs = (props) => {

  const [activeNavigationTab, setActiveNavigationTab] = useState("");
  const theme = useTheme();
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const router = useRouter();
  useEffect(()=>{
    router.push('/');
  },[])
  return (
    <Wrapper>
      {mobileView ? (
        <TimelineHeader
          setActiveState={(props) => {
            setActiveNavigationTab(props);
          }}
          scrollAndRedirect={async (e) => {
            let sc = await document.getElementById("top");
            sc.scrollIntoView({ behavior: "smooth" });
          }}
          {...props}
        />
      ) : (
        <MarkatePlaceHeader
          setActiveState={(props) => {
            setActiveNavigationTab(props);
          }}
          {...props}
        />
      )}
      <section className="container web_main_div background_color position-relative main-Section px-1">
        <div className="bottomLayer"></div>
        <div
          className={`container ${mobileView ? "" : "px-1"}`}
        >
          <div className={`${mobileView ? "row colm_reverse flex-column-reverse" : "row colm_reverse align-items-center"}`}>
            <div className="col-md-6 order-md-1 order-sm-2">
              <h3 className={`${mobileView ? "white fntSz25 bold pt-3" : "white fntSz35 bold pt-3"}`}>{lang.stayUptoDateHighlight}</h3>
            </div>
            <div className={`col-md-6 my_col order-md-2 px-1 ${mobileView ? "text-center" : ""} order-sm-1`}>
              <div>
                <Img
                  src={section1AboutLight}
                  width={12}
                  className="image-size-about mt-4"
                  alt="highlight section"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${mobileView ? "container main-Section px-1" : "container main-Section main-sec-web"}`}>
        <div>
          <p className={`work_text ${mobileView ? "mt-3 mb-0" : "mt-3 mb-0"}`}>{lang.howFanzlyWorks}</p>
        </div>
        <div className="container">
          <div className="row">
            <div className={`col-md-6 my-5 order-md-2 d-flex justify-content-end  ${mobileView ? "text-center" : ""} order-sm-1`}>
              <Img
                src={section2AboutLight}
                className="image-size"
                alt="aboutSection2"
              />
            </div>
            <div className="col-md-6 flex_center order-md-1 order-sm-2">
              <div>
                <div className={`d-flex align-items-center ${mobileView ? "pb-2" : ""}`}>
                  <Icon
                    icon={`${aboutSection1}#section1`}
                    size={20}
                    unit="px"
                    viewBox="00 0 24 24"
                    class="border_radius"
                  />
                  <h6 className={`dv_about_heading m-0 ${mobileView ? "pl-3" : "pl-1"}`}>{lang.oneToOneMsg}</h6>
                </div>
                <h1 className="fntSz22 bold">{lang.findRight}</h1>
                <p className="on-About-text">{lang.birthdayMileStone}</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 order-md-1 order-sm-2 mt-4">
              {theme.type == "light" ? (
                <Img
                  src={section3AboutLight}
                  className="image-size"
                  alt="aboutSection2"
                />
              ) : (
                <Img
                  src={section3AboutDark}
                  className="image-size"
                  alt="aboutSection2"
                />
              )}
            </div>
            <div className="col-md-6 flex_center mt-5 order-md-2 order-sm-1">
              <div className="content">
                <h6 className="dv_about_heading">
                  <div className={`d-flex align-items-center ${mobileView ? "pb-2" : ""}`}>
                    <Icon
                      icon={`${aboutSection2}#sectionTwo`}
                      size={20}
                      unit="px"
                      viewBox="0 0 24 24"
                      class="border_radius"
                    />
                    <h6 className={`dv_about_heading m-0 ${mobileView ? "pl-3" : "pl-1"}`}>
                      {lang.exclusiveContent}
                    </h6>
                  </div>
                </h6>
                <h1 className="fntSz22 bold">{lang.personalizedVideo}</h1>
                <p className="on-About-text">{lang.includeAll}</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 my-5 order-md-2  order-sm-1 d-flex justify-content-end">
              <Img
                src={section4AboutLight}
                className="image-size"
                alt="aboutSection2"
              />
            </div>
            <div className="col-md-6 flex_center order-md-1 order-sm-2">
              <div className="content">
                <h6 className="dv_about_heading">
                  <div className={`d-flex align-items-center ${mobileView ? "pb-2" : ""}`}>
                    <Icon
                      icon={`${aboutSection3}#sectionThree`}
                      size={20}
                      unit="px"
                      viewBox="0 0 24 24"
                      class="border_radius"
                    />
                    <h6 className={`dv_about_heading m-0 ${mobileView ? "pl-3" : "pl-1"}`}>{lang.searchForStar}</h6>
                  </div>
                </h6>
                <h1 className="fntSz22 bold">{lang.beTheFirstPerson}</h1>
                <p className="on-About-text">{lang.megicalMovments}</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 order-md-1 order-sm-2 mt-4">
              <Img
                src={section5AboutLight}
                className="image-size"
                alt="aboutSection2"
              />
            </div>
            <div className="col-md-6 flex_center mt-5 order-md-2 order-sm-1">
              <div className="content">
                <h6 className="dv_about_heading">
                  <div className={`d-flex align-items-center ${mobileView ? "pb-2" : ""}`}>
                    <Icon
                      icon={`${aboutSection4}#sectionFour`}
                      size={20}
                      unit="px"
                      viewBox="0 0 24 24"
                      class="border_radius"
                    />
                    <h6 className={`dv_about_heading m-0 ${mobileView ? "pl-3" : "pl-1"}`}>
                      {lang.startVideoCall}
                    </h6>
                  </div>
                </h6>
                <h1 className="fntSz22 bold">{lang.ExclusiveVideoCall}</h1>
                <p className="on-About-text">{lang.Findyourfavourite}</p>
              </div>
            </div>
          </div>
          <div className={`${mobileView ? "d-flex row flex-row-reverse margin_none mb-5" : "d-flex row flex-row-reverse margin_none mt-5 mb-5"}`}>
            <div className="col-md-6 my-5 order-md-1  order-sm-2 d-flex justify-content-end">
              <Img
                src={section6AboutLight}
                className="image-size"
                alt="aboutSection2"
              />
            </div>
            <div className="col-md-6 flex_center  order-md-2 order-sm-1" style={{ paddingBottom: mobileView ? "100px" : "" }}>
              <div className="content">
                <h6 className="dv_about_heading mb-4">{lang.fanClub}</h6>
                <h1 className="fntSz22 bold mb-4">{lang.exclusiveFanClub}</h1>
                <p className={`on-About-text ${mobileView ? "" : "mb-3"}`}>{lang.stayUptoDate}</p>
                <div className="list_style">
                  <li className={`listfont ${mobileView ? "pt-3" : "py-1"} d-flex aling-items-center`}>
                    <Icon
                      icon={`${sectionTrue}#sectionTrue`}
                      size={20}
                      unit="px"
                      viewBox="0 0 19.336 18.419"
                      class="border_radius"
                    />
                    <span className={`${mobileView ? "ml-2 insiderAccess" : "ml-2 pl-2"}`}>{lang.insiderAccess}</span>
                  </li>
                  <li className={`listfont ${mobileView ? "pt-3" : "py-1"} d-flex aling-items-center`}>
                    <Icon
                      icon={`${sectionFlash}#sectionFlash`}
                      size={20}
                      unit="px"
                      viewBox="0 0 18.624 25.208"
                      className="border_radius mr-3"
                    />
                    <span className={`${mobileView ? "ml-3" : "ml-2 pl-2"}`}>{lang.exclusiveUpdates}</span>
                  </li>
                  <li className="listfont">
                    <div className="divflex">
                      <div className={`d-flex ${mobileView ? "pt-3" : "py-1"} aling-items-center`}>
                        <Icon
                          icon={`${sectionLiveTv}#sectionLivetv`}
                          size={20}
                          unit="px"
                          viewBox="0 0 22.074 20.067"
                          class="border_radius"
                        />
                        <span className={`${mobileView ? "ml-3 footerpadding" : "ml-3 footerpadding"}`}>
                          {lang.firstPersonAbout}
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="listfont">
                    <div className="divflex ">
                      <div className={`d-flex ${mobileView ? "pt-3" : "py-1"} aling-items-center`}>
                        <Icon
                          icon={`${sectionEarth}#sectionEarth`}
                          size={20}
                          unit="px"
                          viewBox="0 0 20.799 20.799"
                          class="border_radius"
                        />
                        <span className={`${mobileView ? "ml-3 footerpadding pt-0" : "ml-3 footerpadding"}`}>{lang.shareAboutText}</span>
                      </div>
                    </div>
                  </li>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!mobileView && <DesktopFooter />}
      <style jsx>{`
        .insiderAccess{
          padding-left:12px;
        }
        .footerpadding{
          padding:5px;
        }
        .main-sec-web{
          padding:0 10%;
        }
        .fontsize {
          font-size: 2.2rem;
          font-weight: bold;
          color: #ffffff;
          // width: 30.5rem;
          height: 17.4375rem;
          margin-top: 8%;
        }
        .web_main_div {
          padding-top: ${mobileView ? "2px" : "136px"};
          padding-bottom: ${mobileView ? "0" : "36px"};
          height:${mobileView ? '' : "85vh"};
        }
        .background_color {
          background: linear-gradient(
            103deg,
            rgb(164, 15, 197) 5%,
            rgba(103, 48, 236, 1) 93%
          );
        }
        .bottomLayer{
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          background:linear-gradient( 0deg,#000000 2%,rgb(48 236 139 / 0%) 93% );
        }
        .work_text {
          display: flex;
          justify-content: center;
          color: ${theme.text};
          background-color: ${theme?.aboutPageBg};
          font-weight: bold;
          font-size: 1.5rem;
          padding: 3% 0%;
        }
        .main-Section {
          max-width: 100%;
          overflow: hidden;
          background-color: ${theme?.aboutPageBg};
          color: ${theme.text};
        }
        .content {
          display: inline-block;
          flex-direction: column;
          align-items: flex-start;
          max-width: 100%;
        }
        .wrap {
          text-align: start;
        }
        .center {
          justify-content: center;
        }
        .on-About-text {
          font-size: 0.875rem;
          opacity: 75%;
        }
        .dv_about_heading {
          color: ${theme?.aboutPageLabelColor};
          text-align: start;
        }
        :global(.border_radius) {
          width: 3.6%;
          margin-right: 1%;
        }
        :global(.image-size) {
          width: ${mobileView ? "97%" : "70%"};
          height: ${mobileView ? "100%" : "100%"};
        }
        :global(.image-size-about) {
          width: ${mobileView ? "97%" : "100%"};
          height: ${mobileView ? "100%" : "45vh"};
        }
        .dflex_footer {
          display: flex;
          align-items: flex-start;
          gap: 1.4rem;
          flex-direction: column;
        }
        .dflex_icon {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 7rem;
          padding-right: 0%;
        }
        .border_icons {
          background-color: white;
          border-radius: 50%;
          width: 1.6rem;
          height: 1.6rem;
          margin: 0 2%;
        }
        .img_flex {
          display: flex;
          justify-content: end;
        }
        .footer {
          background-color: black;
          color: white;
          overflow: hidden;
        }
        .footerMainDiv {
          display: flex;
          width: 100%;
          padding: 0 4%;
        }
        .stylenone {
          list-style: none;
        }
        .padding {
          padding-right: 29%;
          font-size: 1.1rem;
        }
        .marginfooter {
          padding: 3% 0%;
          background-color: #101010;
        }
        .list_style {
          list-style: none;
        }
        .listfont {
          font-size: 0.75rem;
        }
        :global(.border_radius1) {
          margin-right: 1%;
        }
        @media (max-width: 500px) {
          .fontsize {
            margin-top: -01em;
            font-size: 1.375rem;
            font-weight: bold;
            width: 23.687rem;
            height: 7.375rem;
          }
        }
        @media (max-width: 400px) {
          .list_style {
            list-style: none;
          }
        }
        @media (max-width: 400px) {
          .hide {
            display: none;
          }
        }
        @media (max-width: 400px) {
          .border_radius {
            width: 6%;
            margin-right: 1%;
          }
        }
        @media (max-width: 400px) {
          .colm_reverse {
            flex-direction: column-reverse;
          }
        }
        @media (max-width: 400px) {
          .image-size {
            width: 100%;
            height: auto;
          }
        }
        .flex_center {
          display: flex;
          align-items: center;
        }
        @media (max-width: 400px) {
          .fontsize {
            margin-top: -01em;
            font-size: 1.375rem;
            font-weight: bold;
            width: 18.687rem;
            height: 7.375rem;
          }
        }
        .divflex {
          display: flex;
        }
      `}</style>
    </Wrapper>
  );
};

export default AboutUs;