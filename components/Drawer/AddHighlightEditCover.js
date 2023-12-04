import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { getTransformedImageUrl, open_dialog } from "../../lib/global";
import Wrapper from "../../hoc/Wrapper";
const Header = dynamic(() => import("../header/header"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
import { useTheme } from "react-jss";
import Button from "../button/button";
import { useSelector } from "react-redux";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import { TEXT_PLACEHOLDER } from "../../lib/config";

const AddHighlightEditCover = (props) => {
	const theme = useTheme();
	const [lang] = useLang();
	const { back, onClose, data, defaultCoverImg, getSelectedCoverImageId, isCoverImageEdit, activeSection } =
		props;
	const [coverImg, setCoverImg] = useState(defaultCoverImg || "");
	const [activeCoverIndex, setActoveCoverIndex] = useState(0);
	// console.log("edit cover", data);
	const [mobileView] = isMobile();

	// const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
	const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

	const handleBack = () => {
		onClose && onClose("");
	};

	const handleSelectCover = (imageId, index = 0) => {
		setCoverImg(imageId);
		setActoveCoverIndex(index);
	};

	useEffect(() => {
		return () => { };
	}, []);

	const handleSubmit = () => {
		const activeCoverId =
			data[activeCoverIndex] && data[activeCoverIndex].type == 2
				? data[activeCoverIndex].thumbnail
				: data[activeCoverIndex].url;
		getSelectedCoverImageId(data[activeCoverIndex].type == 4 ? true : coverImg);
		isCoverImageEdit && isCoverImageEdit(data[activeCoverIndex].type == 4 ? false : true);
		activeSection && activeSection();
		if (mobileView) {
			onClose && onClose("");
		} else {
			back && back();
		}
		// console.log("activeCoverId", activeCoverId);
	};

	// console.log("jfedfje", data);
	return (
		<Wrapper>
			<div
				id={mobileView ? "client" : ""}
				className={mobileView ? "drawerBgCss w-100 h-100" : "w-100"}
			>
				{mobileView ? (
					""
				) : (
					<button
						type="button"
						className="close dv_modal_close"
						data-dismiss="modal"
						onClick={() => (mobileView ? props.onClose() : back && back())}
					>
						{lang.btnX}
					</button>
				)}
				{mobileView ? (
					<Header
						title={lang.editCover}
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
							<h5 className="text-app dv__fnt24  px-1 pt-3 m-0">
								{lang.editCover}
							</h5>
						</div>
					</div>
				)}
				<div className="col-12">
					<div style={mobileView ? { paddingTop: "60px" } : {}}>
						<div className="col-12 mt-3 p-0">
							<div className={mobileView ? "text-center mb-3" : "text-center"}>
								<Img
									src={s3ImageLinkGen(S3_IMG_LINK, coverImg, null, 345)}
									onError={(e) =>
										(e.target.src = TEXT_PLACEHOLDER)
									}
									className={
										mobileView ? "edit__cover__img" : "dv__edit__cover__img"
									}
									alt="conver"
								/>
								<div className="d-block w-auto py-3">
									{data &&
										data.length &&
										data.map((item, i) => {
											const imageId =
												item.type == 2 ? item.thumbnail : item.url;
												const imageUrl = s3ImageLinkGen(S3_IMG_LINK, imageId, null, 70);
											return (
												<Img
													src={imageUrl}
													key={i}
													onClick={(e) => handleSelectCover(imageId, i)}
													onError={(e) =>
														(e.target.src = TEXT_PLACEHOLDER)
													}
													className={`select__cover__img m-1 ${imageId == coverImg && "active"
														}`}
													alt="story"
												/>
											);
										})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={mobileView ? "set__btm__pos" : "col-10 mx-auto pb-3"}>
				<Button
					type="button"
					fixedBtnClass={"active"}
					onClick={handleSubmit}
				>
					{lang.save}
				</Button>
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
						min-width: 40.263vw !important;
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
				`}
			</style>
		</Wrapper>
	);
};
export default AddHighlightEditCover;
