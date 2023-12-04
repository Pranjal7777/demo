import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '../header/header';
import { Arrow_Left2, backArrow } from '../../lib/config/homepage';
import Icon from '../image/icon';
import isMobile from '../../hooks/isMobile';
import { Toast, goBack } from '../../lib/global';
import Button from '../button/button';
import useLang from '../../hooks/language';
import { deleteMemberInExistingList, getCustomerListDetails } from '../../services/assets';
import { DELETE_FOLDER, USERS_GROUP } from '../../lib/config/vault';
import PaginationIndicator from '../pagination/paginationIndicator';
import CustomDataLoader from '../loader/custom-data-loading';
import Checkbox from '../formControl/checkBox';
import { Avatar, ClickAwayListener, Tooltip } from '@material-ui/core';
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen';
import { useSelector } from 'react-redux';
import { close_dialog, close_drawer, open_dialog, open_drawer, open_progress } from '../../lib/global/loader';
import { getUserBulkMessage } from '../../services/bulkMessage';
import useProfileData from '../../hooks/useProfileData';
import { getFollowFollowing, getFollowing } from '../../services/profile';
import { CLOSE_ICON_WHITE_IMG, EDIT4 } from '../../lib/config';
import Image from '../image/image';
import { FOLLOW_FOLLOWING } from '../../lib/config/header';
import { setCookie } from '../../lib/session';
import { isAgency } from '../../lib/config/creds';
import { handleContextMenu } from '../../lib/helper';
import { debounce } from 'lodash';

