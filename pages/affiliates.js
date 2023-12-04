import { Button } from "@material-ui/core";
import Image from "next/image";
import React from "react";
import DesktopFooter from "../containers/timeline/desktop_footer";
import Header from "../components/landingHeader/Header";

function Affiliates(props) {

  return (
    <div style={{ fontFamily: "Roboto", letterSpacing: "0.2499px" }}>
      <Header {...props}/>
      <div style={{ overflowX: "hidden" }}>
        <div className="landing-bgimg">
          <div className="w-100 h-100 d-flex justify-content-end justify-content-sm-center align-items-center text-center flex-column">
            <h1 className="mt-5 d-none d-sm-block">
              Join The Highest Paying <br />
              Affiliate Program of The Year
            </h1>
            <h1 className="mt-5 d-sm-none d-block">
              Join the highest paying affiliate
              <br />
              program of the year.
            </h1>
            <div className="my-2 my-md-4">
              Earn a Passive Income Every Month
            </div>
            <Button
              className="text-capitalize px-3"
              style={{
                background: "var(--l_base)",
                borderRadius: "24px",
                letterSpacing: "0.4px",
                color: '#ffffff'
              }}
              onClick={() => window.open('/signup-as-user', '_self')}
            >
              Sign Up Now
            </Button>
          </div>
        </div>
        <br />
        <br />
        <br />
        <div className="screen_cover_size my-5">
          <div className="row mx-0 align-items-center">
            <div className="col-12 col-md-6 order-md-2 d-sm-flex justify-content-center mb-5 mb-md-0 pl-5 d-none">
              <Image
                src="/juicyapp/affiliate-marketing.png"
                width={500}
                height={227}
              />
            </div>
            <div className="col-12 col-md-5 order-md-2 d-flex justify-content-center mb-5 mb-md-0 d-sm-none">
              <Image
                src="/juicyapp/affiliate-marketing.png"
                width={242}
                height={110}
              />
            </div>
            <div className="col-12 col-md-6 pr-0 order-md-1 affiliate_marketing">
              <h3>Affiliate Marketing</h3>
              <div style={{ color: "#89898E" }}>
                The Bombshell affiliate program has been designed for marketers by
                marketers to offer the most lucrative payouts and the best
                passive income of any affiliate program this year!
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(18, 18, 18, 0.2) 0%, rgba(144, 99, 253, 0.2) 43.23%, rgba(144, 99, 253, 0.2) 65.1%, rgba(18, 18, 18, 0.2) 99.48%)",
          }}
        >
          <div className="screen_cover_size mt-0 mt-sm-5 pt-0 pt-sm-5">
            <h3 className="text-center paid_sources">
              Get Paid From 2 Different Sources From One Link
            </h3>
            <br />
            <br />
            <div className="row mx-0 align-items-center">
              <div className="col-12 col-md-5 order-md-2 d-sm-flex justify-content-center mb-5 mb-md-0 d-none">
                <Image
                  src="/juicyapp/refer-creator.png"
                  width="300"
                  height="180"
                />
              </div>
              <div className="col-12 col-md-5 order-md-2 d-flex justify-content-center mb-5 mb-md-0 d-sm-none">
                <Image
                  src="/juicyapp/refer-creator.png"
                  width="198"
                  height="116"
                />
              </div>
              <div className="col-12 col-md-7 order-md-1 pr-sm-5 affiliate_marketing">
                <h3>Refer a Creator</h3>
                <div style={{ color: "#89898E" }}>
                  Market your link to creators and have them signup to earn 7.5%
                  of their revenue for the first 12 months they are on the
                  platform with NO CAPS on how much you can earn!
                </div>
              </div>
            </div>
            <br />
            <br />
            <div className="row mx-0 align-items-center">
              <div className="col-12 col-md-5 d-sm-flex justify-content-center mb-5 mb-md-0 pr-5 d-none">
                <Image src="/juicyapp/refer-fan.png" width="300" height="180" />
              </div>
              <div className="col-12 col-md-5 d-flex justify-content-center mb-5 mb-md-0 pr-5 d-sm-none">
                <Image src="/juicyapp/refer-fan.png" width="198" height="116" />
              </div>
              <div className="col-12 col-md-7 pl-sm-5 affiliate_marketing">
                <h3>Refer a Fan</h3>
                <div style={{ color: "#89898E" }}>
                  Market your link to creators and have them signup to earn 7.5%
                  of their revenue for the first 12 months they are on the
                  platform with NO CAPS on how much you can earn!
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className="text-center screen_cover_size mt-2 mt-sm-5 joi_juicy_agency">
          <h3 className="my-4">Why Join The Bombshell Affiliate Program?</h3>
          <div className="row mx-1 mx-sm-3 mt-5">
            <div className="juicy_agency col-12 col-sm-6">
              <div>Cookies Stored For 60 Days</div>
            </div>
            <div className="juicy_agency col-12 col-sm-6">
              <div>Low Payout Threshold of $20</div>
            </div>
            <div className="juicy_agency col-12 col-sm-6">
              <div>Bank Deposits Made Worldwide</div>
            </div>
            <div className="juicy_agency col-12 col-sm-6">
              <div>Instant Payout Processing On Request</div>
            </div>
            <div className="juicy_agency col-12 col-sm-6">
              <div>No Caps On Earnings</div>
            </div>
            <div className="juicy_agency col-12 col-sm-6">
              <div>Loads Of Support Offered</div>
            </div>
          </div>
        </div>
        <div className="affiliate_bottom_bgimg">
          <div className="affiliate_bottom_section m-auto h-100">
            <div className="row mx-0 align-items-center h-100">
              <div className="col-12 col-md-6 pr-lg-5">
                <h1 className="mb-4 mb-sm-2">Getting Started Is Easy</h1>
                <div className="affiliates_bottom_signup_text">
                  Sign Up To The Bombshell Platform as a Fan To Receive Your
                  Affiliate Link
                </div>
              </div>
              <div className="col-12 col-md-6 pl-md-4 affiliate_bottom_sub_section2">
                <div
                  className="fntSz15 py-4 pl-lg-4"
                  style={{ letterSpacing: "0.39996px" }}
                >
                  The 7.5% will be paid out after the promo on all sign ups
                  during the period for the full 12 months. The percentage will
                  drop to 5% for any creators signed after the promo date
                </div>
                <Button
                  className="px-4 ml-lg-4 mb-lg-5 text-capitalize"
                  style={{
                    background: "var(--l_base)",
                    borderRadius: "24px",
                    letterSpacing: "0.4px",
                    color: '#ffffff',
                  }}
                  onClick={() => window.open('/signup-as-user', '_self')}
                >Sign Up Now</Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <DesktopFooter />
        </div>
      </div>

      <style>{`
        .landing-bgimg{
          background: url(/juicyapp/afiliates-bg.webp);
          height: 50vw;
          width: 99.2vw;
          background-size: contain;
          background-repeat: no-repeat;
          z-index: -1;
        }
        .landing-bgimg h1{
          font-size: 3.5vw;
          line-height: "62px";
          font-weight: "500";
        }
        .landing-bgimg div{
          font-size: 1.7vw;
          color: #DDDDDD;
          line-height: 32px;
        }
        .affiliate_marketing h3{
          font-size: 1.855rem;
        }
        .affiliate_marketing div{
          font-size: 0.91rem;
        }
        .affiliate_bottom_bgimg{
          background: url(/juicyapp/affiliate-bottom-bg.webp);
          height: 30vw;
          width: 100vw;
          background-size: contain;
          background-repeat: no-repeat;
          z-index: -1;
          margin-top: 6rem;
        }
        .affiliate_bottom_section{
          width: 85%;
        }
        .screen_cover_size{
          font-family: "Roboto";
          width: 67%;
          margin: auto;
        }
        .juicy_agency{
          padding: 0px !important;
        }
        .juicy_agency div{
          background: linear-gradient(271.62deg, rgba(144, 99, 253, 0) -6.19%, rgba(144, 99, 253, 0.1) 100%);
          border-radius: 10px;
          padding: 22px;
          margin: 6px;
          font-size: 1.25vw;
          font-family: 'Noto Sans';
        }
        .affiliate_bottom_section h1{
          font-size: 3.45vw;
        }
        .affiliates_bottom_signup_text{
          font-size: 1.84vw;
          // letter-spacing: initial;
        }
        @media screen and (max-width: 1180px) {
          .screen_cover_size{
            width: 75%;
          }
        }
        @media screen and (max-width: 991px) {
          .landing-bgimg h5, .affiliate_bottom_bgimg h5{
            font-size: 3vw !important;
          }
          .screen_cover_size h2{
            font-size: 3.5vw
          }
          .screen_cover_size{
            margin-top: 0rem;
            width: 80%;
          }
          .affiliate_bottom_bgimg{
            height: 60vw;
            background-size: 125vw 60vw;
          }
          
        }
        @media screen and (max-width: 767px) {
          .screen_cover_size{
            width: 85%;
          }
          .juicy_agency div{
            font-size: 2vw
          }
          .affiliate_bottom_bgimg{
            height: 55vw;
            background-size: 100vw 55vw;
          }
          .affiliate_bottom_bgimg h1{
            font-size: 6vw !important;
            line-height: 6.5vw !important;
          }
          .affiliates_bottom_signup_text {
            font-size: 2.8vw ;
          }
        }
        @media screen and (max-width: 576px) {
          .landing-bgimg{
            background: url(/juicyapp/affiliates-mobile-banner.webp);
            height: 120vw;
            width: 99.2vw;
            background-size: contain;
            background-repeat: no-repeat;
            z-index: -1;
            padding-bottom: 9vw;
          }
          .landing-bgimg h1{
            font-size: 6.1vw;
          }
          .landing-bgimg div div{
            font-size: 4vw;
          }
          .screen_cover_size{
            width: 95%;
          }
          .top_signup_btn{
            width: 100px !important;
          }
          .top_signup_btn span{
            font-size: 11px !important;
          }
          .affiliate_bottom_bgimg{
            background: url(/juicyapp/affiliates-mobile-bottom.webp);
            height: 90vw;
            width: 100vw;
            background-size: contain;
            background-repeat: no-repeat;
            z-index: -1;
            margin-top: 10rem;
          }
          .affiliate_bottom_section{
            width: 90%;
          }
          .affiliate_bottom_sub_section2{
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 14px !important;
            line-height: 20px !important;
          }
          .affiliates_bottom_signup_text{
            font-size: 3.7vw !important;
          }
          .affiliate_bottom_sub_section2 div{
            font-size: 2.85vw !important;
            line-height: 20px !important;
          }
          .affiliate_marketing h3{
            font-size: 5vw;
          }
          .affiliate_marketing div{
            font-size: 3.2vw;
          }
          .paid_sources{
            font-size: 6vw;
          }
          .juicy_agency div{
            font-size: 3.4vw;
          }
          .joi_juicy_agency h3{
            font-size: 5.5vw;
          }
          .affiliate_bottom_bgimg{
            margin-top: 4rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Affiliates;
