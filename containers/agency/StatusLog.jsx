import React, { useEffect, useState } from 'react'
import { PROFILE_BACK_ICON } from '../../lib/config/profile'
import { useRouter } from 'next/router'
import { startLoader, stopLoader } from '../../lib/global/loader'
import { getStatusEmployee, getStatusLog } from '../../services/agency'
import { getCookie } from '../../lib/session'
import { formatDate } from '../../lib/date-operation/date-operation'
import Icon from '../../components/image/icon'
import { NO_DATA_PLACEHOLDER } from '../../lib/config/placeholder'
import { handleContextMenu } from '../../lib/helper'

const StatusLog = () => {
  const router = useRouter();
  const uId = getCookie("agencyId")
  const [apiData, setApiData] = useState()
  const [cretorId, setCreatorId] = useState(router.query.CreatorId)
  const [isEmployee, setIsEmployee] = useState(router.query.isEmployee)
  useEffect(() => {
    setCreatorId(router.query.CreatorId)
    if (router.query.isEmployee === "true") {
      getStatusEmployees()
    } else {
      getStatusCreator()
    }
  }, [router.query.CreatorId, router.query.isEmployee])
  const getStatusCreator = async () => {
    startLoader();
    let payload = {
      agencyId: uId,
      creatorId: cretorId
    }
    try {
      startLoader();
      const res = await getStatusLog(payload);
      if (res.status === 200) {
        setApiData(res.data.data.statusLogs);
      }
      stopLoader();
    } catch (err) {
      stopLoader();
      console.log(err)
    }
  }
  const getStatusEmployees = async () => {
    let payload = {
      agencyId: uId,
      agencyUserId: cretorId
    }
    try {
      startLoader();
      const res = await getStatusEmployee(payload);
      if (res.status === 200) {
        setApiData(res.data.data.statusLogs);
      }
      stopLoader();
    } catch (err) {
      stopLoader();
      console.log(err)
    }
  }
  const reversedArray = apiData?.map((element, index, arr) => {
    return arr[arr.length - 1 - index];
  });
  return (
    <>
      <div className='card_bg vh-100 rightside px-4'>
        <div className='pt-5 d-flex align-items-center' style={{ height: "16vh" }}>
          <Icon
            icon={`${PROFILE_BACK_ICON}#_Icons_Arrow_Left`}
            width={20}
            class='mr-2 mb-2 cursorPtr'
            alt="follow icon"
            viewBox="0 0 40 40"
            color="var(--l_app_text)"
            onClick={() => router.back()}
          />
          <h4 className='text-app bold'>Status Log</h4>
        </div>
        <div>
          <div className='w-100' style={{ height: "85vh", overflowY: "auto" }}>
            <table className='col-10'>
              <tr className='tableHeader ' style={{ position: "sticky", top: "0%" }}>
                <th className='p-3'>Status</th>
                <th>Timeline</th>
                <th>Action by user role</th>
                <th>Notes</th>
              </tr>
              {reversedArray?.length ? reversedArray?.map((data) => {
                return (
                  <tr className='text-muted tabBorder' key={data?.timestamp}>
                    <td className='p-3'>{data?.status}</td>
                    <td>{formatDate(data.timestamp, "D MMM YYYY h:mm a")}</td>
                    <td>{data?.actionBy}</td>
                    <td>{data?.notes || "N/A"} </td>
                  </tr>
                )
              }) : ""}
            </table>
            {!apiData?.length && <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: "67vh" }}>
              <img src={NO_DATA_PLACEHOLDER} width="160px" className='d-flex flex-column align-item-center justify-content-center callout-none' onContextMenu={handleContextMenu} />
              <p className='text-app text-center bold fntSz24'>No Logs Found!!</p>
            </div>}
          </div>
        </div>
        <style jsx>{`
        .rightside{
          width:100%;
        }
        :global(.tableHeader){
          background: var(--l_border);
          color:var(--l_app_text);
        }
        :global(.tabBorder){
          border-bottom:1px solid #EAE5E7;
        }
        :global(.tabBorder:hover){
          border-bottom:2px solid #FE6FA6;
        }
        td:first-child,
       th:first-child {
         border-radius: 10px 0 0 10px;
       }
       td:last-child,
       th:last-child {
         border-radius: 0 10px 10px 0;
       }
        `}</style>
      </div>
    </ >
  )
}

export default StatusLog