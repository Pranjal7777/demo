import React from 'react'
import { useRef } from 'react';
import JoinAsSeller from '../components/JoinAsSeller';
import isMobile from '../hooks/isMobile';
import DvHomeLayout from '../containers/DvHomeLayout';

function JoinasSeller(props) {
    const homePageref = useRef(null);
    const [mobileView] = isMobile();
  return (
    <div>
        {mobileView ?
        (<JoinAsSeller {...props} />)
        :(<DvHomeLayout
            activeLink="JoinAsSeller"
          homePageref={homePageref}
            pageLink="/join-as-seller"
            withMore
          {...props}
          />)}
    </div>
  )
}

export default JoinasSeller;