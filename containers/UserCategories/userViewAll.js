import React, { useEffect, useState, useRef, useCallback } from "react";
import Wrapper from "../../hoc/Wrapper";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../components/header/header";
import useLang from "../../hooks/language";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getCookie, setCookie } from "../../lib/session";
import {SEARCH_OUTLINE_INACTIVE, backArrow, user_category_sort, user_category_filter} from "../../lib/config";
import { getFeatureCreator } from "../../services/auth";
import { stopLoader, startLoader, open_progress, open_drawer, close_drawer, open_dialog } from "../../lib/global";
import Router from "next/router";
import { getCategories, getCategoriesData, getCategorySectionData, getPdpPageData, getPopularModals } from "../../services/user_category";
import isMobile from "../../hooks/isMobile";
import { useTheme } from "react-jss";
import Icon from "../../components/image/icon";
import PaginationIndicator from "../../components/pagination/paginationIndicator";
import GetUIaccrodingCategory from "./getUIaccrodingCategory";
import MarkatePlaceHeader from "../markatePlaceHeader/markatePlaceHeader";
import { handleHeaderCategories } from "../../redux/actions/shoutout";
import CustomDataLoader from "../../components/loader/custom-data-loading";
const SearchBar = dynamic(() => import("../../containers/timeline/search-bar"),{ssr: false});

const Skeleton = dynamic(() => import("@material-ui/lab/Skeleton"), {
  ssr: false,
});

