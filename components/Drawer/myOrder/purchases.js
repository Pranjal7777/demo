import React, { useEffect, useState } from 'react';
import Header from "../../header/header"
import * as config from "../../../lib/config";
import { close_drawer, open_drawer } from "../../../lib/global";
import isMobile from "../../../hooks/isMobile";
import dynamic from "next/dynamic";
import Collapse from '@material-ui/core/Collapse';
import CustButton from "../../button/button";
import { useTheme } from "react-jss"
import useLang from "../../../hooks/language"
import Button from '../../button/button';
import { handleContextMenu } from '../../../lib/helper';

const FigureCloudinayImage = dynamic(
    () => import("../../cloudinayImage/cloudinaryImage"),
    { ssr: false }
);
const Avatar = dynamic(() => import("@material-ui/core/Avatar"), {
    ssr: false,
});


function PurchaseDetails(props) {
    const [mobileView] = isMobile();
    const profile = props.profile;
    const success = false;
    const [lang] = useLang();
    const request = props.requestData
    const requestData = props.requestData
    const [showText, setShowText] = useState(false)
    const [open, setOpen] = useState(false)
    const [isAccepted, setIsAccepted] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false)
    const theme = useTheme()

    const back = () => {
        close_drawer(
            "PURCHASE_DETAILS",
            "right"
        )
    }

    const handleShowText = () => {
        setShowText(!showText)
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCancelYes = () => {
        setIsCancelled(true)
    }

    return (
        <div>
            {mobileView ? (
                <>
                    <Header title={request.userId} icon={config.backArrow} back={back} />
                    <div className='w-100 h-100 d-flex flex-column align-items-center text-center' style={{ position: 'relative', top: '75px' }}>
                        {/* <div className=''> */}
                        <div className='d-flex flex-column aligh-items-center pt-2 mb-4' style={{ width: '90%', background: '#2828289c' }}>
                            {/* <div className='mb-2'>
                                <p className='p-0 m-0' style={{ fontSize: '4.3vw', fontWeight: '600', color: '#f351c2' }}>{lang.myEarnings}</p>
                            </div> */}
                            <div className='d-flex flex-column justify-content-center rounded-bottom p-2'>
                                <p className='p-0 m-0' style={{ fontSize: '3.3vw', fontWeight: '600' }}>{lang.shoutOut_2}</p>
                                <div className='my-2 text-center m-auto callout-none' onContextMenu={handleContextMenu}>
                                    {profile.profilePic ? (
                                        <FigureCloudinayImage
                                            publicId={profile.profilePic}
                                            width={30}
                                            ratio={1}
                                            className="mv_profile_logo_requestShoutout mb-1"
                                        />
                                    ) : (
                                        <Avatar className="mv_profile_logo mb-1  solid_circle_border">
                                            {profile && profile.firstName && profile.lastName && (
                                                <span className="initials" style={{ letterSpacing: '1px' }}>
                                                    {profile.firstName[0] + (profile.lastName ? profile.lastName[0] : '')}
                                                </span>
                                            )}
                                        </Avatar>
                                    )}
                                </div>
                                <div className='d-flex flex-column justify-content-center ml-2'>
                                    <p className='p-0 m-0' style={{ fontSize: '4.2vw', fontWeight: '700' }}>{props.requestData.userName}</p>
                                    <span style={{ fontSize: '3.9vw', fontWeight: '600', marginTop: '-3px', textTransform: 'capitalize' }}>$ {request.price}</span>
                                    {/* <span style={{ fontSize: '3.9vw', fontWeight: '600', marginTop: '-3px', textTransform: 'capitalize', color: `${(request.requestStatus === 'completed') ? 'green' : (request.requestStatus === 'cancelled') ? 'red' : 'blue'}` }}>{request.requestStatus}</span> */}
                                </div>
                            </div>
                            <div className='d-flex justify-content-between align-items-center p-2 border border-top'>
                                <div>
                                    <p className='p-0 m-0' style={{ fontSize: '3.4vw', color: '#c6c3c3', fontWeight: '100', textAlign: 'left' }}>{lang.requestedFor}</p>
                                    <p className='p-0 m-0 text-left' style={{ textTransform: 'capitalize', fontSize: '4vw', fontWeight: '700' }}>{`${profile.firstName} ${profile.lastName}`}</p>
                                </div>
                                <Button
                                    text={'#fff'}
                                    style={{
                                        borderRadius: '5px',
                                        width: '25%',
                                        padding: '0px',
                                        fontSize: '12px',
                                        height: '30px',
                                        textTransform: 'capitalize',
                                        background: 'transparent',
                                        border: `2px solid ${(request.requestStatus === 'completed') ? 'green' : (request.requestStatus === 'cancelled') ? 'red' : 'blue'}`,
                                        color: `${(request.requestStatus === 'completed') ? 'green !important' : (request.requestStatus === 'cancelled') ? 'red' : 'blue'}`
                                    }}>
                                    {request.requestStatus}
                                </Button>
                            </div>
                        </div>
                        {
                            request.requestStatus === 'cancelled'
                                ? <>
                                    <div className='mt-1' style={{ width: '100%', height: '10px', background: '#ebebeb' }}></div>
                                    <div className='text-left p-2' style={{ width: '91%' }}>
                                        <p className='p-0 m-0 mb-2' style={{ fontSize: '4vw', color: 'red', fontWeight: '600' }}>{lang.cancellationReason}</p>
                                        <p className='p-0 m-0'>{lang.changeMyMind}</p>
                                    </div>
                                </>
                                : <></>
                        }
                        {
                            request.requestStatus === 'completed'
                                ? <>
                                    <div className='mt-1' style={{ width: '100%', height: '10px', background: '#ebebeb' }}></div>
                                    <div className='text-left p-2' style={{ width: '91%' }}>
                                        <p className='p-0 m-0 mb-2' style={{ fontSize: '4vw', fontWeight: '600' }}>{lang.shoutoutVideo}</p>
                                        <div className='d-flex'>
                                            <p style={{ fontSize: '3.9vw', fontWeight: '600', color: '#515151', marginRight: '9px' }}>
                                                <img
                                                    src='https://images.pexels.com/photos/2801333/pexels-photo-2801333.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
                                                    style={{ objectFit: 'cover', width: '25vw', height: '25vw' }}
                                                />
                                            </p>
                                            <div className='d-flex flex-column'>
                                                <p style={{ fontSize: '3.9vw', fontWeight: '600', color: '#515151' }}>{lang.videoText}</p>
                                                <Button
                                                    style={{
                                                        borderRadius: '5px',
                                                        width: '40%',
                                                        padding: '0px',
                                                        height: '30px',
                                                        fontSize: '12px',
                                                        textTransform: 'capitalize',
                                                        background: 'transparent',
                                                        border: '2px solid var(--l_base)',
                                                        color: 'var(--l_base)'
                                                    }}>
                                                    {lang.download}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                : <></>
                        }
                        <div className='mt-1' style={{ width: '100%', height: '10px', background: '#ebebeb' }}></div>
                        <div>
                            <div className='w-100 text-left px-4 pt-4' style={{}}>
                                <h1 style={{ fontSize: '4vw', fontWeight: '800' }}>{lang.requestDetails}</h1>
                                <div>
                                    <div>
                                        <p className='p-0 m-0' style={{ fontSize: '3.4vw', color: '#c6c3c3' }}>{lang.shoutoutIntroduce}</p>
                                        <p style={{ fontSize: '3.9vw', fontWeight: '600', color: '#515151' }}>{requestData.intro}</p>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <p className='p-0 m-0' style={{ fontSize: '3.4vw', color: '#c6c3c3' }}>{lang.selectAnOccasion}</p>
                                        <p style={{ fontSize: '3.9vw', fontWeight: '600', color: '#515151' }}>{requestData.occasion}</p>
                                    </div>
                                </div>
                                <div onClick={handleShowText}>
                                    <p className='p-0 m-0' style={{ fontSize: '3.4vw', color: '#c6c3c3' }}>{lang.addInstructions}</p>
                                    {/* {
                                        showText
                                            ? <></>
                                            : <p style={{ fontSize: '3.9vw', fontWeight: '600', color: '#515151' }}>{`${(requestData.instructions).substr(0, 40)}...`}</p>
                                    } */}
                                    <Collapse in={showText}>
                                        <div>
                                            <span style={{ fontSize: '3.9vw', fontWeight: '600', color: '#515151' }}>{requestData.instructions}</span>
                                        </div>
                                    </Collapse>
                                </div>
                                <div>
                                    <div onClick={handleOpen}>
                                        <p className='p-0 m-0' style={{ fontSize: '3.4vw', color: '#c6c3c3' }}>{lang.videoAttachment}</p>
                                        <p className='p-0 m-0 py-3' style={{ fontSize: '3.9vw', fontWeight: '600', color: '#515151' }}>
                                            <img
                                                src='https://images.pexels.com/photos/2801333/pexels-photo-2801333.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
                                                style={{ objectFit: 'cover', width: '30vw', height: '30vw' }}
                                            />
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-1' style={{ width: '100%', height: '10px', background: '#ebebeb' }}></div>
                            <div className='px-4 py-2 d-flex flex-column text-left' style={{}}>
                                <p className='p-0 m-0 mb-1' style={{ fontSize: '4vw', fontWeight: '600' }}>{lang.paymentDetails}</p>
                                <div className='d-flex justify-content-between mb-2'>
                                    <p className='p-0 m-0' style={{ fontSize: '3.4vw', color: '#646363' }}>{lang.amountPaid}</p>
                                    <span style={{ fontSize: '3.9vw', fontWeight: '600', marginTop: '-3px', textTransform: 'capitalize' }}>$ {lang.paidPrice}</span>
                                </div>
                                <div className='mb-4 d-flex justify-content-between'>
                                    <p className='p-0 m-0' style={{ fontSize: '3.4vw', color: '#646363' }}>{lang.paidCardending}</p>
                                    <span style={{ fontSize: '3.9vw', fontWeight: '600', marginTop: '-3px', textTransform: 'capitalize' }}></span>
                                </div>
                                {
                                    request &&
                                        request.requestStatus == 'pending'
                                        ? <p className='p-0 m-0' style={{ fontSize: '3.4vw', color: '#c6c3c3' }}>{lang.cancelOrder}</p>
                                        : <></>
                                }
                            </div>
                        </div>
                        {/* </div> */}
                    </div>
                </>
            ) : (
                <>
                    <h5 className="content_heading px-1 m-0 myAccount_sticky_header">
                        Desktop Screen
                    </h5>
                    <p>Work in progress</p>
                </>
            )
            }
        </div >
    )
}

export default PurchaseDetails;
