import React from 'react'
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import EditIcon from '@material-ui/icons/Edit';
import dynamic from 'next/dynamic';
import useLang from '../../../hooks/language';
import { useTheme } from 'react-jss';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Wrapper from '../../wrapper/wrapper';
import CreditCardIcon from '@material-ui/icons/CreditCard';
const Button = dynamic(() => import("../../../components/button/button"), { ssr: false });

const confirmVideoCall = () => {
    const [lang] = useLang();
    const theme = useTheme();

    return (
        <div className="p-4">
            <div className="fntSz22 txt-black py-3">Are you sure you want a video call request from Claudia for $15 ?</div>
            <div className="liteColorTxt fntSz14 pb-3 pt-1">{lang.defaultBillingAddress}</div>
            <div>
                <div className="d-flex justify-content-between py-2">
                    <div className="d-flex">
                        <div className="col-auto pl-0 pr-2"><WatchLaterIcon style={{ color: theme.text_light_grey, fontSize: '23px' }} /></div>
                        <div className="col px-2">4th April 2020 10:00 am</div>
                    </div>
                    <div>
                        <div className="col-auto pr-0"><EditIcon style={{ color: theme.appColor, fontSize: '17px' }} /></div>
                    </div>
                </div>
                <div className="d-flex justify-content-between py-2">
                    <div className="d-flex">
                        <div className="col-auto pl-0 pr-2"><LocationOnIcon style={{ color: theme.text_light_grey, fontSize: '23px' }} /></div>
                        <div className="col px-2">7542 Jerde Glens Suite 893, Innsbruck, 5th cross, Edinburgh, Santiago, Malaysia</div>
                    </div>
                    <div>
                        <div className="col-auto pr-0"><EditIcon style={{ color: theme.appColor, fontSize: '17px' }} /></div>
                    </div>
                </div>
                <div className="d-flex justify-content-between py-2">
                    <div className="d-flex">
                        <div className="col-auto pl-0 pr-2"><CreditCardIcon style={{ color: theme.text_light_grey, fontSize: '23px' }} /></div>
                        <div className="col px-2">Card ending 5678</div>
                    </div>
                    <div>
                        <div className="col-auto pr-0"><EditIcon style={{ color: theme.appColor, fontSize: '17px' }} /></div>
                    </div>
                </div>
            </div>
            <div className="d-flex pt-4">
                <div className="col px-2">
                    <Button
                        type="button"
                        cssStyles={theme.blueBorderButton}
                        onClick={() => onClose()}
                    // disabled={!value || (value == "Others" && !otherReason)}
                    >
                        {lang.no}
                    </Button>
                </div>
                <div className="col px-2">
                    <Button
                        type="button"
                        cssStyles={theme.blueButton}
                        onClick={() => onClose()}
                    // disabled={!value || (value == "Others" && !otherReason)}
                    >
                        {lang.yes}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default confirmVideoCall
