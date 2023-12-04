import React from "react";
import Button from "../../../components/button/button";
import InputText from "../../../components/formControl/inputText";
import useLang from "../../../hooks/language";
import useForm from "../../../hooks/useForm";
import { startLoader, stopLoader } from "../../../lib/global";
import { validateUserNameRequest } from "../../../services/auth";
import { useTheme } from "react-jss";
import { useEffect } from "react";

const UserName = (props) => {
  const theme = useTheme();
  // language hooks
  const [lang] = useLang();
  const { showLable = true, userName, setUserName } = props;
  const { setStap, signUpdata = {} } = props;

  // form hook
  const [
    Register,
    value,
    error,
    isValid,
    setElementError,
    validTik,
    setValidTik,
  ] = useForm({
    defaultValue: { ...signUpdata },
  });
useEffect(()=>{
  value.userName = userName
  validateUserName(userName);
},[])

  useEffect(() => {
    setUserName(value.userName)
  }, [value.userName])

  // validate username
  const validateUserName = async (inputValue) => {
    return new Promise(async (res, rej) => {
      try {
        const { userName } = value;

        // startLoader();
        const response = await validateUserNameRequest(inputValue || userName);
        setValidTik(true);
        res();
      } catch (e) {
        setElementError("userName", e.response.data.message);
        rej();
      }

      stopLoader();
    });
  };

  //check validations and if valid then submit form
  const goToNext = async (e) => {
    e && e.preventDefault();
    // check email validation whiile submit
    try {
      await validateUserName();
    } catch (e) {
      // console.log("errorro", e);
      return;
    }
    setStap(value);
  };

  // console.log("usernamew", value);
  return (
    <form onSubmit={goToNext}>
      <div className={`w-330 mx-auto ${showLable ? "py-3" : "pb-3"}`}>
        <div className="col-12 text-center">
          {/* {showLable && <h4 className="titleH4 mb-5">{lang.enterUserName}</h4>} */}
          <div className="mb-4">
            <InputText
              valid={validTik}
              autoFocus
              defaultValue={userName}
              name="userName"
              error={error.userName}
              // onBlur={validateUserName}
              ref={Register({
                onBlur: validateUserName,
                validate: [
                  {
                    validate: "required",
                    error: lang.userNameError,
                  },
                ],
              })}
              placeholder={lang.userNamePlaceHolder}
            ></InputText>
          </div>
        </div>
      </div>
      <div className="posBtm">
        <Button
          disabled={!isValid || error.userName}
          type="submit"
          // onClick={goToNext}
          cssStyles={theme.blueButton}
          id="scr6"
        >
          {lang.next}
        </Button>
      </div>
    </form>
  );
};

export default React.memo(UserName);
