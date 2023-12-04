import React, { useEffect } from "react";
import Button from "../../../components/button/button";
import InputText from "../../../components/formControl/inputText";
import useLang from "../../../hooks/language";
import useForm from "../../../hooks/useForm";
import { focus, movetoNext } from "../../../lib/global";
import { useTheme } from "react-jss";

const Name = (props) => {
  const theme = useTheme();
  // language hooks
  const [lang] = useLang();
  const { setStap, signUpdata = {}, setUserName } = props;
  // form hook
  const [Register, value, error, isValid] = useForm({
    defaultValue: { ...signUpdata },
  });

  useEffect(() => {
    focus("firstName");
  }, []);

  useEffect(() => {
    ((firstName = "", lastName = "") => {
      if (firstName === null) firstName = ""
      if (lastName === null) lastName = ""
      setUserName(firstName + lastName)
    })(value.firstName, value.lastName)
  }, [value.firstName, value.lastName])

  // console.log("jwidj", isValid);
  return (
    <form
      onSubmit={(e) => {
        e & e.preventDefault();
        setStap(value);
      }}
    >
      <div className="w-330 mx-auto">
        <div className="col-12 text-center">
          {/* <h4 className="titleH4 mb-5">{lang.enterName}</h4> */}
          <div className="mb-4">
            <InputText
              autoFocus
              id="firstName"
              defaultValue={signUpdata.firstName}
              name="firstName"
              type="text"
              onKeyUp={(e) => movetoNext(e, "lastName")}
              error={error.firstName}
              ref={Register({
                validate: [
                  {
                    validate: "required",
                    error: lang.firstNameError,
                  },
                ],
              })}
              placeholder={lang.firstNamePlaceholder}
            ></InputText>
            <InputText
              defaultValue={signUpdata.lastName}
              name="lastName"
              id="lastName"
              type="text"
              error={error.lastName}
              ref={Register({
                validate: [
                  {
                    validate: "required",
                    error: lang.lastNameError,
                  },
                ],
              })}
              placeholder={lang.lastNamePlaceholder}
            ></InputText>
          </div>
        </div>
      </div>
      <div className="posBtm">
        <Button
          disabled={!isValid}
          type="submit"
          // onClick={(e) => {
          //   e & e.preventDefault();
          //   setStap(value);
          // }}
          cssStyles={theme.blueButton}
          id="scr6"
        >
          {lang.next}
        </Button>
      </div>
    </form>
  );
};

export default React.memo(Name);
