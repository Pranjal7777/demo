import React from "react";
import Button from "../button/button";
import InputText from "../formControl/inputText";
import useLang from "../../hooks/language";
import useForm from "../../hooks/useForm";
import { startLoader, stopLoader } from "../../lib/global";
import { validateUserNameRequest } from "../../services/auth";
import DVinputText from "./DVinputText";
const DVuserName = (props) => {
    // language hooks
    const [lang] = useLang();
    const { showLable = true } = props;
    const { setStap, signUpdata = {} } = props;

    // form hook
    const [Register, value, error, isValid, setElementError] = useForm({
        defaultValue: { ...signUpdata },
    });

    // validate username
    const validateUserName = async () => {
        return new Promise(async (res, rej) => {
            if (error.userName) {
                rej();
            }
            try {
                const { userName } = value;
                startLoader();
                const response = await validateUserNameRequest(userName);
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
        <form>
            <div className="form-group">
                <DVinputText
                    className="form-control dv_form_control"
                    autoFocus
                    defaultValue={signUpdata.userName}
                    name="userName"
                    error={error.userName}
                    // onBlur={validateUserName}
                    ref={Register({
                        validate: [
                            {
                                validate: "required",
                                error: lang.userNameError,
                            },
                        ],
                    })}
                    placeholder={lang.userNamePlaceHolder}
                ></DVinputText>
            </div>
        </form>
    );
};

export default React.memo(DVuserName);
