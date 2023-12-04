import Router, { useRouter } from "next/router";
import React from 'react';
import DvHeader from '../../containers/DvHeader/DvHeader';
import useLang from "../../hooks/language";
import { ABOUT_US_BANNER, DARIA_REM, FERNINAND } from "../../lib/config";
import Img from "../ui/Img/Img";
import isMobile from "../../hooks/isMobile";
import MarkatePlaceHeader from "../../containers/markatePlaceHeader/markatePlaceHeader";

const AboutUs = (props) => {
    const [lang] = useLang();
    const [mobileView] = isMobile();

    return (
        <>
            {
                mobileView ?
                    <div className="w-100 custom_bg_theme">
                        <div className="container">
                            <div style={{position:'sticky', top:'0', zIndex:'999'}} className="w-100 col-12 px-0 py-2 d-flex justify-content-between align-items-center mySubscription">
                                <ul
                                    className="breadcrumb breadcrumb__custom bg-transparent mb-0"
                                >
                                    <li
                                        className="breadcrumb-item cursorPtr"
                                        onClick={() => Router.push("/")}
                                    >
                                        <span>{lang.home}</span>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <span className="active">{lang.aboutUs}</span>
                                    </li>
                                </ul>
                                <div>
                                    <button
                                        style={{fontSize:'35px'}}
                                        type="button"
                                        className="close custom_cancel_btn dv_appTxtClr"
                                        data-dismiss="modal"
                                        onClick={() => Router.push("/")}
                                    >
                                        {lang.btnX}
                                    </button>
                                </div>
                            </div>

                            <div style={{height:'20vh'}} className="about_us_banner pb-3 pb-md-5">
                                <Img src={ABOUT_US_BANNER} className="w-100 h-100 object-fit-cover" />
                            </div>

                            <h3 className="txt-bold dv_appTxtClr">{lang.weFanzly}</h3>
                            <p className="txt-medium fntlightGrey">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                            <div className="text_image_container">
                                <div className="row py-5">
                                    <div className="col-12 col-md-5 pb-2">
                                        <Img src={DARIA_REM} className="w-100 h-100" />
                                    </div>
                                    <div className="col-12 col-md-7 d-flex flex-column justify-content-center">
                                        <h3 className="txt-bold dv_appTxtClr">Lorem Ipsum</h3>
                                        <p className="txt-medium fntlightGrey">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                    </div>
                                </div>
                                <div className="row py-5">
                                    <div className="col-12 col-md-5 pb-2">
                                        <Img src={FERNINAND} className="w-100 h-100" />
                                    </div>
                                    <div className="col-12 col-md-7 d-flex flex-column justify-content-center">
                                        <h3 className="txt-bold dv_appTxtClr">Lorem Ipsum</h3>
                                        <p className="txt-medium fntlightGrey">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <>
                        <MarkatePlaceHeader setActiveState={props.setActiveState} {...props} />
                        <div style={{ height: '80px', paddingTop: '80px' }}>
                            <div className="w-100 custom_bg_theme">
                                <div className="container">
                                    <div className="col-12 px-0">
                                        <ul
                                            className="breadcrumb breadcrumb__custom py-4"
                                            style={{
                                                zIndex: 2,
                                                borderRadius: 0,
                                                height: "78px",
                                                alignItems: "center",
                                            }}
                                        >
                                            <li
                                                className="breadcrumb-item cursorPtr"
                                                onClick={() => Router.push("/")}
                                            >
                                                <span>{lang.home}</span>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <span className="active">{lang.aboutUs}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="about_us_banner pb-5">
                                        <Img src={ABOUT_US_BANNER} className="w-100 h-100" />
                                    </div>

                                    <h3 className="txt-bold dv_appTxtClr">{lang.weFanzly}</h3>
                                    <p className="txt-medium fntlightGrey">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                                    <div className="row text_image_container">
                                        <div className="row py-5">
                                            <div className="col-12 col-md-7 d-flex flex-column justify-content-center">
                                                <h3 className="txt-bold dv_appTxtClr">Lorem Ipsum</h3>
                                                <p className="txt-medium fntlightGrey">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                            </div>
                                            <div className="col-12 col-md-5">
                                                <Img src={DARIA_REM} className="w-100 h-100" />
                                            </div>
                                        </div>
                                        <div className="row flex-md-row-reverse py-2 py-md-5">
                                            <div className="col-12 col-md-7 d-flex flex-column justify-content-center">
                                                <h3 className="txt-bold dv_appTxtClr">Lorem Ipsum</h3>
                                                <p className="txt-medium fntlightGrey">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                            </div>
                                            <div className="col-12 col-md-5">
                                                <Img src={FERNINAND} className="w-100 h-100" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }
            <style jsx>{`
                :global(.custom_bg_theme) {
                    background-color: var(--theme);
                }
            `}
            </style>
        </>
    )
}

export default AboutUs;
