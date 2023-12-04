// Main React Components
import React, { useState, useRef } from "react";

// Wrapper component
import Wrapper from "../../hoc/Wrapper";

// Cropping Module
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import moment from "moment";

// Asstes
import * as env from "../../lib/config";

// Language context file
import useLang from "../../hooks/language";
import { close_drawer } from "../../lib/global";
import isMobile from "../../hooks/isMobile";
import Img from "../ui/Img/Img";
import { useTheme } from "theming";

var rotateDegree = 0;
export default function ImageCropper(props) {
	const theme = useTheme();
	const [lang] = useLang();
	const [croppedImg, setCroppedImg] = useState("");
	let cropperRef = useRef();
	const [mobileView] = isMobile();

	//rounded image
	const getRoundedCanvas = (sourceCanvas) => {
		let canvas = document.createElement("canvas");
		let context = canvas.getContext("2d");
		let width = sourceCanvas.width;
		let height = sourceCanvas.height;
		canvas.width = width;
		canvas.height = height;
		context.imageSmoothingEnabled = true;
		context.imageSmoothingQuality = "high";
		context.drawImage(sourceCanvas, 0, 0, width, height);
		context.globalCompositeOperation = "destination-in";
		context.beginPath();
		context.arc(
			width / 2,
			height / 2,
			Math.min(width, height) / 2,
			0,
			2 * Math.PI,
			true
		);
		context.fill();
		return canvas;
	};

	const handleRotate = () => {
		const imageElement = cropperRef?.current;
		const cropper = imageElement?.cropper;
		rotateDegree = rotateDegree >= 360 ? 0 : rotateDegree + 90;
		cropper.rotateTo(rotateDegree);
	};

	const onCrop = () => {
		const imageElement = cropperRef?.current;
		const cropper = imageElement?.cropper;
		const resultCrop = cropper.getCroppedCanvas({
			maxWidth: 4096,
			maxHeight: 4096,
			fillColor: "#fff",
			imageSmoothingEnabled: true,
			imageSmoothingQuality: "high",
		});
		const result = props.cropRoundImg
			? getRoundedCanvas(resultCrop)
			: resultCrop;
		setCroppedImg(result && result.toDataURL("image/jpeg", 1.0));
	};

	const handleSave = async () => {
		let response = await fetch(croppedImg);
		let data = await response.blob();
		let name = moment().valueOf().toString() + "." + "jpg";
		var myFile = new File([data], name);
		let file = [];
		file.push(myFile);
		props.handleUploadMedia && props.handleUploadMedia(file, croppedImg);
		close_drawer("ImageCropper");
	};

	return (
		<Wrapper>
			<div className="row m-0 py-2 d-flex justify-content-between align-items-center cropper_header">
				<div className="col-auto cursorPtr">
					<Img
						onClick={props.onClose}
						src={`${theme == "light" ? env.P_CLOSE_ICONS : env.CLOSE_ICON_WHITE}`}
						alt="close"
						className="closeIcon"
						width={22}
					/>
				</div>
				<div className="col-auto txt-heavy fntSz17">
					<a type="button" className="px-3" onClick={handleRotate}>
						{"Rotate"}
					</a>
					<a type="submit" onClick={handleSave} className="">
						{lang.save}
					</a>
				</div>
			</div>
			<div className="CroppingDiv col-12 ">
				<div className="row m-0 mb-3 d-flex justify-content-center align-items-center">
					<div className="col-12 p-0">
						<Cropper
							style={{
								height: window.innerHeight - 59,
								width: mobileView
									? window.innerWidth - 30
									: window.innerWidth - 100,
							}}
							aspectRatio={props.aspectRatio || NaN}
							guides={false}
							src={props.currentImg}
							ref={cropperRef}
							viewMode={1}
							dragMode="move"
							cropBoxMovable={true}
							crop={onCrop}
							rotatable={true}
							scalable={true}
							checkOrientation={1}
							// onInitialized={(instance) => {
							// 	setCropper(instance);
							// }}
						/>
					</div>
				</div>
			</div>

			<style jsx>
				{`
					.cropper_header {
						background: ${theme.background};
					}
					:global(.MuiDialog-paperWidthSm) {
						max-width: initial !important;
						position: relative !important;
					}
					:global(.MuiDrawer-paper) {
						background-color: black;
					}
					.CroppingDiv {
						// width: 100vw;
						// height: 100vh;
						position: relative;
						display: grid;
						background: ${theme.background};
					}
					.CroppingDiv img {
						display: block;
						width: 100vw;
						height: 100vh;
						object-fit: contain;
					}
					.closeIcon {
						width: 12px;
					}
					:global(.cropper-view-box, .cropper-face) {
						border-radius: ${props.cropRoundImg ? "50%" : "0"};
					}
				`}
			</style>
		</Wrapper>
	);
}
