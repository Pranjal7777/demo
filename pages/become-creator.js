import React from 'react'
import { useRef } from 'react';
import isMobile from '../hooks/isMobile';
import Registration from './signup-as-creator';
import DvHomeLayout from '../containers/DvHomeLayout';
import RouterContext from '../context/RouterContext';

function BecomeCreator(props) {
  const homePageref = useRef(null);
  const [mobileView] = isMobile();
  return (
    <RouterContext forLogin={true} forUser={true} forCreator={false} forAgency={false} {...props}>
      <div>
        {mobileView ? (<Registration BecomeCreator={true} {...props} />) : (<DvHomeLayout
          activeLink="becomeCreator"
          homePageref={homePageref}
          pageLink="/become-creator"
          withMore
          {...props}
        />)}
      </div>
    </RouterContext>
  )
}

export default BecomeCreator;