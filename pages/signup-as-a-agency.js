import React from 'react'
import Registration from '../containers/agency/Registration'
import Head from 'next/head'

const agencyRegistration = () => {
  return (
    <div>
      <Head>
      <script defer={true} src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" />
      </Head>
      <Registration />
    </div>
  )
}

export default agencyRegistration