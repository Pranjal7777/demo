import React, { useEffect } from "react";
import Button from "../../../components/button/button";
import InputText from "../../../components/formControl/inputText";
import useLang from "../../../hooks/language";
import useForm from "../../../hooks/useForm";
import { focus, movetoNext } from "../../../lib/global";
import { useTheme } from "react-jss";

const Name = (props) => {
  const [lang] = useLang();
  const theme = useTheme();

  const { setStap, signUpdata = {}, setUserName } = props;
  const [Register, value, error] = useForm({
    defaultValue: { ...signUpdata },
  });

  useEffect(() => {
    focus("firstName");
  }, []);

  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  React.useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

  useEffect(() => {
    ((firstName = "", lastName = "") => {
      if (firstName === null) firstName = ""
      if (lastName === null) lastName = ""
      setUserName(firstName + lastName)
    })(value.firstName, value.lastName)
  }, [value.firstName, value.lastName])

  return (
    <form
      onSubmit={(e) => {
        e & e.preventDefault();
        setStap(value);
      }}
    >
      <div className="w-330 mx-auto">
        <div className="col-12 text-center">
          <div className="mb-4">
            <InputText
              type="text"
              name="firstName"
              id="firstName"
              autoFocus
              onKeyUp={(e) => movetoNext(e, "lastName")}
              error={error.firstName}
              defaultValue={signUpdata.firstName}
              className="txt-book"
              ref={Register({
                onBlur: props.validateUserName,
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
              type="text"
              name="lastName"
              id="lastName"
              // onEvent={(e)=>movetoNext(e, 'lastName')}
              error={error.lastName}
              defaultValue={signUpdata.lastName}
              className="txt-book"
              ref={Register({
                onBlur: props.validateUserName,
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
          disabled={!value.firstName || !value.lastName}
          type="submit"
          role="button"
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
