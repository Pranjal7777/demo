import Button from "../../components/button/button";
import Image from "../../components/image/image";
import FigureImage from "../../components/image/figure-image";
import LoginForm from "./login-form";
import LoginIcon from "./login-icon";

import Route from "next/router";
import useLang from "../../hooks/language";
import { useTheme } from "react-jss";
import { LOGO } from "../../lib/config/logo";
import { DARK_LOGO_HEADER, FRONT_ARROW } from "../../lib/config";

const Login = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const {
    setLoginType,
    handleLoginResponse,
    handleLogin,
    userType,
    arrowIcon,
  } = props;

  return (
    <div>
      {" "}
      <div
        className="scr py-4 animate__animated animate__faster"
        // style={{ backgroundImage: `url(${config.BG_IMAGE})` }}
      >
        <div className="row mx-0 h-100 w-330 mx-auto text-center">
          <div className="col-12 align-self-start">
            <FigureImage
              src={theme?.type === "light" ? DARK_LOGO_HEADER : LOGO}
              width="129"
              id="logoUser"
              className="logoUser"
              alt="logoUser"
            />

            <div className="txt-book fntSz16 mb-4">{lang.loginHeading}</div>

            <LoginForm
              handleLoginResponse={handleLoginResponse}
              userType={userType}
              handleLogin={handleLogin}
            />

            <div className="txt-book fntSz14 mb-4 bgLine">
              <span className="bgLineSpan">{lang.otherSignText}</span>
            </div>

            <LoginIcon handleLogin={handleLogin} />
          </div>

          <div className="col-12 align-self-end">
            <Button
              type="button"
              className="btn btn-default transBgBtn mb-3 bold"
              id="signupUser"
              children={lang.signUpMsg}
              onClick={() => {
                if (userType == 2) {
                  Route.push("/registration?type=user");
                } else {
                  Route.push("/registration?type=model");
                }
              }}
            />
            <Button
              type="button"
              cssStyles={theme.whiteButton}
              id="forCreator"
              children={
                <div>
                  <span>{arrowIcon.text}</span>
                  <Image
                    alt="right-arrow"
                    src={FRONT_ARROW}
                    width="15"
                    className={arrowIcon.className}
                  />
                </div>
              }
              onClick={setLoginType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
