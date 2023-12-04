import React from "react";
import Router from "next/router";

import { P_CLOSE_ICONS, CLOSE_ICON_WHITE_IMG, CLOSE_ICON_WHITE, backArrow_lightgrey, CLOSE_ICON_BLACK } from "../../lib/config";
import Image from "../image/image";
import Wrapper from "../../hoc/Wrapper";
import { useTheme } from "react-jss";
import Icon from "../image/icon";

const CustomHeader = (props) => {
    const { children, className, back, size, icon, mainTitle, title, subTitle, subTitleClick, mobileView, ...other } = props;
    const theme = useTheme();
    return (
        <Wrapper>
            <div className={`d-flex flex-column ${className ? className : ''}`}>
                <div className="w-100 d-flex justify-content-end">
                    {theme.type === "light"
                        ? <Image
                            src={icon ? icon : CLOSE_ICON_BLACK}
                            onClick={() => {
                                back ? back() : Router.back();
                            }}
                            width={size || 18}
                            className="pointer float-left ml-1"
                            alt="close_icon"
                            style={{ marginBottom: "4px" }}
                        />
                        : <Icon
                            icon={(icon ? CLOSE_ICON_WHITE : CLOSE_ICON_WHITE) + "#close-white"}
                            onClick={() => {
                                back ? back() : Router.back();
                            }}
                            width={size || 20}
                            class="pointer float-left ml-1"
                            alt="close_icon"
                        />
                    }

                </div>
                {mainTitle && <h3 className="px-3">{mainTitle}</h3>}
                <div className="d-flex align-items-center justify-content-between px-3">
                    <div className="text-center txt-heavy ">
                        <p className={`m-0 fntSz18 ${mobileView ? "appTextColor" : ""}`}>{title}</p>
                    </div>
                    <div className="p-0 text-center fntSz10 mr-3 mr-xl-0 pointer">
                        <div onClick={subTitleClick} className="w_40 txt-heavy text-right" style={{ color: 'var(--l_base)', fontSize: '12px' }}>{subTitle}</div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};
export default CustomHeader;
