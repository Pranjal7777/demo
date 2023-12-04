import React, { useRef } from 'react'
import DvAgancyLayout from '../containers/agency/DvAgancyLayout'
import DvHomeLayout from '../containers/DvHomeLayout';
import Head from 'next/head';
import RouterContext from '../context/RouterContext';

const my_profile = (props) => {
  const homePageref = useRef();

  return (
    <RouterContext forLogin={true} forUser={false} forCreator={false} forAgency={true} {...props}>
    <div>
      <Head>
        <script defer={true} src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" />
      </Head>
      <DvHomeLayout
        homePageref={homePageref}
        activeLink="my_profile"
        pageLink="/my_profile"
        {...props}
      />
    </div>
    </RouterContext>
  )
}

export default my_profile