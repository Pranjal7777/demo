import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "react-jss";
import Router from "next/router";
import Wrapper from "../../../hoc/Wrapper";
import useLang from "../../../hooks/language";
import isMobile from "../../../hooks/isMobile";
import { open_progress, close_progress, Toast, open_dialog } from "../../../lib/global/loader";
import { authenticate } from "../../../lib/global/routeAuth";
import Img from "../../ui/Img/Img";
import { getPopularHashtagsAPI, getRecentSearchAPI, recentSearchAPI } from "../../../services/hashtag";
import { getSuggetions } from "../../../services/explore";
import Icon from "../../image/icon";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/s3ImageLinkGen"
import isTablet from "../../../hooks/isTablet";
import { commonHeader } from "../../../lib/request";
import { getRecentSearches } from "../../../redux/actions";
import { getCookie, setCookie } from "../../../lib/session";
import OutsideAlerter from "../../../containers/OutsideAlerter";
import InputBox from "../../input-box/input-box";
import { getblockChatUser } from "../../../services/chat";
import { FOLLOW_FOLLOWING, NO_HASHTAG, NO_RECENT_SEARCH, SEACH_WHITE } from "../../../lib/config/header";

const UserTile = dynamic(() => import("../../Drawer/UserTile"));
const CustomDataLoader = dynamic(() => import("../../loader/custom-data-loading"));
const PaginationIndicator = dynamic(() => import("../../pagination/paginationIndicator"));
const Avatar = dynamic(() => import("@material-ui/core/Avatar"));
const Paper = dynamic(() => import("@material-ui/core/Paper"));
const Tab = dynamic(() => import("@material-ui/core/Tab"));
const Tabs = dynamic(() => import("@material-ui/core/Tabs"));

