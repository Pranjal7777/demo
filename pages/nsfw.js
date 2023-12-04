import React from "react";
import CustomHead from "../components/html/head.js";
import { WEB_LINK } from "../lib/config/index.js";
import { getCookie } from "../lib/session.js";
import DvHomeLayout from "../containers/DvHomeLayout.js";
import NSFWContent from "../components/NSFWContent.js";
import Header from "../containers/Header.js";
import Footer from "../containers/Footer.js";

export default function NsfwContent(props) {
    const auth = getCookie("auth");

    return (
        <React.Fragment>
            <CustomHead
                url={`${WEB_LINK}/terms-and-conditions`}
                {...props.seoSettingData}
            />
            {!auth ?
                <div>
                    <Header {...props} />
                    <NSFWContent />
                    <Footer {...props} />
                </div>
                :
                <DvHomeLayout
                    activeLink="NSFWContent"
                    pageLink="/NSFWContent"
                    withMore
                />}
        </React.Fragment>
    );
}