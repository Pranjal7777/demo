import { useState, useEffect } from "react";
import Header from "../../header/header";
import useLang from "../../../hooks/language";
import { makeStyles } from "@material-ui/core";
import isMobile from "../../../hooks/isMobile";

import SearchBar from "../../../containers/timeline/search-bar.jsx";
import SubscriptionTile from "./SubscriptionTile";
import Select from "../../../components/select/select";
import {
  backNavMenu,
  startLoader,
  stopLoader,
  Toast,
} from "../../../lib/global";
import {
  getAllPlans,
  getMySubscribers,
  getSelectedPlans,
} from "../../../services/subscriptions";
import dynamic from "next/dynamic";
import * as env from "../../../lib/config";
import { useTheme } from "react-jss";
import { useSelector, useDispatch } from "react-redux";

const Icon = dynamic(() => import("../../image/icon"), { ssr: false });
import Wrapper from "../../../hoc/Wrapper";
import InputBox from "../../input-box/input-box";
import FilterBox from "../../../components/select/select";
import { getCookie } from "../../../lib/session";
import { setSubscriptionPlan } from "../../../redux/actions/index";
import CustomDataLoader from "../../loader/custom-data-loading";
import { isAgency } from "../../../lib/config/creds";

const MySubscribers = (props) => {
  const theme = useTheme();
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState("");
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(20);
  const [option, setOption] = useState([]);
  const [selectionRange, setSelectRange] = useState({
    value: 0,
    label: "All Plans",
    name: "plans",
  });
  const [apiData, setApiData] = useState(null);
  const activePlans = useSelector((state) => state.subscriptionPlan);
  const [showLoader, setShowLoader] = useState(false);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  let webSearchFollowObj = {
    padding: "0 0 0 50px",
    background: theme?.background,
    border: `1px solid #8e8e931f`,
    borderRadius: "20px",
    height: "44px",
    fontSize: "16px",
    fontFamily: `"Roboto", sans-serif !important`,
    color: theme?.text,
  };

  useEffect(() => {
    if (activePlans?.length > 0) {
      // Changing API Response according to react-select
      if (option?.length <= 0) {
        option.push(selectionRange);
        activePlans.map((plan) => {
          option.push({
            value: plan._id,
            label: plan?.subscriptionTitle ? plan.subscriptionTitle : (plan?.duration + ` ${[plan?.durationType].includes("DAYS") ? "Day" : "Month"}`),
            name: "plans",
          });
        });
      }
    } else {
      getAllPlan();
    }
  }, [activePlans]);

  useEffect(() => {
    const searchResult = async () => {
      try {
        const queryData = {
          skip,
          limit,
        };
        if (searchValue) {
          queryData["searchText"] = searchValue;
        }
        if (isAgency()) {
          queryData["userId"] = selectedCreatorId
        }
        // API Call
        const res = await getMySubscribers(queryData);

        let data = res?.data?.data?.subscribers;
        setApiData(data);
      } catch (err) {
        console.error("ERROR IN searchResult > ", err);
        Toast(err?.response?.data?.message || lang.errorMsg, "error");
      }
    };
    searchResult();
  }, [searchValue]);

  useEffect(() => {
    const getSubscribers = async () => {
      try {
        // API Call
        // startLoader();
        setShowLoader(true);
        const queryData = {
          offset: 0,
          limit: 20,
          planId: selectionRange.value === 0 ? "" : selectionRange.value,
        };
        if (isAgency()) {
          queryData["userId"] = selectedCreatorId
        }
        const res = await getMySubscribers(queryData);
        // console.log("_res is here", res)
        let data = res?.data?.data?.subscribers;
        // stopLoader()
        setShowLoader(false);
        setApiData(data);
      } catch (err) {
        console.error("ERROR IN getSubscribers > ", err);
        stopLoader();
        setShowLoader(false);
        Toast(err?.response?.data?.message || lang.errorMsg, "error");
      }
    };
    getSubscribers();
  }, [selectionRange]);

  const getAllPlan = async () => {
    try {
      const userId = isAgency() ? selectedCreatorId : getCookie("uid");

      // API Call
      let res = await getSelectedPlans(userId);
      if (res.data) {
        dispatch(setSubscriptionPlan(res?.data?.data));
      }
    } catch (err) {
      console.error("ERROR IN getAllPlan > ", err);
      Toast(err?.response?.data?.message || lang.errorMsg, "error");
    }
  };

  const NoDataPlaceholder = () => {
    return (
      <>
        {showLoader ? (
          ""
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "70vh" }}
          >
            <div className="text-center">
              <Icon
                icon={`${env.NO_SUBSCRIBERS_PLACEHOLDER_SVG}#no_subs_svg`}
                color={
                  mobileView
                    ? theme.type == "light"
                      ? theme.palette.l_app_text
                      : theme.palette.d_app_text
                    : theme.type == "light"
                      ? theme.palette.l_app_text
                      : theme.palette.d_app_text
                }
                width={250}
                height={250}
                viewBox="0 0 188.53 229.407"
              />
            </div>
          </div>
        )}
      </>
    );
  };

  const listItems = () => {
    return (
      <ul className="list-unstyled m-0 overflowY-auto" style={{maxHeight: mobileView ? "calc(calc(var(--vhCustom, 1vh) * 100) - 180px)" : "calc(calc(var(--vhCustom, 1vh) * 100) - 160px)"}}>
        {apiData.map((user) => (
          <div key={user._id} className="mt-2">
            <SubscriptionTile plan={user} subscriber={true} />
            <hr className="m-0" />
          </div>
        ))}
      </ul>
    );
  };

  const webInoutStyle = {
    background: theme.palette.l_input_bg,
    color: "#000",
  };
  const mobileInoutStyle = {
    background: theme.palette.d_input_bg,
    color: theme.palette.d_app_text,
  };
  return (
    <Wrapper>
      {mobileView ? (
        <>
          <Header
            title={lang.mySubscribers + `(${apiData?.length || 0})`}
            back={() => {
              backNavMenu(props);
            }}
          />
          <div style={{ paddingTop: "80px", height: "calc(var(--vhCustom, 1vh) * 100)" }} className="my-subscribers">
            <SearchBar
              onlySearch
              value={searchValue}
              handleSearch={(e) => setSearchValue(e.target.value)}
            />

            <div className="d-flex flex-row justify-content-end subscriber_filter">
              <FilterBox
                filterSelect={(value) => setSelectRange(value)}
                value={selectionRange}
                options={option}
                className={"tfdrpdn_slct"}
                apptheme={theme}
                classNamePrefix={mobileView ? "select__optn" : "dv__select__optn"}
                mySubs={true}
              />
            </div>

            {apiData ? listItems() : NoDataPlaceholder()}
          </div>
        </>
      ) : (
        // <div className="h-100">
        <>
          <div className="d-flex flex-row align-items-center justify-content-between" style={{marginTop: "-5px"}}>
            <h5 className="content_heading px-1 m-0 myAccount_sticky__section_header sectionHeading py-0">
              {lang.mySubscribers} {`(${apiData?.length || 0})`}
            </h5>
            <div className="">
              <FilterBox
                filterSelect={(value) => setSelectRange(value)}
                value={selectionRange}
                options={option}
                className={"w-100 tfdrpdn_slct"}
                apptheme={theme}
                classNamePrefix={mobileView ? "select__optn" : "dv__select__optn"}
                mySubs={true}
              />
            </div>
          </div>

          <div className="mb-3">
            <SearchBar
              value={searchValue}
              handleSearch={(e) => setSearchValue(e.target.value)}
              webSearchFollowObj={mobileView ? "" : webSearchFollowObj}
              onlySearch={true}
            />
          </div>
          {apiData ? listItems() : NoDataPlaceholder()}
        </>
      )}

      {showLoader ? (
        <>
          <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
            <CustomDataLoader
              type="ClipLoader"
              loading={showLoader}
              size={60}
            />
          </div>
        </>
      ) : (
        <></>
      )}
      <style jsx>{`
        :global(.subscriber_filter .filterbarBox) {
          width: fit-content !important;
        }
        :global(.filterbarBox .tfdrpdn_slct) {
          min-width: 200px;
        }
    
      `}</style>
    </Wrapper>
  );
};

export default MySubscribers;
