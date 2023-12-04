import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'react-jss'
import useLang from '../../hooks/language';
import isMobile from '../../hooks/isMobile';
import { close_dialog } from '../../lib/global';
const Button = dynamic(() => import("../../components/button/button"), { ssr: false });
import moment from 'moment';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker"

const settings = {
    className: "center",
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "60px",
    focusOnSelect: true,
    speed: 500,
    autoplay: false,
    arrows: false,
    vertical: true,
    verticalSwiping: true,
    swipeToSlide: true
};

const timePeriodsSettings = {
    className: "centertimePeriods",
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    focusOnSelect: true,
    speed: 500,
    autoplay: false,
    arrows: false,
    vertical: true,
    verticalSwiping: true,
}

const hours = ['01','02','03','04','05','06','07','08','09','10','11','12'];
const minutes = ['00', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];
const timePeriods = ['Am', 'Pm'];

const rollerTimePicker = (props) => {
    const [mobileView] = isMobile();
    const { onClose, txtToShow = 'Select Time', handleConfirmProp, minutesRange = 1 } = props;
    const [selectedHr, setSelectedHr] = React.useState(hours[0]);
    const [selectedMin, setSelectedMin] = React.useState(minutes.filter((item) => item % minutesRange === 0)[0]);
    const [selectedPeriod, setSelectedPeriod] = React.useState(timePeriods[0]);
    const [lang] = useLang();
    const theme = useTheme();
    const [time, setTime] = useState(props.time ? moment(props.time, 'hh:mm a') : moment().startOf('day'))
    const handleConfirm = () => {
        const selectedTimeString = moment(time).format("hh:mm a")
        handleConfirmProp?.(selectedTimeString);
        mobileView ? onClose() : close_dialog("rollerTimePicker");
    };

    const handleHoursChange = (index) => {
        setSelectedHr(hours[index]);
    };

    const handleMinutesChange = (index) => {
        setSelectedMin(minutes.filter((item) => item % minutesRange === 0)[index]);
    };

    const handleTimePeriodChange = (index) => {
        setSelectedPeriod(timePeriods[index]);
    };
    return (
        <div className="text-app">
            <div className="pt-3 pb-2 text-center">
                <div className="d-flex justify-content-center">
                    <div className="text-app fntSz18 font-weight-500">{txtToShow}</div>
                </div>
            </div>
            <div className="text-center d-flex justify-content-center align-items-center py-2">
                <div className="boxShadow"></div>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <StaticTimePicker
                        displayStaticWrapperAs="mobile"
                        value={time}
                        format="HH:MM A"
                        onChange={(newValue) => {
                            setTime(moment(newValue.$d));
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minutesStep={5}
                        label={txtToShow}

                    />
                </LocalizationProvider>
            </div>
            <div className="d-flex py-2 confirmBtn align-items-center justify-content-end mr-4 pb-3" style={{ gap: "10px" }}>
                <div className='pointer pr-2' onClick={props.onClose}>Cancel</div>
                <div className=' pointer font-weight-700 gradient_text' onClick={handleConfirm}>Confirm</div>
            </div>
            <style jsx>
                {`
                    .boxShadow{
                        background-image: linear-gradient(180deg, rgb(255 255 255), rgb(0 0 0 / 0%) 70.71%)
                    }
                    .closeOption{
                        right: 15px;
                    }
                    :global(.sliders .slick-center){
                        font-family: "Roboto", sans-serif !important;
                        font-size: 17px;
                    }
                    :global(.hours .slick-slider .slick-list, .minutes .slick-slider .slick-list){
                        height: 167px!important;
                    }
                    :global(.slick-slide){
                        font-family: "Roboto";
                    }
                    .selectedTime{
                        color: var(--l_base);
                    }
                    .sliders{
                        width: 30px;
                    }
                    .border_bottom{
                        border-bottom: 1px solid #E1E1E8;
                    }
                    :global(.MuiPickersClockPointer-pointer),
                    :global(.MuiClockPointer-root),
                    :global(.MuiClock-pin),
                    :global(.MuiClockNumber-root.Mui-selected){
                        background-color:var(--l_base) !important;
                    }
              
                    :global(.MuiClockPointer-thumb){
                        border-color:var(--l_base) !important;
                        background-color:var(--l_base) !important;
                    }
                    :global(.MuiClockNumber-root),
                    :global(.MuiTypography-root),
                    :global(.MuiTypography-subtitle2){
                        color:var(--l_app_text) !important;
                    }
                    :global(.MuiTypography-subtitle2.Mui-selected),
                    :global(.MuiTypography-root.Mui-selected){
                        color:var(--l_base) !important;
                    }
                    :global(.MuiClockNumber-root){
                        background-color:var(--l_app_bg) !important;
                    }
                    :global(.MuiDialogActions-root){
                        display :none !important;
                    }
                    :global(.MuiPickersToolbar-penIconButton ){
                        display :none !important;
                    }
                    :global(.MuiPickerStaticWrapper-content){
                        background-color: var(--l_profileCard_bgColor) !important; 
                    }
                `}
            </style>
        </div>
    )
}

export default rollerTimePicker
