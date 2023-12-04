import React from "react";
import { useTheme } from "react-jss";
import parse from "html-react-parser";
import Skeleton from "@material-ui/lab/Skeleton";

import useLang from "../../../hooks/language";
import isMobile from "../../../hooks/isMobile";
import { becomeCreator, getNSFWContent, signUp } from "../../../services/auth";
import { open_dialog, startLoader, stopLoader, Toast } from "../../../lib/global";
import { BecomeCreatorPayload, ModelRegistrationPayload } from "../../../lib/data-modeling";
import { getCognitoToken } from "../../../services/userCognitoAWS";
import fileUploaderAWS from "../../../lib/UploadAWS/uploadAWS";
import Router from "next/router";
import { backArrow, backArrow_lightgrey, FOLDER_NAME_IMAGES } from "../../../lib/config";
import { setCookie, setLocalStorage } from "../../../lib/session";
import DVRadioButton from "../../../components/DVformControl/DVradioButton";
import Button from "../../../components/button/button";
import Image from "../../../components/image/image";
import { open_drawer } from "../../../lib/global/loader";
import { setAuthData } from "../../../lib/global/setAuthData";
import { clearAllPostsAction } from "../../../redux/actions/dashboard/dashboardAction";
import { useDispatch } from "react-redux";

const NotSafeForWork = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [recieveNSFW, setRecieveNSFW] = React.useState("");
  const [NSFWDisclaimer, setNSFWDisclaimer] = React.useState("");
  const [selectNsfw, setSelectNsfw] = React.useState("");
  // const [currentScreen, setCurrentScreen] = React.useState();
  // const [signupData, setSignupData] = React.useState(props.signupData);
  var signupData = props.signupData;
  if (signupData) {
    const {
      firstName,
      lastName,
      email,
      password,
      userName,
      phoneNumber,
      dateOfBirth,
      gender,
      pic,
      groupIds,
      countrycode,
      inviterReferralCode,
      timezone,
      socialLink
    } = signupData;
  }

  const dispatch = useDispatch()
  React.useEffect(() => {
    getNSFWContentFromAdmin();
  }, []);

  React.useEffect(() => {
    
      if (props.userSignup && recieveNSFW) {
        props.setIsNSFWAllow(recieveNSFW);
      } else {
        if (recieveNSFW) {
          signupData = { ...signupData, isNSFWAllow: recieveNSFW == "true" ? true : false }
          // gotoVerificationPage();
          callModelSignUpApi();
        }
    }
  }, [recieveNSFW]);

  // Function for changing screen
  // const updateScreen = (screen) => {
  //   setCurrentScreen(screen);
  // };

  const getNSFWContentFromAdmin = async () => {
    const res = await getNSFWContent();
    setNSFWDisclaimer(res?.data?.data?.pageContent)
  }

  const callModelSignUpApi = async () => {
    try {
      startLoader();
      let payload = props.BecomeCreator ? {...BecomeCreatorPayload } : {...ModelRegistrationPayload};
      const cognitoToken = await getCognitoToken();
      const tokenData = cognitoToken?.data?.data;
      const imgFileName = `${Date.now()}_${userName?.toLowerCase()}`;
      const folderName = `users/${FOLDER_NAME_IMAGES.profile}`;
      const url = await fileUploaderAWS(
        pic.file[0],
        tokenData,
        imgFileName,
        false,
        folderName,
        null, null, null, false
      );
      payload.firstName = firstName;
      payload.lastName = lastName;
      payload.profilePic = url;
      payload.countryCode = countrycode;
      payload.phoneNumber = phoneNumber;
      payload.dateOfBirth = dateOfBirth;
      payload.gender = gender;
      payload.socialMediaLink = socialLink;
      // payload.isNSFWAllow = recieveNSFW == "true" ? true : false;
      payload.inviterReferralCode = inviterReferralCode;
      payload.timezone = timezone
      payload.groupIds = groupIds
      payload.username = userName;
      let res;
      if(props.BecomeCreator) {
        res = await becomeCreator(payload);
      } else {
        payload.isNSFWAllow = recieveNSFW == "true" ? true : false
        payload.email = email;
        payload.password = password;
        res = await signUp(payload);
      }
      stopLoader();
      if (res?.status === 200) {
        Router.push("/login");
        setCookie("userType", 2)
        open_dialog("profileSubmitted", {});
      }
      // if (res?.status === 200) {
      //   if(props.BecomeCreator) {
      //     setCookie('userType', 2)
      //     if (mobileView) {
      //       open_drawer("SumSub", {
      //         config: {
      //           email: payload.email,
      //           phone: payload.phoneNumber
      //         },
      //         accessToken: res.data.data?.sumsubToken,
      //         onBackdropClick: true
      //       })
      //     } else {
      //       open_dialog("SumSub", {
      //         config: {
      //           email: payload.email,
      //           phone: payload.phoneNumber
      //         },
      //         accessToken: res.data.data?.sumsubToken,
      //         onBackdropClick: true
      //       })
      //     }
      //   }else {const data = res.data && res.data.data ? res.data.data : {};
      //   setLocalStorage('streamUserId', data.user.streamUserId);
      //   setAuthData({ ...data.token, ...data.user });
      //   dispatch(clearAllPostsAction());
      //   setCookie("auth", true);
      //   setCookie("guest", false);
      //   setCookie('zone', timezone);
      //   setCookie("email", email);
      //   if (mobileView) {
      //     open_drawer("SumSub", {
      //       config: {
      //         email: payload.email,
      //         phone: payload.phoneNumber
      //       },
      //       accessToken: res.data.data?.user?.sumsubToken,
      //       onBackdropClick: true
      //     })
      //   } else {
      //     open_dialog("SumSub", {
      //       config: {
      //         email: payload.email,
      //         phone: payload.phoneNumber
      //       },
      //       accessToken: res.data.data?.user?.sumsubToken,
      //       onBackdropClick: true
      //     })
      //   }}
      // }

    } catch (err) {
      stopLoader();
      if (err.response) {
        Toast(err?.response?.data?.message, "error");
      }
      console.error(err);
    }
  }

  return (
    <>
    {mobileView
        ? <div className="vh-100 py-4" style={{ background: `${theme.background}`, color: `${theme.text}` }}>

          <div className="position-relative">
            <div className="position-absolute" style={{ left: '1rem', top: '0.8rem' }}>
              <Image
                alt="model-registration"
                onClick={() => props.onClose()}
                src={theme.type === "light" ? backArrow : backArrow_lightgrey}
                width={28}
                id="scr2"
              />
            </div>
            {/* Heading */}
            <h4 className="w-700 nsfwTitle" style={{ color: `${theme.text}` }}>{lang.nsfw}</h4>
          </div>

          <div className="container">
            {/* Sub-Heading */}
            <h5 className="w-700 nsfwSub-Title" style={{ color: `${theme.text}` }}>{lang.disclaimer}:</h5>

            {/* Text Content */}
            <div className="dt__cls mb-5" style={{ background: `${theme.background}`, color: `${theme.text}` }}>
              {parse(NSFWDisclaimer)}
            </div>

            {/* Action Buttons */}
            <div className="posBtm p-0" style={{ bottom: 0, background: `${theme.background}`, color: `${theme.text}` }}>
              <div className="mb-2 mt-4">
                <DVRadioButton
                  name={"nsfw"}
                  value={"correct"}
                  label={"I am OK to create & view NSFW content"}
                  checked={selectNsfw === "correct"}
                  onChange={(value) => setSelectNsfw(value)}
                // disabledField
                />
              </div>
              <div>
                <DVRadioButton
                  name={"nsfw"}
                  value={"wrong"}
                  label={"I DO NOT WANT to receive, create or view NSFW Content"}
                  checked={selectNsfw === "wrong"}
                  onChange={(value) => setSelectNsfw(value)}
                // disabledField
                />
              </div>
              <Button
                type="button"
                onClick={() => { setRecieveNSFW(`${selectNsfw === 'correct' ? "true" : "false"}`), props.onClose() }}
                cssStyles={{
                  ...theme.blueButton,
                  background:
                    "linear-gradient(91.19deg, rgba(255, 26, 170) 0%, #460a56 100%)",
                  padding: "14px 0px",
                  fontFamily: 'Roboto',
                  fontSize: '13px',
                }}
                fclassname='my-3 font-weight-500'
                children={'Continue to Home Page'}
              />
            </div>
        </div>
      </div>
      :
        <div className="p-4" style={{ borderRadius: '1rem', width: '28rem', background: '#1E1C22' }}>
        <div className="text-center">
            <h4 className="font-weight-600 mb-3">{lang.nsfw}</h4>
        </div>
        <button
          type="button"
          className="close dv_modal_close"
          data-dismiss="modal"
          onClick={() => props.onClose()}
        // onClick={() => mobileView ? props.onClose() : props.onBack()}
        >
            {lang.btnX}
        </button>
          {/* Sub-Heading */}
          <div className="w-600 nsfwSub-Title mb-2" style={{ color: `${theme.text}` }}>{lang.disclaimer}:</div>

        <div className="dt__cls">
          {NSFWDisclaimer
            ? parse(NSFWDisclaimer)
            : <Skeleton
              variant="rect"
              width="100%"
              height={250}
              animation="wave"
            />
          }
        </div>

        <div style={{ bottom: 0, color: "var(--l_app_text)" }}>
            <div className="mb-2 mt-4">
              <DVRadioButton
                name={"nsfw"}
                value={"correct"}
                label={"I am OK to create & view NSFW content"}
                checked={selectNsfw === "correct"}
                onChange={(value) => setSelectNsfw(value)}
              // disabledField
              />
            </div>
            <div>
              <DVRadioButton
                name={"nsfw"}
                value={"wrong"}
                label={"I DO NOT WANT to receive, create or view NSFW Content"}
                checked={selectNsfw === "wrong"}
                onChange={(value) => setSelectNsfw(value)}
              // disabledField
              />
            </div>
            <Button
              type="button"
              onClick={() => { setRecieveNSFW(`${selectNsfw === 'correct' ? "true" : "false"}`), props.onClose() }}
              cssStyles={{
                ...theme.blueButton,
                background:
                  "linear-gradient(91.19deg, rgba(255, 26, 170) 0%, #460a56 100%)",
                padding: "14px 0px",
                fontFamily: 'Roboto',
                fontSize: '13px',
              }}
              fclassname='mt-3 font-weight-500'
              children={'Continue to Home Page'}
            />
        </div>

      </div>
    }
    <style jsx>
      {`
        :global(.dt__cls p span) {
          color: #8C8DB2 !important;
        }
        :global(.NSFW_Signup) {
          display:  ${Router?.pathname === "/login" ? "none" : "block"} !important;
        }
        :global(.MuiDialogContent-root.card_bg) {
          width: 28rem;
          background-color: #1E1C22 !important;
          border-radius: 1rem !important;
        }
        :global(.mu-dialog>div>div){
          min-width: 25rem;
          border-radius: 1rem !important;
        }
      `}
    </style>
  </>

  );
};

export default React.memo(NotSafeForWork);
