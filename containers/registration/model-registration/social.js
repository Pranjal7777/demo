import React from "react";
import Button from "../../../components/button/button";
import InputText from "../../../components/formControl/inputText";
import useLang from "../../../hooks/language";
import useForm from "../../../hooks/useForm";
import { useTheme } from "react-jss";

const SocialMedia = (props) => {
  const theme = useTheme();
  const { setStap, signUpdata = {} } = props;
  const [Register, value, error, isValid] = useForm({ emptyAllow: true });
  const [lang] = useLang();
  return (
    <form
      onSubmit={(e) => {
        e && e.preventDefault();
        setStap(value);
      }}
    >
      <div className="w-330 mx-auto content-secion pb-3">
        <div className="col-12 text-center">
          <div className="mb-4">
            <div className="form-group">
              <InputText
                autoFocus
                name="link"
                defaultValue={signUpdata.link}
                inputMode="url"
                autoCapitalize="off"
                error={error.link}
                ref={Register({
                  emptyAllow: true,
                  validate: [
                    {
                      validate: "link",
                      error: lang.linkError,
                    },
                  ],
                })}
                placeholder={lang.linkPlaceHolder}
              ></InputText>
            </div>
          </div>
        </div>
      </div>
      <div className="posBtm">
        <Button
          disabled={!isValid}
          type="submit"
          // onClick={(e) => {
          //   e && e.preventDefault();
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

export default React.memo(SocialMedia);
