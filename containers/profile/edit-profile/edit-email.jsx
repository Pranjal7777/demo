import React, { useEffect, useRef, useState } from "react";
import EditProfileHeader from "./edit-profile-header";
import useLang from "../../../hooks/language";
import UpdateForm from "../../../components/edit-profile/update-form";
import InputText from "../../../components/formControl/inputText";
import useLocation from "../../../hooks/location-hooks";
import {
  drawerToast,
  focus,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../../lib/global";
import {
  SendVerificationCode,
  ValidatePhoneNoPayload,
  VerifyEmail,
} from "../../../lib/data-modeling";
import {
  sendverificaitonCode,
  updateEmail,
  validateEmail,
  updateUsername,
  validatePhoneNumber,
  validateUserNameRequest
} from "../../../services/auth";
import useForm from "../../../hooks/useForm";
import Router, { useRouter } from "next/router";
import { getCookie, setCookie } from "../../../lib/session";
import { CHECK } from "../../../lib/config";
import { useTheme } from "react-jss";
import Button from "../../../components/button/button";
import { updateReduxProfile } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import { close_dialog } from "../../../lib/global/loader";

export default function EditEmailId(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const router = useRouter();
  // const { username } = router.query
  const username = false; // for stop edit username section
  const [userName,setUserName] = useState('');
  const [Register, value, error, isValid, setElementError, setValidInputMsg] = useForm({
    defaultValue: {},
  });
  const dispatch = useDispatch();

  const validateEmailAddress = async (inputValue) => {
    return new Promise(async (res, rej) => {
      try {
        VerifyEmail.email = inputValue || value.email;
        VerifyEmail.type = 2;
        // VerifyEmail.userType = getCookie("userType");

        const response = await validateEmail(VerifyEmail);
        res();
      } catch (e) {
        stopLoader();
        // console.log("ASdsadd", e);
        e.response && setElementError("email", e.response.data.message);
        rej();
      }
    });
  };
  // validate username
  const validateUserName = async () => {
    return new Promise(async (res, rej) => {
      if (error.userName) {
        rej();
      }
      try {
        const { userName } = value;
        // startLoader();
        const response = await validateUserNameRequest(userName);
        setValidInputMsg("userName", response?.data?.message);

        res();
      } catch (e) {
        setElementError("userName", e?.response?.data?.message);
        rej();
      }
      // stopLoader();
    });
  };

  //update username
  const updateUserName = async (e) => {
    e && e.preventDefault();
    // setStap(value);
    let profileDataFromCookie = JSON.parse(getCookie("profileData"))
    updateUsername({
      username: value.userName,
    })
      .then((data) => {
        stopLoader();
        profileDataFromCookie = { ...profileDataFromCookie, username: value.userName }
        setCookie("profileData", JSON.stringify(profileDataFromCookie))
        dispatch(updateReduxProfile({ username: value.userName }));
        Toast(data?.data?.message, "success");
        router.push("/profile")
        close_dialog();
      })
      .catch((e) => {
        stopLoader();
        e.response && Toast(e.response.data.message, "error");
      });
  };

  //check validations and if valid then submit form
  const updateEmailAddress = async (e) => {
    e && e.preventDefault();
    // check email validation whiile submit
    startLoader();
    try {
      await validateEmailAddress();
    } catch (e) {
      return;
    }

    // setStap(value);
    updateEmail({
      newEmail: value.email,
    })
      .then((data) => {
        stopLoader();

        drawerToast({
          title: lang.checkEmail,
          desc: data.data.message,
          closeIconVisible: false,
          titleClass: "max-full",
          autoClose: true,
        });
        // Toast(data.data.message);
        Router.back();
      })
      .catch((e) => {
        stopLoader();
        e.response && Toast(e.response.data.message, "error");
      });
  };

  useEffect(() => {
    focus("email");
  }, []);

  // console.log("sadasdsadsa", signUpdata, isValid);
  return (
    <div className="wrap">
      <div className="scr wrap-scr bg-dark-custom">
        <div className="col-12">
          <EditProfileHeader title={username ? lang.changeUsername : lang.changeEmail} />
        </div>
        <div className="col-12 py-4">
          <InputText
            autoFocus
            id={username ? "username" : "email"}
            // defaultValue={signUpdata.email}
            name={username ? "userName" : "email"}
            error={username ? error.userName : error.email}
            value={userName}
            onChange={(e) => {
                setUserName((e.target.value).replace(" ",""));
            }}
            ref={Register({
              onBlur: username ? validateUserName : validateEmailAddress,
              validate: [
                {
                  validate: "required",
                  error: username ? lang.userNameError : lang.emailError1,
                },
                {
                  validate: username ? "userName" : "email",
                  error: username ? lang.userNameNotValid : lang.emailError2,
                },
              ],
            })}
            placeholder={username ? lang.usernamePlaceholder : lang.emailPlaceholder}
            className="mv_form_control_Input"
          />
          <Button
            type="submit"
            disabled={!isValid}
            // disabled={!phoneInput.error}
            cssStyles={theme.blueButton}
            fclassname="mb-3"
            onClick={username ? updateUserName : updateEmailAddress}
          >
            {lang.update}
          </Button>
          <div className="txt-roman fntSz12 text-center">
            {username ? lang.editUsernameDesc : lang.editEmailDesc}
          </div>
        </div>
      </div>
    </div>
  );
}
