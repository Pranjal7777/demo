import React, { useEffect, useState } from "react";
import { useTheme } from "react-jss";
import Image from "../../components/image/image";
import useLang from "../../hooks/language";
import { open_drawer, close_drawer, open_dialog } from '../../lib/global';
import {
	CLOUDINARY_BASE_URL,
	CANCELCLR,
	crmCloseIcon,
} from "../../lib/config";
import { generaeVideThumb } from "../../lib/image-video-operation";
const fileEmptyObject = {
	files: null,
	filesObject: null,
};
import isMobile from "../../hooks/isMobile";
import VideocamIcon from '@material-ui/icons/Videocam';
import Icon from "../../components/image/icon";

const VideoContainer = (props) => {
	const [lang] = useLang();
	const theme = useTheme();
	const {
		file,
		changeThumbanail,
		width,
		height,
		isCrmpage = false,
		classStyle = "",
		crmKeyname = "",
		...otherProps
	} = props;
	const [video, setVideo] = useState(
		props.defaultImage || [
			{
				seqId: 1,
				...fileEmptyObject,
			},
		]
	);
	const [mobileView] = isMobile();

	useEffect(() => {
		setVideo(props.defaultImage);
	}, [video, props]);

	return (
		<div style={props.style} className={mobileView ? "" : `${isCrmpage ? "py-2" : "pt-3"}`}>
			{mobileView ? (
				(props.defaultImage[0].length === 0)
					? ""
					: <div
						style={{
							postition: 'relative'
						}}
						className={`position-relative ${isCrmpage ? "" : "pt-3"}`}
						onClick={(e) => {
							e && e.stopPropagation();
							open_drawer(
								"VDO_DRAWER",
								{ props },
								"right"
							);
						}}>
						{!isCrmpage && <VideocamIcon style={{
							border: '1.5px dotted var(--l_base)',
							padding: '17px',
							width: `${isCrmpage ? "auto" : width}`,
							height: `${height}`,
							background: '#f4f1f1',
							borderRadius: "10px",
						}} />}
						<Image
							src={
								props.defaultImage[0] &&
									props.defaultImage[0].thumbnail
									? CLOUDINARY_BASE_URL +
									props.defaultImage[0].thumbnail
									: props.defaultImage[0] &&
									props.defaultImage[0].files || ""
							}
							style={{
								width: width,
								height: `${height}`,
								top: isCrmpage ? '0' : '16px',
								background: '#f4f1f1',
								border: isCrmpage ? "none" : `2px solid ${theme?.appColor}`
							}}
							width="100%"
							className={`${isCrmpage ? "file-video-crm" : "file-video"}`}
							alt=""
						/>
						{isCrmpage ?
							<Icon
								icon={`${crmCloseIcon}#crmCloseIcon`}
								size={35}
								style={{
									bottom: mobileView ? "-11px" : "-4px",
									zIndex: "1",
									left: "60px !important"
								}}
								class="position-absolute cancelBtnVideo cursorPtr"
								viewBox="0 0 32 32"
								onClick={(e) => props?.remove(e)}
							/> :
							<Image
								onClick={(e) => {
									props.remove(e);
								}}
								src={CANCELCLR}
								width="18"
								style={{
									top: isCrmpage ? '1px' : '10px',
									right: '0'
								}}
								className="mv_upload_img_close_icon position-absolute right-0"
								alt=""
							/>}


						{!isCrmpage && <div
							className={`${isCrmpage ? classStyle : "cover-pill-shouotut-mobile"} cursorPtr`}
							onClick={(e) => {
								e && e.stopPropagation();
								open_drawer("thumbSelectore", {
									...file,
									onThumSelect: changeThumbanail,
									crmKeyname: crmKeyname
								}, "bottom");
							}}>
							{lang.cover}
						</div>}
						<div className="text-center h-100 w-100 ">
							<input
								type="file"
								id={"video"}
								accept="video/*"
								onChange={props.onChange}
								style={{ display: "none" }}
							/>
						</div>
					</div>
			) : (
				<>
					<div className={`${props.isShoutOut ? "shoutoutVideo" : isCrmpage ? "crmAutomationVideo" : "dv_media_container"} position-relative p-0`}
						onClick={(e) => {
							e && e.stopPropagation();
							open_dialog(
								"VDO_DRAWER",
								{ props },
							);
						}}
					>
						<Image
							src={
								props.defaultImage[0] &&
									props.defaultImage[0].thumbnail
									? CLOUDINARY_BASE_URL +
									props.defaultImage[0].thumbnail
									: props.defaultImage[0] &&
									props.defaultImage[0].files || ""
							}
							className={`w-100 h-100 px-0 ${props.className}`}
							style={{ border: `2px solid ${theme.appColor}` }}
							alt="background-placeholder"
						/>
						<div>
							{isCrmpage ?
								<Icon
									icon={`${crmCloseIcon}#crmCloseIcon`}
									size={35}
									style={{
										bottom: mobileView ? "-11px" : "-14px",
										zIndex: "1",
										left: "60px !important"
									}}
									class="position-absolute cancelBtnVideo cursorPtr"
									viewBox="0 0 32 32"
									onClick={(e) => props?.remove(e)}
								/> : <Image
									onClick={(e) => {
										props.remove(e);
									}}
									src={CANCELCLR}
									width="18"
									className="mv_upload_remove_icon"
									alt=""
								/>}
						</div>

						{!isCrmpage && <div
							className="cover-pill-shouotut cursorPtr"
							onClick={(e) => {
								e && e.stopPropagation();
								open_dialog("thumbSelectore", {
									...file,
									onThumSelect: changeThumbanail,
									crmKeyname: crmKeyname
								});
							}}>
							{lang.cover}
						</div>}
					</div>

					<div className="text-center h-100 w-100">
						<input
							type="file"
							id={"video"}
							accept="video/*"
							onChange={props.onChange}
							style={{ display: "none" }}
						/>
					</div>
				</>
			)
			}
			<style jsx>{`
				:global(.mv_upload_remove_icon) {
					position: absolute;
					z-index: 1;
					cursor: pointer;
					top: -6px;
					right: -7px;
					width: 16px;
					background: #fff;
					border-radius: 50%;
				}
				:global(.cancelBtnVideo) {
					left: ${mobileView ? "60" : "69"}px !important;
				}
			`}</style>
		</div>
	);
};

export default VideoContainer;
