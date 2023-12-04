import React, { useCallback, useRef, useState } from "react";
import { backArrow, backArrow_lightgrey } from "../../../lib/config";
import Name from "./name";
import PhoneNo from "./phoneno";
import Email from "./email";
import Password from "./password";
import BirthDate from "./birthDate";
import ProfilePic from "./profilePic";
import Social from "./social";
import Ref from "./refer";
import Category from "./category";
import Image from "../../../components/image/image";
import { goBack, open_drawer } from "../../../lib/global";
import useLang from "../../../hooks/language";
import UserName from "../common-form/user-name";
import useLocation from "../../../hooks/location-hooks";
import Gender from "./gender";
import NSFW from "./nsfw";
import ScheduleTime from './scheduleTime';
import { useTheme } from "react-jss";

const UserRegistration = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const { handlerRegistrationData, signUpdata, submitForm } = props;
  const [stap, setStap] = useState(0);
  const [location] = useLocation();
  const data = (signUpdata && signUpdata.current && signUpdata.current) || {};
  const [userName, setUserName] = useState("");
  const title = {
    0: lang.enterName,
    1: lang.enterUserName,
    2: lang.genderSelection,
    3: lang.enterPhone,
    4: lang.enterEmail,
    5: lang.chooseCategory,
    6: lang.passwordSet,
    7: lang.birthDate,
    8: lang.uploadProfile,
    // 9: lang.socialMediaProfile,
    9: lang.refCodeTitle,
    10: lang.selectTimeZone,
    // 11: lang.nsfw
  };

  const back = () => {
    goBack()
    open_drawer("joinAs", {}, "right")
  }

  const backHanlder = () => {
    stap == 0 ? back() : setStap(stap - 1);
  };

  const getStapper = useCallback(() => {
    switch (stap) {
      case 0:
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
      case 1:
        return (
          <UserName
            showLable={false}
            userName={userName}
            setUserName={setUserName}
            signUpdata={data["userName"]}
            setStap={(value) => {
              setStap(2);
              handlerRegistrationData("userName", value);
            }}
          />
        );
      case 2:
        return (
          <Gender
            showLable={false}
            signUpdata={data["gender"]}
            setStap={(value) => {
              setStap(3);
              handlerRegistrationData("gender", value);
            }}
          />
        );
      case 3:
        return (
          <PhoneNo
            location={location}
            signUpdata={data["phoneNo"]}
            setStap={(value) => {
              setStap(4);
              handlerRegistrationData("phoneNo", value);
            }}
          />
        );

      case 4:
        return (
          <Email
            handlerRegistrationData={handlerRegistrationData}
            signUpdata={data["email"]}
            setStap={(value) => {
              setStap(5);
              handlerRegistrationData("email", value);
            }}
          />
        );
      case 5:
        return (
          <Category
            handlerRegistrationData={handlerRegistrationData}
            signUpdata={data["category"]}
            setStap={(value) => {
              setStap(6);
              handlerRegistrationData("category", value);
            }}
          />
        );
      case 6:
        return (
          <Password
            handlerRegistrationData={handlerRegistrationData}
            signUpdata={data["password"]}
            setStap={(value) => {
              setStap(7);
              handlerRegistrationData("password", value);
            }}
          />
        );
      case 7:
        return (
          <BirthDate
            handlerRegistrationData={handlerRegistrationData}
            signUpdata={data["birthDate"]}
            setStap={(value) => {
              setStap(8);
              handlerRegistrationData("birthDate", value);
            }}
          />
        );
      case 8:
        return (
          <ProfilePic
            handlerRegistrationData={handlerRegistrationData}
            signUpdata={data["profilePic"]}
            setStap={(value) => {
              setStap(9);
              handlerRegistrationData("profilePic", value);
            }}
          />
        );
      // case 9:
      //   return (
      //     <Social
      //       handlerRegistrationData={handlerRegistrationData}
      //       signUpdata={data["social"]}
      //       setStap={(value) => {
      //         setStap(10);
      //         handlerRegistrationData("social", value);
      //       }}
      //     />
      //   );
      case 9:
        return (
          <Ref
            handlerRegistrationData={handlerRegistrationData}
            signUpdata={data["refCode"]}
            setStap={(value) => {
              setStap(10);
              handlerRegistrationData("refCode", value);
            }}
          />
        );
      case 10:
        return (
          <ScheduleTime
            handlerRegistrationData={handlerRegistrationData}
            name="TimeZone"
            signUpdata={signUpdata["ScheduleTime"]}
            setStap={(value) => {
              setStap(11)
              handlerRegistrationData("ScheduleTime", value);
            }}
            submitForm={submitForm}
          />

        )
      case 11:
        return (
          <NSFW
            handlerRegistrationData={handlerRegistrationData}
            signUpdata={signUpdata["nsfw"]}
            setStap={(value) => {
              // setStap(12)
              handlerRegistrationData("nsfw", value, true);
            }}
          // submitForm={submitForm}
          />
        );
    }
  }, [stap]);

  return (
    <>
      {stap != 11
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
              <h4 className={`${title[stap] == "Not Safe For Work" || "Choose Category" ? "titleH3" : "titleH4 mb-4"} `}>{title[stap]}</h4>
            </div>
          </div>
          <div className="form-row justify-content-center mb-3 dots-stepper">
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
              font-size: 29px;
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
