import React, { useRef } from 'react'
import DvHomeLayout from '../containers/DvHomeLayout'
import RouterContext from '../context/RouterContext';

const homePageAgency = (props) => {
  const homePageref = useRef();
  return (
    <RouterContext forLogin={true} forUser={false} forCreator={false} forAgency={true} {...props}>
      <div>
        <DvHomeLayout
          activeLink="homePageAgency"
          pageLink="/homePageAgency"
          homePageref={homePageref}
          agencyMenuOpen
          {...props}
        />
      </div>
    </RouterContext>
  )
}

export default homePageAgency