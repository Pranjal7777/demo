export const GET_FEATURED_CREATORS = 'GET_FEATURED_CREATORS';
export const GET_NEWEST_CREATORS = 'GET_NEWEST_CREATORS';
export const GET_ONLINE_CREATORS = 'GET_ONLINE_CREATORS';
export const GET_POPULAR_POSTS = 'GET_POPULAR_POSTS';
export const GET_LATEST_POSTS = 'GET_LATEST_POSTS';
export const UPDATE_ALL_POSTS = 'UPDATE_ALL_POSTS';
export const CLEAR_ALL_POSTS = 'CLEAR_ALL_POSTS';
export const GET_HOMEPAGE_DATA = 'GET_HOMEPAGE_DATA';
export const SET_HOMEPAGE_DATA = 'SET_HOMEPAGE_DATA';
export const UPDATE_PROFILE_OF_ALL_POSTS = "UPDATE_PROFILE_OF_ALL_POSTS"
export const UPDATE_BOOKMARK = 'UPDATE_BOOKMARK';

// If isAPICall is false, means we want to save data in redux. If true, means we want to call API to get data.
export const getFeaturedCreatorsAction = ({ countryName, limit, skip, searchTxt, isAPICall, totalCount, featuredCreatorsList, pageCount, callBackFn, hasMore }) => ({
    type: GET_FEATURED_CREATORS,
    countryName, // For API Call Purpose
    limit,  // For API Call Purpose
    skip,   // For API Call Purpose
    searchTxt, // For API Call Purpose
    isAPICall, // If true means, We'll call API with Saga. If false, We'll save data in Redux State
    featuredCreatorsList, // For Saving Data in Redux
    totalCount, // For Saving Data in Redux to Manage Pagination
    pageCount, // For Saving Data in Redux to Manage Pagination
    callBackFn, // A callback function to pass, that will run after API Call is finished
    hasMore // For Saving Data in Redux to Manage Pagination
});

// If isAPICall is false, means we want to save data in redux. If true, means we want to call API to get data.
export const getNewestCreatorsAction = ({ countryName, limit, skip, searchTxt, isAPICall, totalCount, newestCreatorsList, pageCount, callBackFn, hasMore }) => ({
    type: GET_NEWEST_CREATORS,
    countryName, // For API Call Purpose
    limit,  // For API Call Purpose
    skip,   // For API Call Purpose
    searchTxt, // For API Call Purpose
    isAPICall, // If true means, We'll call API with Saga. If false, We'll save data in Redux State
    newestCreatorsList, // For Saving Data in Redux
    totalCount, // For Saving Data in Redux to Manage Pagination
    pageCount, // For Saving Data in Redux to Manage Pagination
    callBackFn, // A callback function to pass, that will run after API Call is finished
    hasMore // For Saving Data in Redux to Manage Pagination
});

export const getOnlineCreatorsAction = ({ countryName, limit, skip, searchTxt, isAPICall, totalCount, onlineCreatorsList, pageCount, callBackFn, hasMore }) => ({
    type: GET_ONLINE_CREATORS,
    countryName, // For API Call Purpose
    limit,  // For API Call Purpose
    skip,   // For API Call Purpose
    searchTxt, // For API Call Purpose
    isAPICall, // If true means, We'll call API with Saga. If false, We'll save data in Redux State
    onlineCreatorsList, // For Saving Data in Redux
    totalCount, // For Saving Data in Redux to Manage Pagination
    pageCount, // For Saving Data in Redux to Manage Pagination
    callBackFn, // A callback function to pass, that will run after API Call is finished
    hasMore // For Saving Data in Redux to Manage Pagination
});

export const getPopularPostsAction = ({ page, isAPICall, popularPosts, callBackFn, totalCount, userId }) => ({
    type: GET_POPULAR_POSTS,
    page,
    isAPICall,
    popularPosts,
    callBackFn,
    totalCount,
    userId
});

export const getLatestPostAction = ({ isAPICall, limit, skip, latestPosts, hasMore, page, callBackFn, userId }) => ({
    type: GET_LATEST_POSTS,
    isAPICall,
    latestPosts,
    limit,
    skip,
    hasMore,
    callBackFn,
    page,
    userId
});

export const updatePostsDataAction = ({ postId, data = {}, isDelete }) => ({
    type: UPDATE_ALL_POSTS,
    postId,
    data,
    isDelete
});

export const clearAllPostsAction = () => ({ type: CLEAR_ALL_POSTS });

// Homepage Data Actions
export const getHomePageDataAction = ({ callBack }) => ({
    type: GET_HOMEPAGE_DATA,
    callBack
});

export const setHomePageDataAction = ({ dataToSave = [], page, hasMore }) => ({
    type: SET_HOMEPAGE_DATA,
    dataToSave,
    page,
    hasMore
});

export const updateProfileOfDataAction = ({ userId, data = {} }) => ({
    type: UPDATE_PROFILE_OF_ALL_POSTS,
    userId,
    data,
});
export const updateBookmarkAction = ({ postId }) => ({
    type: UPDATE_BOOKMARK,
    postId,
});