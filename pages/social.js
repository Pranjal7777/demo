import React from 'react';
import SocialHomePage from "../containers/homepages/socialHomePage";
import { getCookiees } from '../lib/session';
import { getPopularPostsAction } from '../redux/actions/dashboard/dashboardAction';
import { getPopularFeedPost } from '../services/assets';

const social = (props) => <SocialHomePage {...props} />; 
social.getInitialProps = async ({ Component, ctx }) => {
    const { query = {}, req, res } = ctx;
    try {
        if (!ctx.req) {
            return { query: query, serverDetails: { isServer: false } };
        }
        let token = getCookiees("token", req);
        const response = await getPopularFeedPost(1, decodeURIComponent(token));
        const serverPopularPosts = response.data.result
        ctx.store.dispatch(getPopularPostsAction({ page: 1, isAPICall: false, popularPosts: serverPopularPosts, totalCount: response.data.totalCount }));
        return { query: query, serverPopularPosts, token };
    } catch (e) {
        console.error("TOKEN", e);
    }
};

export default social;