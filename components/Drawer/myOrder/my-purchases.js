import { useState, useEffect } from "react"
import Header from "../../header/header"
import useLang from "../../../hooks/language"
import isMobile from "../../../hooks/isMobile"

import SearchBar from "../../../containers/timeline/search-bar.jsx";
import { backNavMenu, startLoader, stopLoader, Toast } from "../../../lib/global";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import { useSelector, useDispatch } from "react-redux"
import { open_drawer } from "../../../lib/global";

import Wrapper from "../../../hoc/Wrapper";
import CustomDataLoader from "../../loader/custom-data-loading";
import FilterListIcon from '@material-ui/icons/FilterList';
import useProfileData from "../../../hooks/useProfileData";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ShoutoutSelect from '../../select/shoutoutSelect';
import Img from '../../ui/Img/Img';
import { SPEAKER_ICONS } from "../../../lib/config";
import { handleContextMenu } from "../../../lib/helper";
const FigureCloudinayImage = dynamic(
    () => import("../../cloudinayImage/cloudinaryImage"),
    { ssr: false }
);
const Avatar = dynamic(() => import("@material-ui/core/Avatar"), {
    ssr: false,
});

const MyShoutoutPurchases = (props) => {
    const theme = useTheme()
    const [mobileView] = isMobile();
    const [lang] = useLang();
    const [currProfile] = useProfileData();

    const [searchValue, setSearchValue] = useState("")
    const [selectionRange, setSelectRange] = useState({
        value: 0,
        label: "All Status",
    })
    // const activePlans = useSelector((state) => state.subscriptionPlan)
    const [showLoader, setShowLoader] = useState(false)
    const [activeStatus, setActiveStatus] = useState('all')
    const [allShoutouts, setAllShoutouts] = useState([])
    const profile = props.profile;

    const shoutoutRequests = [
        {
            userId: '#OD8EGD538CXSDV55312345',
            userName: 'Caludia Fijal',
            date: '5 June 2019 10:32AM',
            profileData: {},
            requestStatus: 'completed',
            price: '180.00',
            requestData: {
                intro: 'I love your movies',
                occasion: 'Birthday',
                instructions: 'Paragraph is collection of sentences. In html it is denoted with the tag is given <p> This is dummy paragraph.... </p> you can adjust the width and height of the paragraph by using hmtl other tag which will be describe in coming lectures.'
            },
            video: ''
        },
        {
            userId: '#OD8EGD538CXSDV5587654',
            userName: 'Caludia Fijal',
            date: '15 July 2019 10:32AM',
            profileData: {},
            requestStatus: 'accepted',
            price: '180.00',
            requestData: {
                intro: 'I love your movies',
                occasion: 'Birthday',
                instructions: 'Paragraph is collection of sentences. In html it is denoted with the tag is given <p> This is dummy paragraph.... </p> you can adjust the width and height of the paragraph by using hmtl other tag which will be describe in coming lectures.'
            },
            video: ''
        },
        {
            userId: '#OD8EGD538CXSDV553987',
            userName: 'Caludia Fijal',
            date: '3 August 2019 10:32AM',
            profileData: {},
            requestStatus: 'pending',
            price: '180.00',
            requestData: {
                intro: 'I love your movies',
                occasion: 'Birthday',
                instructions: 'Paragraph is collection of sentences. In html it is denoted with the tag is given <p> This is dummy paragraph.... </p> you can adjust the width and height of the paragraph by using hmtl other tag which will be describe in coming lectures.'
            },
            video: ''
        },
        {
            userId: '#OD8EGD538CXSDV5534567',
            userName: 'Caludia Fijal',
            date: '8 December 2019 10:32AM',
            profileData: {},
            requestStatus: 'cancelled',
            price: '180.00',
            requestData: {
                intro: 'I love your movies',
                occasion: 'Birthday',
                instructions: 'Paragraph is collection of sentences. In html it is denoted with the tag is given <p> This is dummy paragraph.... </p> you can adjust the width and height of the paragraph by using hmtl other tag which will be describe in coming lectures.'
            },
            video: ''
        },
    ]

    return (
        <Wrapper>
            {mobileView ? (
                <>
                    <Header
                        title={lang.myOrder}
                        back={() => {
                            backNavMenu(props)
                        }}
                    />
                    <div style={{ marginTop: "80px" }}>
                        <div className='d-flex' style={{ width: '86vw' }}>
                            {<SearchBar
                                value={searchValue}
                                onlySearch
                                handleSearch={(e) => setSearchValue(e.target.value)}
                            />}
                            <div className='position-relative' style={{ border: '2px solid #eeeeee', background: '#eeeeee', width: '40px', height: '40px', borderRadius: '50%' }}>
                                <FilterListIcon style={{ marginTop: '10px', position: 'absolute', top: '-2px', left: '6px' }} />
                                <ShoutoutSelect style={{ position: 'absolute' }} handleFilterState={setActiveStatus} options={shoutoutRequests} />
                            </div>
                        </div>
                        {
                            activeStatus === 'all'
                                ? <>
                                    {
                                        shoutoutRequests && shoutoutRequests.map((request) => (
                                            <div
                                                key={request.userId}
                                                className="my-2 d-flex flex-column justify-content-center"
                                                style={{
                                                    margin: '0 15px'
                                                }}>
                                                <div
                                                    className="py-1 row m-0 text-dark"
                                                    style={{
                                                        backgroundColor: "#e8e4e4a3",
                                                        width: '100%'
                                                    }}
                                                    onClick={() =>
                                                        open_drawer(
                                                            "Purchase",
                                                            {
                                                                profile: currProfile,
                                                                requestData: request
                                                            },
                                                            "right"
                                                        )
                                                    }
                                                >
                                                    <div className="col-10 px-2 py-1 m-0">
                                                        <p className="m-0 bold fntSz12">{request.userId}</p>
                                                        <p className="m-0 fntSz10">{request.date}</p>
                                                    </div>
                                                    <div className="col-2 text-center m-auto m-0 p-0">
                                                        <ArrowForwardIosIcon style={{ color: 'var(--l_base)', fontSize: '13px' }} />
                                                    </div>
                                                </div>
                                                <div className='d-flex align-items-center justify-content-between p-2'>
                                                    <div className='d-flex align-items-center'>
                                                        <div className='callout-none' onContextMenu={handleContextMenu} >
                                                            {profile.profilePic ? (
                                                                <FigureCloudinayImage
                                                                    publicId={profile.profilePic}
                                                                    width={30}
                                                                    ratio={1}
                                                                    className="mv_profile_logo_requestShoutout mb-1"
                                                                />
                                                            ) : (
                                                                <Avatar className="mv_profile_logo__myPurchases mb-1  solid_circle_border">
                                                                    {profile && profile.firstName && profile.lastName && (
                                                                        <span className="initials__myPurchases" style={{ letterSpacing: '1px !important' }}>
                                                                            {profile.firstName[0] + (profile.lastName ? profile.lastName[0] : '')}
                                                                        </span>
                                                                    )}
                                                                </Avatar>
                                                            )}
                                                        </div>
                                                        <div className='d-flex flex-column justify-content-center ml-2'>
                                                            <p className='p-0 m-0' style={{ fontSize: '3.3vw', fontWeight: '700' }}>{request.userName}</p>
                                                            <span style={{ fontSize: '3vw', fontWeight: '600', marginTop: '-3px', textTransform: 'capitalize', color: `${(request.requestStatus === 'completed') ? 'green' : (request.requestStatus === 'cancelled') ? 'red' : 'blue'}` }}>{request.requestStatus}</span>
                                                        </div>
                                                    </div>
                                                    <div style={{ marginRight: '6vw' }}>
                                                        <Img src={SPEAKER_ICONS} alt='speaker icons' style={{ width: '30px' }} />
                                                    </div>
                                                </div>
                                                <div style={{ width: '100%', height: '2px', background: '#e8e4e4a3' }}></div>
                                                <div className='px-2 py-1'>
                                                    <Avatar
                                                        className="mb-1  solid_circle_border"
                                                        style={{ width: '20px', height: '20px', display: 'inline-flex', marginRight: '6px' }}>
                                                        {currProfile && currProfile.firstName && currProfile.lastName && (
                                                            <span className="initials__myPurchases" style={{ fontSize: '8px', letterSpacing: '1px !important' }}>
                                                                {currProfile.firstName[0] + currProfile.lastName[0]}
                                                            </span>
                                                        )}
                                                    </Avatar>
                                                    <p className='p-0 m-0' style={{ fontSize: '10px', display: 'inline' }}>
                                                        For
                                                        <span className="initials__myPurchases" style={{ textTransform: 'capitalize', fontSize: '10px', color: '#4b4b4b', marginLeft: '2px', fontWeight: '700' }}>
                                                            {currProfile.firstName + currProfile.lastName}
                                                        </span></p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </>
                                : shoutoutRequests.filter(shoutoutRequest => shoutoutRequest.requestStatus === `${activeStatus}`).map(request => (
                                    <div
                                        key={request.userId}
                                        className="my-2 d-flex flex-column justify-content-center"
                                        style={{
                                            margin: '0 15px'
                                        }}>
                                        <div
                                            className="py-1 row m-0 text-dark"
                                            style={{
                                                backgroundColor: "#e8e4e4a3",
                                                width: '100%'
                                            }}
                                            onClick={() =>
                                                open_drawer(
                                                    "Purchase",
                                                    {
                                                        profile: currProfile,
                                                        requestData: request
                                                    },
                                                    "right"
                                                )
                                            }
                                        >
                                            <div className="col-10 px-2 py-1 m-0">
                                                <p className="m-0 bold fntSz12">{request.userId}</p>
                                                <p className="m-0 fntSz10">{request.date}</p>
                                            </div>
                                            <div className="col-2 text-center m-auto m-0 p-0">
                                                <ArrowForwardIosIcon style={{ color: 'var(--l_base)', fontSize: '13px' }} />
                                            </div>
                                        </div>
                                        <div className='d-flex align-items-center justify-content-between p-2'>
                                            <div className='d-flex align-items-center'>
                                                <div className='callout-none' onContextMenu={handleContextMenu} >
                                                    {profile.profilePic ? (
                                                        <FigureCloudinayImage
                                                            publicId={profile.profilePic}
                                                            width={30}
                                                            ratio={1}
                                                            className="mv_profile_logo_requestShoutout mb-1"
                                                        />
                                                    ) : (
                                                        <Avatar className="mv_profile_logo__myPurchases mb-1  solid_circle_border">
                                                            {profile && profile.firstName && profile.lastName && (
                                                                <span className="initials__myPurchases" style={{ letterSpacing: '1px !important' }}>
                                                                    {profile.firstName[0] + (profile.lastName ? profile.lastName[0] : '')}
                                                                </span>
                                                            )}
                                                        </Avatar>
                                                    )}
                                                </div>
                                                <div className='d-flex flex-column justify-content-center ml-2'>
                                                    <p className='p-0 m-0' style={{ fontSize: '3.3vw', fontWeight: '700' }}>{request.userName}</p>
                                                    <span style={{ fontSize: '3vw', fontWeight: '600', marginTop: '-3px', textTransform: 'capitalize', color: `${(request.requestStatus === 'completed') ? 'green' : (request.requestStatus === 'cancelled') ? 'red' : 'blue'}` }}>{request.requestStatus}</span>
                                                </div>
                                            </div>
                                            <div style={{ marginRight: '6vw' }}>
                                                <Img src={SPEAKER_ICONS} alt='speaker icons' style={{ width: '30px' }} />
                                            </div>
                                        </div>
                                        <div style={{ width: '100%', height: '2px', background: '#e8e4e4a3' }}></div>
                                        <div className='px-2 py-1'>
                                            <Avatar
                                                className="mb-1  solid_circle_border"
                                                style={{ width: '20px', height: '20px', display: 'inline-flex', marginRight: '6px' }}>
                                                {currProfile && currProfile.firstName && currProfile.lastName && (
                                                    <span className="initials__myPurchases" style={{ fontSize: '8px', letterSpacing: '1px !important' }}>
                                                        {currProfile.firstName[0] + currProfile.lastName[0]}
                                                    </span>
                                                )}
                                            </Avatar>
                                            <p className='p-0 m-0' style={{ fontSize: '10px', display: 'inline' }}>
                                                For
                                                <span className="initials__myPurchases" style={{ fontSize: '10px', color: '#4b4b4b', marginLeft: '2px', letterSpacing: '1px !important' }}>
                                                    {currProfile.firstName + currProfile.lastName}
                                                </span></p>
                                        </div>
                                    </div>
                                ))
                        }
                    </div>
                </>
            ) : (<></>)
            }

            {
                showLoader ? (<>
                    <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
                        <CustomDataLoader type="ClipLoader" loading={showLoader} size={60} />
                    </div>
                </>) : <></>
            }
        </Wrapper >
    )
}

export default MyShoutoutPurchases;