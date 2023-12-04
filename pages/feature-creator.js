import dynamic from 'next/dynamic';
import React from 'react'
import { useRef } from 'react';
import Wrapper from '../hoc/Wrapper';
import isMobile from '../hooks/isMobile';
import DvHomeLayout from "../containers/DvHomeLayout"

const FeaturedCreator = dynamic(() => import('../components/featureCreator'), { ssr: false });

const FeatureCreator = (props) => {
  const [mobileView] = isMobile();
  const homePageref = useRef(null);

  return (
    <div ref={homePageref} id="home-page">
      {mobileView ? (
        <div>
          <FeaturedCreator />
        </div>
      ) : (
        <Wrapper>
          <DvHomeLayout
            activeLink="viewAllFeaturedCreators"
            pageLink="/feature-creator"
            homePageref={homePageref}
            featuredBar
            {...props}
          />
        </Wrapper>
      )}
    </div>
  )
}

export default FeatureCreator;