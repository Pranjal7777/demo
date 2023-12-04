import React, { useCallback, useEffect, useState } from "react";
import useLang from "../../../hooks/language";
import { useTheme } from "react-jss";
import dynamic from "next/dynamic";
import Wrapper from "../../../hoc/Wrapper";
import Icon from "../../../components/image/icon";
import BulkMessageHeader from '../../header/bulkMessage';
import isMobile from "../../../hooks/isMobile";
import SearchBar from "../../../containers/timeline/search-bar";
import { close_dialog, goBack, open_dialog } from "../../../lib/global";
import Checkbox from "../../formControl/checkBox";
import { Arrow_Left2 } from "../../../lib/config/homepage";
import { CLOSE_ICON_WHITE } from "../../../lib/config/logo";
import { USERS_GROUP } from "../../../lib/config/vault";
import { getListDetails } from "../../../services/assets";
import { isAgency } from "../../../lib/config/creds";
import { useSelector } from "react-redux";
import { close_drawer } from "../../../lib/global/loader";
import { uppercaseToCamelCase } from "../../../redux/actions/chat/helper";
import PaginationIndicator from "../../pagination/paginationIndicator";
import Placeholder from "../../../containers/profile/placeholder";
import CustomDataLoader from "../../loader/custom-data-loading";
import debounce from 'lodash/debounce';


const Button = dynamic(() => import("../../button/button"), { ssr: false });

