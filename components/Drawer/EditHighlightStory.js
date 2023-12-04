import React, { useEffect, useState } from "react";
import useLang from "../../hooks/language";
import { formatDate } from "../../lib/date-operation/date-operation";
import {
	getTransformedImageUrl,
	open_dialog,
	open_drawer,
	startLoader,
	startPageLoader,
	stopLoader,
	stopPageLoader,
	Toast,
} from "../../lib/global";
import * as config from "../../lib/config";
import {
	getAllStoriesToHighlightApi,
	updateFeaturedStoryApi,
} from "../../services/assets";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
const Header = dynamic(() => import("../header/header"), { ssr: false });
const PaginationIndicator = dynamic(
	() => import("../pagination/paginationIndicator"),
	{ ssr: false }
);
const PageLoader = dynamic(() => import("../loader/page-loader"), {
	ssr: false,
});
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
const AddHighlightEditCover = dynamic(() => import("./AddHighlightEditCover"), {
	ssr: false,
});
const Button = dynamic(() => import("../button/button"), { ssr: false });
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import { isAgency } from "../../lib/config/creds";
import InputField from "../../containers/profile/edit-profile/label-input-field";

const EditHighlightStory = (props) => {
	const theme = useTheme();
	const [lang] = useLang();
	const {
		back,
		onClose,
		data = [],
		coverImage,
		title,
		featCollectionId,
	} = props;
	const [editTitle, setTitle] = useState(title || "");
	const [coverImg, setCoverImg] = useState(coverImage);
	const [editData, setEditData] = useState(data || []);
	const [isCoverImageEdit, setIsCoverImageEdit] = useState(false);
	const [storiesList, setStoriesList] = useState([]);
	const [selectedList, setSelectedList] = useState([]);
	const [clientWidth, setClientWidth] = useState(0);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [mobileView] = isMobile();
	const [activeHighlightTab, setActiveHighlightTab] = useState("Selected")

	const [currentScreen, setCurrentScreen] = useState();

	// const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
	const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
	const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

	// Function for changing screen
	const updateScreen = (screen) => {
		setCurrentScreen(screen);
	};

	useEffect(() => {
		setClientWidth(parseInt(window.innerWidth / 2));
		setSelectedList(editData.map((item) => item._id));
		getAllStoriesList();
	}, []);

	const handleBack = () => {
		onClose && onClose("");
	};

	const getAllStoriesList = (pageCount = 0) => {
		pageCount && startPageLoader();
		const list = {
			limit: 10,
			offset: pageCount * 10,
		};
		if (isAgency()) {
			list["userId"] = selectedCreatorId;
		}
		getAllStoriesToHighlightApi(list)
			.then((res) => {
				if (res && res.data && res.data.data) {
					setPage(pageCount);
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
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleClickEdit = () => {
		const allStories = [...storiesList];
		let selectedItems = allStories.filter((item) =>
			selectedList.includes(item._id)
		);
		mobileView
			? open_drawer(
				"ADD_HIGHLIGHT_EDIT_COVER",
				{
					data: selectedItems.map((item) => item.storyData),
					defaultCoverImg: coverImg || "",
					getSelectedCoverImageId: (id) => {
						setCoverImg(id);
					},
					isCoverImageEdit: (isCoverEdit = true) => setIsCoverImageEdit(isCoverEdit),
					activeSection: () => setActiveHighlightTab("Add")
				},
				"right"
			)
			: updateScreen(
				<AddHighlightEditCover
					data={selectedItems.map((item) => item.storyData)}
					defaultCoverImg={coverImg || ""}
					getSelectedCoverImageId={(id) => {
						setCoverImg(id);
					}}
					back={() => updateScreen()}
					isCoverImageEdit={(isCoverEdit = true) => setIsCoverImageEdit(isCoverEdit)}
					activeSection={() => setActiveHighlightTab("Add")}
				/>
			);
	};

	const highlightEditSubmitHandler = () => {
		const existingList = editData.map((item) => item._id);
		const addStoryIds = selectedList.filter(
			(item) => !existingList.includes(item)
		);
		const removeStoryIds = existingList.filter(
			(item) => !selectedList.includes(item)
		);
		const payload = {
			addStoryIds,
			removeStoryIds,
			title: editTitle || "HIGHLIGHTS",
			featCollectionId,
			// coverImage: coverImg,
		};
		if (isCoverImageEdit && coverImage != true) {
			// this will run when manually edit cover image
			payload["coverImage"] = coverImg;
		}
		startLoader();
		updateFeaturedStoryApi(payload)
			.then((res) => {
				stopLoader();
				back && back();
				onClose && onClose("");
				Toast("Featured story updated successfully!", "success");
			})
			.catch((error) => {
				stopLoader();
				console.error("addFeaturedStoryApi - error - ", error);
				Toast(
					(error &&
						error.response &&
						error.response.data &&
						error.response.data.message) ||
					"Failed to add Featured story!",
					"error"
				);
			});
	};

	const handleSelectDeselectItem = (id) => {
		if (selectedList.includes(id)) {
			setSelectedList((prev) => prev.filter((item) => item != id));
		} else {
			setSelectedList((prev) => [...prev, id]);
		}
	};
	return (
		<Wrapper>
			{!currentScreen ? (
				<Wrapper>
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
					<div
						id={mobileView ? "client" : "dv_client"}
						className={
							mobileView
								? "drawerBgCss w-100 h-100"
								: "w-100 overflow-hidden"
						}
					>
						{mobileView ? (
							<Header
								title={lang.editHighlight}
								back={() => {
									handleBack();
								}}
								right={() => {
									<div className="col-2"></div>;
								}}
							/>
						) : (
							<div className="col-12">
								<div className="d-flex align-items-center justify-content-center">
									<h5 className="text-app dv__fnt24 px-1 pt-3 m-0">
										{lang.editHighlight}
									</h5>
								</div>
							</div>
						)}
						<div
							className={mobileView ? "col-12" : "col-12 overflow-auto p-0"}
							style={mobileView ? {} : { height: "30.014vw" }}
						>
							<div style={mobileView ? { paddingTop: "60px" } : {}}>
								<div
									className={
										mobileView ? "col-12 mt-3 p-0" : "col-10 p-0 mt-3 mx-auto"
									}
								>
									<div className="text-center mb-3">
										<Img
											src={s3ImageLinkGen(S3_IMG_LINK, coverImg, null, 345)}
											onError={(e) =>
												(e.target.src = config.TEXT_PLACEHOLDER)
											}
											className="add__title__img"
											alt="cover"
										/>
										<a
											onClick={handleClickEdit}
											className="d-block w-auto p-2 cursorPtr"
										>
											{lang.editCover}
										</a>
									</div>

									<div className="position-relative mb-3">
										<InputField
											type='text'
											id="add_highlight_title"
											inputType='text'
											name='editHighlight'
											value={editTitle}
											autoComplete="off"
											onChange={(e) => setTitle(e.target.value)}
											className='dv_address_form_control'
											placeholder='Enter the title'
											focus
										/>
									</div>

									<div>
										<ul
											className="nav nav-pills nav-justified mb-3 selected__add__UL"
											role="tablist"
										>
											<li className="nav-item">
												<a
													className="nav-link m-auto active"
													data-toggle="pill"
													href="#selected"
													onClick={() => setActiveHighlightTab("Selected")}
												>
													<span>{lang.selected}</span>
												</a>
											</li>
											<li className="nav-item">
												<a
													className="nav-link m-auto"
													data-toggle="pill"
													href="#Add"
													onClick={() => setActiveHighlightTab("Add")}
												>
													<span>{lang.add}</span>
												</a>
											</li>
										</ul>
										<div className="tab-content">
											<div id="selected" className="col-12 tab-pane active" style={{ height: "35vh", overflowY: "scroll" }}>
												<div className="form-row">
													{editData &&
														editData.length &&
														editData.map((item, i) => {
															if ((!item.storyData || !item.storyData.url) && item.storyData.type != 4)
																return <></>;
															const publicId =
																item.storyData.type == 1
																	? item.storyData.url
																	: item.storyData.thumbnail;
															return (
																<div
																	className={
																		mobileView ? "col-4 mb-2" : "dv__storyCard"
																	}
																	onClick={() =>
																		handleSelectDeselectItem(item._id, i)
																	}
																>
																	<div className="inner__highlight__stories d-flex">
																		<div className="stories_highlights__dates">
																			{formatDate(item.createdTs, 'D MMM')}
																		</div>
																		{item?.storyData?.type == 4 ? <div className={`${mobileView ? "w-100 py-5" : "dv__storyCard"} d-flex justify-content-center align-items-center`} style={{ background: item.storyData.bgColorCode, color: item.storyData.colorCode, fontFamily: item.storyData.font }}>{item.storyData.text}</div>
																			: <Img
																				src={s3ImageLinkGen(S3_IMG_LINK, publicId, null, clientWidth || 120)}
																				onError={(e) =>
																					(e.target.src = config.BG_SPLASH_SCREEN)
																				}
																				width="100%"
																				alt="story"
																			/>}
																		<label
																			className={
																				mobileView
																					? "checkbox__stories"
																					: "dv__checkbox__stories"
																			}
																		>
																			<input
																				type="checkbox"
																				checked={!selectedList.includes(
																					item._id
																				)}
																			/>
																			<span className="checkmark"></span>
																		</label>
																	</div>
																</div>
															);
														})}
												</div>
											</div>
											<div id="Add" className="col-12 tab-pane fade" style={{ height: "35vh", overflowY: "scroll" }}>
												<div className="form-row">
													<PaginationIndicator
														id={mobileView ? "client" : "dv_client"}
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
																return <></>;
															const publicId =
																item.storyData.type == 1
																	? item.storyData.url
																	: item.storyData.thumbnail;
															return (
																<div
																	className={
																		mobileView ? "col-4 mb-2" : "dv__storyCard"
																	}
																	onClick={() =>
																		handleSelectDeselectItem(item._id, i)
																	}
																>
																	<div className="inner__highlight__stories d-flex">
																		<div className="stories_highlights__dates">
																			{formatDate(item.createdTs, "D MMM")}
																		</div>
																		{item?.storyData?.type == 4 ? <div className={`${mobileView ? "w-100" : "dv__storyCard"}  d-flex justify-content-center align-items-center`}
																			style={{ background: item.storyData.bgColorCode, color: item.storyData.colorCode, fontFamily: item.storyData.font, textAlign: "center" }}>{item.storyData.text}</div>
																			: <Img
																				src={s3ImageLinkGen(S3_IMG_LINK, publicId, false, clientWidth || 120)}
																				onError={(e) =>
																					(e.target.src = config.BG_SPLASH_SCREEN)
																				}
																				width="100%"
																				alt="story"
																			/>}
																		<label
																			className={
																				mobileView
																					? "checkbox__stories"
																					: "dv__checkbox__stories"
																			}
																		>
																			<input
																				type="checkbox"
																				checked={selectedList.includes(
																					item._id
																				)}
																			/>
																			<span className="checkmark"></span>
																		</label>
																	</div>
																</div>
															);
														})}
												</div>
												<div id="page_loader" className="text-center">
													<PageLoader />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={mobileView ? "set__btm__pos" : "col-10 mx-auto py-3"}>
						<Button
							type="button"
							onClick={highlightEditSubmitHandler}
							fixedBtnClass={"active"}
						>
							{activeHighlightTab == "Selected" ? lang.remove : lang.done}
						</Button>
					</div>
				</Wrapper>
			) : (
				currentScreen
			)}
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
					input::placeholder {
						color: #d5d5d57a !important;
					}
					:global(.MuiDialog-container) {
						height: 100%;
						outline: 0;
						display: flex;
						justify-content: center;
						padding-top: unset;
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
						height: 15vh !important;
						background:var(--l_app_bg)!important;
					}
				`}
			</style>
		</Wrapper>
	);
};
export default EditHighlightStory;
