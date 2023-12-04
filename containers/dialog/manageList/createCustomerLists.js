import React, { useCallback, useEffect, useRef, useState } from 'react'
import useLang from '../../../hooks/language';
import Button from '../../../components/button/button';
import DVinputText from '../../../components/DVformControl/DVinputText';
import Icon from '../../../components/image/icon';
import { CLOSE_ICON_WHITE_IMG, P_CLOSE_ICONS } from '../../../lib/config';
import isMobile from '../../../hooks/isMobile';
import Script from 'next/script';
import { s3ImageLinkGen } from '../../../lib/UploadAWS/s3ImageLinkGen';
import { useSelector } from 'react-redux';
import { Arrow_Left2 } from '../../../lib/config/homepage';
import Checkbox from '../../../components/formControl/checkBox';
import { getFollowees } from '../../../services/profile';
import useProfileData from '../../../hooks/useProfileData';
import CustomDataLoader from '../../../components/loader/custom-data-loading';
import PaginationIndicator from '../../../components/pagination/paginationIndicator';
import { Avatar, Tooltip } from '@material-ui/core';
import { Toast, close_dialog } from '../../../lib/global/loader';
import { addMemberInExistingList, editListDetails, postCreateCustomerList } from '../../../services/assets';
import { useRouter } from 'next/router';
import { FOLLOW_FOLLOWING } from '../../../lib/config/header';
import Image from '../../../components/image/image';
import CustomTooltip from '../../../components/customTooltip';
import { isAgency } from '../../../lib/config/creds';
import { handleContextMenu } from '../../../lib/helper';
import { debounce } from 'lodash';


