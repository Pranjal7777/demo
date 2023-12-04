import dynamic from 'next/dynamic';
import React from 'react'
import { useRef } from 'react';
import Wrapper from '../../hoc/Wrapper';
import isMobile from '../../hooks/isMobile';
import MyVault from '../../components/myVault/my-vault';
import DvHomeLayout from '../../containers/DvHomeLayout';
import RouterContext from '../../context/RouterContext';


const myVault = (props) => {
    const [mobileView] = isMobile();
    const homePageref = useRef(null);

    return (
        <RouterContext forLogin={true} forUser={false} forCreator={true} forAgency={true} {...props}>
            <div ref={homePageref} id="home-page">
                {mobileView ? (
                    <div>
                        <MyVault {...props} />
                    </div>
                ) : (
                    <Wrapper>
                        <DvHomeLayout
                            activeLink="MyVault"
                            pageLink="/my-vault"
                            homePageref={homePageref}
                            featuredBar
                            {...props}
                        />
                    </Wrapper>
                )}
            </div>
        </RouterContext>
    )
}

export default myVault;
