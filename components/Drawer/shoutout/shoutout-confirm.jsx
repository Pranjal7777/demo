import React from 'react';
import { useTheme } from "react-jss";
import useLang from "../../../hooks/language";
import isMobile from "../../../hooks/isMobile";
import { open_drawer, close_drawer } from '../../../lib/global';
import CustButton from "../../button/button";
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import EditIcon from '@material-ui/icons/Edit';

function Shoutout(props) {
    const [mobileView] = isMobile()
    const theme = useTheme()
    const [lang] = useLang();

    return (
        <div>
            {
                mobileView
                    ? (
                        <div className='p-3 py-4'>
                            <div>
                                <h1 className='bold' style={{ fontSize: '6vw' }}>Are you sure you want a shoutout from Claudia for $15 ?</h1>
                                <p style={{ fontSize: '4vw' }}>We will be use your default billing address and default card</p>
                            </div>
                            <div className='w-100 d-flex justify-content-between'>
                                <div className='d-flex'>
                                    <LocationOnIcon />
                                    <p className='ml-3 mr-4'>{lang.jerdaGlens}</p>
                                </div>
                                <EditIcon />
                            </div>
                            <div className='w-100 d-flex justify-content-between'>
                                <div className='d-flex'>
                                    <CreditCardIcon />
                                    <p className='ml-3 mr-4'>{lang.cardEnding}</p>
                                </div>
                                <EditIcon />
                            </div>
                            <div className='d-flex mt-4'>
                                <CustButton
                                    type="submit"
                                    style={{ width: '70%', marginRight: '10px' }}
                                    onClick={
                                        () => close_drawer(
                                            "ShoutoutConfirm",
                                            "bottom"
                                        )
                                    }
                                    cssStyles={theme.blueButton}
                                >
                                    {lang.no}
                                </CustButton>
                                <CustButton
                                    type="submit"
                                    style={{ width: '70%', marginLeft: '10px' }}
                                    onClick={
                                        () => {
                                            props.handleFinalData()
                                            open_drawer(
                                                "ShoutoutOrderSuccess",
                                                "right"
                                            )
                                        }
                                    }
                                    cssStyles={theme.blueButton}
                                >
                                    {lang.yes}
                                </CustButton>
                            </div>
                        </div>
                    )
                    : <></>
            }
        </div>
    )
}

export default Shoutout
