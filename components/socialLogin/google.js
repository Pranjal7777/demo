import React, { useEffect } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { googleIcon, GOOGLE_ICON2, google_icon_white } from "../../lib/config/logo";
import Icon from "../image/icon";
import { startLoader } from "../../lib/global/loader";
import axios from 'axios'

/**
 * @uthor Satyam
 * @Date 22 October 2020
 * @authHandler responseGoogle will handle on click google login
 */
const LoginWithGoogle = (props) => {

  const GoogleLoginHandler = () => {
    Login()
  }
  const getUserProfile = async (access_token) => {
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    return axios.get(url)
  }

  const responseGoogle = (googleUser) => {
    console.log(googleUser, "googleLoginStatus")
    let profileInfo =
      googleUser && googleUser.email_verified ? googleUser : null;
    let email, firstName, lastName, profilePic;
    if (profileInfo) {
      startLoader();
      email = profileInfo.email;
      firstName = profileInfo.given_name;
      lastName = profileInfo.family_name ? profileInfo.family_name : "";
      profilePic = profileInfo.picture;
    }

    if (googleUser && googleUser.sub && email) {
      let googleId = googleUser.sub;
      if (props && props.handleLogin && googleId) {
        let values = {
          email,
          firstName,
          lastName,
          loginType: 3, //google login login
          googleId,
        };
        props.handleLogin(values, props.isUser);
      }
    }
  };

  const Login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const response = await getUserProfile(tokenResponse.access_token)
      responseGoogle(response.data)
    },
    scope: "email"
  });

  return (
    <React.Fragment>
      <div onClick={GoogleLoginHandler} className="cursorPtr text-white">
        {props.Landingpage ? <div className="login_google d-flex flex-row align-items-center justify-content-center my-2 position-relative cursorPtr">
          <div style={{ position: "absolute", left: "28px" }}>
            <Icon
              icon={`${GOOGLE_ICON2}#google2`}
              viewBox="0 0 32 32"
              width="32"
              height="32"
            />
          </div>
          Continue with Google
        </div>
          :
          // <div style={{
          //   background:
          //     "linear-gradient(94.91deg, rgba(255, 26, 170) 0%, #460a56 100%)",
          //   padding: '1px',
          //   borderRadius: "8px",
          //   margin: '1.5rem 0px 0.5rem 0px'
          // }}>
          //   <div style={{ background: '#121212', borderRadius: "8px", }}>
          <div
            className="d-flex align-items-center justify-content-center flex-nowrap mt-4 mb-1"
            style={{
              background:
                "linear-gradient(94.91deg, rgba(115, 33, 244, 0.25) 0%, rgba(255, 26, 170, 0.35)  100%)",
              fontWeight: "600",
              borderRadius: "8px",
              fontFamily: "Inter",
              fontSize: '13px',
              letterSpacing: '0.4px',
              padding: '0.876rem',
              lineHeight: 'initial'
            }}
          >
            <Icon
              icon={`${google_icon_white}#google`}
              viewBox="0 0 22.313 22.313"
              color={"#fff"}
              width="15"
              height="16"
              style={{ paddingRight: '0.7rem' }}
            />
            Continue With Google
          </div>
          //   </div>
          // </div>
        }
      </div>

      <style jsx="true">{`
        .mv_signup_text {
          font-family: "Roboto";
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </React.Fragment>
  );
};
export default LoginWithGoogle;