const SelectList = ({ handleSelectedList, selectedLists, ...props }) => {
    const [lang] = useLang();
    const [mobileView] = isMobile()
    const theme = useTheme();
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [updateListApi, setUpdateListApi] = useState(false);
    const [customerList, setCustomerLists] = useState([]);
    const selectedCreatorId = useSelector((state) => state?.selectedCreator.creatorId);
    const { mySubscriber, myExpiredSubscriber, totalFollower, totalFollowing } = useSelector((state) => state.profileData)

    const countMappingHelper = {
        MY_FOLLOWERS: totalFollower,
        FOLLOWINGS: totalFollowing,
        MY_SUBSCRIBERS: mySubscriber,
        UNSUBSCRIBERS: myExpiredSubscriber,
    };
    const back = () => {
        mobileView ? close_drawer("bulkMessage") : close_dialog("bulkMessage");
    }

    const getListButtons = (data) => {
        return (
            <>
                <label
                    className="bulkMessageBtn py-1 d-block cursorPtr"
                    htmlFor={data._id || data.subTitle}
                >
                    <div className="row mx-0 flex-row align-items-center justify-content-between">
                        <div className="col-11 px-0 d-flex flex-column"
                        // onClick={() => props?.setActiveList("myListMembers")}
                        >
                            <p className='mb-0'>{data.title}</p>
                            <div className='d-flex  px-0 fntSz13 light_app_text'>
                                <div className='d-flex flex-row flex-nowrap align-items-center pr-3'>
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
                                <div>
                                    {uppercaseToCamelCase(data?.listType)}
                                    {/* {data?.listType} */}
                                </div>
                            </div>
                        </div>
                        <div className="col-1 px-0 d-flex flex-row align-items-center">
                            <div className="pr-2 mb-2">
                                <Checkbox id={data._id || data.subTitle} onChange={(e) => handleSelectedList(e, data)} checked={!!selectedLists.find(list => data?._id ? list._id === data._id : list.subTitle === data.subTitle)} myList={true} />
                            </div>
                        </div>
                    </div>
                </label>
            </>
        );
    };

    useEffect(() => {
        setCustomerLists([]);
        if (searchText) {
            setLoading(true);
            setPageCount(0);
        }
        searchResult()
    }, [updateListApi, searchText]);

    const getList = async (skip = 0, limit = 10, searchText = "") => {
        setLoading(true);
        let payload = {
            skip: skip * 10,
            limit: limit,
            searchText: searchText.toLocaleLowerCase() || "",
        }
        if (isAgency()) {
            payload["creatorId"] = selectedCreatorId;
        }
        try {
            const res = await getListDetails(payload);
            setLoading(false)
            if (res.status === 200 && res?.data?.data?.length) {
                setPageCount(pageCount + 1)
                setHasMore(true);
                if (!pageCount) {
                    setCustomerLists(res?.data?.data)
                } else {
                    setCustomerLists((prev) => ([...prev, ...res?.data?.data]))
                }
            } else {
                if (searchText && !pageCount) {
                    setCustomerLists([]);
                }
                setHasMore(false);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setHasMore(false);
        }
    }

    // Create a debounced version of searchResult with a 500ms delay
    const debouncedSearchResult = useCallback(debounce(getList, 700), []); // Adjust the debounce delay as needed

    const searchResult = () => {
        debouncedSearchResult(0, 10, searchText);
    };

    const ContinueBtn = () => {
        return (
            <Button
                type="submit"
                fclassname='gradient_bg rounded-pill'
                onClick={() => props?.setActiveList("CreateBulkMsg")}
                disabled={!selectedLists.length}
            >
                {lang.continue}
            </Button>
        )
    }

    const updateList = (data) => {
        if (data) {
            setUpdateListApi(!updateListApi);
            // props?.setActiveList(data)
        }
    }

    return (
        <Wrapper>
            <div className="myListsDialog w-100 specific_section_bg" style={{ maxHeight: "85vh" }}>
                <div className="px-4 borderBtm position-relative">
                    <div className="close_icon">
                        <Icon
                            icon={CLOSE_ICON_WHITE + "#close-white"}
                            onClick={back}
                            width={20}
                            color={'var(--l_app_text)'}
                            class="pointer float-left ml-1"
                            alt="close_icon"
                        />
                    </div>
                    <div className="position-relative py-4">
                        <h4 className={`text-center m-0 dv_appTxtClr ${mobileView ? 'dTitleMobile' : 'dTitle'}`}>{lang.myLists}</h4>
                    </div>
                    <div className=''>
                        <SearchBar
                            value={searchText}
                            handleSearch={(e) => setSearchText(e.target.value)}
                            placeholder={lang.searchList}
                            fclassname={"background_none borderStroke"}
                            crossIcon={searchText && true}
                            onClick={() => setSearchText("")}
                            onlySearch={true}
                        />
                    </div>
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="light_app_text my-2">
                            Choose List
                        </div>
                        <div className="gradient_text w-500 cursorPtr"
                            style={{ top: "5px", right: "5px" }}
                            onClick={() => open_dialog("createCustomerLists", {
                                updateList: (value) => updateList(value)
                            })}>+ Create</div>
                    </div>
                </div>
                <div id="customList" className='d-flex flex-column px-4 py-3 overflowY-auto' style={{ height: mobileView ? "calc(calc(var(--vhCustom, 1vh) * 85) - 15rem)" : "calc(calc(var(--vhCustom, 1vh) * 100) - 23.5rem)" }}>
                    {customerList.length ? customerList.map((data, index) => {
                        return <div className="cursorPtr p-1 borderBtm" key={index}>{getListButtons(data)}
                        </div>
                    }) : !loading ? <div className="w-100 placeholder-image h-100 d-flex align-items-center justify-content-center">
                        <Placeholder pageName="manageList" label="List not found" />
                    </div> : ""}
                </div>
                {loading ? <div className="d-flex justify-content-center align-items-center">
                    <CustomDataLoader type="normal" isLoading={loading} />
                </div> : ""}
                <PaginationIndicator
                    id="customList"
                    totalData={customerList || []}
                    pageEventHandler={() => {
                        if (!loading && hasMore) {
                            getList(pageCount);
                        }
                    }}
                />
                <div className='col-11 mx-auto p-2'>
                    {ContinueBtn()}
                </div>
                <style jsx>
                    {
                        `
                        .myListsDialog .close_icon{
                            right: 10px;
                            top: 0;
                        }
                        `
                    }
                </style>
            </div>
        </Wrapper>
    );
}

export default SelectList;
