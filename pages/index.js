import dynamic from 'next/dynamic';
import React, { useRef } from 'react';
const HomePage = dynamic(() => import("../containers/homepages/Home"));
import { guestLogin } from '../lib/global/guestLogin';
import { getCookiees } from '../lib/session';
import { getPopularPostsAction, setHomePageDataAction } from '../redux/actions/dashboard/dashboardAction';
import { getPopularFeedPost } from '../services/assets';
import { getHompageData } from '../services/user_category';
import HomeSeo from '../containers/homepages/HomeSeo';
import DvHomeLayout from '../containers/DvHomeLayout';

const Index = (props) => {
  const homePageref = useRef(null);
  const { testimonial } = props


  return <HomeSeo {...props}>
    {!props.auth ? <HomePage testimonial={testimonial} />
      : <DvHomeLayout
        activeLink="HomePage"
        pageLink="/"
        homePageref={homePageref}
        featuredBar
        {...props}
      />}
  </HomeSeo>
}

Index.getInitialProps = async ({ Component, ctx, userToken }) => {
  const { new_profile, new_profile1, new_profile2, star } = await import("../public/Bombshell/images/home/index")
  const homeData = [
    {
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      profile: "Sabi wabi",
      profile_email: "Sabi wabi",
      profile_image: new_profile,
      star: star
    },
    {
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      profile: "Sabi wabi",
      profile_email: "Sabi wabi",
      profile_image: new_profile1,
      star: star
    },
    {
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      profile: "Sabi wabi",
      profile_email: "Sabi wabi",
      profile_image: new_profile2,
      star: star
    },
    {
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      profile: "Sabi wabi",
      profile_email: "Sabi wabi",
      profile_image: new_profile,
      star: star
    },
    {
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      profile: "Sabi wabi",
      profile_email: "Sabi wabi",
      profile_image: new_profile1,
      star: star
    },
    {
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      profile: "Sabi wabi",
      profile_email: "Sabi wabi",
      profile_image: new_profile2,
      star: star
    },
    {
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      profile: "Sabi wabi",
      profile_email: "Sabi wabi",
      profile_image: new_profile,
      star: star
    },
    {
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      profile: "Sabi wabi",
      profile_email: "Sabi wabi",
      profile_image: new_profile1,
      star: star
    },
    {
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      profile: "Sabi wabi",
      profile_email: "Sabi wabi",
      profile_image: new_profile2,
      star: star
    },

  ]
  const { query = {}, req, res } = ctx;
  const auth = getCookiees('auth', req)
  const userType = getCookiees("userType", ctx.req);
  const selectedCreatorId = getCookiees("selectedCreatorId", ctx.req)
  // if (query.tab == "profile") {
  //   returnLogin(req, res);
  // }
  // returnJuicy(req, res)
  try {
    if (!req) {
      return { query: query, serverDetails: { isServer: false }, auth: auth, testimonial: homeData };
    }
    let token = userToken || getCookiees("token", req);
    if (!token?.toString?.().length) {
      const guestData = await guestLogin();
      token = guestData.token;
    }
    if (token) {
      if (process.env.NEXT_PUBLIC_ISCAMEO) {
        let payload = {
          offset: 0,
          limit: 10
        };
        const response = await getHompageData(payload, decodeURIComponent(token));
        const serverHomePage = response.data.data
        if (response.status === 200 && response.data?.data?.length) {
          ctx.store.dispatch(setHomePageDataAction({ dataToSave: response.data.data, page: 1, hasMore: true }));
        } else if (response.status === 204) {
          ctx.store.dispatch(setHomePageDataAction({ dataToSave: [], page: 1, hasMore: false }));
        }
        return { query: query, serverHomePage, token, auth: auth, testimonial: homeData };
      } else {
        const response = await getPopularFeedPost(1, userType == 3 ? selectedCreatorId : "", decodeURIComponent(token));
        const serverPopularPosts = response.data.result
        ctx.store.dispatch(getPopularPostsAction({ page: 1, isAPICall: false, popularPosts: serverPopularPosts, totalCount: response.data.totalCount, userId: userType == 3 ? selectedCreatorId : "" }));
        return { query: query, serverPopularPosts, token, auth: auth, testimonial: homeData };
      }
    } else {
      return { query: query, serverPopularPosts: [], token: undefined, auth: auth, testimonial: homeData };
    }
  } catch (e) {
    return { query: query, serverPopularPosts: [], token: undefined, auth: auth, testimonial: homeData };
  }
};

export default Index;

