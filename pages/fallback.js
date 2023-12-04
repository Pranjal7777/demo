import dynamic from 'next/dynamic'
import React from 'react'
import { APP_NAME } from '../lib/config'
const Head = dynamic(() => import('next/head'), { ssr: false })

const Fallback = () => {
    return (
        <>
            <Head>
                <title>{APP_NAME}</title>
            </Head>
            <h1>This is offline fallback page</h1>
            <h2>When offline, any route will fallback to this page</h2>
        </>
    )
}

export default Fallback
