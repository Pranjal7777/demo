import * as React from 'react';
import { getFeaturedCreatorsAction, getNewestCreatorsAction, getOnlineCreatorsAction } from '../../redux/actions/dashboard/dashboardAction';
import { useDispatch } from 'react-redux';
import { stopLoader } from '../../lib/global/loader';
import { getFeaturedCreatorsHook, getNewestCreatorsHook, getOnlineCreatorsHook } from '../../hooks/dashboardDataHooks';

const useFeaturedApiHook = () => {

    const dispatch = useDispatch();
    const [skeleton, setSkeleton] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const [featuredCreatorState] = getFeaturedCreatorsHook();
    const [newestCreatorState] = getNewestCreatorsHook();
    const [onlineCreatorState] = getOnlineCreatorsHook();


    const getFeaturedCreatorsList = (pageCount = 0) => {
        dispatch(getFeaturedCreatorsAction({
            countryName: "INDIA",
            limit: 10,
            skip: pageCount * 10,
            callBackFn: () => {
                stopLoader();
                setSkeleton(false);
                setIsLoading(false);
            },
            isAPICall: true
        }));
    };

    const getNewestCreatorsList = (pageCount = 0) => {
        dispatch(getNewestCreatorsAction({
            // countryName: "INDIA",
            limit: 10,
            skip: pageCount * 10,
            callBackFn: () => {
                stopLoader();
                setSkeleton(false);
                setIsLoading(false);
            },
            isAPICall: true
        }));
    };

    const getOnlineCreatorsList = (pageCount = 0) => {
        dispatch(getOnlineCreatorsAction({
            // countryName: "INDIA",
            limit: 10,
            skip: pageCount * 10,
            callBackFn: () => {
                stopLoader();
                setSkeleton(false);
                setIsLoading(false);
            },
            isAPICall: true
        }));
    };

    const initialApiCall = () => {
        if (!featuredCreatorState.data?.length || featuredCreatorState.searchTxt) {
            getFeaturedCreatorsList(featuredCreatorState.page);
        } else {
            setSkeleton(false);
        }
        if (!newestCreatorState.data?.length || newestCreatorState.searchTxt) {
            getNewestCreatorsList(newestCreatorState.page);
        } else {
            setSkeleton(false);
        }
        if (!onlineCreatorState.data?.length || onlineCreatorState.searchTxt) {
            getOnlineCreatorsList(onlineCreatorState.page);
        } else {
            setSkeleton(false);
        }
    }

    const handleRefreshApiCall = () => {
        setSkeleton(true);
        getFeaturedCreatorsList(0);
        getNewestCreatorsList(0);
        getOnlineCreatorsList(0);
    }

    const pageEventHandler = async (e) => {
        setIsLoading(true);
        getFeaturedCreatorsList(featuredCreatorState.page + 1);
        getNewestCreatorsList(newestCreatorState.page + 1);
        getOnlineCreatorsList(onlineCreatorState.page + 1);
    };

    return {
        skeleton,
        isLoading,
        initialApiCall,
        handleRefreshApiCall,
        pageEventHandler
    }
}

export default useFeaturedApiHook