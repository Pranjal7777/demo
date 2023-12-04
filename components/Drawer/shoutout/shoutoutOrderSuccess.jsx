import React from 'react';
import { useTheme } from "react-jss";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import { useRouter } from "next/router";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

function Shoutout() {
    const [mobileView] = isMobile()
    const theme = useTheme()
    const [lang] = useLang();
    const router = useRouter();

    const handleBack = () => {
        router.back()
    }

    return (
        <div className='w-100 h-100'>
            {
                mobileView
                    ? (
                        <div className='w-100 h-100 '>
                            <div className='h-100 border d-flex justify-content-center align-items-center'>
                                <h1
                                    onClick={handleBack}
                                    className='d-flex flex-column justify-content-center align-items-center'
                                    style={{
                                        fontSize: '4vw',
                                        fontWeight: '700',
                                        color: '#6b6969'
                                    }}
                                >
                                    <CheckCircleIcon style={{ color: 'var(--l_base)', fontSize: '80px', marginBottom: '16px' }} />
                                    {lang.orderPlacedSuccessfully}
                                </h1>
                            </div>
                        </div>
                    )
                    : <></>
            }
        </div>
    )
}

export default Shoutout
