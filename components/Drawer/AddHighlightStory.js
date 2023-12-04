import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import Header from "../header/header";
import * as config from "../../lib/config";
import {
	getAllOwnStoriesApi,
	getAllStoriesToHighlightApi,
} from "../../services/assets";
import {
	getTransformedImageUrl,
	getTransformedUrl,
	open_dialog,
	open_drawer,
	startPageLoader,
	stopPageLoader,
} from "../../lib/global";
import { formatDate } from "../../lib/date-operation/date-operation";
import PaginationIndicator from "../pagination/paginationIndicator";
import PageLoader from "../loader/page-loader";
import Img from "../ui/Img/Img";
import isMobile from "../../hooks/isMobile";
import { NO_POST_PLACEHOLDER_DV } from "../../lib/config";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import { isAgency } from "../../lib/config/creds";
const Button = dynamic(() => import("../button/button"), { ssr: false });

const AddHighlightStory = (props) => {
	const theme = useTheme();
	const { back, onClose } = props;
	const [lang] = useLang();
	// const [profile] = useProfileData()
	const [storiesList, setStoriesList] = useState(null);
	const [clientWidth, setClientWidth] = useState("");
	const [selectedList, setSelectedList] = useState([]);
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(true);
	const [mobileView] = isMobile();

	// const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
	const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
	const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

	useEffect(() => {
		const width = document.getElementById("client").clientWidth;
		width && setClientWidth(parseInt(width / 3));
		getAllStoriesList(0);
	}, []);

	const getAllStoriesList = async (pageCount = 0) => {
		pageCount && startPageLoader();
		const list = {
			limit: pageCount ? 10 : 20,
			offset: pageCount == 1 ? 20 : pageCount * 10,
		};
		if (isAgency()) {
			list["userId"] = selectedCreatorId;
		}
		try {
			const res = await getAllStoriesToHighlightApi(list)
			if (res && res.data && res.data.data) {
				setPage(pageCount == 1 ? 2 : pageCount);
				if (pageCount) {
					setStoriesList((prev) => [...prev, ...res.data.data]);
				} else {
					setStoriesList(res.data.data);
				}
				setTimeout(() => {
					setLoading(false);
				}, 1000);
			}
			stopPageLoader();

		} catch (error) {
			stopPageLoader();
			console.error("error", error);
		}
	};

	const handleBack = () => {
		back && back();
		onClose && onClose("");
	};

	const handleSelectItem = (id) => {
		setSelectedList((prev) => {
			const existingItem = prev.indexOf(id);
			if (existingItem != -1) {
				return prev.filter((item) => item != id);
			} else {
				return [...prev, id];
			}
		});
	};

	const handleClickNext = () => {
		mobileView
			? open_drawer(
				"ADD_HIGHLIGHT_COVER",
				{
					data: storiesList.filter((item) => selectedList.includes(item._id)),
					storyIdList: selectedList || [],
					back: handleBack,
				},
				"right"
			)
			: open_dialog("ADD_HIGHLIGHT_COVER", {
				data: storiesList.filter((item) => selectedList.includes(item._id)),
				storyIdList: selectedList || [],
				back: handleBack,
				closeAll: true,
			});
	};
	return (
		<Wrapper>
			<div
				id="client"
				className={
					mobileView
						? "drawerBgCss w-100 h-100"
						: "w-100 h-100 overflow-hidden"
				}
			>
				{mobileView ? (
					""
				) : (
					<button
						type="button"
						className="close dv_modal_close"
						data-dismiss="modal"
						onClick={() => props.onClose()}
					>
						{lang.btnX}
					</button>
				)}
				{mobileView ? (
					<Header
						title={lang.highlightStories}
						back={() => {
							onClose && onClose("");
						}}
						right={() => {
							<div className="col-2"></div>;
						}}
					></Header>
				) : (
					<div className="col-12">
						<div className="d-flex align-items-center justify-content-center">
							<h5 className="txt-black dv__fnt30 px-1 py-3 m-0">
								{lang.highlightStories}
							</h5>
							{storiesList && (
								<div
									style={{
										width: "8.052vw",
										position: "absolute",
										right: "65px",
									}}
								>
									<Button
										type="button"
										disabled={!selectedList || !selectedList.length}
										onClick={handleClickNext}
										fixedBtnClass={"active"}
									>
										Next
									</Button>
								</div>
							)}
						</div>
					</div>
				)}

				{storiesList ? (
					<div
						id="highlight_story_add"
						className={mobileView ? "col-12" : "col-12 overflow-auto"}
						style={mobileView ? {} : { height: "calc(100% - 100px )" }}
					>
						<div style={mobileView ? { paddingTop: "60px" } : {}}>
							<div
								className={
									mobileView ? "col-12 mt-3 p-0" : "col-10 mt-3 mx-auto p-0"
								}
							>
								<div className="form-row">
									<PaginationIndicator
										id="highlight_story_add"
										totalData={storiesList || []}
										totalCount={500}
										pageEventHandler={() => {
											!loading && getAllStoriesList(page + 1, true);
											setLoading(true);
										}}
									></PaginationIndicator>
									{storiesList &&
										storiesList.length &&
										storiesList.map((item, i) => {
											if ((!item.storyData || !item.storyData.url) && item.storyData.type != 4)
												return <span key={i}></span>;
											const publicId =
												item.storyData.type == 1
													? item.storyData.url
													: item.storyData.thumbnail;
											// console.log("djwidj", publicId);
											return (
												<div
													key={i}
													className={
														mobileView ? "col-4 mb-2 boxshadow position-relative" : "dv__storyCard d-flex align-items-center justify-content-center boxshadow position-relative"
													}
													onClick={() => handleSelectItem(item._id)}
												>
													<label
														className={
															mobileView
																? "checkbox__stories"
																: "dv__checkbox__stories"
														}
													>
														<input
															onClick={() => handleSelectItem(item._id)}
															type="checkbox"
															checked={selectedList.includes(item._id)}
														/>
														<span className="checkmark"></span>
													</label>
													<div className="stories_highlights__dates">
														{formatDate(item.createdTs, "D MMM")}
													</div>
													<div className="inner__highlight__stories d-flex overflow-hidden">
														{item?.storyData?.type == 4 ? <div className={`${mobileView ? "w-100" : "dv__storyCard"} d-flex justify-content-center align-items-center`} style={{ background: item.storyData.bgColorCode, color: item.storyData.colorCode, fontFamily: item.storyData.font }}>{item.storyData.text}</div>
															:
															<Img
																src={s3ImageLinkGen(S3_IMG_LINK, publicId, null, clientWidth)}
																onError={(e) =>
																	(e.target.src = config.BG_SPLASH_SCREEN)
																}
																width="100%"
																alt="story"
															/>}

													</div>
												</div>
											);
										})}
								</div>
								<div id="page_loader" className="text-center">
									<PageLoader></PageLoader>
								</div>
							</div>
							{mobileView ? (
								<div className="set__btm__pos">
									<Button
										type="button"
										fixedBtnClass={"active"}
										disabled={!selectedList || !selectedList.length}
										onClick={handleClickNext}
									>
										Next
									</Button>
								</div>
							) : (
								""
							)}
						</div>
					</div>
				) : (
					<div className="d-flex mt-5 flex-column justify-content-center align-items-center">
						<div
							className="text-center container"
							onClick={() => {
								click && Route.push("/");
							}}
						>
							<Img
								src={NO_POST_PLACEHOLDER_DV}
								alt="No Post Yet! Placeholder Image"
								className="pt-5"
							/>
						</div>
					</div>
				)}
			</div>
			<style jsx>
				{`
					:global(.MuiDrawer-paper) {
						width: 100% !important;
						max-width: 100% !important;
						color: inherit;
					}
					:global(.MuiDrawer-paper > div) {
						width: 100% !important;
						max-width: 100% !important;
					}
					:global(.MuiDialog-paper) {
						min-width: 65.885vw !important;
					}
					:global(.MuiDialogContent-root) {
						overflow-y: hidden !important;
					}
					:global(.set__btm__pos) {
						position: fixed;
						bottom: 0;
						left: 50%;
						z-index: 1;
						width: 100%;
						max-width: 100%;
						transform: translateX(-50%);
						padding: 8px 15px 15px 15px;
						background: ${theme.background};
					}
					:global(.inner__highlight__stories){
						height: 33vh;
            			text-align: center;
					}
					.boxshadow{
					 box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
					}
					.close:hover{
						color:white !important; 
					}
				`}
			</style>
		</Wrapper>
	);
};

{
	/* AddHighlightStory.getInitialProps = async ({ Component, ctx }) => {
		const { query = {}, req, res } = ctx;
		const userId = getCookiees('uid', req);
		let response = {};
		try {
				response = await getAllOwnStoriesApi(userId);
				// console.log('response', response)
		} catch (e) {
			// console.log("token token", e);
		}
  
		return { query: query, profile: response.data && response.data.data || {} };
	}; */
}
export default AddHighlightStory;
