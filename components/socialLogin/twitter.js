import React from "react";
import TwitterLogin from "react-twitter-login";
import * as config from "../../lib/config";
import { useTheme } from "react-jss";
import Button from "../button/button";
import isMobile from "../../hooks/isMobile";
import Icon from "../image/icon";
import useLang from "../../hooks/language";
import FigureImage from "../../components/image/figure-image";

const LoginWithTwitter = (props) => {
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const theme = useTheme();
  /*
        @Author Satyam
        @Date 22 October 2020
        @authHandler authHandler will handle on click twitter login
    */

  const authHandler = (err, data) => {
    // console.log("sadadasdasd", data);
    let twitterId = null;
    if (data) {
      twitterId = data.user_id;
    }
    if (props && props.handleLogin && twitterId) {
      let values = {
        loginType: 4, //facebook login
        twitterId,
        userName: data.screen_name,
      };
      props.handleLogin(values);
    }
  };

  return (
    <React.Fragment>
      <TwitterLogin
        authCallback={authHandler}
        children={
          <>
            {!mobileView ? (
            <div cssStyles={theme.blueButton} >
                <FigureImage
                    fclassname="my-4 cursorPtr"
                    src={config.twitterIcon}
                    width="49"
                    alt="TwitterIcon"
                />
            </div>
            ) : (
              <Button
                fclassname="mb-3 text-black"
                cssStyles={theme.whiteButton}
              >
                <div className="d-flex align-items-center justify-content-center">
                  <Icon
                    icon={`${config.TWITTER_ICON}#twitter_icon`}
                    color={theme.appColor}
                    size={15}
                    class="mx-2 mb-1"
                    viewBox="0 0 512 512"
                  />
                  <span className="dv_appTxtClr">{lang.signUpTwitter}</span>
                </div>
              </Button>
            )}
          </>
        }
        consumerKey={config.TWITTER_CONSUMER_KEY}
        consumerSecret={config.TWITTER_CONSUMER_SECRET}
      />
    </React.Fragment>
  );
};

export default LoginWithTwitter;