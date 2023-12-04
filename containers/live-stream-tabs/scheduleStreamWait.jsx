import moment from 'moment';
import React from 'react';
import Router from 'next/router';
import { GO_LIVE_SCREEN, RIGHT_WHT_ARROW } from '../../lib/config';

const scheduleStreamWait = (props) => {
    const { scheduleStartTime, handleRejoinScheduleStream } = props;
    const [currentTimeStamp, setCurrentTimeStamp] = React.useState(moment().unix());

    const differenceCalc = (bigTimeStamp, smallTimeStamp) => {
        const differenceSeconds = bigTimeStamp - smallTimeStamp;
        const daydiff = ~~((differenceSeconds/3600)/24);
        const hrsdiff = ~~((differenceSeconds%86400)/3600);
        const minutesDiff = ~~((differenceSeconds%3600)/60);
        const secondsDiff = ~~(differenceSeconds%60);
        return `${daydiff < 10 ? '0' + daydiff : daydiff}: ${hrsdiff < 10 ? '0' + hrsdiff : hrsdiff}: ${minutesDiff < 10 ? '0' + minutesDiff : minutesDiff}: ${secondsDiff < 10 ? '0' + secondsDiff : secondsDiff}`;
    }

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTimeStamp(moment().unix());
        }, 1000);
        return () => {
            clearInterval(intervalId);
        }
    }, []);

    const handleBack = () => {
        Router.push('/');
    };

    return (
        <>
        <div className="d-flex justify-content-center align-items-center position-relative" style={{ width: '100vw', height: '100vh', backgroundColor: '#3A343A' }}>
            <img
                src={RIGHT_WHT_ARROW}
                height="20px"
                className="dv_stream_close"
                alt="close icon"
                onClick={handleBack}
            />
            <div className="text-white align-items-center d-flex flex-column">
                <div className="txt-dark fntSz24 mb-3">Stream Will Be Live Shortly</div>
                <img width={200} src={GO_LIVE_SCREEN.clockIcon} alt="Clock Img" />
                {currentTimeStamp < scheduleStartTime ? (
                    <span className="txt-medium fntSz20 mt-3">{differenceCalc(scheduleStartTime, currentTimeStamp)}</span>
                ) : (
                    <button onClick={handleRejoinScheduleStream} className="btn py-2 blue__design-btn mt-3">Join Stream</button>
                )}
            </div>
        </div>
        <style jsx="true">
        {`
        .dv_stream_close {
            position: absolute;
            background: #00000070;
            border-radius: 50%;
            width: 33px;
            height: 33px;
            padding: 8px;
            cursor: pointer;
            left: 15px;
            top: 15px;
            transform: rotate(180deg);
          }
          .blue__design-btn {
            border-radius: 25px;
            background: var(--l_base);
            color: #fff;
            padding-left: 38px;
            padding-right: 38px;
            box-shadow: 0px 3px 6px #00000029;
            cursor: pointer
          }
        `}
        </style>
        </>
    );
};

export default scheduleStreamWait;
