import React, { useRef } from 'react'
import MoreMenu from '../components/moremenu'
import DvHomeLayout from '../containers/DvHomeLayout';
import isMobile from '../hooks/isMobile';
import MyAgencyList from '../components/MyAgencyList';
import RouterContext from '../context/RouterContext';

const myAgency = (props) => {
  const homePageref = useRef(null);
  const [mobileView] = isMobile();
  return (
    <RouterContext forLogin={true} forUser={false} forCreator={true} forAgency={true} {...props}>
      <div>
        {!mobileView ? <DvHomeLayout
          activeLink="myAgency"
          pageLink="/myAgency"
          homePageref={homePageref}
          withMore
          {...props}
        /> :
          <div>
            <MyAgencyList
              {...props}
            />
          </div>

        }
      </div>
    </RouterContext>
  )
}

export default myAgency