import Head from 'next/head';
import * as React from 'react';

export const RecaptchaProvider = (props) => {
    return (
        <>
            <Head>
                <script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_KEY}`} />
            </Head>
            {props.children}
        </>
    );
};