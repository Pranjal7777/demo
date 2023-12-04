import React, { useEffect, useState } from "react";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import InputText from "../../components/formControl/inputText";
import { updateEmail, validateEmail, updateUsername, validateUserNameRequest, } from "../../services/auth";
import {
  close_dialog,
  focus,
  open_dialog,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import { getCookie, setCookie } from "../../lib/session";
import useForm from "../../hooks/useForm";
import { VerifyEmail } from "../../lib/data-modeling";
import { useTheme } from "react-jss";
import Button from "../../components/button/button";
import { updateReduxProfile } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

export default function DvEditEmail(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const router = useRouter()
  const [Register, value, error, isValid, setElementError, setValidInputMsg] = useForm({
    defaultValue: {},
  });
  const dispatch = useDispatch()
  const [userName,setUserName] = useState('');

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
      if (error.email) {
        rej();
      }
      try {
        const { email } = value;
        // startLoader();
        const response = await validateUserNameRequest(email);
        setValidInputMsg("email", response?.data?.message);

        res();
      } catch (e) {
        setElementError("email", e?.response?.data?.message);
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
      username: value.email,
    })
      .then((data) => {
        stopLoader();
        profileDataFromCookie = { ...profileDataFromCookie, username: value.email }
        setCookie("profileData", JSON.stringify(profileDataFromCookie))
        dispatch(updateReduxProfile({ username: value.email }));
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
        Toast(lang.checkEmail, "success");
        close_dialog();
      })
      .catch((e) => {
        stopLoader();
        e.response && Toast(e.response.data.message, "error");
      });
  };

  useEffect(() => {
    focus("email");
  }, []);

  return (
    <Wrapper>
      <div>
        <button
          type="button"
          className="close dv__modal_close"
          onClick={() => props.onClose()}
        >
          {lang.btnX}
        </button>
        <div className="p-4 text-center">
          <h6 className="dv__modelHeading my-2 text-black">{props.username ? lang.changeUsername : lang.changeEmail}</h6>
          {props.isAgency && <div className="txt-roman fntSz12 text-center my-2">
            {props.username ? lang.editUsernameDesc : lang.editEmailDesc}
          </div>}
          <InputText
            autoFocus
            id={props.usename ? "userName" : "email"}
            name={props.usename ? "userName" : "email"}
            error={error.email}
            value={userName}
            onChange={(e) => {
                setUserName((e.target.value).replace(" ",""));
            }}
            ref={Register({
              onBlur: props.username ? validateUserName : validateEmailAddress,
              validate: [
                {
                  validate: "required",
                  error: props.username ? lang.userNameError : lang.emailError1,
                },
                {
                  validate: props.username ? "userName" : "email",
                  error: props.username ? lang.userNameNotValid : lang.emailError2,
                },
              ],
            })}
            className="dv__border_bottom_profile_input my-2"
            placeholder={props.username ? lang.usernamePlaceholder : lang.emailPlaceholder}
          />
          {!props.isAgency && <div className="txt-roman fntSz12 text-center my-2">
            {props.username ? lang.editUsernameDesc : lang.editEmailDesc}
          </div>}
          <Button
            type="submit"
            disabled={!isValid}
            // disabled={!phoneInput.error}
            cssStyles={theme.blueButton}
            fclassname="my-3"
            onClick={props.username ? updateUserName : updateEmailAddress}
          >
            {lang.update}
          </Button>
        </div>
      </div>

      <style jsx>
        {`
          :global(.MuiDialog-paper) {
            max-width: 450px;
          }
          :global(.MuiDrawer-paper) {
            color: inherit;
          }
          :global(.error-tooltip-container){
            right:0px;
          }
          :global(.error-tooltip){
            right:4%;
          }
          :global(.btmModal){
            background: ${props.isAgency && "#fff"}!important;
            color:${props.isAgency && "#000"}!important;
          }
          :global(.dv__modal_close){
            color:${props.isAgency && "#000"}!important;
          }
          :global(.dv__modelHeading){
            color:${props.isAgency && "#000"}!important;
          }
          :global(.dv__border_bottom_profile_input){
            color:${props.isAgency && "#000"}!important;
            background: ${props.isAgency && "#fff"}!important;
            border: ${props.isAgency && "1px solid #c4c4c4"}!important;
            border-radius:8px !important;
            padding:10px 10px !important;
          }
        `}
      </style>
    </Wrapper>
  );
}
