import { useRouter } from 'next/router';
import Script from 'next/script';
import React from 'react'
import { useTheme } from 'react-jss';
import Slider from 'react-slick';
import CancelIcon from "@material-ui/icons/Cancel";
import Icon from '../components/image/icon';
import { backArrow, backArrow_lightgrey, google_icon_white } from '../lib/config';
import { useState } from 'react';
import Button from '../components/button/button';
import isMobile from '../hooks/isMobile';
import Image from '../components/image/image';
import { close_drawer } from '../lib/global';

function JoinJuicy() {
    const theme = useTheme();
    const router = useRouter();
    const [activeClass, setActiveClass] = useState('')
    const [mobileView] = isMobile();

    const signImageList = [
        { id: 1, webImage: '/Bombshell/images/signup-user-banner.png' },
        { id: 2, webImage: '/Bombshell/images/signup-creator-banner.png' },
        { id: 3, webImage: '/Bombshell/images/signup-login-banner.png' },
    ];
    const settings = {
        dots: true,
        className: "w-100 h-100",
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: false,
    };

    const handleClickRoute = () => {
        switch (activeClass) {
            case '1':
                return window.open('/signup-as-user', '_self')
                break;
            case '2':
                return window.open('/signup-as-creator', "_self")
                break;
            default:
                break;
        }
    }
    return (
        <>
            <Script
                defer={true}
                src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js"
            />

            {!mobileView ? (<div className="h-screen overflow-hidden">
                <div
                    className="col-12 row p-0 m-0"
                    style={{ height: "100vh", overflow: "hidden" }}
                >
                    <div className=" p-0 vh-100 d-flex reg__left__sec">
                        <Slider {...settings}>
                            {signImageList?.map((img) => (
                                <div className="cursorPtr w-100  " key={img._id}>
                                    <img
                                        src={img?.webImage}
                                        alt="desktop login image"
                                        className="w-100 wrap"
                                        style={{ objectFit: "fill" }}
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <div
                        className=" d-flex justify-content-center vh-100 reg__right__sec"
                        style={{
                            background: `${theme.type == "light" ? "#FFF" : "#242a37"}`,
                            overflowY: "auto",
                        }}
                    >
                        <div
                            className="text-muted cursorPtr position-absolute"
                            style={{ right: 10, top: 10 }}
                            onClick={() => router.push("/")}
                        >
                            <CancelIcon fontSize="large" />
                        </div>
                        <div className="m-auto  reg__right__sec__inner pt-5 d-flex flex-column justify-content-between align-items-center h-100">
                            <div>
                                <h3>Join Juicy as a </h3>
                            </div>
                            <div className='row mx-0'>
                                <div className='col-6 px-2'>
                                    <div className={`h-100 cursorPtr ${activeClass == '1' && 'active_class'}`} onClick={() => setActiveClass('1')} style={{ padding: 1 }}>
                                        <div style={{ background: '#1E1C22', borderRadius: "8px", height: '100%', }} className='p-3'>
                                            <h5 className='text-center mb-3'>User</h5>
                                            <div className='fntSz12' style={{ color: '#8C8DB2', letterSpacing: '0.05em' }}>
                                                Fill up this form to join thousands of other users in the Juicy Community to watch the hottest content from the top creators around the world.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-6 px-2'>
                                    <div className={`h-100 cursorPtr ${activeClass == '2' && 'active_class'}`} onClick={() => setActiveClass('2')} style={{ padding: 1 }}>
                                        <div style={{ background: '#1E1C22', borderRadius: "8px", height: '100%', }} className='p-3'>
                                            <h5 className='text-center mb-3'>Creator</h5>
                                            <div className='fntSz12' style={{ color: '#8C8DB2', letterSpacing: '0.05em' }}>
                                                Fill up this form to crate your Juicy Creator account, the firm requires you to submit your identification proof, rest assured this will be stored securely and we will not use it for any other purposes other than account verification.                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-100 p-5'>
                                <Button
                                    type="button"
                                    onClick={() => handleClickRoute()}
                                    cssStyles={{
                                        ...theme.blueButton,
                                        background:
                                            "linear-gradient(91.19deg, rgba(255, 26, 170) 0%, #460a56 100%)",
                                        padding: "16px 0px",
                                        fontFamily: 'Roboto',
                                    }}
                                    fclassname='font-weight-500'
                                    children={"Continue"}
                                    disabled={!activeClass}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>) : (
                    <div className="vh-100" style={{ color: `${theme.text}` }}>

                        <div className="position-relative d-flex align-items-center justify-content-center" style={{ height: '5rem' }}>
                            <div className="position-absolute" style={{ left: '1rem', top: '1.5rem' }}>
                            <Image
                                alt="model-registration"
                                onClick={() => close_drawer('join_juicy')}
                                src={theme.type === "light" ? backArrow : backArrow_lightgrey}
                                width={28}
                                id="scr2"
                            />
                        </div>
                        {/* Heading */}
                            <h3 className="m-0" style={{ color: `${theme.text}` }}>Join Now</h3>
                    </div>

                    <div className="container">
                            <div className='row mx-0 ' style={{ overflow: 'auto', maxHeight: 'calc(calc(var(--vhCustom, 1vh) * 100)  - 12rem)', paddingTop: 'calc(calc(var(--vhCustom, 1vh) * 33)  - 12rem)' }}>
                                <div className='col-12 col-sm-6 my-2'>
                                <div className={`h-100 cursorPtr ${activeClass == '1' && 'active_class'}`} onClick={() => setActiveClass('1')} style={{ padding: 1 }}>
                                    <div style={{ background: '#1E1C22', borderRadius: "8px", height: '100%', }} className='p-3'>
                                            <h3 className='text-center mb-3'>User</h3>
                                            <div className='fntSz16' style={{ color: '#8C8DB2', letterSpacing: '0.05em' }}>
                                            Fill up this form to join thousands of other users in the Juicy Community to watch the hottest content from the top creators around the world.
                                        </div>
                                    </div>
                                </div>
                            </div>
                                <div className='col-12 col-sm-6 my-2'>
                                <div className={`h-100 cursorPtr ${activeClass == '2' && 'active_class'}`} onClick={() => setActiveClass('2')} style={{ padding: 1 }}>
                                    <div style={{ background: '#1E1C22', borderRadius: "8px", height: '100%', }} className='p-3'>
                                            <h3 className='text-center mb-3'>Creator</h3>
                                            <div className='fntSz16' style={{ color: '#8C8DB2', letterSpacing: '0.05em' }}>
                                            Fill up this form to crate your Juicy Creator account, the firm requires you to submit your identification proof, rest assured this will be stored securely and we will not use it for any other purposes other than account verification.                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                            <div className="posBtm p-0 pb-4" style={{ bottom: 0, background: '#121212', color: `${theme.text}`, height: '7rem' }}>
                            <Button
                                type="button"
                                onClick={() => handleClickRoute()}
                                cssStyles={{
                                    ...theme.blueButton,
                                    background:
                                        "linear-gradient(91.19deg, rgba(255, 26, 170) 0%, #460a56 100%)",
                                    padding: "14px 0px",
                                    fontFamily: 'Roboto',
                                }}
                                fclassname='my-3 font-weight-500'
                                children={'Continue'}
                                disabled={!activeClass}
                            />
                        </div>
                    </div>
                </div>
            )}
            <style jsx>{`
                :global(.custBtn) {
                display: initial !important;
                }
                .active_class{
                    background: linear-gradient(94.91deg, #7426F2 0%, #C926F2 100%);
                    padding: 1px;
                    border-radius: 8px;
                }
                .reg__left__sec {
                background: #121212;
                width: 45%;
                }
                .reg__right__sec {
                overflow-y: scroll;
                background: ${theme.type == "light" ? "#fff" : "#121212"} !important;
                width: 55%;
                }
                .reg__right__sec__inner {
                    width: 45vw;
                    max-width: 39rem;
                    min-width: 30rem;
                }
                .reg__right__sec__inner__child {
                right: 30px;
                top: 20px;
                position: absolute;
                }

                :global(.slick-dots) {
                font-family: "slick";
                font-size: 10px;
                line-height: 20px;
                position: absolute;
                bottom: 0px;
                left: 40%;
                width: 100px;
                height: 49px;
                content: "•";
                text-align: center;
                color: #fff;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                }
                :global(.slick-arrow){
                display: none !important;
                }
                :global(.slick-dots li.slick-active button:before) {
                opacity: 1;
                color: #fff;
                font-size: 9px;
                }
                :global(.slick-dots li button:before) {
                opacity: 0.5;
                color: var(--l_light_grey);
                }
                :global(.dt__cls p span) {
                    color: #8C8DB2 !important;
                  }
                  :global(.MuiDialogContent-root.card_bg) {
                    width: 28rem;
                    background-color: #1E1C22 !important;
                    border-radius: 1rem !important;
                  }
                  :global(.mu-dialog>div>div){
                    min-width: 25rem;
                    border-radius: 1rem !important;
                  }
                  :global(.MuiPaper-root) {
                    background-color: #121212 !important;
                  }
            `}</style>
        </>
    )
}

export default JoinJuicy;