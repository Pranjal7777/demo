import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { startLoader, stopLoader } from '../../lib/global/loader';
import { getDeviceLog } from '../../services/agency';
import Image from '../../components/image/image';
import useLang from "../../hooks/language";
import { formatDate } from '../../lib/date-operation/date-operation'
import { PROFILE_BACK_ICON } from '../../lib/config/profile';
import Icon from '../../components/image/icon';
import { NO_DATA_PLACEHOLDER } from '../../lib/config/placeholder';
import moment from 'moment/moment';
import { handleContextMenu } from '../../lib/helper';

const DeviceLog = () => {

  const router = useRouter();
  const [apiData, setApiData] = useState();
  const [lang] = useLang();
  useEffect(() => {
    getStatusEmployees()
  }, [])
  const getStatusEmployees = async () => {
    let payload = {
      userId: router.query.CreatorId,
      limit: 10,
      offset: 0
    }
    try {
      startLoader();
      const res = await getDeviceLog(payload);
      if (res.status === 200) {
        setApiData(res.data.result);
      }
      stopLoader();
    } catch (err) {
      stopLoader();
      console.log(err)
    }
  }
  return (
    <div className='card_bg vh-100 rightside px-4'>
      <div className='pt-5 d-flex align-items-center ' style={{ height: "16vh" }} >
        <Icon
          icon={`${PROFILE_BACK_ICON}#_Icons_Arrow_Left`}
          size={20}
          class='mr-2 mb-2 cursorPtr'
          alt="cross icon"
          viewBox="0 0 40 40"
          color="var(--l_app_text)"
          onClick={() => router.back()}
        />

        <h4 className='text-app bold'>Device Log</h4>
      </div>
      <div>
        <div className='w-100' style={{ height: "85vh", overflowY: "auto" }}>
          <table className='col-12'>
            <tr className='tableHeader col-12 ' style={{ position: "sticky", top: "0%", zIndex: "1" }}>
              <th className='p-3 col-1'>{lang.device}</th>
              <th className='col-1'>{lang.manufacturer}</th>
              <th className='col-1'>{lang.model}</th>
              <th className='col-1'>{lang.os}</th>
              <th className='col-1'>{lang.City}</th>
              <th className='col-1'>{lang.IP}</th>
              <th className='col-1'>{lang.SessionStart}</th>
              <th className='col-1'>{lang.SessionEnd}</th>
            </tr>
            {apiData?.length ? apiData?.map((data) => {
              return (
                <tr className='text-muted tabBorder col-12' key={data?.sessionStart}>
                  <td className='p-3 col-1'>{data?.device}</td>
                  <td className='col-1'>{data.manufacturer}</td>
                  <td className='col-1'>{data.model}</td>
                  <td className='col-1'>{data.os}</td>
                  <td className='col-1'>{data.city || "N/A"}</td>
                  <td className='col-1'>{data.ipAddress}</td>
                  <td className='col-1'>{moment.unix(data.sessionStart).format("D MMM YYYY h:mm a")}</td>
                  <td className='col-1'>{moment.unix(data.sessionEnd).format("D MMM YYYY h:mm a")}</td>
                </tr>
              )
            }) : ""}
          </table>
          {!apiData?.length && <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: "67vh" }}>
            <img src={NO_DATA_PLACEHOLDER} width="160px" className='d-flex flex-column align-item-center justify-content-centercallout-none' onContextMenu={handleContextMenu} />
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
  )
}

export default DeviceLog