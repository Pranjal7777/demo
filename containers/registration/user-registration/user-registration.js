import React, { useCallback, useState } from "react";
import { backArrow, backArrow_lightgrey } from "../../../lib/config";
import Name from "./name";
import Password from "./password";
import Image from "../../../components/image/image";
import { goBack, open_drawer } from "../../../lib/global";
import UserName from "../common-form/user-name";
import NSFW from "../model-registration/nsfw";
import ScheduleTime from "../model-registration/scheduleTime";
import useLang from "../../../hooks/language";
import { useTheme } from "react-jss";
import Ref from "../model-registration/refer";

const UserRegistration = (props) => {
  const theme = useTheme();
  const { handlerRegistrationData, signUpdata, submitForm } = props;
  const [stap, setStap] = useState(0);
  const [lang] = useLang();
  const data = (signUpdata && signUpdata.current && signUpdata.current) || {};
  const [userName, setUserName] = useState("");

  const title = {
    0: lang.enterName,
    // 1: lang.enterUserName,
    1: lang.enterEmailPassword,
    2: lang.refCodeTitle,
    3: lang.selectTimeZone,
    5: lang.nsfw
  };

  // back page handler
  const back = () => {
    goBack()
    open_drawer("joinAs", {}, "right")
  }

  console.log(userName)
  const backHanlder = () => {
    stap == 0 ? back() : setStap(stap - 1);
  };
  // form pages
  const getStapper = useCallback(() => {
    switch (stap) {
      case 0:
        // Name page
        return (
          <Name
            signUpdata={data["name"]}
            setUserName={setUserName}
            setStap={(value) => {
              setStap(1);
              handlerRegistrationData("name", value);
            }}
          />
        );
      // case 1:
      //   // Username page
      //   return (
      //     <UserName
      //       signUpdata={data["userName"]}
      //       userName={userName}
      //       setUserName={setUserName}

      //       setStap={(value) => {
      //         setStap(2);
      //         handlerRegistrationData("userName", value);
      //       }}
      //     />
      //   );
      case 1:
        // Password page
        return (
          <Password
            signUpdata={data["password"]}
            setStap={(value) => {
              setStap(2);
              handlerRegistrationData("password", value);
            }}
          />
        );
      case 2:
        return (
          <Ref
            handlerRegistrationData={handlerRegistrationData}
            signUpdata={data["refCode"]}
            setStap={(value) => {
              setStap(3);
              handlerRegistrationData("refCode", value);
            }}
          />
        );
      case 3:
        return (
          <ScheduleTime
            signUpdata={signUpdata["ScheduleTime"]}
            title={lang.selectTimeZone}
            setStap={(value) => {
              setStap(5)
              handlerRegistrationData("ScheduleTime", value);
              submitForm = { submitForm }
            }}
          />
        )
      case 5:
        // Not Safe For Work Page
        return (
          <NSFW
            signUpdata={data["nsfw"]}
            setStap={(value) => {
              handlerRegistrationData("nsfw", value, true);
            }}
            submitForm={submitForm}
          />
        );
    }
  }, [stap]);
  return (
    <>
      {stap != 5
        ? <>
          {/* <div className="header-top-secion w-330 mx-auto py-2">
            <div className="col-12">
              <div className="row justify-content-between">
                <div className="col-auto">
                  <Image
                    alt="model-registration"
                    onClick={backHanlder}
                    src={theme.type === "light" ? backArrow : backArrow_lightgrey}
                    width={28}
                    id="scr2"
                  />
                </div>
              </div>
            </div>
          </div>{" "} */}
          <div className="w-330 row mx-auto content-secion pt-5 pb-2">
            <div className="col-auto pt-1 ">
              <Image
                alt="model-registration"
                onClick={backHanlder}
                src={theme.type === "light" ? backArrow : backArrow_lightgrey}
                width={28}
                id="scr2"
              />
            </div>
            <div className="col-10 text-left px-0">
              <h4 className={`${title[stap] == "Not Safe For Work" ? "titleH3" : "titleH4 mb-4"} `}>{title[stap]}</h4>
            </div>
          </div>
          <div className="form-row justify-content-center mb-4 dots-stepper">
            {Object.keys(title).map((_, index) => {
              return (
                <div
                  key={index}
                  className={`col-auto ${index <= stap ? "active" : ""}`}
                />
              );
            })}
          </div>
        </>
        : ""
      }
      {getStapper()}
      <style jsx>{`
            .titleH3{
              font-weight: unset !important;
              letter-spacing: 1px;
              font-family: "Roboto", sans-serif !important;
              margin-bottom: 15px;
              font-size: 30px;
            }
            :global(.error-tooltip-container){
              right:0px!important;
            }
            :global(.error-tooltip){
              right:18px!important;
            }
      `}</style>
    </>
  );
};

export default UserRegistration;
