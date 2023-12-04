import React, { useEffect, useRef } from 'react'
import { getDeviceLog } from '../services/agency';
import { useRouter } from 'next/router';
import { startLoader, stopLoader } from '../lib/global/loader';
import DvHomeLayout from '../containers/DvHomeLayout';
import RouterContext from '../context/RouterContext';

const deviceLog = (props) => {
  const homePageref = useRef();
  return (
    <RouterContext forLogin={true} forUser={false} forCreator={false} forAgency={true} {...props}>
    <div>
      <DvHomeLayout
        activeLink="deviceLog"
        pageLink="/deviceLog"
        agencyMenuOpen
        homePageref={homePageref}
        {...props}
      />
    </div>
    </RouterContext>
  )

}

export default deviceLog