import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import CancelIcon from "@material-ui/icons/Cancel";
import { BG_IMAGE, CANCEL, CROSS, LOGO, DARK_LOGO } from "../../lib/config";
import Image from "../image/image";
import { close_dialog, close_drawer, goBack, startLoader, stopLoader } from "../../lib/global";
import useLang from "../../hooks/language";
import Button from "../button/button";
import Icon from "../image/image";
import Router from "next/router";
const FigureImage = dynamic(() => import("../../components/image/figure-image"), { ssr: false });

const JoinAs = (props) => {
  const [lang] = useLang();
  const theme = useTheme()
  const [isCreator, setIsCreator] = useState(false);

  const backHanlder = () => {
    close_drawer("joinAs");
  };

  const handleJoinAsCreator = () => {
    setIsCreator(true);
  }

  const handleJoinAsUser = () => {
    setIsCreator(false);
  }

  const handleNext = () => {
    startLoader();
    if (isCreator) {
      Router.push("/registration?type=model")
    }
    else {
      Router.push("/registration?type=user")
    }
  }

  return (
    <>
      <div className="joinAs_bg h-100 scr card_bg">
        <div className="header-top-secion w-330 mx-auto py-3">
          <div className="col-12">
            <div
              className="text-muted cursorPtr position-absolute"
              style={{ right: '10px' }}
              onClick={backHanlder}>
              <CancelIcon fontSize="large" />
            </div>
            <FigureImage
              src={theme.type === "light" ? LOGO : DARK_LOGO}
              width="129"
              fclassname="m-0"
              id="logoUser"
              alt="logoUser"
            />
          </div>
        </div>{" "}
        <div className="w-330 mx-auto content-secion pt-3">
          <div className="col-12 text-center">
            <h4 className="mb-4 bold fntSz18 text-app">{lang.signUpFanzly}</h4>
          </div>
        </div>
        <div>
          <div
            className={`signUp__box px-4 pt-2 pb-3 m-4 ${isCreator && 'background'}`}
            onClick={handleJoinAsCreator}>
            <div>
              <h1 className="fntSz18 text-uppercase fntWeight600">{lang.creatorMobile}</h1>
              <div>
                <p className="fntSz12 m-0 p-0">{lang.signupCreatorTxt}</p>
              </div>
            </div>
          </div>
          <div
            className={`signUp__box px-4 pt-2 pb-3 m-4 ${!isCreator && 'background'}`}
            onClick={handleJoinAsUser}>
            <div>
              <h1 className="fntSz18 text-uppercase fntWeight600">{lang.userMobile}</h1>
              <div>
                <p className="fntSz12 m-0 p-0">{lang.userTxt}</p>
              </div>
            </div>
          </div>
          <div className="position-absolute w-100 px-4" style={{ bottom: '0' }}>
            <Button
              type="submit"
              fclassname="mb-4"
              cssStyles={theme.blueButton}
              id="logIn1"
              onClick={handleNext}
              children={lang.next}
            />
            <Button
              type="submit"
              fclassname="mb-4"
              cssStyles={theme.blueBorderButton}
              onClick={backHanlder}
              id="logIn1"
              children={lang.btnLogin}
            />
          </div>
        </div>
        <style jsx>
          {`
          .signUp__box {
            border-radius: 20px;
            background: #fff;
          }
          .background {
            background: #fff;
            border: 3px solid ${theme.appColor};
            color: ${theme.appColor};
          }
          `}
        </style>
      </div>
    </>
  )
};

export default JoinAs