const HashtagSearchDrawer = (props) => {
	const [lang] = useLang();
	const theme = useTheme();
	const userId = getCookie("uid");
	const dispatch = useDispatch();
	const [mobileView] = isMobile();
	const [tabletView] = isTablet();
	const [searchValue, setSearchValue] = useState("");
	const [hashtagList, setHashtagList] = useState([]);
	const [usersList, setUsersList] = useState([]);
	const [apiData, setApiData] = useState(null);
	const [page, setPage] = useState(0);
	const [value, setValue] = useState(0);
	const [count, setCount] = useState(0);
	const [loader, setLoader] = useState(false);
	const [totalCount, setTotalCount] = useState(null);
	const [searchedTag, setSearchedTag] = useState("");
	const [searchResults, setSearchResults] = useState(false);
	const [hashtagName, setHashtagName] = useState('');

	const RECENT_SEARCHES = useSelector((state) => state?.desktopData?.hashtagPage?.recentSearches);
	const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

	useEffect(() => {
		if (searchValue) {
			searchResult();
		}

		// if (searchResults && !RECENT_SEARCHES.length) {
		if (searchResults) {
			getRecentSearch();
		}
	}, [searchValue, searchResults, value]);

	const searchResult = async () => {
		try {
			setLoader(true);

			if (value) {
				// API Call
				if (searchValue.startsWith("#")) {
					setUsersList([])
					setLoader(false);
					return
				}
				const res = await getSuggetions(searchValue, 10, 0);

				// if (res.status == 200) {
				// setPage(pageCount);
				// if (!pageCount) {
				setUsersList(res?.data?.data)
				// } else {
				// setUsersList((prev) => [...prev, ...res.data.data])
				// }
				// }
			} else {
				const payload = {
					limit: 10,
					set: 0,
					searchValue: searchValue.startsWith("#") ? searchValue.slice(1) : searchValue,
				};

				// API Call
				// const res = await getHashtagAPI(payload);
				const res = await getPopularHashtagsAPI(payload);

				// if (res.status == 200) {
				// setPage(pageCount);
				// if (!pageCount) {
				setHashtagList(res.data.result);
				// } else {
				// setHashtagList((prev) => [...prev, ...res.data.data])
				// }
				// }
			}
			setLoader(false);

		} catch (err) {
			console.error("ERROR IN searchResult ", err);
			Toast(err?.response?.data?.message || lang.errorMsg, "error");
			setLoader(false);
		}
	};

	const getRecentSearch = async (pageCount) => {
		try {
			setLoader(true);

			// API Calling (GET)
			const res = await getRecentSearchAPI();
			if (res.status == 200) {
				setApiData(res?.data?.data);
				dispatch(getRecentSearches(res?.data?.data));
			}
			setLoader(false);

		} catch (err) {
			setLoader(false);
			console.error("ERROR IN getRecentSearches", err);
			// Toast(err?.response?.data?.message, "error");
		}
	}

	const postRecentSearch = async (data, typeSearch) => {
		try {
			setLoader(true);

			let payload = {
				platform: Number(commonHeader.platform),
				ipAddress: commonHeader.ipAddress,
				latitude: commonHeader.latitude,
				longitude: commonHeader.longitude,
				city: commonHeader.city,
				country: commonHeader.country
			};

			if (typeSearch === "hashtagSearch") {
				let { name, noOfPost } = data;
				name = name.slice(1);

				payload = {
					...payload,
					searchTag: name,
					type: 2,
					searchId: name
				}
			} else {

				payload = {
					...payload,
					searchTag: data.username,
					type: 1,
					searchId: data._id
				}
			}

			// API Calling (POST)
			const res = await recentSearchAPI(payload);
			setLoader(false);


		} catch (err) {
			setLoader(false);

			console.error("ERROR IN postRecentSearch", err);
			Toast(err?.response?.data?.message, "error");
		}
	}

	// const pageEventHandler = (e) => {
	//   setIsLoading(true);
	//   getPopularHashtag(page + 1);
	// };

	const drawerRedirection = (data) => {
		if (searchValue) postRecentSearch(data, "hashtagSearch");

		const hashtagName = data.name ? data.name.slice(1) : data.searchIn;

		Router.push(`/explore/${hashtagName}`);
		setHashtagName(hashtagName);
	}

	const redirectrecentToProfile = async(data) => {
		open_progress();
		let userid = userId === userId ? data.userId : userId;
		let getBlockUser = await getblockChatUser(userid);
	  let	blockdata = getBlockUser.data.data.blocked;

		if (searchValue) postRecentSearch(data);
		setCookie("otherProfile", `${data?.username?.trim() || data?.userName?.trim()}$$${data?.userId || data?.userid || data?._id}`)
		setSearchValue("");
		if (userId === data._id || userId === data.userId) {
			Router.push("/profile") 
		}
		else {
			!blockdata ? Router.push(`/${data.username || data.userName }`) : open_dialog("successOnly", {
				wraning: true,
				label: "You can't view to this user you're blocked.",
			})
		}
		blockdata &&  close_progress();
	}

	const redirectToProfile = (data) => {
		open_progress();
		if (searchValue) postRecentSearch(data);
		setCookie("otherProfile", `${data?.username?.trim() || data?.userName?.trim()}$$${data?.userId || data?.userid || data?._id}`)
		setSearchValue("");
		if (userId === data._id) {
			Router.push("/profile")
		} else {
			Router.push(`/${data.username || data.userName}`);
		}
	}

	const handleInputClick = () => {
		setSearchResults(true)
	}

	const SearchTile = () => {
		return (
			<>
				<div onClick={() => handleInputClick()}>
					<>
						<InputBox
							type="text"
							name="search"
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							// onFocus={() => Router.push("/search")}
							autoComplete="off"
							fclassname="form-control inputHeight px-3"
							cssStyles={{ ...theme, background: theme?.type === "light" ? "#ffffff" : "#2F1E34", border: '1px solid var(--l_border)' }}
							placeholder="Search"
							style={{ fontSize: `${tabletView ? 'calc(1.098vw + 3px)' : '1.098vw'}` }}
						/>
						<Icon
							icon={`${SEACH_WHITE}#search_icon`}
							color={theme.text}
							size={14}
							class="dv__search__icon"
							viewBox="0 0 511.999 511.999"
						/>
					</>
				</div>
			</>
		)
	};

	const TabPanel = (props) => {
		const { children, value, index } = props;
		return <>{value === index && <div style={{ height: '89%' }}>{children}</div>}</>;
	};

	const HashtagSearch = () => {
		return (
			<ul id="scrollEventHashtag" style={{ height: '100%' }} className="list-unstyled m-0">
				{hashtagList?.map((data, index) => (
					<div
						key={index}
						className="d-flex justify-content-center align-items-center py-1 my-1 cursorPtr dv_link_hover"
						onClick={() => {
							handleCloseSearch(false)
							drawerRedirection(data)
						}}
					>
						<div className="col-2">
							<Avatar className="search__hashtags text-capitalize" style={{ color: '#fff' }}>#</Avatar>
						</div>
						<div className="col-10">
							<p className="m-0 bold fntSz14 text-app">{data.name}</p>
							<p className="m-0 fntSz10 text-app">{`${data.noOfPost} ${data.noOfPost > 1 ? lang.posts : lang.post}`}</p>
						</div>
					</div>
				))}
			</ul>
		);
	};

	const UsersSearch = () => {
		return (
			<ul className="list-unstyled m-0">
				{usersList?.map((data) => (
					<div
						key={data._id}
						className='cursorPtr'
						onClick={() => {
							handleCloseSearch(false)
							redirectToProfile(data)
						}}
					>
						<UserTile
							auth={authenticate}
							uUserId={userId}
							userId={data._id}
							isFollow={data.follow == 1 ? true : false}
							{...data}
							searchBar={true}
						/>
					</div>
				))}
			</ul>
		);
	};

	const TabsFunction = () => {
		return (
			<Tabs
				value={value}
				variant="fullWidth"
				onChange={() => setValue(value ? 0 : 1)}
				style={{
					background: `${mobileView ? theme.background : "white"}`,
				}}
				indicatorColor="primary"
				textColor="primary"
				TabIndicatorProps={{ style: { background: theme.appColor, height: "3px" } }}
			>
				<Tab
					className="text-capitalize font-weight-bold fntSz16 specific_section_bg text-app"
					label="Hashtags"
				/>
				<Tab
					className="text-capitalize font-weight-bold fntSz16 specific_section_bg text-app"
					label="Users"
				/>
			</Tabs>
		);
	};

	const NoDataPlaceholder = () => {
		return (
			<div
				className="d-flex justify-content-center align-items-center"
				style={{ height: "80%" }}
			>
				<div className="text-center">
					{searchValue === ""
						? <Icon
							icon={`${NO_RECENT_SEARCH}#no_recent_search`}
							color={theme.palette.l_base}
							width={150}
							height={150}
							viewBox="0 0 152 152"
						/>
						: value
							? <Img
								key="empty-placeholder"
								className="text"
								src={FOLLOW_FOLLOWING}
							/>
							: <Icon
								icon={`${NO_HASHTAG}#hashtag_svg`}
								color={theme.palette.l_base}
								width={150}
								height={150}
								viewBox="0 0 152 152"
							/>
					}
					<p className="bold mt-3 text-app">
						{searchValue === ""
							? lang.noRecentSearch
							: value
								? lang.noUserFound
								: lang.noHashtagFound}
					</p>
				</div>
			</div>
		);
	};

	const TabsPanelFunction = () => {
		return (
			<>
				<TabPanel value={value} index={0}>
					{hashtagList?.length
						? <HashtagSearch />
						: <NoDataPlaceholder />}
				</TabPanel>
				<TabPanel value={value} index={1}>
					{usersList?.length ? <UsersSearch /> : <NoDataPlaceholder />}
				</TabPanel>
			</>
		);
	};

	const handleCloseSearch = () => {
		setSearchResults(false)
	};

	const RecentSearchUI = () => {
		return (
			<>
				<p className="bold px-4 py-2 dt__el">{lang.recent}</p>
				{apiData?.length
					? <ul className="list-unstyled m-0">
						{apiData?.map((data, index) => (
							data.type == 1
								? <div
									key={index}
									className="d-flex hover_hashtag justify-content-center align-items-center py-1 my-1 cursorPtr dv_link_hover"
									onClick={() => {
										handleCloseSearch(false)
										redirectrecentToProfile(data)
									}}
								>
									<div className="col-1">
										<Avatar
											className='search__hashtags  text-capitalize'
											src={s3ImageLinkGen(S3_IMG_LINK, data.profilePic, 40, 44, 44)}
											// src={data.profilePic}
											alt="profilePic">{data.userName[0]}
										</Avatar>
									</div>
									<div className="col-11">
										<p className="m-0 bold fntSz14 px-4">{data.userName}</p>
										<p className="m-0 fntSz10 px-4">{`${data.postCount} ${data.postCount > 1 ? lang.posts : lang.post}`}</p>
									</div>
								</div>
								: <div
									key={index}
									className={`d-flex hover_hashtag justify-content-center align-items-center py-1 my-1 dv_link_hover ${data.postCount == 0 ? '' : 'cursorPtr'}`}
									onClick={
										data.postCount == 0
											? null
											: () => {
												handleCloseSearch(false)
												drawerRedirection(data)
											}}
								>
									<div className="col-1">
										<Avatar className="search__hashtags text-capitalize">#</Avatar>
									</div>
									<div className="col-11 text-dark">
										<p className="m-0 bold fntSz14 px-4 dv_appTxtClr">{data.searchIn}</p>
										<p className="m-0 fntSz10 px-4 dv_appTxtClr">{`${data.postCount} ${data.postCount > 1 ? lang.posts : lang.post}`}</p>
									</div>
								</div>
						))}
					</ul>
					: !loader && <NoDataPlaceholder />
				}
				{/* {apiData?.map((data, index) => {
          <div key={index}>

          </div>
        })} */}
				{/* <div
          // key={data._id}
          onClick={() => {
            Router.push(`/otherProfile?userId=${data.userId || data._id}&status=1`);
          }}
        >
          <UserTile
            auth={authenticate}
            uUserId={userId}
            userId={data._id}
            isFollow={data.follow == 1 ? true : false}
            {...data}
            searchBar={true}
          />
        </div> */}
			</>
		)
	}

	return (
		<Wrapper>
			<>
				{SearchTile()}
				<OutsideAlerter onClose={handleCloseSearch}>
					<div
						style={{ height: `${props.height ? props.height : '60vh'}`, width: `${props.width ? props.width : ''}`, left: `${props.left ? props.left : ''}`, overflowX: "hidden" }}
						id="scrollEventHashtag"
						className={`dv__search__bar ${searchResults ? "d-block" : "d-none"
							}`}
					>
						{searchValue
							? <>
								<Paper>{TabsFunction()}</Paper>
								{TabsPanelFunction()}
							</>
							: RecentSearchUI()
						}

						{loader && <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
							<CustomDataLoader
								type="ClipLoader"
								loading={loader}
								size={60}
							/>
						</div>}
					</div>

					{searchValue != ''
						? <PaginationIndicator
							id="scrollEventHashtag"
							totalData={hashtagList || []}
							totalCount={totalCount}
							pageEventHandler={() => {
								searchResult(page + 1, true);
								setLoader(true);
							}}
						/>
						: ""
					}
				</OutsideAlerter>
			</>

			<style jsx>{`
				.dv__search__bar{
					position: ${props.exploreHastagePage ? "fixed" : "absolute"};
					left: ${props.exploreHastagePage ? "auto" : "-21px"};
				}
				.MuiAvatar-colorDefault {
						background: ${theme.palette.l_base} !important;
				}
				:global(.MuiAvatar-colorDefault, .hashtags) {
						font-size: x-large;
						background: ${theme.palette.l_base}
				}
				.MuiAvatar-colorDefault {
					font-size: x-large;
					height: 44px !important;
					width: 44px !important;
					font-size: 30px !important;
					background: ${theme == 'light' ? theme.palette.l_app_bg : theme.palette.d_app_bg}
					color: ${theme == 'light' ? theme.palette.d_app_bg : theme.palette.l_app_bg};
				}
				
				:global(.MuiTab-textColorPrimary){
					color: var(--l_app_bg)!important !important;
					background: var(--l_app_bg) !important;
				}
				:global(.MuiTab-textColorPrimary){
					color:var(--l_app_text) !important
				}
				:global(.MuiTab-textColorPrimary.Mui-selected) {
					color: ${theme.appColor} !important;
				}
				@media (min-width: 700px) and (max-width: 991.98px){
					:global(.inputHeight){
						height: 26px;
					}
				}
				
			`}</style>
		</Wrapper>
	);
};

export default HashtagSearchDrawer;
