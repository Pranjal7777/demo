import { Button } from "@material-ui/core";
import React from "react";
import Icon from "../components/image/icon";
import InputBox from "../components/input-box/input-box";
import DesktopFooter from "../containers/timeline/desktop_footer";
import {
  PRIVACY_LOGO,
  SUPPORT_CREATOR_LOGO,
  SUPPORT_FANS_LOGO,
  USER_LOGO,
} from "../lib/config";
import Header from "../components/landingHeader/Header";
import Route from "next/router";

function Support(props) {

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
          <div className="w-100 h-100 d-flex justify-content-center align-items-center text-center flex-column pt-5">
            <h1 className="mt-3 mt-sm-5 pt-sm-5 mb-0">
              Problem getting started?
            </h1>
            <div className=" my-sm-3 mb-sm-4">Find from our discussions</div>
            <div
              className="d-flex align-items-center justify-content-between rounded-pill mt-4 support_search_div"
              style={{
                background: "#333333",
                width: "33.33%",
                padding: "0.4rem",
                minWidth: "18rem",
              }}
            >
              <InputBox
                type="text"
                placeholder="Search here..."
                fclassname="form-control h-100"
                cssStyles={{
                  background: "#333333",
                  fontSize: "0.9rem",
                  border: "none",
                  outline: "none",
                  color: "#ffffff",
                  fontFamily: "Roboto",
                }}
              />
              <Button
                type="submit"
                className="px-4 text-white text-capitalize"
                style={{
                  background: "var(--l_base)",
                  borderRadius: "24px",
                  letterSpacing: "0.4px",
                }}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
        <div className="screen_cover_size">
          <div className="row mx-0 mb-sm-5 pb-sm-5">
            <div className="col-6 mx-auto col-md-5 col-lg-3 px-1">
              <div className="card text-center">
                <Icon
                  icon={`${PRIVACY_LOGO}#privacy_icon`}
                  viewBox="0 0 92 92"
                  width="72"
                  height="72"
                />
                <div class="card-body px-0">
                  <h5 class="card-title">Privacy & Terms</h5>
                  {/* <p class="card-text">
                    Collaboration can make our teams stronger, and our
                    individual designs better.
                  </p> */}
                </div>
              </div>
            </div>
            <div className="col-6 mx-auto col-md-5 col-lg-3 px-1">
              <div className="card text-center">
                <Icon
                  icon={`${SUPPORT_CREATOR_LOGO}#support_creator`}
                  viewBox="0 0 92 92"
                  width="72"
                  height="72"
                />
                <div class="card-body px-0">
                  <h5 class="card-title">For Creators</h5>
                </div>
              </div>
            </div>
            <div className="col-6 mx-auto col-md-5 col-lg-3 px-1">
              <div className="card text-center">
                <Icon
                  icon={`${SUPPORT_FANS_LOGO}#support_fans`}
                  viewBox="0 0 92 92"
                  width="72"
                  height="72"
                />
                <div class="card-body px-0">
                  <h5 class="card-title">For Fans</h5>
                </div>
              </div>
            </div>
            <div className="col-6 mx-auto col-md-5 col-lg-3 px-1">
              <div className="card text-center">
                <Icon
                  icon={`${USER_LOGO}#user_icon`}
                  viewBox="0 0 92 92"
                  width="72"
                  height="72"
                />
                <div class="card-body px-0">
                  <h5 class="card-title">General</h5>
                </div>
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
          background: url(/juicyapp/support-top-bgimg.png);
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
          input::placeholder{
            color: #FFFFFF !important;
          }
        .screen_cover_size{
          fontFamily: "Roboto";
          width: 87%;
          margin: auto;
        }
        .card{
          background: linear-gradient(rgba(53, 53, 53, 0) 0%, #1b1b1b 18%,  #1b1b1b 0%, rgb(53, 53, 53, 0%) 89.77%);
          border: none;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.8rem 1.5rem;
          margin: 1rem 0.3rem;
        }
        .card-title{
          line-height: 28px;
          font-size: 1.28rem;
        }
        .card-text{
          color: #89898E;
          font-size: 1.02vw;
        }
        @media screen and (max-width: 991px) {
          .landing-bgimg h5{
            font-size: 3vw !important;
          }
          .screen_cover_size h5{
            font-size: 5vw;
          }
        }
        @media screen and (max-width: 767px) {
        }
        @media screen and (max-width: 576px) {
          .landing-bgimg{
            background: url(/juicyapp/support-mobile-banner.png);
            height: 120vw;
            width: 100vw;
            background-size: contain;
            background-repeat: no-repeat;
            z-index: -1;
          }
          .support_search_div{
            width: 90% !important;
          }
          .landing-bgimg h1{
            font-size: 5vw;
          }
          .landing-bgimg div{
            font-size: 3vw;
          }
          .card{
            padding: 2rem 1.5rem;
          }
          .screen_cover_size{
            width: 100%;
          }
          .screen_cover_size h5{
            font-size: 4vw;
          }
          .screen_cover_size svg{
            width: 48px !important;
            height: 48px !important;
          }
          
        }
      `}</style>
    </div>
  );
}


// Support.getInitialProps = async ({ Component, ctx }) => {
//   const { query = {}, req, res } = ctx;

//   if (req) {
//     res.writeHead(302, { Location: `https://help.juicy.network/` });
//     res.end();
//   }
//   if (!req) {
//     Route.replace("https://help.juicy.network/");
//   }

//   return { query: query };
// };

export default Support;
