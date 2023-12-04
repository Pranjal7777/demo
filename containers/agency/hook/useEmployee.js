import React, { useEffect, useState } from 'react'
import { getEmployeeList, updateEmployee, updateStatusEmployee } from '../../../services/agency';
import { getCookie } from '../../../lib/session';
import { startLoader, stopLoader } from '../../../lib/global/loader';
import { Toast } from '../../../lib/global';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEmployeeData, getEmployeeData, updateEmployeeHandler } from '../../../redux/actions/agency';
import { getProfile } from '../../../services/auth';
import { ParseToken } from '../../../lib/parsers/token-parser';
import { useRouter } from 'next/router';

const useEmployee = () => {
  const [value, setValue] = useState(0);
  const [searchText, setSearchText] = useState();
  const [reason, setReason] = useState()
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const employeeData = useSelector((state) => state?.allEmployeeData);
  const dispatch = useDispatch()
  const router = useRouter();
  const uId = getCookie("agencyId")
  const handleTab = (e, newValue) => {
    setValue(newValue);
    getEmployee(newValue, 0);
    dispatch(getAllEmployeeData([]))
    setPageCount(0);
  };
  const handleaddEmployee = () => {
    dispatch(getEmployeeData([]))
    router.push('/addEmployee')
  }
  useEffect(() => {
    getEmployee(value, 0)
  }, [searchText])
  const getEmployee = async (value, page = 0) => {
    let payload = {
      limit: 10,
      offset: page * 10,
      action: value === 0 ? 1 : value === 1 ? 2 : value === 2 ? 4 : 3
    }
    if (searchText) {
      payload["searchText"] = searchText;
    }
    try {
      startLoader();
      const res = await getEmployeeList(payload);
      if (res.status === 200) {
        setHasMore(true)
        if (page === 0) {
          dispatch(getAllEmployeeData(res.data.data.employeeData))
        } else {
          dispatch(getAllEmployeeData([...employeeData, ...res.data.data.employeeData]))
        }
        setPageCount(page + 1);
      } else {
        setHasMore(false)
      }
      setTotalPostCount(res.data.data.totalCount)
      setIsLoading(false)
      stopLoader();
    } catch (err) {
      stopLoader();
      setIsLoading(false)
      console.log(err)
    }
  };
  const handlePageEvent = (value) => {
    if (!isLoading && hasMore && employeeData.length < totalPostCount) {
      setIsLoading(true);
      getEmployee(value, pageCount);
    }
  };

  const handleAccept = (status, id) => {
    let payload = {
      agencyId: uId,
      agencyEmployeeId: id,
      action: status,
    }
    updateStatusEmployee(payload)
      .then((res) => {
        startLoader()
        let response = res;
        if (response.status === 200) {
          dispatch(updateEmployeeHandler(id))
        }
        stopLoader()
      })
      .catch((e) => {
        // stopLoader();
        console.error("update error", e);
        Toast(e?.response?.data?.message, "error");
        stopLoader();
      })
  }

  return ({
    value,
    searchText,
    totalPostCount,
    isLoading,
    pageCount,
    hasMore,
    setIsLoading,
    setValue,
    setSearchText,
    handleTab,
    handleAccept,
    getEmployee,
    handleaddEmployee,
    handlePageEvent
  })
}

export default useEmployee