const MyList = (props) => {
    const { id, title, desc, member, listType, membersCount } = props.openList;
    const { isDefaultDataToGet } = props
    const router = useRouter();
    const [mobileView] = isMobile();
    const [lang] = useLang();
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const [searchMember, setSearchMember] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [memberList, setMemberList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [description, setDescription] = useState(desc)
    const [listTitle, setTitle] = useState(title)
    const [selectedAll, setSelectedAll] = useState(false)
    const [openToolTip, setOpenToolTip] = useState(false);
    const [parsedDescription, setParsedDescription] = useState("");
    const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
    const profileData = useProfileData()
    const getDefaultData = async (skip = 0, limit = 10, intitalCall = false, searchMember) => {
        let filter
        if (listTitle === "My Followers") filter = "FOLLOWER"
        else if (listTitle === "People I Follow") filter = "FOLLOWING"
        else if (listTitle === "My Subscribers") filter = "SUBSCRIBERS"
        else if (listTitle === "Unsubscribed Users") filter = "UNSUBSCRIBERS"
        setLoader(true)
        try {
            if (filter === "UNSUBSCRIBERS" || filter === "SUBSCRIBERS") {
                const payload = {
                    limit: 10,
                    offset: skip * limit,
                    filter,
                    searchText: searchMember?.toLowerCase()
                };
                if (isAgency()) {
                    payload["creatorId"] = selectedCreatorId;
                }
                const res = await getUserBulkMessage(payload);
                if (res.status === 200) {
                    if (intitalCall) setMemberList(res.data.data)
                    else setMemberList([...memberList, ...res.data.data])
                    setPageCount(pageCount + 1)
                    setHasMore(true);
                } else if (res.status === 204) {
                    setMemberList((prev) => [...prev]);
                    setHasMore(false);
                }
            } else {

                const res = await getFollowFollowing(profileData.userid, skip * limit, limit, searchMember?.toLowerCase(), filter, isAgency() ? selectedCreatorId : "");
                if (res.status === 200) {
                    if (intitalCall) setMemberList(res.data.data)
                    else setMemberList([...memberList, ...res.data.data])
                    setPageCount(pageCount + 1)
                    setHasMore(true);
                } else if (res.status === 204) {
                    setMemberList((prev) => [...prev]);
                    setHasMore(false);
                }
            }
            setLoader(false)
        } catch (err) {
            console.error("ERROR IN getUserData", err);
            setHasMore(false);
            setLoader(false);
        }
    }

    useEffect(() => {
        if (listType === "DEFAULT") {
            defaultSearchResult()
        }
    }, [searchMember, pageCount])

    useEffect(() => {
        setPageCount(0)
        if (listType !== "DEFAULT") {
            searchResult()
        }
    }, [searchMember])

    useEffect(() => {
        showMoreDescText(description, true);
    }, [description])

    const getCustomerList = async (customerId, skip = 0, limit = 10, intitalCall = false, searchMember) => {
        setLoader(true)
        let payload = {
            creatorCustomerListId: customerId,
            skip: skip * 10,
            limit: limit,
            searchText: searchMember?.toLowerCase(),
            listType
        }
        if (isAgency()) {
            payload["userId"] = selectedCreatorId;
        }
        try {
            const res = await getCustomerListDetails(payload);
            if (res.status === 200 && res?.data?.data) {
                setPageCount(pageCount + 1)
                setHasMore(true);
                if (intitalCall) setMemberList([...res?.data?.data?.data])
                else setMemberList([...memberList, ...res?.data?.data?.data])
            } else {
                if (searchMember) {
                    setMemberList([]);
                } else {
                    setMemberList((prev) => [...prev]);
                }
                setHasMore(false);
            }
            setLoader(false);
        } catch (error) {
            console.log(error);
            setHasMore(false);
            setLoader(false);
        }
    }

    const debouncedSearchResult = useCallback(debounce(getCustomerList, 700), []); // Adjust the debounce delay as needed

    const searchResult = () => {
        debouncedSearchResult(id, 0, 10, true, searchMember);
    };

    const debouncedDefaultSearchResult = useCallback(debounce(getDefaultData, 700), []); // Adjust the debounce delay as needed

    const defaultSearchResult = () => {
        if (pageCount === 0) {
            debouncedDefaultSearchResult(pageCount, 10, true, searchMember)
        } else if (pageCount === 1) {
            debouncedDefaultSearchResult(pageCount, 10, false, searchMember)
        }
    };

    const handleListClick = (id, listName) => {
        router.push({
            pathname: "/manage-list/"
        })
    }

    const followersData = async (skip = 0, limit = 10) => {
        setLoader(true)
        try {
            const res = await getFollowing(profileData?._id,
                skip * 10,
                limit,
                searchMember,);
            if (res.status === 200) {
                setPageCount(pageCount + 1)
                setHasMore(true);
                setMemberList([...memberList, ...res?.data?.data])
                setLoader(false);
            } else if (res.status === 204) {
                if (searchMember) {
                    setMemberList([]);
                } else {
                    setMemberList((prev) => [...prev]);
                }
                setHasMore(false);
                setLoader(false);
            }
        } catch (error) {
            console.log(error);
            setHasMore(false);
            setLoader(false);
        }
    }


    const handleCheckboxChange = (item) => {
        const index = selectedItems.indexOf(item);
        if (index === -1) {
            setSelectedItems([...selectedItems, item]);
        } else {
            const updatedItems = [...selectedItems];
            updatedItems.splice(index, 1);
            setSelectedItems(updatedItems);
        }
    };

    const handleSelectAll = (e, value) => {
        if (value) {
            memberList?.forEach((data) => {
                setSelectedItems((prev) => [...prev, data?.userId])
            })
            setSelectedAll(true)
        } else {
            setSelectedItems([]);
            setSelectedAll(false)
        }
    }

    const successMemberAdded = () => {
        setMemberList([])
        setPageCount(0)
        getCustomerList(id, 0, 10, true);
        Toast("Mumber Successfully Added", "success")
        if (mobileView) close_drawer("createCustomerLists")
        else close_dialog("createCustomerLists")
    }
    const handleDeleteMeber = async () => {
        const payload = {
            creatorCustomerListId: id,
            userIds: [...selectedItems]
        }
        if (isAgency()) {
            payload["userId"] = selectedCreatorId
        }
        try {
            const response = await deleteMemberInExistingList(payload)
            getCustomerList(id, 0, 10, true);
            setMemberList([])
            setSelectedItems([])
            setSelectedAll(false)
            setPageCount(0)
            Toast("Member Deleted From List")
            if (mobileView) close_drawer("confirmDeleteMemeber")
            else close_dialog("confirmDeleteMemeber")

        } catch (error) {
            console.log(error)
        }
    }
    const deleteMember = () => {
        mobileView ? open_drawer(
            "confirmDeleteMemeber",
            {
                delete: handleDeleteMeber,
                cancel: () => close_drawer("confirmDeleteMemeber")
            },
            "bottom"
        ) :
            open_dialog(
                "confirmDeleteMemeber",
                {
                    delete: handleDeleteMeber,
                    cancel: () => close_dialog("confirmDeleteMemeber")
                },
            );
    }

    const handleCancel = () => {
        setSelectedItems([])
        setSelectedAll(false)
    }

    const handleOtherProfileRedirection = (item) => {
        if (item.userType === "MODEL" || item.userTypeCode === 2) {
            open_progress();
            (!(profileData._id == (item?.userId || item?.userid || item?._id)) && setCookie("otherProfile", `${item?.username || item?.userName}$$${item?.userId || item?.userid || item?._id}`));
            (profileData._id == (item?.userId || item?.userid || item?._id) ? (router.push('/profile')) : router.push(`${item.username}`));
        }
    }

    const addMemberList = () => {
        return (
            <div id="myListMembers" className="overflow-auto px-3 px-md-5 pt-2 pb-4" style={{ height: `calc(calc(var(--vhCustom, 1vh) * 100) - ${mobileView ? listTitle === "CUSTOM" ? "13.5rem" : "12.4rem" : "15.5rem"} - ${!description?.length ? "0px" : description?.length < (mobileView ? 100 : 100) ? "2em" : "4.6em"})` }}>
                {memberList?.length ? memberList?.map((item, index) => (
                    <div key={index} className="d-flex flex-row justify-content-start align-items-start py-1 my-1 cursorPtr"

                    >
                        <div className="pr-3 callout-none" onContextMenu={handleContextMenu}>
                            {item.profilePic ? <Avatar alt={item.firstName} src={s3ImageLinkGen(S3_IMG_LINK, item?.profilePic)} />
                                :
                                <div className="tagUserProfileImage">{item?.firstName[0] + (item?.lastName && item?.lastName[0])}</div>
                            }
                        </div>
                        <div className="borderBtm d-flex justify-content-between align-items-center w-100 pb-2">
                            <div onClick={() => handleOtherProfileRedirection(item)}>
                                <p className="m-0 bold fntSz14 text-app">{item.username}</p>
                                <p className="m-0 fntSz10  strong_app_text">@{item.username}</p>
                            </div>
                            {listType === "CUSTOM" && <div className=''>
                                <Checkbox checked={selectedItems?.includes(item?.userId)} onChange={() => handleCheckboxChange(item?.userId)} />
                            </div>}
                        </div>
                        <hr className="m-0" />
                    </div>
                ))
                    :
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className='d-flex flex-column align-items-center justify-content-center'>
                            <Image
                                key="empty-placeholder"
                                className="text"
                                src={FOLLOW_FOLLOWING}
                                alt="follow_following_icon"
                            />
                            <h4 className="my-3">{"No Members Yet!"}</h4>
                        </div>
                    </div>
                }
                {loader && <div className='text-center p-3 d-flex justify-content-center'>
                    <CustomDataLoader loading={loader} />
                </div>}
                <PaginationIndicator
                    elementRef="myListMembers"
                    id="myListMembers"
                    pageEventHandler={() => {
                        if (!loader && hasMore) {
                            if (isDefaultDataToGet) getDefaultData(pageCount)
                            else getCustomerList(id, pageCount);
                        }
                    }}
                />
                <style jsx>{`
                    .checkBox_section{
                        position: absolute;
                        z-index: 99;
                        top: 4%;
                        left: 9%;
                    }
                `}</style>
            </div>
        )
    }
    const successMemberEdited = (updatedTitle = "", updatedDescription = "") => {
        Toast("List Edited Successfully")
        if (mobileView) close_drawer("createCustomerLists")
        else close_dialog("createCustomerLists")
        props.getList(0, 10, true)
        setDescription(updatedDescription)
        setTitle(updatedTitle)

    }

    const showMoreDescText = (text, flag) => {
        const count = mobileView ? 100 : 240;
        if (!text || text.length <= count || !flag) {
            setParsedDescription(text);
        } else {
            let nText = [...text].splice(0, count - 10).join("");
            setParsedDescription(nText);
        }
    };


    return (
        <div className='text-app'>
            {mobileView ? <div className="pl-2 pl-md-4 pr-4 py-3 d-flex flex-row justify-content-between align-items-center specific_section_bg">
                <div className='hover_bgClr' onClick={() => goBack()} style={{ borderRadius: "10px", padding: '6px' }}>
                    <Icon
                        icon={`${Arrow_Left2}#arrowleft2`}
                        hoverColor='var(--l_base)'
                        width={20}
                        height={20}
                        alt="Back Arrow"
                    />
                </div>
                <ClickAwayListener onClickAway={() => { setOpenToolTip(false) }} >
                    <Tooltip open={openToolTip} onClick={() => setOpenToolTip(!openToolTip)} placement="bottom" title={listTitle}>
                        <h4 className="mb-0 w-100 text-center text-truncate alignText">
                            {listTitle}
                        </h4>
                    </Tooltip>
                </ClickAwayListener>

                {!isDefaultDataToGet && selectedItems.length ? <div className='d-flex flex-row'>
                    <div className="d-flex align-items-center justify-content-center move_folder_section" onClick={deleteMember}>
                        <Icon
                            icon={`${DELETE_FOLDER}#delete_fill`}
                            size={26}
                            unit={mobileView ? "px" : "vw"}
                            viewBox="0 0 52 52"
                            class="mx-1"
                        />
                    </div>
                </div> :
                    (listType === "CUSTOM" && <div className='d-flex flex-row align-items-center'>
                        <span className='gradient_text fntSz30 mr-1 px-1' style={{ lineHeight: "30px" }}
                            onClick={() => open_drawer("createCustomerLists", {
                                editMember: true,
                                listId: id,
                                successMemberAdded: successMemberAdded
                            }, "bottom")}
                        >
                            +
                        </span>
                        <Icon
                            icon={`${EDIT4}#edit-4`}
                            hoverColor='var(--l_base)'
                            width={18}
                            height={18}
                            class="ml-2 cursorPtr"
                            alt="Back Arrow"
                            onClick={() => open_drawer("createCustomerLists", {
                                editList: true,
                                listId: id,
                                listName: listTitle,
                                desc: description,
                                successMemberEdited: successMemberEdited
                            }, "bottom")}
                        />
                    </div>
                    )
                }
            </div> :
                <div className="pb-3 d-flex flex-row justify-content-between align-items-center">
                    <div className='d-flex flex-row align-items-center'>
                        <Icon
                            icon={`${Arrow_Left2}#arrowleft2`}
                            hoverColor='var(--l_base)'
                            width={20}
                            height={20}
                            onClick={handleListClick}
                            class="cursor-pointer"
                            alt="Back Arrow"
                        />
                        <div className="txt-heavy text-truncate ml-5">
                            <h4 className={`mb-0 text-app`}>
                                {listTitle}
                            </h4>
                        </div>
                    </div>
                    {listType === "CUSTOM" && <div className='d-flex flex-row align-items-center'>
                        <Button
                            type="button"
                            fclassname='gradient_bg rounded-pill'
                            btnSpanClass='text-white'
                            btnSpanStyle={{ lineHeight: '0px', padding: '8px' }}
                            onClick={() => open_dialog("createCustomerLists", {
                                editMember: true,
                                listId: id,
                                successMemberAdded: successMemberAdded
                            })}
                            children={`+ ${lang.add}`}
                        />
                        <Icon
                            icon={`${EDIT4}#edit-4`}
                            hoverColor='var(--l_base)'
                            width={20}
                            height={20}
                            class="ml-3 cursorPtr"
                            alt="Back Arrow"
                            onClick={() => open_dialog("createCustomerLists", {
                                editList: true,
                                listId: id,
                                listName: listTitle,
                                desc: description,
                                successMemberEdited: successMemberEdited
                            })}
                        />
                    </div>
                    }
                </div>
            }
            <div className='borderBtm' style={{ padding: mobileView ? "25px" : "0px 65px 10px" }}>
                <div className=''>
                    {!!description?.length && <p className="mb-0 dv__Grey_var_13 txt-roman  text-break mb-2 descriptionDiv" >
                        {parsedDescription && parsedDescription}
                        {description.length > (mobileView ? 100 : 240) &&
                            (parsedDescription.length > (mobileView ? 100 : 240) ? (
                                <a
                                    onClick={() => showMoreDescText(description, true)}
                                    className="cursorPtr"
                                >
                                    {lang.showLess}
                                </a>
                            ) : (
                                <a
                                    onClick={() => showMoreDescText(description, false)}
                                    className="cursorPtr"
                                >
                                    {lang.showMore}
                                </a>))}</p>} </div>


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
                        {membersCount}
                    </div>

                    <div className=''>
                        {listType === "CUSTOM" ? "Custom List" : "Default List"}
                    </div>
                </div>
            </div>
            <div className='position-relative'>
                {listType === "CUSTOM" && <div className='px-3 px-md-5'>
                    <div className='d-flex justify-content-between align-items-center my-2 strong_app_text'>
                        <div>
                            {lang.select}
                        </div>
                        <div className='d-flex align-items-center'>
                            <div className='pr-2'>Select All</div>
                            <Checkbox checked={selectedAll} onChange={(e, value) => handleSelectAll(e, value)} />
                        </div>
                    </div>
                </div>}
                <div className='position-relative mt-3 px-md-5 mb-2 px-3'>
                    <input
                        type='search'
                        name="search"
                        value={searchMember}
                        placeholder='Search here'
                        onChange={(e) => setSearchMember(e.target.value)}
                        className='form-control background_none borderStroke rounded-pill pl-4 text-app custom-search-input'
                    />
                </div>
                {addMemberList()}
                {!mobileView && !isDefaultDataToGet && selectedItems.length ? < div className='px-5 pt-3 w-100 specific_section_bg d-flex optionsDiv position-absolute'>
                    <Button
                        type="button"
                        cssStyles={{
                            background: "rgba(255, 52, 52, 0.1)",
                            border: '1px solid #FF3434',
                        }}
                        fclassname='rounded-pill my-2'
                        btnSpanClass="text-danger font-weight-500 letterSpacing3"
                        onClick={deleteMember}
                        children={props?.sunbmitBtn || lang?.delete}
                    />
                    {<Button
                        type="button"
                        cssStyles={{
                            background: "none",
                            border: '1px solid var(--l_base)'
                        }}
                        fclassname='rounded-pill my-2'
                        btnSpanClass="gradient_text font-weight-500 letterSpacing3"
                        onClick={handleCancel}
                        children={props?.cancelBtn || lang?.cancel}
                    />}
                </div> : ""}

            </div>
            <style jsx>{`
            .optionsDiv{
                gap:2rem;
                bottom: -10px;
            }
            .descriptionDiv{
           max-height:63px;
           overflow:auto;
           word-break: break-all !important;
            }
            .alignText{
                max-width: calc(100% - 62px - 8px ${listType === "CUSTOM" ? "34px" : "0px"});
            }
            .custom-search-input::-webkit-search-cancel-button {
                -webkit-appearance: none;
                height: 14px;
                width: 14px;
                background-image: url(${CLOSE_ICON_WHITE_IMG});
                background-size: cover;
                cursor: pointer;
              }

            `}
            </style>
        </div>
    )
}

export default MyList