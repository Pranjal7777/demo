import { useSelector } from "react-redux";

export const getFeaturedCreatorsHook = () => {
    const data = useSelector(state => state.desktopData.featuredCreators);
    return [data];
};

export const getOnlineCreatorsHook = () => {
    const data = useSelector(state => state.desktopData.onlineCreators);
    return [data];
};

export const getNewestCreatorsHook = () => {
    const data = useSelector(state => state.desktopData.newestCreators);
    return [data];
};

export const getPopularPostsHook = () => {
    const data = useSelector(state => state.desktopData.popularPosts);
    return [data];
};

export const getLatestPostsHook = () => {
    const data = useSelector(state => state.desktopData.latestPosts);
    return [data];
};