const CreateCustomerLists = (props) => {
    const { editMember = false, listId = "", listName = "", desc = "", successMemberAdded = () => { }, successListCreated = () => { } } = props
    const [lang] = useLang();
    const [mobile] = isMobile();
    const router = useRouter();
    const [profileData] = useProfileData();
    const [listNameDetails, setListNameDetail] = useState({
        listName: listName,
        description: desc,
    });
    const [stepper, setStepper] = useState(!editMember ? "listName" : "createList")
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
    const [searchMember, setSearchMember] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [memberList, setMemberList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [openToolTip, setOpenToolTip] = useState(false);

    useEffect(() => {
        setMemberList([]);
        searchResult();
    }, [stepper, searchMember])


    const handleSetListDetails = (e) => {
        let { name, value } = e.target;
        setListNameDetail((prev) => ({ ...prev, [name]: value }));
    }

    const followersData = async (type, skip = 0, limit = 10, searchMember) => {
        setLoader(true)
        try {
            const res = await getFollowees(profileData?._id,
                skip * 10,
                limit,
                searchMember?.toLocaleLowerCase(),
                isAgency() ? selectedCreatorId : "");
            if (res.status === 200) {
                let userList = memberList ? memberList : [];
                if (type === "search") {
                    userList = [];
                }
                setPageCount(pageCount + 1)
                setHasMore(true);
                setMemberList([...userList, ...res?.data?.data])
                setLoader(false);
            } else if (res.status === 204) {
                setMemberList((prev) => [...prev]);
                setHasMore(false);
                setLoader(false);
            }
        } catch (error) {
            console.log(error);
            setHasMore(false);
            setLoader(false);
        }
    }

    const debouncedSearchResult = useCallback(debounce(followersData, 700), []); // Adjust the debounce delay as needed

    const searchResult = () => {
        debouncedSearchResult("search", 0, 10, searchMember);
    };

    const postCreateList = async () => {
        let payload = {
            title: listNameDetails?.listName,
            userIds: selectedItems,
        }
        if (isAgency()) {
            payload["userId"] = selectedCreatorId
        }
        if (listNameDetails?.description) payload["description"] = listNameDetails?.description
        setLoader(true);
        try {
            const res = await postCreateCustomerList(payload);
            if (res.status === 200) {
                successListCreated()
                close_dialog("createCustomerLists");
                props?.updateList?.("createNewList");
            }
            setLoader(false);
            Toast("List Create SuccessFully!")
            if (!props?.updateList) {
            }
        } catch (error) {
            console.log(error);
            setLoader(false);
            Toast(error.message, "error")
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
            }
            )
        } else {
            setSelectedItems([]);
        }
    }

    const handleAddMember = async () => {
        const payload = {
            userIds: [...selectedItems],
            creatorCustomerListId: listId
        }
        if (isAgency()) {
            payload["userId"] = selectedCreatorId
        }
        try {
            const response = await addMemberInExistingList(payload)
            if (response.status === 200) successMemberAdded()
        } catch (error) {
            console.log(error)
        }
    }


    const handleCreateList = () => {
        if (stepper === "listName") {
            if (props.editList) {
                handleEditList()
            } else {
                setStepper("createList")
            }
        } else if (stepper === "createList") {
            if (editMember) handleAddMember()
            else postCreateList()
        }
    }

    const handleEditList = async () => {

        const payload = {
            customerListId: listId,
            title: listNameDetails.listName,
        }
        if (isAgency()) {
            payload["userId"] = selectedCreatorId;
        }
        if (listNameDetails?.description) payload["description"] = listNameDetails?.description
        else delete payload.description
        try {
            const response = await editListDetails(payload)
            props.successMemberEdited(listNameDetails.listName, listNameDetails?.description)
        } catch (error) {
            console.log(error)
        }
    }

    const addMemberList = () => {
        return (
            <div id="memberList" className="overflow-auto px-5 py-2" style={{ height: "calc(calc(var(--vhCustom, 1vh) * 100) - 22.5rem)" }}>
                {memberList?.length ? memberList?.map((item, index) => (
                    <div key={index} onContextMenu={handleContextMenu} className="callout-none d-flex flex-row justify-content-start align-items-start py-1 my-1 cursorPtr"
                    // onClick={() => itemSelectHandler(item)}
                    >
                        <div className="pr-3">
                            {item.profilePic ? <Avatar alt={item.firstName} src={s3ImageLinkGen(S3_IMG_LINK, item?.profilePic)} />
                                :
                                <div className="tagUserProfileImage">{item?.firstName[0] + (item?.lastName && item?.lastName[0])}</div>
                            }
                        </div>
                        <div className="borderBtm d-flex justify-content-between align-items-center w-100 pb-2">
                            <div>
                                <p className="m-0 bold fntSz14 text-app">{item.username}</p>
                                <p className="m-0 fntSz10  strong_app_text">@{item.username}</p>
                            </div>
                            <div className=''>
                                <Checkbox checked={selectedItems?.includes(item?.userId)} onChange={() => handleCheckboxChange(item?.userId)} />
                            </div>
                        </div>
                        <hr className="m-0" />
                    </div>
                )) :
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className='d-flex flex-column align-items-center justify-content-center'>
                            <Image
                                key="empty-placeholder"
                                className="text"
                                src={FOLLOW_FOLLOWING}
                                alt="follow_following_icon"
                            />
                            <h4 className="my-3">{"No Followers"}</h4>
                        </div>
                    </div>
                }
                <div className='text-center p-3 d-flex justify-content-center'>
                    <CustomDataLoader loading={loader} />
                </div>
                <PaginationIndicator
                    elementRef="memberList"
                    id="memberList"
                    pageEventHandler={() => {
                        if (!loader && hasMore) {
                            followersData("", pageCount);
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

    return (
        <>
            <Script
                defer={true}
                src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js"
            />
            <div className='text-app'>
                <div className=" pt-2">
                    <div>
                        <div className='hover_bgClr position-absolute' onClick={() => setStepper("listName")} style={{ borderRadius: "10px", padding: '6px', top: mobile ? '10px' : "12px", left: "8px" }}>
                            {stepper === "createList" &&
                                <Icon
                                    icon={`${Arrow_Left2}#arrowleft2`}
                                    hoverColor='var(--l_base)'
                                    width={16}
                                    height={16}
                                    class="arrowLeft"
                                    alt="Left Arrow"
                                />}
                        </div>
                        <h4 className="text-app">{props.titleName}</h4>
                        <div className='hover_bgClr position-absolute' onClick={props.onClose} style={{ borderRadius: "10px", padding: '6px', top: mobile ? '10px' : "12px", right: mobile ? "18px" : "8px" }}>
                            <Icon
                                icon={`${P_CLOSE_ICONS}#cross_btn`}
                                hoverColor='var(--l_base)'
                                color={'var(--l_app_text)'}
                                width={20}
                                height={20}
                                alt="Back Arrow"
                            />
                        </div>
                    </div>
                    <div className='text-center'>
                        <h4 className='mb-0'>
                            {stepper === "createList" ? lang.addMembers : props.editList ? lang.editList : lang.createList}
                        </h4>
                    </div>
                    {(stepper === "createList" || props.editMember) ?
                        <div>
                            <div className='borderBtm px-3 px-md-5'>
                                {/* <div className='d-flex flex-row py-3 overflow-auto scroll-hide' style={{ width: "25rem" }}>
                                    {memberList?.map((item, index) => {
                                        return (
                                            <div className="mx-1 cursorPtr">
                                                {item.profilePic ? <Avatar alt={item.firstName} src={s3ImageLinkGen(S3_IMG_LINK, item?.profilePic)} />
                                                    :
                                                    <div className="tagUserProfileImage">{item?.firstName[0] + (item?.lastName && item?.lastName[0])}</div>
                                                }
                                            </div>
                                        )
                                    })}
                                </div> */}
                                <div className='position-relative mt-3'>
                                    <input
                                        type='search'
                                        name="search"
                                        value={searchMember}
                                        placeholder='Search here'
                                        onChange={(e) => setSearchMember(e.target.value)}
                                        className='form-control background_none borderStroke rounded-pill pl-4 text-app custom-search-input'
                                    />
                                </div>
                                <div className='d-flex justify-content-between align-items-center my-2 strong_app_text'>
                                    <div className='d-flex flex-row'>
                                        Select Members

                                        <CustomTooltip
                                            tooltipTitle={lang.AddListDublicateUser}
                                            placement="bottom"
                                        />
                                    </div>

                                    <div className='d-flex align-items-center' style={{ paddingRight: mobile ? "32px" : "5px" }}>
                                        <div className='pt-2 pr-2'>Select All</div>
                                        <Checkbox checked={false} onChange={(e, value) => handleSelectAll(e, value)} />
                                    </div>
                                </div>
                            </div>
                            {addMemberList()}
                        </div>
                        : <div className="pt-3 mb-0 px-3 px-md-5" style={{ color: 'var(--l_light_app_text)', height: "calc(var(--vhCustom, 1vh) * 60)", width: mobile ? "" : "30rem" }}>
                            <div className='w-100'>
                                <DVinputText
                                    labelTitle="Enter list name"
                                    className="dark_input_section background_none borderStroke radius_12 text-app"
                                    style={{ padding: '21.5px' }}
                                    id="listName"
                                    name="listName"
                                    value={listNameDetails.listName}
                                    autoComplete='off'
                                    placeholder={"Enter here"}
                                    onChange={handleSetListDetails}
                                    type="text"
                                />
                            </div>
                            <div className='d-flex flex-column'>
                                <label>Enter Description</label>
                                <textarea
                                    className="dark_input_section background_none borderStroke radius_12 text-app px-3 py-2"
                                    style={{ height: "6rem" }}
                                    id="description"
                                    name="description"
                                    value={listNameDetails.description}
                                    autoComplete='off'
                                    placeholder={"Enter here"}
                                    onChange={handleSetListDetails}
                                    type="text"
                                />
                            </div>
                        </div>}
                </div>
                <div className='px-3 px-md-5 py-1 specific_section_bg'>
                    <Button
                        type="button"
                        fclassname='rounded-pill my-2 gradient_bg'
                        btnSpanClass=" font-weight-500 letterSpacing3"
                        onClick={handleCreateList}
                        disabled={stepper === "createList" ? !(selectedItems?.length) : editMember ? !(selectedItems.length && editMember) : !(listNameDetails?.listName?.length)}
                        children={stepper === "createList" ? editMember ? "Add Member" : "Create List" : lang.continue}
                    />
                </div>
            </div>
            <style jsx>{`
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
        </>
    )
}

export default CreateCustomerLists;