import React from 'react';
import Head from 'next/head';

const Seo = ({ title = "", description = "", viewport = false }) => {
    const fullTitle = title ? `${title} | Bombshell Influencers` : 'Bombshell Influencers';

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {viewport && <meta name="viewport" content="width=device-width, initial-scale=1" />}
        </Head>
    );
};

export default Seo;
