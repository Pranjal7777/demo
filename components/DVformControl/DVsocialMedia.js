import React from "react";
import Button from "../button/button";
import InputText from "../formControl/inputText";
import useLang from "../../hooks/language";
import useForm from "../../hooks/useForm";
import DVinputText from "./DVinputText";

// We can delete this component .. Not using anywhere
const DVsocialMedia = (props) => {
    const { setStap, signUpdata = {} } = props;
    const [Register, value, error, isValid] = useForm({ emptyAllow: true });
    const [lang] = useLang();
    return (
        <form>
            <div className="form-group">
                <DVinputText
                    className="form-control dv_form_control"
                    autoFocus
                    error={error.link}
                    placeholder={`${lang.linkPlaceHolder}`}
                    {...props}
                />
            </div>
        </form>
    );
};

export default React.memo(DVsocialMedia);
