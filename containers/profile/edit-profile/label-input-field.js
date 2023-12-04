import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { useTheme } from "react-jss";
import { Tooltip } from "@material-ui/core";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import InputText from "../../../components/formControl/inputText";
import InputTextArea from "../../../components/formControl/textArea";
import Image from "../../../components/image/image";
import {
  Chevron_Right_Darkgrey,
  // EDIT_WHITE,
  IMAGE_LOCK_ICON,
  IMAGE_LOCK_ICON_Grey,
  INFO,
  LOCK_ICON,
} from "../../../lib/config";
import isMobile from "../../../hooks/isMobile";
import Icon from "../../../components/image/icon";

export default function InputField(props) {
  const { disabled = false } = props;
  const { addBankAccount } = props;
  const [mobileView] = isMobile();
  const theme = useTheme();

  const [tooltipShow, setToolTipShow] = useState(false);

  return (
    <div className={props.bioInput ? "form-group m-0" : "form-group"}>
      {props.label ? (
        <label
          className={
            mobileView ? "mv_label_profile_input" : "dv__label_profile_input mb-0 dv_base_color dv_base_color"
          }
        >
          {props.label}
          {props.informationText && <Tooltip open={tooltipShow} title={props.informationText} placement="top" arrow>
            <span className="ml-1 cursorPtr fntSz30"
              onClick={() => {
                setToolTipShow(true);
                setTimeout(() => setToolTipShow(false), 3000);
              }}
            >
              <InfoOutlinedIcon style={{ fontSize: 16 }} />
            </span>
          </Tooltip>
          }
        </label>
      ) : (
        ""
      )}
      <div className="position-relative">
        {!props.textarea ? (
          <InputText
            // className={
            //   mobileView
            //     ? `form-control mv_form_control_profile_input ${
            //         props.readOnly && "grey_color"
            //       }`
            //     : `form-control ${
            //         props.className
            //           ? props.className
            //           : "dv__form_control_profile_input"
            //       } ${props.readOnly && "grey_color"}`
            // }
            editLabel={true}
            id={props.id}
            name={props.name}
            placeholder={props.placeholder}
            defaultValue={props.value}
            value={props.value}
            // value={values.fieldValue}
            disabled={disabled}
            error={props.error}
            type={props.type}
            onChange={props.onChange}
            onBlur={props.onBlur}
            readOnly={props.readOnly}
            {...props}
          />
        ) : (
          <InputTextArea
            key={props.name == "bio" ? "" : props.value}
            className={
              !mobileView
                ? "dv__form_control_profile_textarea_white"
                : props.bgWhite
                  ? "mv_form_control_profile_textarea_white"
                  : "form-control mv_form_control_profile_textarea"
            }
            id={props.id}
            name={props.name}
            placeholder={props.placeholder}
            defaultValue={props.value}
            rows={props.rows}
            value={props.value}
            disabled={disabled}
            error={props.error}
            onChange={props.onChange}
            onBlur={props.onBlur}
            {...props}
          />
        )}

        {props.edit && (
          <Image
            src={
              // mobileView ? EDIT_WHITE :
              Chevron_Right_Darkgrey
            }
            className={mobileView ? "edit-icon" : "dv__edit-icon"}
          />
        )}
        {props.lock && (
          <Icon
            icon={`${mobileView ? IMAGE_LOCK_ICON : IMAGE_LOCK_ICON_Grey}
			${mobileView ? "#lock_icon" : ""}`}
            color={theme.type === "light" ? "#000" : "#fff"}
            width={22}
            height={21}
            style={{ position: "absolute", top: "27%", right: "14px" }}
          />
        )}
        {props.icon && (
          <Icon
            icon={`${props.icon}${props.iconId}`}
            color={props.color}
            width={22}
            height={21}
            style={{ position: "absolute", top: "25%", right: "14px" }}
          />
        )}
      </div>
      <style jsx>
        {`
          :global(.mv_form_control_profile_textarea_white) {
            width: 100%;
            height: 50px;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            border: 1px solid var(--l_border) !important;
            background-color: #fff;
            background-clip: padding-box;
            border-radius: 0.25rem;
            -webkit-transition: border-color 0.15s ease-in-out,
              box-shadow 0.15s ease-in-out;
            transition: border-color 0.15s ease-in-out,
              box-shadow 0.15s ease-in-out;
          }

          :global(.mv_form_control_profile_textarea_white:focus) {
            border: 1px solid var(--l_border) !important;
          }
        `}
      </style>
    </div>
  );
}
