import { useState, useEffect } from "react";
import Header from "../../header/header";
import useLang from "../../../hooks/language";
import { makeStyles, Paper, Tab, Tabs } from "@material-ui/core";
import SubscriptionTile from "./SubscriptionTile";
import isMobile from "../../../hooks/isMobile";
import * as env from "../../../lib/config";
import { getSubscriptions } from "../../../services/subscriptions";
import dynamic from "next/dynamic";
import {
  backNavMenu,
} from "../../../lib/global";
import { useTheme } from "react-jss";
import SearchBar from "../../../containers/timeline/search-bar";
import PaginationIndicator from "../../../components/pagination/paginationIndicator";


const Icon = dynamic(() => import("../../image/icon"), { ssr: false });
import Wrapper from "../../../hoc/Wrapper";
import CustomDataLoader from "../../loader/custom-data-loading";
import { isAgency } from "../../../lib/config/creds";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: "100%",
  },
});

const MySubscriptions = (props) => {
  const [mobileView] = isMobile();
  const [apiData, setApiData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(0);
  const [flag, setFlag] = useState(false)
  const [searchShow, setSearchShow] = useState(false);
  const theme = useTheme();
  const [showLoader, setShowLoader] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const [lang] = useLang();
  const classes = useStyles();

  useEffect(() => {
    setPage(0);
    getSubsPlan();
  }, [value, searchValue]);

  const getSubsPlan = async () => {
    setShowLoader(true)
    try {
      const queryData = {
        status: value === 0 ? "ACTIVE" : "EXPIRED",
        offset: page * 10,
        limit: 10,
      };
      if (searchValue) {
        queryData["searchText"] = searchValue;
      }
      if (isAgency()) {
        queryData["userId"] = selectedCreatorId;
      }
      const res = await getSubscriptions(queryData);
      if (res.status === 200) {
        setFlag(true);
        setPage(page + 1);
        if (!page) {
          setApiData(res.data.data.subscription);
        } else {
          setApiData([...apiData, ...res.data.data.subscription]);
        }
      } else if (res.status === 204) {
        setFlag(false);
      }
      setTotalCount(res.data.data.totalCount);
      setShowLoader(false);
    } catch (err) {
      setShowLoader(false);
      console.error("ERROR IN getSubsPlan > ", err);
    }
  };

  const handleTab = (e, newValue) => {
    setApiData([])
    setValue(newValue);
    setPage(0);
  };

  const TabPanel = (props) => {
    const { children, value, index } = props;
    return <>{value === index && <div>{children}</div>}</>;
  };

  const activeTab = () => {
    return (
      <div className="list-unstyled mx-0 mt-3 mt-sm-4">
        {apiData?.map((plan) => (
          <div key={plan._id} style={{ position: `${!searchShow && "relative"}`, top: `${!searchShow && "0px"}` }}>
            <SubscriptionTile plan={plan} value={value} />
          </div>
        ))}
        <PaginationIndicator
          id="mySubscriptionTab"
          totalData={apiData}
          totalCount={totalCount}
          pageEventHandler={() => {
            if (page && !showLoader && flag) {
              getSubsPlan();
            }
          }}
        />
      </div>
    );
  };

  const cancelledTab = () => {
    return (
      <div className="list-unstyled mx-0 mt-3 mt-sm-4">
        {apiData?.map((plan) => (
          <div key={plan._id} style={{ position: `${!searchShow && "relative"}`, top: `${!searchShow && "0px"}` }}>
            <SubscriptionTile plan={plan} value={value} />
            <hr className="m-0" />
          </div>
        ))}
        <PaginationIndicator
          id="mySubscriptionTab"
          totalData={apiData}
          totalCount={totalCount}
          pageEventHandler={() => {
            if (page && !showLoader && flag) {
              getSubsPlan();
            }
          }}
        />
      </div>
    );
  };

  const NoDataPlaceholder = (loading) => {

    return (
      <>
        {!apiData?.length && <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "70vh" }}
        >
          {
            loading ?
              <CustomDataLoader
                type="ClipLoader"
                loading={true}
                size={60}
              /> :
              <div className="text-center">
                <Icon
                  icon={
                    value
                      ? `${env.NO_CANCEL_SUBSCRIPTIONS_SVG}#no_cancel_subs_svg`
                      : `${env.NO_ACTIVE_SUBSCRIPTIONS_SVG}#Group_132878`
                  }
                  color={theme.text}
                  width={150}
                  height={150}
                  viewBox={"0 0 118.599 111.261"}
                />
                <h4 className="pt-3 txt-heavy fntSz22">{!value ? lang?.noActiveSubscription : lang?.noCancelledSubscription}</h4>
              </div>
          }

        </div>}
      </>
    );
  };

  const TabsFunction = () => {
    return (
      <>
        <Tabs
          value={value}
          variant="fullWidth"
          onChange={handleTab}
          style={{
            background: "var(--l_profileCard_bgColor)",
          }}
        >
          <Tab
            className={`text-capitalize fntSz16 ${value === 0 ? "dv_base_color borderBtmClr2" : "borderBtm2 text-app"}`}
            label="Active"
          />
          <Tab
            className={`text-capitalize fntSz16 ${value === 1 ? "dv_base_color borderBtmClr2" : "borderBtm2 text-app"}`}
            label="Expired"
          />
        </Tabs>
      </>
    );
  };

  const TabsPanelFunction = () => {
    
    return (
      <>
        <TabPanel value={value} index={0}>
          {!apiData?.length ? NoDataPlaceholder(showLoader) : activeTab()}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {!apiData?.length ? NoDataPlaceholder(showLoader) : cancelledTab()}
        </TabPanel>
      </>
    );
  };

  const SearchFunc = () => {
    const webSearchFollowObj = {
      padding: "0 0 0 50px",
      background: theme?.background,
      border: `1px solid #8e8e931f`,
      borderRadius: "20px",
      height: "44px",
      fontSize: "16px",
      fontFamily: `"Avenir-Book", sans-serif !important`,
      color: theme?.text,
    };
    return (
      <div className="py-3">
        <SearchBar
          onlySearch
          value={searchValue}
          handleSearch={(e) => setSearchValue(e.target.value)}
          webSearchFollowObj={mobileView ? "" : webSearchFollowObj}
        />
      </div>
    );
  };

  return (
    <Wrapper>
      {mobileView ? (
        <>
          <Header
            title={lang.mySubscriptions}
            Data={lang.mySubscriptions}
            back={() => {
              backNavMenu(props);
            }}
            right={() => {
              return (
                <div onClick={() => setSearchShow(!searchShow)}>
                  <Icon
                    icon={`${env.SEARCH_OUTLINE_INACTIVE}#_Icons_1_Search`}
                    color={theme.text}
                    size={25}
                  />
                </div>
              );
            }}
          />

          <div style={{ marginTop: "70px" }} className="">
            {searchShow && SearchFunc()}
            <Paper className={classes.root}>{TabsFunction()}</Paper>
            <div>
              <div id="mySubscriptionTab" className="overflowY-auto" style={{ height: "calc(calc(var(--vhCustom, 1vh) * 100) - 118px)" }}>
                {TabsPanelFunction()}
              </div>
            </div>

          </div>
        </>
      ) : (
        <div className="h-100 w-100">
          <div className="myAccount_sticky__section_header">
            <div className="row m-0 align-items-center justify-content-between px-3">
              <h5 className="content_heading px-1 m-0 content_heading__dt sectionHeading">
                {lang.mySubscriptions}
              </h5>
              {SearchFunc()}
            </div>
            {TabsFunction()}
          </div>
          <div id="mySubscriptionTab" style={{ height: "calc(calc(var(--vhCustom, 1vh) * 100) - 185px)", overflowY: "auto" }}>
            {TabsPanelFunction()}
          </div>
        </div>
      )}
      {showLoader && apiData?.length &&
        <div className="d-flex align-items-center justify-content-center h-100 w-100 profileSectionLoader">
          <CustomDataLoader
            type="ClipLoader"
            loading={showLoader}
            size={60}
          />
        </div>}

      <style jsx="true">{`
        :global(.MuiTabs-root) {
          position: sticky;
          background-color:${theme?.drawerBackground};
          top: 210px;
          z-index: 2;
        }
        :global(.MuiTab-textColorPrimary) {
          color: ${theme.text};
          border-bottom: 3px solid #6c757d;
        }
        :global(.MuiTab-textColorPrimary.Mui-selected.MuiTab-wrapper) {
          color: ${theme.appColor};
        }
      `}</style>
    </Wrapper>
  );
};

export default MySubscriptions;
