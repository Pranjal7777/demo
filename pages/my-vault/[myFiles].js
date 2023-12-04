import React, { useRef } from "react";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import DvHomeLayout from "../../containers/DvHomeLayout";
import MyFilesPage from "../../components/myVault/my-files";
import RouterContext from "../../context/RouterContext";


const MyFiles = (props) => {
    const [mobileView] = isMobile();
    const homePageref = useRef(null);
    return (
        <RouterContext forLogin={true} forUser={false} forCreator={true} forAgency={true} {...props}>
            <Wrapper>
                {mobileView ?
                    <MyFilesPage {...props} />
                    :
                    <div className="mv_wrap_home" ref={homePageref} id="home-page">
                        <DvHomeLayout
                            homePageref={homePageref}
                            activeLink="my-vault/myFilePage"
                            featuredBar
                            {...props}
                        />
                    </div>
                }
            </Wrapper>
        </RouterContext>
    )
}

export default MyFiles;