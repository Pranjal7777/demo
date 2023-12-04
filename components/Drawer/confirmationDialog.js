import React from "react";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { useTheme } from "react-jss";
import Button from "../button/button";
import { close_dialog } from "../../lib/global";
import { P_CLOSE_ICONS } from "../../lib/config";
import Icon from "../image/icon";

export default function ConfirmDialog(props) {
    const theme = useTheme();
    const { title, subtitle, btn_class, cancelT, submitT, noHandler, onClose } = props;
    const [mobileView] = isMobile();

    const handleClose = () => {
        props?.no && props?.no();
        noHandler?.();
        onClose();
    }

    return (
        <Wrapper>
            <div className="btmModal">
                <Icon
                    icon={`${P_CLOSE_ICONS}#cross_btn`}
                    size={mobileView ? 20 : 17}
                    unit={"px"}
                    viewBox="0 0 20 20"
                    class="position-absolute pointer"
                    color={'var(--l_app_text)'}
                    style={{ top: "10px", right: mobileView ? "15px" : "10px", zIndex: 7 }}
                    onClick={() => props.onClose()}
                />
                <div className="modal-dialog rounded position-relative">

                    <div
                        className={
                            mobileView
                                ? "modal-content-mobile pb-3 pt-4"
                                : "modal-content py-3 px-5 text-center"
                        }
                    >
                        <div className="col-12 px-4 mx-auto">
                            <h6
                                className={mobileView ? "mb-0 fntSz26 pb-2 w-100 bold" : "dv__fnt20 txt-black mx-auto pb-2"}
                            >
                                {title}
                            </h6>
                            <p className="text-app">{subtitle}</p>
                            <div
                                className={
                                    mobileView
                                        ? "row pt-3 align-items-center justify-content-between"
                                        : "row align-items-center justify-content-between"
                                }
                            >
                                <div className={`${mobileView ? "w-75" : "w-100"} m-auto`}>
                                    <Button
                                        type="button"
                                        fclassname={`gradient_bg rounded-pill py-2 ${btn_class ? btn_class : ""}`}
                                        cssStyles={theme.blueButton}
                                        onClick={(e) => {
                                            props.yes && props.yes();
                                            mobileView ? props.onClose() : close_dialog("confirmationDialog");
                                        }}
                                    >
                                        {submitT || "Confirm"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
