import React, { useRef } from 'react'
import DvAgancyLayout from '../containers/agency/DvAgancyLayout'
import DvHomeLayout from '../containers/DvHomeLayout'
import RouterContext from '../context/RouterContext';

const agencyEmployee = (props) => {
  const homePageref = useRef();

  return (
    <RouterContext forLogin={true} forUser={false} forCreator={false} forAgency={true} {...props}>
      <DvHomeLayout
        activeLink="agencyEmployee"
        pageLink="/agencyEmployee"
        homePageref={homePageref}
        agencyMenuOpen
        {...props}
      />
    </RouterContext>
  )
}

export default agencyEmployee