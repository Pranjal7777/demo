import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import isMobile from "../../hooks/isMobile";
import { useTheme } from "react-jss";
import FigureImage from "../../components/image/figure-image";
import { facebookIcon, FACEBOOK_ICON } from "../../lib/config/logo";
import { FACEBOOK_FIELDS, FACEBOOK_ID, FACEBOOK_SCOPES } from "../../lib/config/creds";


const LoginWithFacebook = (props) => {
  const [mobileView] = isMobile();
  const theme = useTheme();

  /*
        @Author Satyam
        @Date 22 October 2020
        @authHandler responseFacebook will handle on click facebook login
    */

  const responseFacebook = (response) => {
    const facebookId = response && response.id ? response.id : null;
    const email = response && response.email;
    if (props && props.handleLogin && facebookId && email) {
      let values = {
        loginType: 2, //facebook login
        facebookId,
        email
      };
      return props.handleLogin(values);
    }
  };

  return (
    <React.Fragment>
      <FacebookLogin
        appId={FACEBOOK_ID}
        autoLoad={false}
        fields={FACEBOOK_FIELDS}
        scope={FACEBOOK_SCOPES}
        render={(renderProps) => (
          <>
            {!mobileView ? (
            <div onClick={renderProps.onClick} >
                 <div className=" cursorPtr d-flex justify-content-around align-item-center" style={{width:"10rem",height:"35px",border:`${theme.type === "light"?"1px solid #c7c7c8":""}`,borderRadius:"5px",background:`${theme.type === "light"? "":"#000"}`}}>
                  <div className="d-flex justify-content-around align-item-center"style={{width:"5rem"}}>
                  <img 
                      src={FACEBOOK_ICON}
                  width="15"
                  style={{objectFit:"contain"}}
                  />
                  <p className="text-center font-weight-bold text-app fntSz12 py-2">Facebook</p>
                  </div>
                </div>
            </div>
            ) : (
              <div onClick={renderProps.onClick} >
              <FigureImage
                  fclassname="my-4 cursorPtr"
                    src={facebookIcon}
                  width="49"
                  alt="FacebookIcon"
                />
          </div>
            )}
          </>
        )}
        callback={responseFacebook}
      />
    </React.Fragment>
  );
};

export default LoginWithFacebook;