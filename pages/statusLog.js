import React, { useRef } from 'react'
import DvAgancyLayout from '../containers/agency/DvAgancyLayout'
import DvHomeLayout from '../containers/DvHomeLayout'
import RouterContext from '../context/RouterContext';

const statusLog = (props) => {
  const homePageref = useRef();

  return (
    <RouterContext forLogin={true} forUser={false} forCreator={false} forAgency={true} {...props}>
      <div>
        <DvHomeLayout
          activeLink="statusLog"
          pageLink="/statusLog"
          agencyMenuOpen
          homePageref={homePageref}
          {...props}
        />
      </div>
    </RouterContext>
  )
}

export default statusLog