import Route from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import Image from "../../components/image/image";
import useLang from "../../hooks/language";
import { DARK_LOGO_HEADER, profileSubmmited, signupBackground } from "../../lib/config";
import { gotoLogin, startLoader, stopLoader } from "../../lib/global";
import { getCookie, setCookie } from "../../lib/session";
import { SUBMIT_PROFILE } from "../../redux/actions/actionTypes";
import { useTheme } from "react-jss";
import Button from "../../components/button/button";
import { LOGO } from "../../lib/config/logo";

const ProfileSubmited = (props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [lang] = useLang();

  React.useEffect(() => {
    // return () => {
    stopLoader();
    // };
  }, []);

  const profileSubmitHandler = async () => {
    if (getCookie("userType") != 2) {
      return window.location.href = "/login";
    } else {
      await dispatch({
        type: SUBMIT_PROFILE,
        data: true,
      });
      // gotoLogin()
      Route.replace("/login");
      startLoader();
    }
  };
  return (
    <div className="h-100 text-center p-4">
      <div className="">
        <figure className="text-center">
          <Image
            alt="profile-submit"
            src={theme?.type === "light" ? DARK_LOGO_HEADER : LOGO}
            width={129}
            id="logoUser"
            className="logoUser"
          />
        </figure>
      </div>
      <div className="h-100 d-flex justify-content-center align-items-center flex-column">
        <div className="px-2">
          <h5>
            {lang.profileSubmitted}
          </h5>
          <div className="light_app_text fntSz16">{props.isAgency ? lang.pendingAgency : lang.pendingMessage}</div>
        </div>
        <div className="w-100 d-flex flex-row justify-content-center my-5">
          <Button
            type="button"
            id="loginCrtr"
            fclassname="btnGradient_bg rounded-pill w-auto px-5"
            onClick={profileSubmitHandler}
            children={lang.login}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileSubmited);
