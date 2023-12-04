import { Button } from "@material-ui/core";
import Image from "next/image";
import React from "react";
import { useTheme } from "react-jss";
import DesktopFooter from "../containers/timeline/desktop_footer";
import Header from "../components/landingHeader/Header";

function WhoWeAre(props) {
  const theme = useTheme();

  return (
    <div
      style={{
        fontFamily: "Roboto",
        letterSpacing: "0.2499px",
        lineHeight: "20px",
      }}
    >
      <Header {...props}/>
      <div style={{ overflow: "hidden" }}>
        <div className="landing-bgimg">
          <div className="w-100 h-100 d-flex justify-content-center align-items-center text-center flex-column">
            <h1 className="pb-4 d-none d-sm-inline">
              We Are More Than Just a Content
              <br />
              Website We Are People Helping People
            </h1>
            <h1 className="mt-4 pt-1 d-inline d-sm-none">
              We Are More Than Just a <br /> Content Website <br /> We Are
              People Helping People
            </h1>
          </div>
        </div>
        <br />
        <br />
        <br />
        <div className="screen_cover_size">
          <div className="row mx-0 ">
            <div className="col-12 col-lg-6 order-lg-2 d-flex justify-content-center mb-4 mb-lg-0">
              <Image
                src="/juicyapp/who-ourprofit.png"
                width="540"
                height="336"
              />
            </div>
            <div className="col-12 col-lg-6 order-lg-1 agency_want_life">
              <h3>Giving Back 1% Of Our Profits</h3>
              <div style={{ color: "#89898E" }}>
                <p>
                  Supporting charities is a major part of Bombshell Ventures and
                  something we wish to grow. Our focus is to help as many people
                  as we can by donating 1% of our profits back to worldwide
                  charities that help women. Whether it is shelters, domestic
                  violence, or human trafficking charities, we want to provide
                  all the support we can.
                </p>
                <p>
                  If you have a charity that could use the help of Bombshell
                  Ventures please contact us at support@bombshell.network
                </p>
              </div>
            </div>
          </div>
          <div className="row mx-0 mt-sm-5 pt-lg-5">
            <div className="col-12 col-lg-6 order-lg-1 d-flex justify-content-center my-4 my-lg-0">
              <Image
                src="/juicyapp/who-mental-health.png"
                width="540"
                height="336"
              />
            </div>
            <div className="col-12 col-lg-6 order-md-2 agency_want_life">
              <h3>We Are Here For Mental Health</h3>
              <div style={{ color: "#89898E" }}>
                <p>
                  The adult industry can be stressful over and above the stress
                  of life in general. We know this and provide free mental
                  health counseling sessions for all creators on the platform.
                  With a click of a button, our creators have the ability to
                  book a virtual appointment with one of our partner mental
                  health organizations. Sometimes it is easier to talk to others
                  than people close to you and we want to make it easy for that
                  to happen.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="position-relative ">
          <div
            style={{
              background:
                "linear-gradient(222.19deg, #9063FC -10.02%, #121212 40.55%)",
              transform: "rotate(-45deg)",
              height: "80vw",
              width: "190vw",
              position: "absolute",
              // top: "14vw",
              left: "-5vw",
              zIndex: "-1",
            }}
          ></div>
          <div
            style={{
              background:
                "linear-gradient(112.29deg, rgba(144, 99, 253, 0.1) 15.06%, rgba(24, 21, 27, 0) 49.99%)",
              transform: "rotate(45deg)",
              height: "80vw",
              width: "190vw",
              position: "absolute",
              // top: "0px",
              left: "-80vw",
              zIndex: "-1",
            }}
          ></div>
          <div className="screen_cover_size">
            <div className="row mx-0 mt-sm-5 pt-lg-5">
              <div className="col-12 col-lg-6 order-lg-2 d-flex justify-content-center my-4 my-lg-0">
                <Image
                  src="/juicyapp/who-grow-education.png"
                  width="540"
                  height="336"
                />
              </div>
              <div className="col-12 col-lg-6 order-lg-1 agency_want_life">
                <h3>Grow Your Education</h3>
                <div style={{ color: "#89898E" }}>
                  <p>
                    Our school scholarship program will be open to apply for in
                    the 2023 fall school season for any creators on the platform
                    to apply for themselves or their children. We will be
                    offering multiple scholarships of multiple amounts to
                    support further post-secondary education in any country
                    around the world.
                  </p>
                </div>
              </div>
            </div>
            <div className="row mx-0 mt-sm-5 pt-lg-5">
              <div className="col-12 col-lg-6 order-lg-1 d-flex justify-content-center my-4 my-lg-0">
                <Image
                  src="/juicyapp/who-build-empire.png"
                  width="540"
                  height="336"
                />
              </div>
              <div className="col-12 col-lg-6 order-lg-2 agency_want_life">
                <h3>Build Your Empire</h3>
                <div style={{ color: "#89898E" }}>
                  <p>
                    We love entrepreneurs. Our business has been built by them
                    and know that a lot of our creators are entrepreneurs too.
                    We want to help those creators build a brand for themselves
                    outside of Bombshell and help build their business empire. Our
                    business grants program will take applications from creators
                    starting in the spring of 2023 to receive one of our many
                    grants and mentoring packages to help get the push and
                    guidance they need to grow their new business.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="agency_bottom_bgimg">
          <div className="w-100 h-100 d-flex justify-content-center align-items-center text-center flex-column">
            <h1 className="mt-5 pt-5">Looking To Become a Creator?</h1>
            <Button
              type="submit"
              className="px-3 text-white text-capitalize"
              style={{
                background: "var(--l_base)",
                borderRadius: "24px",
                letterSpacing: "0.4px",
              }}
              onClick={() => window.open('/signup-as-user', '_self')}
            >
              Join Now
            </Button>
          </div>
        </div>
        <div>
          <DesktopFooter />
        </div>
      </div>

      <style>{`
        .landing-bgimg{
          background: url(/juicyapp/whoweare-banner-bg.webp);
          height: 50vw;
          width: 100vw;
          background-size: contain;
          background-repeat: no-repeat;
          z-index: -1;
        }
        .landing-bgimg h1{
          font-size: 3.5vw;
          line-height: 62px;
          font-weight: 600;
        }
        .landing-bgimg div{
          font-size: 1.7vw;
          color: #DDDDDD;
          line-height: 32px;
        }
        .agency_want_life div p{
            font-size: 14.8px;
          }
        .agency_bottom_bgimg{
          background: url(/juicyapp/who-creator-bottom.webp);
          font-family: 'Roboto';
          height: 30vw;
          width: 100%;
          background-size: contain;
          background-repeat: no-repeat;
          z-index: -1;
          margin-top: 6rem;
        }
        .agency_bottom_bgimg h1{
          font-size: 3.5vw;
          line-height: 60px;
          font-weight: 500;
        }
        .screen_cover_size{
          font-family: Roboto;
          width: 67%;
          margin: auto;
        }
        @media screen and (max-width: 1180px) {
          .screen_cover_size{
            width: 80%;
          }
        }
        @media screen and (max-width: 991px) {
          .landing-bgimg h1{
            font-size: 3vw !important;
            line-height: 4.5vw !important;
          }
          .landing-bgimg h5{
            font-size: 3vw !important;
          }
          .screen_cover_size h2{
            font-size: 5.4vw;
          }
          .agency_bottom_bgimg{
            height: 35vw;
            width: 100vw;
            background-size: 100vw 35vw;
          }
          .agency_bottom_bgimg h1{
            font-size: 4vw !important;
            line-height: 6vw !important;
          }
        }
        @media screen and (max-width: 767px) {
          .screen_cover_size{
            width: 85%;
          }
        }
        @media screen and (max-width: 576px) {
          .landing-bgimg{
            background: url(/juicyapp/whoweare-mobile-banner.png);
            height: 120vw;
            width: 99.2vw;
            background-size: contain;
            background-repeat: no-repeat;
            z-index: -1;
            padding-bottom: 9vw;
          }
          .screen_cover_size{
            width: 95%;
          }
          .top_signup_btn{
            width: 200px !important;
          }
          .top_signup_btn span{
            font-size: 11px !important;
          }
          .bottom_bookcall_btn{
            width: 200px !important;
          }
          .bottom_bookcall_btn span{
            font-size: 11px !important;
          }
          .agency_bottom_bgimg{
            background: url(/juicyapp/whoweare-mobile-bottom.svg);
            height: 60vw;
            width: 100vw;
            background-size: contain;
            background-repeat: no-repeat;
            z-index: -1;
            margin-top: 4rem;
          }
          .agency_bottom_bgimg h1{
            font-size: 5.5vw !important;
          }
          .landing-bgimg div div{
            font-size: 4vw;
          }
          .landing-bgimg div h1{
            font-size: 6vw !important;
            line-height: 32px !important;
          }
          .agency_want_life h2{
            font-size: 5vw !important;
          }
          .agency_want_life div p{
            font-size: 3.15vw;
          }
          .agency_join_juicy div div{
            font-size: 3.2vw !important;
          }
          .agency_join_juicy h3{
            font-size: 5.2vw !important;
          }
          .agency_join_juicy div{
            font-size: 3.3vw !important;
          }
        }
      `}</style>
    </div>
  );
}

export default WhoWeAre;
