import React, { Component } from "react";
import dynamic from "next/dynamic";

import Wrapper from "../../hoc/Wrapper";
import CategoreyHeader from "../../containers/UserCategories/categoreyHeader";
import { scrollToView } from "../../lib/global";
import { connect } from "react-redux";
import { getCookie } from "../../lib/session";
import TimelineHeader from "../../containers/timeline/timeline-header";
import FeaturedMoment from "../../containers/UserCategories/featuredMoment";
import AllCategoryUser from "../../containers/UserCategories/allCategoryUser";
import HomePageData from "../../containers/UserCategories/HomePage/HomePageRender";
import MarkatePlaceHeader from "../../containers/markatePlaceHeader/markatePlaceHeader";
import { getHomePageDataAction } from "../../redux/actions/dashboard/dashboardAction";
const AvailableCategories = dynamic(
  () => import("../../containers/UserCategories/availableCategories"),
  { ssr: false }
);
const UserFeatureCreatores = dynamic(
  () => import("../../containers/UserCategories/userFeatureCreatores"),
  {
    ssr: false,
  }
);
const UserBanner = dynamic(
  () => import("../../containers/UserCategories/userBanner"),
  {
    ssr: false,
  }
);
const ModelBottomNavigation = dynamic(
  () => import("../../containers/timeline/bottom-navigation-model"),
  { ssr: false }
);
const UserCategoryCardList = dynamic(
  () => import("../../containers/UserCategories/userCategoryCard"),
  { ssr: false }
);
const DvHeader = dynamic(() => import("../../containers/DvHeader/DvHeader"), {
  ssr: false,
});

class UserCategory extends Component {
  state = {
    activeNavigationTab: "",
    desktop_header: 0,
    userType: getCookie("userType"),
    homapageData: [],
    skeleton: true
  };

  componentDidMount = () => {
    this.handleHomePageData();
    setTimeout(() => {
      const headerHght = document.querySelector(".dv__header")?.offsetHeight;
      this.setState({
        desktop_header: headerHght,
      });
    }, 1000);
  };

  handleHomePageData = async () => {
    if (this.props.homePageData?.length) {
      this.setState({ homapageData: this.props.homePageData, skeleton: false });
    } else {
      this.props.dispatch(getHomePageDataAction({ callBack: (data) => {
        this.setState({ homapageData: data, skeleton: false });
      }}));
    };
  }

  
  render() {
    console.log("Homapage State", this.state);
    return (
      <Wrapper>
        <div id="top" className="pageScroll">
          {this.props.isMobileView ? (
            <TimelineHeader
              setActiveState={(props) => {
                this.setState({ activeNavigationTab: props });
              }}
              scrollAndRedirect={async (e) => {
                let sc = await document.getElementById("top");
                sc.scrollIntoView({ behavior: "smooth" });
              }}
                {...this.props}
              />
          ) : (
            <MarkatePlaceHeader
              setActiveState={(props) => {
                this.setState({ activeNavigationTab: props });
              }}
              {...this.props}
            />
          )}

          <div
            className={`${
              this.props.isMobileView
                ? "col-12 px-0 d-flex"
                : "websiteContainer"
            }`}
          >
            <AvailableCategories />
          </div>

          <div
            className={`${
              this.props.isMobileView ? "col-12 d-flex flex-column" : "websiteContainer"
            }`}
            style={{ marginBottom: this.props.isMobileView ? "auto" : "0" }}
          >
            <UserBanner desktop_header={this.state.desktop_header} />
            <UserFeatureCreatores isFeatured={true} />
            <UserCategoryCardList />
            <UserFeatureCreatores isFeatured={false} />
            {this?.state?.homapageData && this?.state?.homapageData.slice(1).map((data, index)=>(
              <HomePageData label={this?.state?.homapageData[index+1]?.title} type={this?.state?.homapageData[index+1]?.type} isVideoCallComp={false} sectionData={this?.state?.homapageData[index+1]?.data} />
            ))}
            {/* <FeaturedMoment />
            <AllCategoryUser label="New and noteworthy" isVideoCallComp={false} />
            <AllCategoryUser label="Trending" isVideoCallComp={false} />
            <AllCategoryUser label="Actors" /> */}
          </div>
          <div style={{ height: "60px" }}></div>
          {this.props.isMobileView && (
            <div
              className={`${
                this.props.isMobileView ? "col-12 d-flex" : "websiteContainer"
              }`}
            >
              <ModelBottomNavigation
                setActiveState={(props) => {
                  this.setState({ activeNavigationTab: props });
                }}
              />
            </div>
          )}
        </div>
        <style jsx>
          {`
            .pageScroll {
              overflow-y: auto !important;
              height: 100vh;
            }

            #top {
              scroll-behavior: smooth;
            }
          `}
        </style>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isMobileView: state.isMobile,
    homepageData: state.desktopData.homePageData.data
  };
};

export default connect(mapStateToProps)(UserCategory);
