import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import { useRouter } from "next/router";;
import Wrapper from "../../hoc/Wrapper";
import Header from "../../components/header/header";
import useLang from "../../hooks/language";
const Calendar = dynamic(() => import("../../components/calender/fullCalender"), { ssr: false });

import RotaterOptions from "../../components/rotaterOptions";
import { clock_icon_call } from "../../lib/config/logo";
import { DOLLAR_ICON, backArrow } from "../../lib/config";
import isMobile from "../../hooks/isMobile";


const ViewSchedule = (props) => {
    const { refreshFunction } = props;
    const theme = useTheme();
    const [lang] = useLang();
    const router = useRouter();
    const [mobileView] = isMobile()

    const handleCloseDrawer = () => {
        router.back();
    };

    const optionsData = [
        {
            title: "Price Settings",
            tab: "price",
            iconDetails: {
                icon: DOLLAR_ICON,
                id: "Dollar_tip",
                viewBox: "0 0 28 28",
                color: "var(--l_app_text)",
                size: 25
            },
            onClick: () => { router.push("/video-call") }
        },
        {
            title: "Set Schedule",
            tab: "schedule",
            iconDetails: {
                icon: clock_icon_call,
                id: "clock_icon_call",
                viewBox: "0 0 20 20",
                color: "var(--l_app_text)",
                size: 20
            },
            onClick: () => { router.push("/CallAvailability") }
        }

    ]

    return (
        <div className="mv_wrap_videoCall bg_color" id="home-page">
            <Wrapper>
                <Header
                    title={lang.viewSchedule}
                    icon={backArrow}
                    back={handleCloseDrawer}
                />
                <div style={{ marginTop: "70px", overflowX: "hidden" }} className="col-12">
                    <div className="manageBtn">
                        <RotaterOptions filterList={optionsData} />
                    </div>
                    <Calendar refreshFunction={refreshFunction} theme={theme} mobileView={mobileView} />

                </div>
            </Wrapper>
            <style jsx>
                {`
          .confirmBtn {
            position: fixed;
            width: 100%;
            bottom: 0;
          }
          .manageBtn{
            position: fixed;
            bottom: 30px;
            right: 25px;
            z-index:10;
          }
        `}
            </style>
        </div>
    );
};

export default ViewSchedule;