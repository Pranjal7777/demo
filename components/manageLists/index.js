import React, { useEffect, useState } from 'react'
import Icon from '../image/icon'
import { goBack } from '../../lib/global'
import { Arrow_Left2 } from '../../lib/config/homepage'
import Button from '../button/button'
import isMobile from '../../hooks/isMobile'
import { DELETE_FOLDER, USERS_GROUP } from '../../lib/config/vault'
import useLang from '../../hooks/language'
import { Toast, close_dialog, close_drawer, open_dialog, open_drawer } from '../../lib/global/loader'
import { deleteCustomerList, getListDetails } from '../../services/assets'
import { useRouter } from 'next/router'
import MyList from './myList'
import Checkbox from '../formControl/checkBox'
import CustomDataLoader from '../loader/custom-data-loading'
import PaginationIndicator from '../pagination/paginationIndicator'
import Placeholder from '../../containers/profile/placeholder'
import { useSelector } from 'react-redux'
import { isAgency } from '../../lib/config/creds'
import { uppercaseToCamelCase } from '../../redux/actions/chat/helper'

const ManageList = () => {
    const [mobileView] = isMobile();
    const router = useRouter();
    const [lang] = useLang();
    const [customerLists, setCustomerLists] = useState([]);
    const [hoverState, setHoverState] = useState("");
    const [openList, setOpenList] = useState({});
    const [isDefaultDataToGet, setIsDefaultDataToGet] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState("");
    const [loader, setLoader] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const selectedCreatorId = useSelector((state) => state?.selectedCreator.creatorId);
    const { mySubscriber, myExpiredSubscriber, totalFollower, totalFollowing } = useSelector((state) => state.profileData)


    useEffect(() => {

        if (router?.asPath === "/manage-list") {
            setOpenList({});
        }
    }, [router]);

    useEffect(() => {
        getList()
    }, [])

    const countMappingHelper = {
        MY_FOLLOWERS: totalFollower,
        FOLLOWINGS: totalFollowing,
        MY_SUBSCRIBERS: mySubscriber,
        UNSUBSCRIBERS: myExpiredSubscriber,
    };

    const getList = async (skip = 0, limit = 10, intitalCall = false) => {
        let payload = {
            skip: skip * 10,
            limit: limit
        }
        setLoader(true)
        if (isAgency()) {
            payload["creatorId"] = selectedCreatorId;
        }
        try {
            const res = await getListDetails(payload);
            if (res.status === 200) {
                if (intitalCall) {
                    setCustomerLists(res?.data?.data)
                    setHasMore(false);
                    setLoader(false);
                }
                else if (!res?.data?.data.length) {
                    setHasMore(false);
                    setLoader(false);
                    return
                } else {
                    setCustomerLists([...customerLists, ...res?.data?.data])
                    setPageCount(pageCount + 1)
                    setHasMore(true);
                    setLoader(false);
                }
            }
            else if (res.status === 204) {
                setCustomerLists((prev) => [...prev]);
                setHasMore(false);
                setLoader(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handledeleteList = (e, id) => {
        e.stopPropagation();
        mobileView ? open_drawer("deleteFiles",
            {
                title: "list",
                subTitle: "list",
                // cancelBtn: lang.cancel,
                delete: () => handleDeleteCustomerList(selectedItemId)
            }, "bottom") :
            open_dialog("deleteFiles",
                {
                    title: lang.list,
                    subTitle: lang.list,
                    cancelBtn: lang.cancel,
                    delete: () => handleDeleteCustomerList(id)
                })
    }

    const handleDeleteCustomerList = async (id) => {
        let payload = {
            creatorCustomerListId: id,
        }
        if (isAgency()) {
            payload["userId"] = selectedCreatorId;
        }
        try {
            const res = await deleteCustomerList(payload)
            if (res.status === 200) {
                Toast("List Deleted Successfully!");
                getList(0, 10, true)
                setSelectedItems([])
            }
        } catch (error) {
            console.log(error);
            Toast(error.message, "error")
        }
    }

    const handleListClick = (e, data, membersCount) => {
        e.stopPropagation();
        if (data.listType == "DEFAULT" && (data.title.includes("People I Follow") || data.title.includes("My Followers") || data.title.includes("My Subscribers") || data.title.includes("Unsubscribed Users"))) {
            setIsDefaultDataToGet(true)
            router.push({
                pathname: "/manage-list/",
                query: { id: data?.title?.replace(" ", "") }
            })
        } else {
            setIsDefaultDataToGet(false)
            router.push({
                pathname: "/manage-list/",
                query: { id: data?._id }
            })
        }
        setOpenList({
            id: data?._id,
            title: data?.title,
            desc: data?.description,
            listType: data?.listType,
            membersCount
        });
    }

    const successListCreated = () => {
        getList(0, 10, true)
        if (mobileView) close_drawer("createCustomerLists")
        else close_dialog("createCustomerLists")

    }

    const handleCloseMyList = () => {
        goBack()
        close_drawer("manageCustomerLists");
    }

    const handleCheckboxChange = (e, item) => {
        if (item == selectedItemId) setSelectedItemId("");
        else setSelectedItemId(item);
        e.stopPropagation();
        const index = selectedItems.indexOf(item);
        if (index === -1) {
            setSelectedItems([...selectedItems, item]);
        } else {
            const updatedItems = [...selectedItems];
            updatedItems.splice(index, 1);
            setSelectedItems(updatedItems);
        }
    };

    return (
        <>
            {!(openList?.id || openList?.title) ?
                <div className='text-app'>
                    {mobileView ? <div className="pl-2 pl-md-4 pr-4 py-3 d-flex flex-row justify-content-between align-items-center specific_section_bg">
                        <div className='hover_bgClr' style={{ borderRadius: "10px", padding: '6px' }}>
                            <Icon
                                icon={`${Arrow_Left2}#arrowleft2`}
                                hoverColor='var(--l_base)'
                                width={20}
                                height={20}
                                onClick={handleCloseMyList}
                                alt="Back Arrow"
                            />
                        </div>
                        <h4 className="mb-0">
                            My Lists
                        </h4>
                        {selectedItems?.length ? <div className="d-flex align-items-center justify-content-center move_folder_section" onClick={(e) => handledeleteList(e, selectedItems)}>
                            <Icon
                                icon={`${DELETE_FOLDER}#delete_fill`}
                                size={26}
                                unit={mobileView ? "px" : "vw"}
                                viewBox="0 0 52 52"
                                class="mx-1"
                            />
                        </div> :
                            <div className='fntSz35 fntWeight400' style={{ lineHeight: "36px" }}
                                onClick={() => open_drawer("createCustomerLists", { successListCreated: successListCreated }, "bottom")}>
                                <span className='gradient_text'>
                                    +
                                </span>
                            </div>}
                    </div> : <div className=" pb-3 d-flex flex-row justify-content-between align-items-center">
                        <h4 className="mb-0 sectionHeading ">
                            My Lists
                        </h4>
                        <div>
                            <Button
                                type="button"
                                fclassname='gradient_bg rounded-pill'
                                btnSpanClass='text-white'
                                btnSpanStyle={{ lineHeight: '0px', padding: '8px' }}
                                onClick={() => open_dialog("createCustomerLists", { successListCreated: successListCreated })}
                                    children={lang.addBulkMessage}
                            />
                        </div>
                    </div>}
                    <div >
                        <div id="myListDiv" className={`py-3 px-3 px-md-0 pt-md-0 overflow-auto`} style={{ maxHeight: `calc(calc(var(--vhCustom, 1vh) * 100) - ${mobileView ? "4.5rem" : "7.5rem"})` }}>
                            {customerLists?.length ? customerLists?.map((data, index) => {
                                return (
                                    <div key={data?._id} className={` my-3 my-md-2 cursorPtr d-flex align-items-center flex-row justify-content-between ${mobileView ? "borderBtm" : "section_bg radius_12"}`} onMouseEnter={() => setHoverState(data?._id)} onMouseLeave={() => setHoverState("")} style={{ padding: "12px 20px" }}>
                                        <div className='col-11 px-0' onClick={(e) => handleListClick(e, data, countMappingHelper[data?.subTitle] || data?.usersCount || 0)}>
                                            <h6 className='mb-1'>{data?.title}</h6>
                                            <div className='d-flex  px-0 fntSz13 light_app_text'>
                                                <div className='d-flex flex-row flex-nowrap align-items-center pr-2'>
                                                    <Icon
                                                        icon={`${USERS_GROUP}#users_group`}
                                                        hoverColor='var(--l_base)'
                                                        width={14}
                                                        height={14}
                                                        class="mr-1"
                                                        alt="Back Arrow"
                                                    />
                                                    {countMappingHelper[data?.subTitle] || data?.usersCount || 0}
                                                </div>
                                                <div className=''>
                                                    {data?.listType === "CUSTOM" ? "Custom List" : "Default List"}
                                                </div>
                                            </div>
                                        </div>
                                        {!mobileView && data?.listType === "CUSTOM" &&
                                            hoverState === data?._id &&
                                            <div
                                                className="hover_bgClr col-1 p-2 d-flex justify-content-center"
                                                style={{ borderRadius: '10px' }}
                                                onClick={(e) => handledeleteList(e, data?._id)}
                                            >
                                                <Icon
                                                    icon={`${DELETE_FOLDER}#delete_fill`}
                                                    size={20}
                                                    // unit={mobileView ? "px" : "vw"}
                                                    viewBox="0 0 52 52"
                                                    color='var(--l_base)'
                                                />
                                            </div>}
                                        {data?.listType === "CUSTOM" && mobileView && <div className='d-flex align-items-center col-1 px-0'>
                                            <Checkbox checked={selectedItemId === data?._id} onChange={(e) => handleCheckboxChange(e, data?._id)} />
                                        </div>}
                                    </div>
                                )
                            })
                                :
                                <div className="d-flex justify-content-center align-items-center h-100 w-100 placeholder-image">
                                    <Placeholder pageName="manageList" />
                                </div>
                            }
                            {!!loader && <div className='text-center p-3 d-flex justify-content-center'>
                                <CustomDataLoader loading={loader} />
                            </div>}
                            <PaginationIndicator
                                elementRef="myListDiv"
                                id="myListDiv"
                                pageEventHandler={() => {
                                    if (!loader && hasMore) {
                                        getList(pageCount)
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                :
                <div>
                    <MyList openList={openList} isDefaultDataToGet={isDefaultDataToGet} getList={getList} />
                </div>
            }
        </>
    )
}

export default ManageList