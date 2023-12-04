import React, { useEffect, useState } from "react";
import { useTheme } from "react-jss";
import CancelOutlined from "@material-ui/icons/CancelOutlined";
import useLang from "../../hooks/language";
import FigureImage from "../../components/image/figure-image";
import DVLoginForm from "./dv-login-form";
import * as config from "../../lib/config/logo";
import Slider from "react-slick";
import { goBack } from "../../lib/global";
import Icon from "../../components/image/icon";
import isMobile from "../../hooks/isMobile";
import Image from "../../components/image/image";
import { backArrow, backArrow_lightgrey } from "../../lib/config";
import LoginWithGoogle from "../../components/socialLogin/google";
import { SIGNUP_BANNER_CREATOR_1, SIGNUP_BANNER_CREATOR_2, SIGNUP_BANNER_CREATOR_3 } from "../../lib/config/logo";
import { handleContextMenu } from "../../lib/helper";


const DVLOGIN = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const [showSignupForm, setShowSignupForm] = useState(true);
  const [active, setActive] = useState(true);
  const [mobileView] = isMobile();

  const signImageList = [
    { id: 1, webImage: SIGNUP_BANNER_CREATOR_1 },
    { id: 2, webImage: SIGNUP_BANNER_CREATOR_2 },
    { id: 3, webImage: SIGNUP_BANNER_CREATOR_3 },
  ]

  const {
    toggleModelSignup,
    toggleUserSignup,
  } = props;

  useEffect(() => {
    props.reff &&
      props.reff({
        toggleModelSignup: toggleModelSignup,
        toggleUserSignup: toggleUserSignup,
      });
  }, []);

  const settings = {
    dots: true,
    className: "w-100 h-100",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false
  };


  return (
    <div className={`h-screen ${!mobileView && 'overflow-hidden'}`}>
      <div className={`col-12 row p-0 m-0 ${!mobileView && 'overflow-hidden vh-100'}`}>
        {!mobileView && <div className="p-0 vh-100 d-flex reg__left__sec">
          <Slider {...settings}>
            {signImageList?.map((img) => (
              <div className="cursorPtr w-100" key={img.id}>
                <img
                  src={img?.webImage}
                  alt="desktop login image"
                  className="w-100 wrap callout-none"
                  onContextMenu={handleContextMenu}
                  style={{ objectFit: "fill" }}
                />
              </div>
            ))}
          </Slider>
        </div>}

        <div className={`vh-100 reg__right__sec ${mobileView ? '' : 'd-flex justify-content-center'}`} style={{ background: `${theme.type == "light" ? '#FFF' : "#121212"}` }}>
          <div className="m-auto text-center reg__right__sec__inner">
            {!mobileView && <div
              className="text-muted cursorPtr position-absolute"
              style={{ right: 10, top: 10 }}
              onClick={() => goBack()}
            >
              <CancelOutlined fontSize="large" />
            </div>}

            {/* <FigureImage
              fclassname="my-3 d-flex align-item-left "
              src={theme.type == "light" ? LOGO : DARK_LOGO}
              width="184"
              alt={APP_NAME}
              style={{ width: '13.981vw' }}
            /> */}
            {/* <p className="text-left text-secondary fntSz13 mb-3" style={{ maxWidth: '27.943vw', margin: 'auto' }}>
              {lang.loginHeading}
            </p> */}
            {mobileView && <div className="text-left sticky-top p-3" style={{ background: '#121212', zIndex: '99' }}>
              <Image
                alt="model-registration"
                onClick={() => goBack()}
                src={theme.type === "light" ? backArrow : backArrow_lightgrey}
                width={28}
                id="scr2"
              />
            </div>}

            <div className="text-center p-3">
              {mobileView && <div className="d-flex justify-content-center mb-4">
                <FigureImage
                  src={theme.type === "light" ? config.LOGO : config.DARK_LOGO}
                  width="190"
                  height='90'
                  fclassname="m-0"
                  id="logoUser"
                  alt="logoUser"
                />
              </div>}
              <h3>Login to Your Account</h3>
              <div style={{ color: "#E2E2E2" }}>Your Own Digital Campaign</div>
              <LoginWithGoogle handleLogin={props.handleLogin} />
              <div style={{ color: "#6F7173" }}>— OR —</div>
            </div>

            <div className="col-12 p-3">
              <DVLoginForm
                handleLoginResponse={props.handleLoginResponse}
                userType={props.userType}
                handleLogin={props.handleLogin}
                setVal={props.setVal}
                passError={props.passError}
              />
            </div>


            <div className="col-12 p-0 mb-1">
              {/* <div className="dv_or_sign_in px-5 py-3 d-flex align-items-center justify-content-between text-center" style={{ gap: "5px" }}>
              <span className="fntSz13" style={{ color: "#6c757d" }}><a
                  type="button"
                  className="btn btn-default dv_btn_anch font-weight-bold txt-book fntSz14"
                  data-toggle="modal"
                  onClick={() => open_dialog("FrgtPass", { closeAll: true })}
                  id="frgtPwd"
                  style={{ color: "var(--l_base)" }}
                >
                  {lang.forgetPassword}
                </a></span>
                <span onClick={()=> Router.push('/registration')} className="fntSz14 cursorPtr font-weight-bold" style={{ color: "var(--l_base)" }}>{lang.signUpMsg}</span>
              </div>

              <div className="mb-3">
                <LoginIcon handleLogin={props.handleLogin} />
              </div> */}

              {/* <div style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                }}>
                  <FigureImage
                    fclassname="my-4 cursorPtr"
                    src={config.googleIcon}
                    width="49"
                    alt="GoogleIcon"
                  />
                  <FigureImage
                    fclassname="my-4 cursorPtr"
                    src={config.facebookIcon}
                    width="49"
                    alt="FacebookIcon"
                  />
                  <FigureImage
                    fclassname="my-4 cursorPtr"
                    src={config.twitterIcon}
                    width="49"
                    alt="TwitterIcon"
                  />
                </div> */}

              {/* <div>
                <p className="fntSz13 pt-4 font-weight-bold">{lang.signUpMsg} <Link href="/registration"><a style={{ textDecoration: "underline" }}>Sign up</a></Link></p>
              </div> */}

            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
      .reg__left__sec{
        width: 45%;
      }
      .reg__right__sec{
        width: ${mobileView ? '100%' : '55%'};
      }
      .reg__right__sec__inner{
        width: ${mobileView ? '100%' : '22rem'};
      }
        :global(.slick-dots){
          font-family: 'slick';
          font-size: 10px;
          line-height: 20px;
          position: absolute;
          bottom: 0px;
          left: 40%;
          width: 100px;
          height: 49px;
          content: '•';
          text-align: center;
          color: #fff;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
      }
      :global(.slick-arrow){
        display: none !important;
      }
      :global(.slick-dots li.slick-active button:before) {
        opacity: 1;
        color: #fff;
        font-size:9px
      }
      :global(.slick-dots li button:before){
        opacity: 0.5;
        color:var(--l_light_grey);
      }
      `}</style>
    </div >
  );
};

export default DVLOGIN;