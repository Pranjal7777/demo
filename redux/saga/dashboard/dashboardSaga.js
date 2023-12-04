import { takeEvery, put } from "redux-saga/effects";
import { GET_FEATURED_CREATORS, getFeaturedCreatorsAction, GET_POPULAR_POSTS, getPopularPostsAction, getLatestPostAction, GET_LATEST_POSTS, setHomePageDataAction, GET_HOMEPAGE_DATA, GET_NEWEST_CREATORS, getNewestCreatorsAction, getOnlineCreatorsAction, GET_ONLINE_CREATORS } from "../../actions/dashboard/dashboardAction";
import { getFeatureCreator, getHeroCreatorsApi, getOnlineCreatorsApi } from "../../../services/auth";
import { getPopularFeedPost, getPost } from "../../../services/assets";
import { getHompageData } from "../../../services/user_category";

function* getFeaturedCreatorSaga({ countryName, limit, skip, searchTxt, isAPICall, callBackFn }) {
    if (!isAPICall) return;
    try {
        const response = yield getFeatureCreator({ country: countryName, limit, offset: skip, searchText: searchTxt });
        if (response.status === 200) {
            const dataToSave = response.data.data;
            yield put(getFeaturedCreatorsAction({ isAPICall: false, featuredCreatorsList: dataToSave, totalCount: dataToSave?.length, pageCount: parseInt(skip / limit, 10) + 1, hasMore: dataToSave?.length == 10, searchTxt: searchTxt || "" }));
        }
        if (response.status === 204) {
            yield put(getFeaturedCreatorsAction({ isAPICall: searchText.length == 0 ? true : false, featuredCreatorsList: [], hasMore: false, searchTxt: searchTxt || "", pageCount: 0 }));
        }
    } catch (err) {
        console.error(err);
    } finally {
        callBackFn?.();
    }
};

function* getNewestCreatorSaga({ countryName, limit, skip, searchTxt, isAPICall, callBackFn }) {
    if (!isAPICall) return;
    try {
        const response = yield getHeroCreatorsApi({ country: countryName, limit, offset: skip, searchText: searchTxt });
        if (response.status === 200) {
            const dataToSave = response.data.data;
            yield put(getNewestCreatorsAction({ isAPICall: false, newestCreatorsList: dataToSave, totalCount: dataToSave?.length, pageCount: parseInt(skip / limit, 10) + 1, hasMore: dataToSave?.length == 10, searchTxt: searchTxt || "" }));
        }
        if (response.status === 204) {
            yield put(getNewestCreatorsAction({ isAPICall: searchText.length == 0 ? true : false, newestCreatorsList: [], hasMore: false, searchTxt: searchTxt || "", pageCount: 0 }));
        }
    } catch (err) {
        console.error(err);
    } finally {
        callBackFn?.();
    }
};

function* getOnlineCreatorSaga({ countryName, limit, skip, searchTxt, isAPICall, callBackFn }) {
    if (!isAPICall) return;
    try {
        const response = yield getOnlineCreatorsApi({ country: countryName, limit, offset: skip, searchText: searchTxt });
        if (response.status === 200) {
            const dataToSave = response.data.data;
            yield put(getOnlineCreatorsAction({ isAPICall: false, onlineCreatorsList: dataToSave, totalCount: dataToSave?.length, pageCount: parseInt(skip / limit, 10) + 1, hasMore: dataToSave?.length == 10, searchTxt: searchTxt || "" }));
        }
        if (response.status === 204) {
            yield put(getOnlineCreatorsAction({ isAPICall: searchText.length == 0 ? true : false, onlineCreatorsList: [], hasMore: false, searchTxt: searchTxt || "", pageCount: 0 }));
        }
    } catch (err) {
        console.error(err);
    } finally {
        callBackFn?.();
    }
};

function* getPopularPostsSaga({ page, isAPICall, callBackFn, userId }) {
    if (!isAPICall) return;
    try {
        const response = yield getPopularFeedPost(page, userId);
        if (response.status === 200) {
            const dataToSave = response.data.result;
            yield put(getPopularPostsAction({ page, isAPICall: false, popularPosts: dataToSave, totalCount: response.data.totalCount, userId }));
            callBackFn?.(dataToSave, response.data.totalCount);
        }
    } catch (err) {
        console.error(err);
        callBackFn?.([], 0);
    } 
};

function* getLatestPostsSaga({ isAPICall, limit, skip, callBackFn, userId }) {
    if (!isAPICall) return;
    try {
        const response = yield getPost({ filter: "LATEST", limit, offset: skip, userId: userId });
        if (response.status == 200) {
            const dataToSave = response.data.data;
            yield put(getLatestPostAction({ isAPICall: false, hasMore: true, latestPosts: dataToSave, page: parseInt(skip / limit, 10) + 1 }));
            callBackFn?.(dataToSave, true);
        }
        if (response.status == 204) {
            yield put(getLatestPostAction({ isAPICall: false, hasMore: false, latestPosts: [] }));
            callBackFn?.([], false);
        }
    } catch (err) {
        console.error(err);
        callBackFn?.([], false);
    }

};

function* getHomePageDataSaga({ callBack, page = 0, limit = 10 }) {
    try {
        let payload = {
            offset: page * 10,
            limit
          };
        const response = yield getHompageData(payload);
        if (response.status === 200 && response.data?.data?.length) {
            yield put(setHomePageDataAction({ dataToSave: response.data.data, page: page + 1, hasMore: true }));
            callBack?.(response.data.data, true);
        } else if (response.status === 204) {
            yield put(setHomePageDataAction({ dataToSave: [], page: page, hasMore: false }));
            callBack?.(response.data.data, true);
        }
    } catch (err) {
        console.error(err);
        callBack?.([], false);
    }
}

export default function dashboardRootSaga() {
    return [
        takeEvery(GET_FEATURED_CREATORS, getFeaturedCreatorSaga),
        takeEvery(GET_NEWEST_CREATORS, getNewestCreatorSaga),
        takeEvery(GET_ONLINE_CREATORS, getOnlineCreatorSaga),
        takeEvery(GET_POPULAR_POSTS, getPopularPostsSaga),
        takeEvery(GET_LATEST_POSTS, getLatestPostsSaga),
        takeEvery(GET_HOMEPAGE_DATA, getHomePageDataSaga)
    ]
};