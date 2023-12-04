import React, { useEffect, useState } from 'react';
import { LOGO_IMG } from '../../lib/config/logo';
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import useAgencyCreatorList from './hook/useAgencyCreatorList';
import useLang from '../../hooks/language'
import { useDispatch, useSelector } from 'react-redux';
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen';
import { setSelectCreator } from '../../redux/actions/agency';
import { useRouter } from 'next/router';
import { getCookie, removeCookie, setCookie } from '../../lib/session';
import { getFollowCount, getProfile } from '../../services/profile';
import { ParseToken } from '../../lib/parsers/token-parser';
import { setProfile } from '../../redux/actions';
import { Toast, startLoader, stopLoader } from '../../lib/global/loader';
import { isAgency } from '../../lib/config/creds';
import { isoChatLogin } from '../../services/chat';
import PaginationIndicator from '../../components/pagination/paginationIndicator';
import { handleContextMenu } from '../../lib/helper';


const AgencySelect = (props) => {
  const { setDropdownVisible, dropdownVisible } = props;
  const [selectedOption, setSelectedOption] = useState(null);
  const { getCretorLinkedListData, handleLinekedCreator } = useAgencyCreatorList();
  const creatorlist = useSelector((state) => state.creatorRequest)
  const [agencyList, setAglist] = useState([creatorlist])
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const dispatch = useDispatch();
  const router = useRouter();
  const selectCreatorData = getCookie("selectedCreator")
  const [lang] = useLang()
  const selectedCreator = selectCreatorData && JSON.parse(selectCreatorData);
  const apiData = useSelector((state) => state.creatorAgencyData)
  let linkedCreatorlist = creatorlist.filter((creator) => creator?.creatorId !== selectedCreator?.creatorId);
  useEffect(() => {
    getCretorLinkedListData()
  }, [apiData])

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setCookie("selectedCreator", option)
    setCookie("selectedCreatorId", option.creatorId)
    setDropdownVisible(false);
  };
  const fecthProfileDetails = async (Uid) => {
    return new Promise(async (resolve, reject) => {
      try {
        startLoader();
        const token = getCookie('token')
        const uid = isAgency() ? Uid : getCookie("uid");
        const res = await getProfile(uid, ParseToken(token), Uid);
        setCookie("profileData", JSON.stringify({
          ...res?.data?.data,
        }))
        setCookie('isometrikUserId', res?.data?.data?.isometrikUserId);
        setCookie("categoryData", JSON.stringify([...res?.data?.data?.categoryData]))
        const followCount = await getFollowCount(uid, ParseToken(token), isAgency() ? Uid : "");
        dispatch(
          setProfile({
            ...res?.data?.data,
            ...followCount?.data?.data,
          })
        );
        stopLoader();
        resolve(true);
      } catch (err) {
        stopLoader();
        console.log(err, "hhhhhhhh")
        Toast("Something went wrong!!!", "error");
      }
    })

  };
  const selectCreator = async (option) => {
    try {
      const chatRes = await isoChatLogin(option.creatorId)
      const chatToken = chatRes?.data?.data?.isometrikToken
      if (!chatToken) {
        Toast(lang.reportErrMsg)
        return;
      }
      setCookie('isometrikToken', chatToken)
    } catch (e) {
      Toast(lang.reportErrMsg)
      console.log("chat token errrorr", e);
      return;
    }
    removeCookie("profileData");
    removeCookie("userPreference");
    removeCookie("categoryData");
    removeCookie("isometrikUserId");
    fecthProfileDetails(option.creatorId).then(async () => {
      if (window.mqttAppClient) {
        try {
          window.mqttAppClient.disconnect();
        } catch (e) {
          console.log(e);
        }
      }
      handleSelectOption(option.creatorDetails ? { ...option.creatorDetails, creatorId: option.creatorId } : { ...option })
      dispatch(setSelectCreator(option.creatorDetails ? { ...option.creatorDetails, creatorId: option.creatorId } : { ...option }))
      window.location.href = "/"
    }
    ).catch(e => {
      Toast(lang.reportErrMsg)
    })
  }
  return (
    <div className="custom-select-wrapper mb-1">
      <div
        className={`custom-select customStyle position-relative  cursor-pointer`}
        onClick={() => {
          linkedCreatorlist.length && setDropdownVisible(!dropdownVisible)
          getCretorLinkedListData()
        }}
      >
        {!selectedCreator && <p className='d-flex align-items-center mb-0 gradient-text pl-3'>Select Creator</p>}

        {selectedCreator && (
          <React.Fragment>
            <img onContextMenu={handleContextMenu} src={s3ImageLinkGen(S3_IMG_LINK, selectedCreator.profilePic, 100, 200, 200)} style={{ borderRadius: "50%" }} className='imgTile callout-none' alt="Profile Image" />
            <span className='d-flex flex-column'>
              <span className="name name text-app fntSz15 text-truncate" style={{ color: "#000" }}>{selectedCreator.firstName}{selectedCreator.lastName}</span>
              <span className="username text-mute fntSz14">{selectedCreator.username}</span>
            </span>
          </React.Fragment>
        )}
        <div className={`${!dropdownVisible ? "arrow_on_down" : "arrow_on_up"} position-absolute`}>
          <ArrowForwardIosIcon className=" fntSz15 cursor-pointer" color='#fff' />
        </div>

      </div>
      {dropdownVisible && (
        <div className="custom-select-dropdown mt-3 overflow-hidden py-2  cursor-pointer" style={{ borderRadius: "33px", boxShadow: "0px 1px 3px 2px var(--l_app_bg)" }}>
          <div id="linekedCreator_container" style={{ overflowY: "auto", maxHeight: "40vh" }}>
            {linkedCreatorlist?.map((option, index) => (
              <div
                className={`custom-select-option  d-flex flex-row col-12 py-2 borderSide`} style={{ gap: "1rem", borderBottom: "1px solid #F6F6F6" }}
                key={index}
                onClick={() => selectCreator(option)}
              >
                <img src={s3ImageLinkGen(S3_IMG_LINK, (option.creatorDetails?.profilePic || option?.profilePic), 100, 200, 200)}
                  className='imgTile callout-none' onContextMenu={handleContextMenu} style={{ objectFit: "contain", borderRadius: "50%" }} alt="Profile Image" />
                <span className='d-flex flex-column'>
                  <span className={`name text-app fntSz17 ${selectedCreator?.username == (option.creatorDetails?.username || option.username) && "gradient-text"}`}>{option.creatorDetails?.firstName || option.firstName} {option.creatorDetails?.lastName || option.lastName}</span>
                  <span className="username text-muted fntSz14">{option.creatorDetails?.username || option.username}</span>
                </span>
              </div>
            ))}
          </div>
          <PaginationIndicator
            id={"linekedCreator_container"}
            totalData={creatorlist}
            pageEventHandler={handleLinekedCreator}
          />
        </div>
      )
      }
      <style jsx>{`
      .customStyle{
        height: 3.5rem !important;
        display: flex;
    gap: 1rem;
    border-radius: 33px;
      }
      .customStyle:hover{
        border:2px solid deeppink;
        box-shadow: 0px 1px 8px 7px var(--l_app_bg);
        border-radius:33px;
        transition:.5s;
      }
      .gradient-text {
        background-color: #f3ec78;
        background-image: linear-gradient(#FF71A4, #D33BFE) !important;
        background-size: 100%;
        font-size:15px;
        text-align:left;
        -webkit-background-clip: text;
        -moz-background-clip: text;
        -webkit-text-fill-color: transparent; 
        -moz-text-fill-color: transparent;
    }
      .borderTop:hover{
    border-top-left-radius: 33px !important;
    border-top-right-radius: 33px !important;
    border-bottom:1px solid #F6F6F6 !important;
    border:2px solid deepPink;
      }
      .border_Bottom:hover{
    border-bottom-left-radius: 33px !important;
    border-bottom-right-radius: 33px !important;
    border-top:1px solid #F6F6F6 !important;
    border:2px solid deepPink !important;
      }
      .borderSide:hover{
        border-left:2px solid deepPink;
      }
      .custom-select{
background:none;   
   }
.arrow_on_down{
  top:31%;
  transform: rotate(90deg) !important;
   left: 88.5%;
}
.arrow_on_up{
  top:31%;
  transform: rotate(270deg) !important;
   left: 88%;
}
.imgTile{
  width:40px;
  height:40px
}
.custom-select-dropdown ::-webkit-scrollbar-track{
  background:#fff !important;
  margin: 20px 0 !important;
}

      `}</style>
    </div >
  );
};

export default AgencySelect;