const FilterRadioGroup = dynamic(() => import("./filterGroup/filterRadioGroup"), {
  ssr: false,
});
const CheckboxLabels = dynamic(() => import("./filterGroup/checkRadioGroup"), {
  ssr: false,
});
const InputRanges = dynamic(() => import("../../components/input-range-picker-comp/input-range-picker"), {
  ssr: false,
});
const UserViewAll = (props) => {
  const searchBox = useRef();
  const scroll = useRef();
  const dispatch = useDispatch();
  const [mobileView] = isMobile();
  const theme = useTheme();
  const categoryFilterData = useSelector((state)=> state?.markateplaceData?.headerCategories);
  const minShoutoutValue = useSelector((state)=> state?.appConfig?.minShoutoutValue);
  const [page, setPage] = useState(0);
  const [featureCreatorList, setFeatureCreatorList] = useState([]);
  const [popularCreatorList, setPopularCreatorList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [isSearchBarShow, setIsSearchBarShow] = useState(false);

  const [skeleton, setSkeleton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const uid = getCookie("uid");
  const [lang] = useLang();
  const [headerHeight, setHeaderHeight] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [isFilterAvailabelForCat, setIsFilterAvailabelForCat] = useState(true);
  const [headerTitleList, setHeaderTitleList] = useState([
    { query: "category_type", title: lang.categories },
    { query: "featured-creators", title: lang.featured },
    { query: "popular-creators", title: lang.popular },
    { query: "user_avilabel_categories", title: "user_avilabel_categories" },
    { query: "user_categories", title: "user_categories" },
    { query: "feature_moment", title: "feature_moment" },
    { query: "category_list", title: "category_list" },
  ]);
  const [sortByFilters, setSortByFilters] = useState(
    [{label : "Price: High - low",value: "HIGH_TO_LOW"},
    {label : "Price: Low - High",value: "LOW_TO_HIGH"},
    // {label : "Number of reviews",value: "NO_OF_REVIEWS"},
    {label : "Newest",value: "NEWEST"},
    {label : "Alphabetical",value: "ALPHABETICS"}
    ]);
  const [sortByRatings, setSortByRatings] = useState(
    [{label : "5 stars",value: 5, checked: false , id: 0},
    {label : "4+ stars",value: 4, checked: false , id: 1},
    {label : "3+ stars",value: 3, checked: false , id: 2},
    {label : "2+ stars",value: 2, checked: false , id: 3},
    {label : "1+ stars",value: 1, checked: false , id: 4}
    ]);

    const [sortByPrice, setSortByPrice] = useState(
      [
        {label: "$5 - $100", checked: false, id: 0, from: 5, to: 100},
        {label: "$100 - $200", checked: false, id: 1, from: 100, to: 200},
        {label: "$200 - $300", checked: false, id: 2, from: 200, to: 300},
        {label: "$300 - $400", checked: false, id: 3, from: 300, to: 400},
        {label: "$400 - $500", checked: false, id: 4, from: 400, to: 500},
        {label: "$500+", checked: false, id: 4, from: 500, to: 1000},
      ]
      );

    const [shoutoutRating, setShoutoutRating] = useState(
      [
        {label: "1 - 50", checked: false, id: 0, from: 1, to: 50},
        {label: "51 - 100", checked: false, id: 1, from: 51, to: 100},
        {label: "101 - 150", checked: false, id: 2, from: 101, to: 150},
        {label: "151 - 200", checked: false, id: 3, from: 151, to: 200},
        {label: "250+", checked: false, id: 4, from: 250, to: 1000},
      ]
      );

    const [categoryData, setCategoryData] = useState([]);

  const [headerTitle, setHeaderTitle] = useState(lang.featured);
  const [searchKey, setSearchKey] = useState("");

  //   get params from url
  const router = useRouter();
  const queryType = router?.query?.userCatType;
  const category_label = router?.query?.caterory_label;
  const category_type = router?.query?.type;
  const catId = router?.query?.id || "";
  const isHeroCategory = router?.query?.isHeroCategory || false;
  const isFromCategorySection = router?.query?.isFromCategorySection || false;
  const [totalPostCount, setTotalPostCount] = useState(0);

  // filter value
  const [sortByFilter, setSortByFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState({});
  const [shoutoutFilter, setShoutoutFilter] = useState({});
  const [isPriceFilterAvailabel, setIsPriceFilterAvailabel] = useState(false);
  const [filterRating, setFilterRating] = useState(false);
  const [sortByCategoryFilter, setSortByCategoryFilter] = useState("")
  const [activeCatData, setActiveCateData] = useState([]);
  const [isFilterClear, setIsFilterClear] = useState(false);
  const [minRangeValue, setMinRangeValue] = useState(0);
  const [maxRangeValue, setMaxRangeValue] = useState(1000);

  // video playing state
  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);
  const [isVideoPlayed, setIsVideoPlayed] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoSpinnser, setVideoSpinner] = useState(false);
  const [isVideoMute, setisVideoMute] = useState(true);
  let fullscreenEle = useRef(null);

  let webSearchFollowObj = {
    padding: "0 0 0 50px",
      background: theme.type == "light" ? "#fff" :  "#32344a",
      border: "none",
      borderRadius: "20px",
      height: "44px",
      fontSize: "16px",
      fontFamily: `"Roboto", sans-serif !important`,
      color: `${theme.text}!important`,
  }

  // pagination loader state
  const [isAPICalled, setIsAPICalled] = useState(false);
  const [isApiNeedToCall, setIsApiNeedTocall] = useState(true);
  const [preventAPICall, setPrevantAPICall] = useState(false);
  const handleShoutoutVideo = (video) => {
    mobileView ? open_drawer("VDO_DRAWER", 
    { vdoUrl: getVideoUrl(video), creator: video.creator}, "right") : 
    open_dialog("HOMEPAGE_VIDEO_DRAWER", { vdoUrl: getVideoUrl(video),  creator: video.creator });
    setIsVideoPlayed(false);
  }

  const handleCategoriesFilter = (catid) => {
    setPrevantAPICall(prev => prev=true);
    setSortByCategoryFilter(prev => `${prev},${catid}`)
  }

  const handleProfileDirection = (user) => {
    mobileView ? startLoader() : open_progress();
    if(getCookie("uid") == user?.creator?.id){
      Router.push("/profile");
    }else{
      setCookie("otherProfile", `${user?.creator?.username || user?.creator?.userName || user?.creator?.profilename}$$${user?.creator?.creatorId || user?.creator?.userId || user?.creator?.userid || user?.creator?._id}`)
      Router.push(`/${user?.creator?.username || user?.creator?.username}`);
    }
  };

  const handleShoutoutDetail = (e, shoutoutDetail) => {
    e.stopPropagation();
    mobileView && open_drawer("shoutoutDetail", {shoutoutDetail}, "right")
  }

  const handleCheckboxValue = (filterType, id, filterData = []) => {
    setPrevantAPICall(prev => prev=true);
    switch(filterType){
      case lang.avgRating:
        if(filterData.length > 0){
          setSortByRatings([...filterData]);
          setFilterRating(sortByRatings[id].value);
          !filterData[id].checked ? 
          setFilterRating(false) : setFilterRating(sortByRatings[id].value);
          return;
        }
        let data = [];
        sortByRatings.map((ratingFilter, index)=> {
          if(id == index) {
            let selectedLabel = {...ratingFilter, checked: !ratingFilter.checked}
            data.push(selectedLabel);
          }else{
            let unselectedLabel = {...ratingFilter, checked: false}
            data.push(unselectedLabel);
          }
          setSortByRatings([...data])
        })

        sortByRatings[id].checked ? 
        setFilterRating(false) : setFilterRating(sortByRatings[id].value);
        break;

      case lang.filterByPrice:
        if(filterData.length > 0){
          setSortByPrice([...filterData]);
          let priceFilterInfo = filterData[id];
          !priceFilterInfo.checked ? 
          setPriceFilter({
            priceFrom: 0,
            priceTo: 0,
          }) : setPriceFilter({
            priceFrom: priceFilterInfo?.from,
            priceTo: priceFilterInfo?.to})
          setMinRangeValue(prev => minShoutoutValue);
          setMaxRangeValue(prev => 1000);
          return;
        }else{
          let priceDataFilter = [];
          sortByPrice.map((priceFilterState, index)=> {
            if(id == index) {
              let selectedLabel = {...priceFilterState, checked: !priceFilterState.checked}
              priceDataFilter.push(selectedLabel);
            }else{
              let unselectedLabel = {...priceFilterState, checked: false}
              priceDataFilter.push(unselectedLabel);
            }
            setSortByPrice([...priceDataFilter])
          })
        }
        let priceFilterInfo = sortByPrice[id];
        sortByPrice[id].checked ? 
        setPriceFilter({
          priceFrom: 0,
          priceTo: 0,
        }) : setPriceFilter({
          priceFrom: priceFilterInfo?.from,
          priceTo: priceFilterInfo?.to})
        setMinRangeValue(priceFilterInfo?.from);
        setMaxRangeValue(priceFilterInfo?.to)
      break;

      case lang.filterCategory:
        if(filterData.length > 0){
          setCategoryData([...filterData]);
          let categoryUrl = "";
          filterData.map((cat, index)=>{
            if(cat?.checked){
              categoryUrl = categoryUrl+`${cat?.categoryId},`
            }
          })
          setSortByCategoryFilter(prev => categoryUrl.slice(0,-1))
          return;
        }
        if(categoryData.length > 0){
          let categoryFilter = [...categoryData];
          categoryFilter[id] = {
            ...categoryFilter[id], checked: !categoryFilter[id].checked
          }
          setCategoryData([...categoryFilter]);
          let categoryUrl = "";
          categoryFilter.map((cat, index)=>{
            if(cat?.checked){
              categoryUrl = categoryUrl+`${cat?.categoryId},`
            }
          })
          setSortByCategoryFilter(prev => categoryUrl.slice(0,-1))
        }
      break;

    case lang.shoutoutCount:
      if(filterData.length > 0){
          setShoutoutRating([...filterData]);
          let shoutoutRatingCount = filterData[id];
          !shoutoutRatingCount.checked ? 
          setShoutoutFilter({
            shoutoutFrom: 0,
            shoutoutTo: 0,
          }) : setShoutoutFilter({
            shoutoutFrom: shoutoutRatingCount?.from,
            shoutoutTo: shoutoutRatingCount?.to})
          return;
      }else{
        let shoutoutFilterData = [];
        shoutoutRating.map((priceFilterState, index)=> {
          if(id == index) {
            let selectedLabel = {...priceFilterState, checked: !priceFilterState.checked}
            shoutoutFilterData.push(selectedLabel);
          }else{
            let unselectedLabel = {...priceFilterState, checked: false}
            shoutoutFilterData.push(unselectedLabel);
          }
          setShoutoutRating([...shoutoutFilterData])
        })
      }
      let shoutoutFilterInfo = sortByPrice[id];
      shoutoutRating[id].checked ? 
        setShoutoutFilter({
          shoutoutFrom: 0,
          shoutoutTo: 0,
        }) : setShoutoutFilter({
          shoutoutFrom: shoutoutFilterInfo?.from,
          shoutoutTo: shoutoutFilterInfo?.to})
    break;
    }
  }

  const categoryState = () => {
    let categoryArray = [];
    for(let i = 0; i < categoryFilterData?.length; i++){
      categoryArray[i] = {
        label: categoryFilterData[i]?.title,
        checked: false,
        value: categoryFilterData[i]?.title,
        id: i,
        categoryId: categoryFilterData[i]?._id
      }
    }
    setCategoryData([...categoryArray]);
  }

  useEffect(() => {
    categoryState();
    if (mobileView) {
      let headerRef = document.getElementById("header").offsetHeight;
      setHeaderHeight(headerRef + 10);
    }
    getHeaderTitle();
    handelFilterVisibility();
    mobileView && handelGetCategoryForMobile();
  }, []);

  useEffect(()=>{
    categoryState();
  }, [categoryFilterData.length])
  
  useEffect(()=> {
    
    if(preventAPICall){
      setIsApiNeedTocall((prev) => prev = true);
      if(queryType == "category_list"){
        getHeaderTitle();
        return;
      }else{
        setActiveCateData(prev => prev = []);
        category_type != "CategorySection" ?  handlePDPpageData(0, true, true) : handleCategoryData(0, true, true);
      }
    }

  }, [sortByFilter, filterRating, priceFilter, shoutoutFilter, catId, queryType,sortByCategoryFilter])

  useEffect(()=>{
    if(preventAPICall){
      clearFilters()
      getHeaderTitle();
      handelFilterVisibility();
    }
    if(isHeroCategory || category_type=="CategorySection"){
      clearFilters()
      getHeaderTitle();
      handelFilterVisibility();
      return;
    }
  }, [catId, queryType])

  const handelFilterVisibility = () => {
    if((category_type == "SHOUTOUT_PROFILE_SLIDER" || category_type == "VIDEO_CALL_PROFILE_SLIDER" || category_type == "RECENTLY_VIEWED" || category_type == "CategorySection")){
      setIsFilterVisible(true);
      setIsFilterAvailabelForCat(true)
    }else{
      setIsFilterAvailabelForCat(false);
      setIsFilterVisible(false);
    }
  }

  const handleSortUsers = () => {
    open_drawer("sortByCategories",{radioValue: sortByFilter, radioOptionList: sortByFilters ,radioLabel:"sortby",  setFilterValue:handleFilterValue},"bottom");
  }

  const handleFilterUsers = () => {
    open_drawer("sortByUserFilters",
    {
      checkboxList: [...categoryData],
      isFilterClear: isFilterClear, 
      setFilterValue: handleCategoriesFilter,
      handleRange :handleRange, 
      category_label,
      minShoutoutValue: minRangeValue, 
      minValue: minRangeValue, 
      maxValue: maxRangeValue ? maxRangeValue : 1000,
      handleCheckboxValue: handleCheckboxValue,
      sortByPrice: sortByPrice,
      sortByRatings: sortByRatings,
      shoutoutRating: shoutoutRating,
      isFromCategorySection: Boolean(isFromCategorySection)
    },
      "bottom");
  }

  const handleRange = (value) => {
    setPrevantAPICall(prev => true);
    value[0] && value[1] ?  setIsPriceFilterAvailabel(true) : setIsPriceFilterAvailabel(false);
    setMinRangeValue(value[0]);
    setMaxRangeValue(value[1]);

    setPriceFilter({
      priceFrom: value[0],
      priceTo: value[1]
    })

    let unCheckedPriceFilter = [];
    sortByPrice.map((priceFilter, index)=> {
        let unselectedLabel = {...priceFilter, checked: false}
        unCheckedPriceFilter.push(unselectedLabel);
        setSortByPrice([...unCheckedPriceFilter])
    })
  };

  // commenting this code as need to work on search kay
  useEffect(() => {
    if(preventAPICall){
      getHeaderTitle();
      setIsApiNeedTocall((prev) => true);
    }
  }, [searchKey]);

  const handleFilterValue = (value, label) => {
    setPrevantAPICall(prev => prev=true);
    mobileView && close_drawer("sortByCategories")
    switch(label){
      case "sortby":
        setSortByFilter(value);
        break;
      case "ratingBy":
        setFilterRating(value)
        break;
      default:
        break;
    }
  }

  const handelGetCategoryForMobile = async () => {
    try{
      const res = await getCategoriesData();
      const data = res?.data?.data
      dispatch(handleHeaderCategories(data))
    }catch(e){
      console.error("Error in handleCategories", e);
    }
  }


  // function will return post of active category for API pagination
  const getActiveCategoryPost = () => {
    switch (queryType) {
      case "featured-creators":
        return featureCreatorList;
      case "category_type":
        return categoryList;
      case "popular-creators":
        return popularCreatorList;
      case "user_avilabel_categories":
      case "user_categories":
      case "category_list":
      case "feature_moment":
        return activeCatData;
    }
  };

  //  for calling API according to title
  const getPostAccordingCat = (cat, pageNo = 0, isPagination = false) => {
    switch (cat) {
      case "featured-creators":
        getFeaturedCreatorsList(pageNo);
        break;
      case "popular-creators":
        getPopularUserModals(pageNo);
        break;
      case "category_type":
        getUserCategories(pageNo);
        break;
      case "user_avilabel_categories":
      case "feature_moment":
        handlePDPpageData(pageNo, true);
        break;
      case "user_categories":
      case "heroCategories":
        handleCategoryData(pageNo, true);
        break;
      case "category_list":
        getCategoriesDataInfo(pageNo, true);
        break;
    }
  };

  const getHeaderTitle = () => {
    const hTitle = headerTitleList.find((tit, index) => {
      return tit.query === router?.query?.userCatType;
    });

    setHeaderTitle(hTitle?.title);
    getPostAccordingCat(hTitle?.query);
  };

  const handlePDPpageData = async (pageno, loader = true, isFilterApplied = false) => {
    if(!isApiNeedToCall && !isFilterApplied) {
      setIsAPICalled(false);
      return;
    };
    if(loader) setIsAPICalled(true);
    if(category_type == "CategorySection") {
      setIsAPICalled(false);
      return;
    };
    pageno == 0 && setSkeleton(true);
      mobileView && startLoader();
       let payload = {
          limit: 10,
          offset: pageno * 10,
          sortBy: sortByFilter
        }
        if(catId){
          payload["sectionId"] = catId
        }
        if(Object.values(priceFilter).length >= 2){
          payload["priceFrom"] = priceFilter?.priceFrom,
          payload["priceTo"] = priceFilter?.priceTo
        }
        if(Object.values(shoutoutFilter).length >= 2){
          payload["shoutoutFrom"] = shoutoutFilter?.shoutoutFrom,
          payload["shoutoutTo"] = shoutoutFilter?.shoutoutTo
        }
        if(filterRating){
          payload["rating"] = filterRating
        }
        if(sortByCategoryFilter){
          payload["categoryIds"] = sortByCategoryFilter.slice(0)
        }
        if(searchKey){
          payload["searchText"] = searchKey
        }
         try{
            setPage(pageno);
            let res = await getPdpPageData(payload);
            let data = res?.data?.data;
            if(pageno == page){
              if(res.status == 204 && searchKey.length > 0){
                setActiveCateData([]);
              }else{
                setActiveCateData([...data]);
              }
            }else{
              if(res.status == 204){
                if(searchKey.length > 0){
                  setActiveCateData([]);
                }else{
                  setActiveCateData((prev) => [...prev]);
                  setIsApiNeedTocall(false);
                }
              }else{
                setActiveCateData((prev) => [...prev, ...data]);
                setIsApiNeedTocall(true);
              }
            }
            mobileView && stopLoader();
            setIsAPICalled(false);
            setSkeleton(false);
         }catch(e){
          mobileView && stopLoader();
          setSkeleton(false);
          setIsAPICalled(false);
         }
      }

  const handleCategoryData = async (pageno, loader = true, isFilterApplied=false) => {
    if(!isApiNeedToCall && !isFilterApplied) {
      setIsAPICalled(false);
      return;
    };
    if(loader) setIsAPICalled(true);
      pageno == 0 && setSkeleton(true);
      mobileView && startLoader();
        let payload = {
          limit: 10,
          offset: pageno * 10,
          sortBy: sortByFilter
        }
        if(Object.values(priceFilter).length >= 2){
          payload["priceFrom"] = priceFilter?.priceFrom,
          payload["priceTo"] = priceFilter?.priceTo
        }
        if(Object.values(shoutoutFilter).length >= 2){
          payload["shoutoutFrom"] = shoutoutFilter?.shoutoutFrom,
          payload["shoutoutTo"] = shoutoutFilter?.shoutoutTo
        }
        if(filterRating){
          payload["rating"] = filterRating
        }
        if(sortByCategoryFilter || catId){
          payload["categoryIds"] = sortByCategoryFilter.slice(0) || catId
        }
        if(searchKey){
          payload["searchText"] = searchKey
        }
        try{
          setPage(pageno);
            let res = await getCategorySectionData(payload);
            let data = res?.data?.data;
          if(pageno == page){
            if(res.status == 204 && searchKey.length > 0){
              setActiveCateData([]);
            }else{
              setActiveCateData([...data]);
            }
          }else{
            if(res.status == 204){
              if(searchKey.length > 0){
                setActiveCateData([]);
              }else{
                setActiveCateData((prev) => [...prev]);
                setIsApiNeedTocall(false);
              }
            }else{
              setActiveCateData((prev) => [...prev, ...data]);
              setIsApiNeedTocall(true);
            }
          }
          stopLoader();
          setIsAPICalled(false);
          setSkeleton(false);
        }catch(e){
          stopLoader();
          setActiveCateData([]);
          setSkeleton(false);
          setIsAPICalled(false);
        }
      }

  const getCategoriesDataInfo = async (pageno = 0) => {
    if(!isApiNeedToCall) {
      setIsAPICalled(false);
      return
    };
    pageno == 0 && setSkeleton(true);
    startLoader();
    let payload = {
      limit: 10,
      offset: pageno * 20,
    }
    if(searchKey){
      payload["searchText"] = searchKey;
    }
      try{
        let res = await getCategoriesData(payload);
        let data = res?.data?.data;
        if(pageno == page){
          if(res.status == 204 && searchKey.length > 0){
            setActiveCateData([]);
          }else{
            setActiveCateData([...data]);
          }
        }else{
          if(res.status == 204){
            if(searchKey.length > 0){
              setActiveCateData([]);
            }else{
              setActiveCateData((prev) => [...prev]);
            }
          }else{
            setActiveCateData((prev) => [...prev, ...data]);
            setIsApiNeedTocall(true);
          }
        }
        stopLoader();
        setSkeleton(false);
        setIsAPICalled(false);
      }catch(e){
      stopLoader();
      setIsAPICalled(false);
      setActiveCateData([]);
      setSkeleton(false);
      }
  }

  // clear filter
  const clearFilters = () => {
    setSortByFilter("");
    setMinRangeValue(0);
    setMaxRangeValue(1000);
    setSortByCategoryFilter("");
    setFilterRating("");
    setIsPriceFilterAvailabel(false);
    setIsFilterClear(true);
    setPriceFilter({});
    setIsApiNeedTocall(true);
    setPrevantAPICall((prev)=> prev=true);
    const newPriceData = sortByPrice && sortByPrice.length && sortByPrice.map((data) => ({
        id: data.id, // value: data.value,
        checked: false,
        label: data.label,
        from: data.from,
        to: data.to
    }));
    setSortByPrice([...newPriceData]);

    const newRatingData = sortByRatings && sortByRatings.length && sortByRatings.map((data) => ({
      id: data.id,
      value: data.value,
      checked: false,
      label: data.label,
    }));
    setSortByRatings(newRatingData);

    if(categoryData.length > 0){
      const newCategoryData = categoryData && categoryData.length && categoryData.map((data, index) => ({
        label: data?.label,
        checked: false,
        value: data?.value,
        id: index,
        categoryId: data?.categoryId
      }));
      setCategoryData([...newCategoryData]);
    }
  }

  //  get feature post
  const getFeaturedCreatorsList = (pageCount = 0) => {
    startLoader();
    const list = {
      country: "INDIA",
      limit: mobileView ? 10 : 20,
      offset: searchKey ? 0  : mobileView ? pageCount * 10 :  pageCount * 20,
      searchText: searchKey || "",
    };
    getFeatureCreator(list)
      .then(async (res) => {
        if (res.status === 200) {
          setPage(pageCount);
          if (!pageCount) {
            setFeatureCreatorList(res.data.data);
          } else {
            setFeatureCreatorList((prev) => [...prev, ...res.data.data]);
          }
          setTotalPostCount(res.data.length);
        }else{
          setFeatureCreatorList([]);
        }
        setTimeout(() => {
          setSkeleton(false);
        }, 500);
        stopLoader();
        setHasMore(true);
        setIsLoading(false);
      })
      .catch(async (err) => {
        setHasMore(false);
        stopLoader();
        setSkeleton(false);
        setIsLoading(false);
        console.error(err);
      });
  };

  // get popular post
  const getPopularUserModals = (pageCount) => {
    startLoader();
    const list = {
      userId: uid,
      limit: mobileView ? 10 : 20,
      skip: searchKey ? 0  : mobileView ? pageCount * 10 :  pageCount * 20,
      search : searchKey || "",
    };
    getPopularModals(list)
      .then(async (res) => {
        if (res.status === 200) {
          setPage(pageCount);
          if (!pageCount) {
            setPopularCreatorList(res.data.data);
          } else {
            setPopularCreatorList((prev) => [...prev, ...res.data.data]);
          }
          setTotalPostCount(res.data.data.length);
        }
        
        setTimeout(() => {
          setSkeleton(false);
        }, 500);
        stopLoader();
        setHasMore(true);
        setIsLoading(false);
      })
      .catch(async (err) => {
        if(err.response.status === 404){
          searchKey ? setPopularCreatorList([]) : setPopularCreatorList((prev) => [...prev]);
        }
        stopLoader();
        setHasMore(false);
        setSkeleton(false);
        setIsLoading(false);
      });
  };

  //   get categories
  const getUserCategories = (pageCount) => {
    const list = {
      limit: 10,
      offset: searchKey ? 0  : mobileView ? pageCount * 10 :  pageCount * 20,
      searchText: searchKey || "",
    };
    getCategories(list)
      .then(async (res) => {
        if (res.status === 200) {
          setPage(pageCount);
          if (!pageCount) {
            setCategoryList(res.data.data);
          } else {
            setCategoryList((prev) => [...prev, ...res.data.data]);
          }
          setTotalPostCount(res.data.data.length);

        }else{
          setCategoryList([]);
        }
        setTimeout(() => {
          setSkeleton(false);
        }, 500);
        stopLoader();
        setIsLoading(false);
        setHasMore(true);
      })
      .catch(async (err) => {
        setHasMore(false);
        stopLoader();
        setSkeleton(false);
        setIsLoading(false);
        console.error(err);
      });
  };

  const profileClickHandler = (user) => {
    if (uid && (uid == user.userId || uid == user.user_id || uid == user.creatorId)) {
      open_progress();
      Router.push(`/profile`);
    } else {
      setCookie("otherProfile", `${user?.username || user?.userName}$$${user?.creatorId || user?.userId || user?.userid || user?._id}`);
      open_progress();
      Router.push(`/${user.username || user.userName}`);
    }
  };

  // API pagination for web
  const pageEventHandler = async (e) => {
    getPostAccordingCat(isHeroCategory ? "heroCategories" : queryType, page+1, true);
  };

  const openFullscreen = (e) => {
    if (fullscreenEle.current.requestFullscreen) {
      fullscreenEle.current.requestFullscreen();
    } else if (fullscreenEle.current.mozRequestFullScreen) {
      fullscreenEle.current.mozRequestFullScreen();
    } else if (fullscreenEle.current.webkitRequestFullscreen) {
      fullscreenEle.current.webkitRequestFullscreen();
    } else if (fullscreenEle.current.msRequestFullscreen) {
      fullscreenEle.current.msRequestFullscreen();
    } else {
      fullscreenEle.current.classList.toggle('fullscreen');
    }
  }

  const playVideoOnHover = (e, video) => {
    setIsVideoPlayed(true);
    setisVideoMute(true)
    setVideoId(video?._id)
    setVideoUrl(getVideoUrl(video));
    e.stopPropagation();
  }

  const getVideoUrl = (video) => {
    if(video?.otherUrls){
      return mobileView ? video?.otherUrls?.mobile : video?.otherUrls?.web;
    }else{
      return `${APP_IMG_LINK}/${video?.videoUrl}`;
    }
  }

  // for getting card UI according to category
  const getCardUI = () => {
    switch (headerTitle) {
      case lang.featured:
        return (
          <div className="row w-100 m-0 px-2">
            <GetUIaccrodingCategory 
              headerTitle={headerTitle} 
              featureCreatorList={featureCreatorList} 
              profileClickHandler={profileClickHandler}
            />
          </div>
        );
      case lang.popular:
        return (
          <div className="row m-0 px-2">
            <GetUIaccrodingCategory 
              headerTitle={headerTitle} 
              popularCreatorList={popularCreatorList} 
              profileClickHandler={profileClickHandler}
            />
          </div>
        );
      case lang.categories:
        return (
          <div className={`row w-100 m-0 ${mobileView ? "px-0" : "px-2"}`}>
             <GetUIaccrodingCategory 
              headerTitle={lang.categories} 
              categoryList={categoryList} 
              profileClickHandler={profileClickHandler}
              category_label={category_label}
            />
          </div>
        );
      case "user_avilabel_categories":
      case "category_list":
        return (
          <div className="row w-100 m-0 px-2">
            <GetUIaccrodingCategory 
              headerTitle={category_label == "Categories" ? lang.categories : headerTitle} 
              profileClickHandler={profileClickHandler}
              activeCateData={activeCatData}
              isFilterVisible={isFilterVisible}
              isFilterAvailabelForCat={isFilterAvailabelForCat}
              category_label={category_label}
              isVidecall={category_label == "1:1 Video calls" ? true : false}
            />
          </div>
        );
      case "user_categories":
        return (
          <div className="row w-100 m-0 px-2">
            <GetUIaccrodingCategory 
              headerTitle={category_label == "Categories" ? lang.categories : headerTitle} 
              profileClickHandler={profileClickHandler}
              activeCateData={activeCatData}
              isFilterVisible={isFilterVisible}
              isFilterAvailabelForCat={isFilterAvailabelForCat}
              category_label={category_label}
            />
          </div>
        );
      case "feature_moment":
        return (
          <div className="row w-100 m-0 px-2">
            <GetUIaccrodingCategory 
              headerTitle={headerTitle} 
              profileClickHandler={profileClickHandler}
              activeCateData={activeCatData}
              isFilterVisible={isFilterVisible}
              isFilterAvailabelForCat={isFilterAvailabelForCat}
              category_label={category_label}
              handleShoutoutVideo={handleShoutoutVideo}
              videoUrl={videoUrl}
              videoId={videoId}
              isVideoPlayed={isVideoPlayed}
              endVideoFunc={(videoBool) => setIsVideoPlayed(videoBool)}
              handleProfileDirection={handleProfileDirection}
              setVideoSpinner={setVideoSpinner}
              videoSpinnser={videoSpinnser}
              setisVideoMute={setisVideoMute}
              openFullscreen={openFullscreen}
              isVideoMute={isVideoMute}
              playVideoOnHover={playVideoOnHover}
              fullscreenEle={fullscreenEle}
              handleShoutoutDetail={handleShoutoutDetail}
            />
          </div>
        );
      default:
        break;
    }
  };

  return (
    <Wrapper>
      <div className="subPageScroll" id="featured_and_popular" ref={scroll}>
        {!mobileView ? (
          <>
          <MarkatePlaceHeader
            setActiveState={props?.setActiveState}
              {...props}
          />
          <div className="main_header_css markatePlaceContainer col-12 d-flex align-items-center px-3" style={{paddingTop: "105px", paddingBottom: "20px"}}>
            <div className="col-auto d-flex px-0">
            <ul
                className="breadcrumb align-items-center position-sticky breadcrumb__custom py-4"
                style={{
                  top: "62px",
                  left: "0",
                  zIndex: 2,
                  borderRadius: 0,
                  height: "28px",
                }}
              >
                <li
                  className="breadcrumb-item cursorPtr"
                  onClick={() => Router.push("/homepage")}
                >
                  <span>{lang.home}</span>
                </li>
                {isFromCategorySection && <li className="breadcrumb-item cursorPtr"
                  onClick={()=> Router.push("/homepage/category_list?caterory_label=Categories&&id=0&&type=CATEGORY_SLIDER")}
                >
                  <span className="">{lang.categories}</span>
                </li>}
                <li className="breadcrumb-item">
                  <span className="active">{category_label || "Feature"}</span>
                </li>
              </ul>
              </div>
          </div>
          <div className="col-12 pt-3 d-flex align-items-center markatePlaceContainer justify-content-between px-3">
            <h3>{category_label || "Feature"}</h3>
           {isFilterAvailabelForCat && <div className="d-flex align-items-center">
              <div className="hideFilteCss mr-1" onClick={()=> setIsFilterVisible(!isFilterVisible)}>{isFilterVisible ? lang.hideFilters : lang.displayFilters}</div>
              <div className="cleanFilterCss" onClick={()=> clearFilters()}>Clear Filter</div>
            </div>}
          </div>
          </>

        ) : (
          <Header id="header" title={category_label == "Categories" ? lang.allCategories :router?.query?.caterory_label} icon={backArrow} 
            right={() => {
              return (
                <Icon
                    icon={`${SEARCH_OUTLINE_INACTIVE}#subSearch`}
                    color={theme.text}
                    size={20}
                    onClick={()=>setIsSearchBarShow(prev => !prev)}
                  />
              );
            }}
          />
        )}
        {mobileView ? (
          <Wrapper>
          <div className={`positionTop ${mobileView ? "px-0" : "pl-5 pr-0"}`}>
              {mobileView && (
                <>
                  {isSearchBarShow && <div className="col-12 px-0">
                    <SearchBar
                      value={searchKey}
                      ref={searchBox}
                      handleSearch={(e) => {setSearchKey(e.target.value); setPrevantAPICall(true)}}
                      onlySearch={true}
                      webSearchFollowObj={webSearchFollowObj}
                      crossIcon={searchKey.length > 0 ? true : false}
                      onClick={()=> {setSearchKey("")}}
                    />
                  </div>}
                  {isFilterAvailabelForCat && <div className="mobileFilterPositionCss py-3 col-12 d-flex justify-content-between align-items-center">
                    <div className="d-flex justify-content-center align-items-center px-0 col-6" onClick={()=> handleSortUsers()}>
                    <Icon
                      icon={`${user_category_sort}#sortIcon`}
                      height={20}
                      width={18}
                      color={theme.text}
                      alt="sorting drawer"
                      class="cursorPtr"
                      viewBox="0 0 15 15"
                    /><span className="pl-2">Sort</span></div>
                    <div className="d-flex justify-content-center align-items-center px-0 col-6"
                      onClick={()=> handleFilterUsers()}
                    >
                    <Icon
                      icon={`${user_category_filter}#filter`}
                      height={20}
                      width={18}
                      color={theme.text}
                      alt="filter drawer"
                      class="cursorPtr"
                      viewBox="0 0 15 10"
                    />
                    <span className="pl-2">Filter</span></div>
                  </div>}
                </> 
              )}
              {skeleton ? (
                <>
                  <div className="row m-0 px-2">
                    {[...new Array(6)].map((item, index) => (
                      <div className={`${mobileView ? "col-6" : "col-2"} p-2`}>
                        <Skeleton
                          variant="rect"
                          width="100%"
                          height={`${
                            headerTitle == lang.categories ? "113px" : "200px"
                          }`}
                          className="imgStyle"
                          style={{
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>{getCardUI()}</>
              )}
            </div>
          </Wrapper>
        ) : (
          <div className="d-flex markatePlaceContainer">
            {isFilterVisible && isFilterAvailabelForCat && <div className="col-auto positionTop px-3">
              <div className="filterBorderCss py-2">
                <p className="filerLabelColor fntSz14 mb-0 pb-1">{lang.sortBy}</p>
                <FilterRadioGroup labelPlacement="end" radioOptionList={sortByFilters} radioClass="pl-0 py-2" radioValue={sortByFilter} radioLabel="sortby"  setFilterValue={handleFilterValue}/>
              </div>
              <div className="filterBorderCss py-2">
                <p className="filerLabelColor fntSz14 mb-0 pb-1">{lang.price}</p>
                <div className="py-2">
                  <InputRanges handleCheckboxValue={handleCheckboxValue} handleRange={handleRange} filterType="Filter by price" sortByPrice={sortByPrice} minValue={minRangeValue} minShoutoutValue={minRangeValue} maxValue={maxRangeValue ? maxRangeValue : 1000} />
                </div>
              </div>
             
              <div className="filterBorderCss py-2">
                <p className="filerLabelColor fntSz14 mb-0 pb-1">{lang.avgRating}</p>
                <CheckboxLabels handleCheckboxValue={handleCheckboxValue} labelPlacement="end" radioClass="pl-0 py-2" checkboxList={sortByRatings} setFilterValue={handleCategoriesFilter} filterType="Average review rating" />
              </div>
               {(!isFromCategorySection && (category_type == "SHOUTOUT_PROFILE_SLIDER" || category_type == "VIDEO_CALL_PROFILE_SLIDER" || category_type == "RECENTLY_VIEWED")) && <div className="filterBorderCss py-2">
                <p className="filerLabelColor fntSz14 mb-0 pb-1" radioLabel="categoryBy">{lang.filterCategory}</p>
                <CheckboxLabels category_label={category_label} handleCheckboxValue={handleCheckboxValue} checkboxList={categoryData} isFilterClear={isFilterClear} setFilterValue={handleCategoriesFilter} filterType="Filter by category" />
              </div>}
            </div>}
            <div className={`positionTop col ${mobileView ? "px-2" : `${isFilterVisible && isFilterAvailabelForCat ? "pl-3 pr-0": "p-0" }`}`}>
              {skeleton ? (
                <>
                  <div className="row m-0 px-2">
                    {[...new Array(6)].map((item, index) => (
                      <div className={`${mobileView ? "col-6" : "col-3"} p-2`}>
                        <Skeleton
                          variant="rect"
                          width="100%"
                          height={`${
                            headerTitle == lang.categories ? "113px" : "294px"
                          }`}
                          className="imgStyle"
                          style={{
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>{getCardUI()}</>
              )}
            </div>
          </div>
        )}
      {!mobileView && <div className="text-center">
        <CustomDataLoader
          isLoading={isAPICalled}
          type="normal"
        />
      </div>}
      </div>
      {getActiveCategoryPost() && getActiveCategoryPost().length > 9 && (
        <PaginationIndicator
          id="featured_and_popular"
          totalData={getActiveCategoryPost()}
          totalCount={getActiveCategoryPost().length || 500}
          pageEventHandler={() => {
              pageEventHandler();
          }}
        />
      )}
      <style jsx>{`
        .subPageScroll {
          overflow-y: auto !important;
          height: 100vh;
          background: ${theme?.markatePlaceBackground}
        }
        .positionTop {
          padding-top: ${mobileView ? "75" : "8"}px !important;
        }
        .imgStyle {
          border-radius: 8px !important;
          border-bottom: 2px solid #e5e5e5;
          object-fit : cover;
        }
        .main_header_css {
          height: 80px;
        }
        :global(.dv_search_bar_input) {
          max-width: 300px;
        }
        :global(.placeHolderCss){
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
        }
        .filerLabelColor{
          color: #ADAEB5;
        }
        .filterBorderCss{
          border-bottom: 1px solid #252525;
          width: 200px;
        }
        .activeCategoryCss{
          background: ${theme.appColor};
          border-radius: 22px;
        }
        .cateLabelAll {
          background: ${theme.labelbg};
          border-radius: 22px;
        }
        .catCountAll {
          color: #c0c0c0;
        }
        .hideFilteCss{
          border: 1px solid ${theme.text};
          border-radius: 22px;
          font-size: 13px;
          padding: 4px 10px;
          cursor: pointer;
        }
        .cleanFilterCss{
          background: ${theme.appColor};
          border: 1px solid ${theme.appColor};
          border-radius: 22px;
          font-size: 13px;
          padding: 4px 10px;
          cursor: pointer;
        }
        .sliderDivCss{
          border: 1px solid ${theme.labelbg};
          border-radius: 6px;
          text-align: center;
          background: ${theme.labelbg};
          font-size: 12px;
        }
        .markatePlaceContainer{
            width: 95.359vw;
            margin: 0 auto;
         }
         .breadcrumb__custom li span.active{
           color: ${theme?.text} !important
         }
         .breadcrumb__custom li span{
          color:  var(--l_breadcrum_deactive) !important;
          font-size: 16px;
          font-family: Roboto;
         }
         .breadcrumb__custom {
          padding-left: 0px !important;
          padding-right: 0px !important;
          background-color: ${theme?.markatePlaceBackground};
          margin: 0px;
        }
        .mobileFilterPositionCss{
          position: sticky;
          top: 77px;
          background: ${theme?.markatePlaceBackground};
          width: 100%;
          z-index: 99;
        }
      `}</style>
    </Wrapper>
  );
};

export default UserViewAll;
