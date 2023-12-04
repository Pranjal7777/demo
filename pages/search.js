import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';

const Explore = dynamic(() => import("../containers/profile/explore/explore"), {
    ssr: false,
});

const SearchPage = (props) => {
    const [activeNavigationTab, setActiveNavigationTab] = useState('search');

    useEffect(() => {
        setActiveNavigationTab('search')
    }, []);

    return <>
        <Explore
            setActiveState={(props) => {
                setActiveNavigationTab(props);
            }}
            {...props}
        />
    </>
}

export default SearchPage;