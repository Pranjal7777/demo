import React, { useEffect, useState } from "react";
import Button from "../../../components/button/button";
import RadioButton from "../../../components/formControl/radioButton";
import useLang from "../../../hooks/language";
import useForm from "../../../hooks/useForm";
import { focus } from "../../../lib/global";
import { useTheme } from "react-jss";

const Gender = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const { setStap, signUpdata = {} } = props;
  const [gender, setGender] = useState(signUpdata.gender || "");

  useEffect(() => {
    // focus("firstName");
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e & e.preventDefault();
        setStap({
          gender: gender,
        });
      }}
    >
      <div className="w-330 mx-auto content-secion pb-3">
        <div className="col-12 text-app">
          <div className="mb-4 gender-radio">
            <div className="form-group position-relative ">
              <RadioButton
                name={"gender"}
                value={"Male"}
                label={"Male"}
                checked={gender == "Male"}
                onChange={(value) => setGender(value)}
              ></RadioButton>
            </div>
            <div className="form-group position-relative">
              <RadioButton
                name={"gender"}
                value={"Female"}
                label={"Female"}
                checked={gender == "Female"}
                onChange={(value) => setGender(value)}
              ></RadioButton>
            </div>
            <div className="form-group position-relative">
              <RadioButton
                name={"other"}
                value={"Other"}
                label={"Other"}
                checked={gender == "Other"}
                onChange={(value) => setGender(value)}
              ></RadioButton>
            </div>
            {/* <Radio></Radio> */}
          </div>
        </div>
      </div>
      <div className="posBtm">
        <Button
          disabled={!gender}
          type="submit"
          // onClick={(e) => {
          //   e & e.preventDefault();
          //   setStap({
          //     gender: gender,
          //   });
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

export default React.memo(Gender);
