import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import useLang from "../../hooks/language";
import {
	getTransformedImageUrl,
	open_dialog,
	open_drawer,
	startLoader,
	stopLoader,
	Toast,
} from "../../lib/global";
import { addFeaturedStoryApi } from "../../services/assets";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
const Header = dynamic(() => import("../header/header"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
const AddHighlightEditCover = dynamic(() => import("./AddHighlightEditCover"), {
	ssr: false,
});
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import { TEXT_PLACEHOLDER } from "../../lib/config";
import { isAgency } from "../../lib/config/creds";
import InputField from "../../containers/profile/edit-profile/label-input-field";
const Button = dynamic(() => import("../button/button"), { ssr: false });

const AddHighlightCover = (props) => {
	const theme = useTheme();

	const [lang] = useLang();
	const { back, onClose, data, storyIdList = [] } = props;
	const [mobileView] = isMobile();

	const [title, setTitle] = useState("");
	const [coverImg, setCoverImg] = useState("");
	const [currentScreen, setCurrentScreen] = useState();
	const [isCoverImageEdit, setIsCoverImageEdit] = useState(false);

	// const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
	const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
	const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

	const setCustomVhToBody = () => {
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
	};

	React.useEffect(() => {
		setCustomVhToBody();
		window.addEventListener('resize', setCustomVhToBody);

		return () => {
			window.removeEventListener('resize', setCustomVhToBody);
		};
	}, []);

	// Function for changing screen
	const updateScreen = (screen) => {
		setCurrentScreen(screen);
	};

	useEffect(() => {
		var storyData = {};
		if (data && data[0] && data[0].storyData && data[0].storyData.url) {
			storyData = data[0].storyData;
			const imageId = storyData.type == 2 ? storyData.thumbnail : storyData.url;
			setCoverImg(imageId);
		}
		if (data[0]?.storyData?.type == 4) {
			setCoverImg(true);
		}
	}, [data]);

	const handleBack = () => {
		onClose && onClose("");
	};

	const handleClickEdit = () => {
		mobileView
			? open_drawer(
				"ADD_HIGHLIGHT_EDIT_COVER",
				{
					data: data.map((item) => item.storyData),
					defaultCoverImg: coverImg || "",
					getSelectedCoverImageId: (id) => {
						setCoverImg(id);
					},
					isCoverImageEdit: (isCoverEdit = true) => setIsCoverImageEdit(isCoverEdit)
				},
				"right"
			)
			: updateScreen(
				<AddHighlightEditCover
					data={data.map((item) => item.storyData)}
					defaultCoverImg={coverImg || ""}
					getSelectedCoverImageId={(id) => {
						setCoverImg(id);
					}}
					back={() => updateScreen()}
					isCoverImageEdit={(isCoverEdit = true) => setIsCoverImageEdit(isCoverEdit)}
				/>
			);
	};

	const highlightSubmitHandler = () => {
		const payload = {
			storyIds: [...storyIdList],
			// coverImage: coverImg,
			title: title || "HIGHLIGHTS",
		};
		if (isCoverImageEdit && coverImg != true) {
			// this will run when manually edit cover image
			payload["coverImage"] = coverImg;
		}
		if (isAgency()) {
			payload["userId"] = selectedCreatorId;
		}
		startLoader();
		addFeaturedStoryApi(payload)
			.then((res) => {
				stopLoader();
				back && back();
				onClose && onClose("");
				Toast("Featured story added successfully!", "success");
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
	return (
		<Wrapper>
			{!currentScreen ? (
				<Wrapper>
					<div
						id={mobileView ? "client" : ""}
						className={mobileView ? "drawerBgCss w-100 dynamicHeight" : "w-100"}
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
								title={lang.addTitle}
								back={() => {
									onClose && onClose("");
								}}
								right={() => {
									<div className="col-2"></div>;
								}}
							/>
						) : (
							<div className="col-12">
								<div className="d-flex align-items-center justify-content-center">
									<h5 className="txt-black text-center dv__fnt24 px-1 py-3 m-0">
										{lang.addTitle}
									</h5>
								</div>
							</div>
						)}
						<div className="col-12">
							<div style={mobileView ? { paddingTop: "60px" } : {}}>
								<div
									className={
										mobileView ? "col-12 mt-3 p-0" : "col-10 mx-auto mt-3 p-0"
									}
								>
									<div className="text-center mb-3">
										<Img
											// src={getTransformedImageUrl({
											// 	publicId: coverImg,
											// 	width: 345,
											// 	IMAGE_LINK,
											// })}
											src={s3ImageLinkGen(S3_IMG_LINK, coverImg, null, 345)}
											onError={(e) =>
												(e.target.src = TEXT_PLACEHOLDER)

											}
											className="add__title__img"
											alt="cover"
										/>
										<a
											onClick={handleClickEdit}
											className="d-block cursorPtr w-auto p-2"
										>
											{lang.editCover}
										</a>
									</div>

									<div className="position-relative mb-3 text-app">
										<InputField
											type='text'
											id="add_highlight_title"
											inputType='text'
											name='highlight'
											value={title}
											autoComplete="off"
											onChange={(e) => setTitle(e.target.value)}
											className='dv_address_form_control'
											placeholder='Enter the title'
											focus
										/>
										<div className={mobileView ? "set__btm__poss" : "col-10 mx-auto pb-3"}>
											<Button
												type="button"
												fixedBtnClass={"active"}
												onClick={highlightSubmitHandler}
												disabled={!coverImg}
												fclassname={`${mobileView ? "" : "mt-2"
													}`}
											>
												{lang.confirm}
											</Button>
										</div>
									</div>

								</div>
							</div>
						</div>
					</div>
					{/* <div className={mobileView ? "set__btm__poss" : "col-10 mx-auto pb-3"}>
						<Button
							type="button"
							onClick={highlightSubmitHandler}
							disabled={!coverImg}
							fclassname={`btn btn-default ${mobileView ? "" : "dv__blueBgBtn"
								}`}
							cssStyles={theme.blueButton}
						>
							{lang.confirm}
						</Button>
					</div> */}
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
					:global(.MuiBackdrop-root){
            height:${mobileView ? "100vh" : ""};
            background:${mobileView ? "white" : ""};
          }
					input::placeholder {
						color: #d5d5d57a !important;
					}
					:global(.MuiDialog-paper) {
						min-width: 40.263vw !important;
					}
					.set__btm__poss{
						position: absolute;
						top:calc(var(--vhCustom, 1vh) * 50) !important;;
						z-index: 1;
						width: 100%;
						max-width: 100%;
						padding: 8px 15px 15px 15px;
						background: ${theme.background};
					}
					.dynamicHeight {
						height: calc(var(--vhCustom, 1vh) * 100) !important;
					  }
					input::placeholder {
						color: ${theme.type === 'light' ? "#000 !important" : "#fff !important"};
						opacity: 1;
					}
						
					input:-ms-input-placeholder {
						color: ${theme.type === 'light' ? "#000 !important;" : "#fff !important"};
					}
						
					input::-ms-input-placeholder { 
						color: ${theme.type === 'light' ? "#000 !important;" : "#fff !important"};
					}
					input:focus { 
						border-color:  ${theme.type === 'light' ? "#00000052 !important;" : "#ffffff4d !important"};
					}
				`}
			</style>
		</Wrapper>
	);
};
export default AddHighlightCover;
