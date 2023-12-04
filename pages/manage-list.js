import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import isMobile from "../hooks/isMobile";
import DvHomeLayout from "../containers/DvHomeLayout";
import RouterContext from "../context/RouterContext";
const ManageList = dynamic(() => import("../components/manageLists"), { ssr: false });

const ManageListPage = (props) => {
    const [mobileView] = isMobile();
    const homePageref = useRef(null);


    const [activeNavigationTab, setActiveNavigationTab] = useState("timeline");

    return (
        <RouterContext forLogin={true} forUser={false} forCreator={true} forAgency={true} {...props}>
            <div className="mv_wrap_home" ref={homePageref} id="home-page">
                {mobileView ? (
                    <>
                        <ManageList {...props} />
                    </>
                ) :
                    (<DvHomeLayout
                        activeLink="manageLists"
                        pageLink="/manage-list"
                        setActiveState={(props) => {
                            setActiveNavigationTab(props);
                        }}
                        homePageref={homePageref}
                        withMore
                        {...props}
                    />)}
            </div>
        </RouterContext>
    );
}

export default ManageListPage;
