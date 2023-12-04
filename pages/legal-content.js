import React from "react";
import CustomHead from "../components/html/head";
import Legalcontentcomp from "../components/legalContent";
import { WEB_LINK } from "../lib/config";
import { getCookie } from "../lib/session";
import Header from "../components/landingHeader/Header";
import DvHomeLayout from "../containers/DvHomeLayout";

export default function LegalContent(props) {
    const auth = getCookie("auth");
    return (
        <React.Fragment>
            <CustomHead
                url={`${WEB_LINK}/terms-and-conditions`}
                {...props.seoSettingData}
            />
            {!auth && <Header {...props}/>}
            {!auth ? <Legalcontentcomp />
                :
                <DvHomeLayout
                    activeLink="legal-content"
                    pageLink="/legal-content"
                    withMore
                />
            }
        </React.Fragment>
    );
}