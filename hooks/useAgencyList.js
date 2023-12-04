import React, { useEffect, useState } from 'react'
import { getAgencyList, getMyAgencyList, sendAgeencyRequest, sendAgencyRequest, updateStatusEmployee } from '../services/agencyList';
import { Toast, close_dialog, close_drawer, startLoader, stopLoader } from '../lib/global/loader';
import { countries } from '../lib/CountriesList';
import { getCookie } from '../lib/session';
import { useDispatch, useSelector } from 'react-redux';
import { getAgencyData, getMyAgencyData } from '../redux/actions/crmChange';
import isMobile from './isMobile';

const useAgencyList = () => {
  const findAgency = useSelector((state) => state.allAgency)
  const myAgency = useSelector((state) => state.myAgencyData)
  const [value, setValue] = useState((myAgency?.currentAgencyData?.length) ? 1 : 0);
  const [searchValue, setSearchValue] = useState();
  const uID = getCookie("uid");
  const dispatch = useDispatch();
  const [mobileView] = isMobile();
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const handleTab = (e, newValue) => {
    setValue(newValue);
    getAgency(0)
    getMyAgency()
    setPageCount(0);
  }

  const getAgency = async (page = 0) => {
    let payload = {
      limit: 10,
      offset: page * 10
    }
    if (searchValue) {
      payload.searchText = searchValue;
    }
    try {
      setIsLoading(true);
      let res = await getAgencyList(payload);
      if (res.status === 200) {
        setHasMore(true)
        if (page === 0) {
        dispatch(getAgencyData(res.data.data))
        } else {
          dispatch(getAgencyData([...findAgency, ...res.data.data]))
        }
        setPageCount(page + 1);
      } else {
        setHasMore(false)
      }
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false);
      console.log(err.respone)
    }
  }
  const handlePageEvent = () => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      getAgency(pageCount);
    }
  };

  const getMyAgency = async () => {
    let payload = {
      limit: 10,
      offset: 0
    }
    try {
      setIsLoading(true);
      let res = await getMyAgencyList(payload);
      if (res.status === 200) {
        dispatch(getMyAgencyData(res.data.data))
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err.respone)
    }
  }
  const findCountryCode = (countryName) => {
    const country = countries.find((country) =>
      country.label.toLowerCase() === countryName.toLowerCase()
    );
    return country ? country.value : null;
  }

  const handleCancel = async (id, action) => {
    let payload = {
      creatorId: uID,
      agencyId: id,
      action: action
    }
    try {
      startLoader();
      let res = await updateStatusEmployee(payload);
      if (res.status === 200) {
        Toast("Cancelled");
        getMyAgency()
        mobileView ? close_drawer() : close_dialog();
      }
      stopLoader();
    } catch (err) {
      stopLoader();
      Toast(err?.response?.data?.message, "error");
    }
  }

  return ({
    value,
    searchValue,
    isLoading,
    setSearchValue,
    handleTab,
    getAgency,
    getMyAgency,
    findCountryCode,
    handleCancel,
    handlePageEvent
  }
  )
}

export default useAgencyList