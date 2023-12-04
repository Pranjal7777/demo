import { async } from 'q';
import React, { useEffect, useState } from 'react'
import { getCreatorLinkedList, getCreatorRequestList, getEmployeeList, updateStatus } from '../../../services/agency';
import { getCookie } from '../../../lib/session';
import { Toast, startLoader, stopLoader } from '../../../lib/global/loader';
import { getAgencyCreatorList, getCreatorData, getSelectedEmplyee } from '../../../redux/actions/agency';
import { useDispatch, useSelector } from 'react-redux';

const useAgencyCreatorList = () => {
  const [value, setValue] = useState(0);
  const [employeeData, setEmployeeData] = useState()
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const uId = getCookie("agencyId")
  const dispatch = useDispatch();
  const handleTab = (e, newValue) => {
    setValue(newValue);
    dispatch(getAgencyCreatorList([]))
    dispatch(getSelectedEmplyee([]));
    getCreatorList(newValue, 0);
    getAllEmployee()
    setPageCount(0);
  };
  const apiData = useSelector((state) => state.creatorAgencyData)
  const creatorlist = useSelector((state) => state.creatorRequest)
  const handleReject = () => {
    let payload = {
      agencyId: uId,
      action: "ACCEPTED",
      creatorId: creatorId
    }
    updateStatus(payload)
      .then((res) => {
        let response = res;
        if (response.status === 200) {
          Toast("Accepted");
        }
      })
      .catch((e) => {
        console.error("update error", e);
        Toast(e?.response?.data?.message, "error");
      })
  }

  const getCreatorList = async (value, page = 0, isInitialCall = false) => {
    let payload = {
      limit: 10,
      offset: page * 10,
      action: value == 0 ? "REQUESTED" : value == 1 ? "PENDING_ADMIN_APPROVAL" : value == 2 ? "ACCEPTED" : value == 3 ? "UNLINKED/REJECTED" : "CANCELLED",
      agencyId: uId
    }
    try {
      startLoader();
      const res = await getCreatorRequestList(payload);
      if (res.status === 200) {
        setHasMore(true)
        if (page === 0) {
          dispatch(getAgencyCreatorList(res.data.data.creatorAgency))
        }
        else {
          dispatch(getAgencyCreatorList([...apiData, ...res.data.data.creatorAgency]))
        }
        setPageCount(page + 1);
        setTotalPostCount(res.data.data.totalCount)
      } else if (res.status === 204) {
        if (isInitialCall) {
          dispatch(getAgencyCreatorList([]))
        }
        setHasMore(false)
        setIsLoading(false)
      }
      else {
        setHasMore(false)
        setIsLoading(false)
      }
      setIsLoading(false)
      stopLoader();
    } catch (err) {
      console.log(err)
      stopLoader();
      setHasMore(false)
      setIsLoading(false)
    }
  }

  const handlePageEvent = (value) => {
    if (!isLoading && hasMore && apiData.length < totalPostCount) {
      setIsLoading(true);
      getCreatorList(value, pageCount);
    }
  };

  const getLinkedCreatorList = async () => {
    let payload = {
      limit: 10,
      offset: 0,
      action: "ACCEPTED",
      agencyId: uId
    }
    try {
      startLoader();
      const res = await getCreatorRequestList(payload);
      if (res.status === 200) {
        dispatch(getCreatorData(res.data.data.creatorAgency))
      }
      stopLoader();
    } catch (err) {
      console.log(err)
      stopLoader();
    }
  }
  const getAllEmployee = async () => {
    let payload = {
      limit: 10,
      offset: 0,
      action: 1
    }
    try {
      startLoader();
      const res = await getEmployeeList(payload);

      if (res.status === 200) {
        setEmployeeData(res.data.data.employeeData);
      }
      stopLoader();
    } catch (err) {
      stopLoader();
      console.log(err)
    }
  }
  const getCretorLinkedListData = async (page = 0) => {
    setIsLoading(true);
    try {
      let payload = {
        offset: page * 10,
        limit: 10
      }
      const res = await getCreatorLinkedList(payload);
      if (res.status === 200) {
        setHasMore(true)
        if (page === 0) {
          dispatch(getCreatorData(res.data.data))
        } else {
          dispatch(getCreatorData([...creatorlist, ...res.data.data]))
        }
        setPageCount(page + 1)
      } else {
        setHasMore(false)
      }
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setHasMore(false)
    }
  };
  const handleLinekedCreator = () => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      getCretorLinkedListData(pageCount);
    }
  };
  return ({
    value,
    employeeData,
    setValue,
    handleTab,
    getCreatorList,
    handleReject,
    getLinkedCreatorList,
    getAllEmployee,
    handlePageEvent,
    getCretorLinkedListData,
    handleLinekedCreator
  })
}

export default useAgencyCreatorList