import React, { useRef } from 'react'
import DvAgancyLayout from '../containers/agency/DvAgancyLayout'
import Head from 'next/head'
import DvHomeLayout from '../containers/DvHomeLayout'
import RouterContext from '../context/RouterContext'

const agencyProfile = (props) => {
  const homePageref = useRef();

  return (
    <RouterContext forLogin={true} forUser={false} forCreator={false} forAgency={true} {...props}>
      <div>
        <Head>
          <script
            defer={true}
            src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js"
          />
        </Head>
        <DvHomeLayout
          activeLink="agencyProfile"
          pageLink="/agencyProfile"
          homePageref={homePageref}
          agencyMenuOpen
          {...props}
        />
      </div>
    </RouterContext>
  )
}

export default agencyProfile