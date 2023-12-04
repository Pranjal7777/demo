import React, { useEffect, useState } from "react";
import {
	LIGHT_BLUE,
	WHITE,
	INPUT_BORDER,
	PDP_BUTTON_BORDER,
	PROFILE_IMAGE,
	color1,
	color7,
	DIAMOND_COLOR,
} from "../../../lib/config";
import Wrapper from "../chatWrapper/chatWrapper";
import moment from "moment";
import { textdecode } from "../../../lib/chat";
import { LINK_DETECTION_REGEX, validEmailText } from "../../../lib/global";
import Img from "../../ui/Img/Img";
import { useTheme } from "react-jss";

const Text = (props) => {
	const theme = useTheme();

	// useEffect(() => {
	// 	console.log(urlify(textdecode(props.message.payload)), "props.message.payload");
	// })

	const urlify = (text) => {
		// var kLINK_DETECTION_REGEX1 = /(.*)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\@.\]?[\w-]+)*\/?/gm;
		// var kLINK_DETECTION_REGEX = /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#]?[\w-]+)*\/?/gm;
		// return text.replace(kLINK_DETECTION_REGEX1, function(url) {
		//   let urlInstance = url;
		//   if(!url.startsWith('http')){
		//     urlInstance = `http://${url}`
		//   }
		//   return `<a target="_blank" href=${urlInstance}>${url}</a>`
		// })

		return text.replace(LINK_DETECTION_REGEX, function (url) {
			let urlInstance = url;
			if (validEmailText(url)) {
				return `<a class="${props.user ? "" : "text-app"
					}" target="_blank" href="mailto:${url}" rel="noopener noreferrer">${url}</a>`;
			}

			if (!urlInstance.startsWith("http")) {
				urlInstance = `https://${url}`;
			}
			return `<a class="${props.user ? "" : "text-app"
				}" target="_blank" href=${urlInstance} rel="noopener noreferrer">${url}</a>`;
		});
	};

	return (
		<Wrapper
			index={props.index}
			message={props.message}
			profilePic={props.profilePic}
			user={props.user}
		>
			<div className="chat-block">
				<div className="d-flex align-items-start">
					{props.isVipMessage && props.user ? (
						<Img
							src={DIAMOND_COLOR}
							width={12}
							className={`vip_chat_icon self`}
							alt="Vip message icon"
						/>
					) : (
						<></>
					)}
					<div
						className="chat-text"
						dangerouslySetInnerHTML={{
							__html: urlify(textdecode(props.message.payload || "")),
						}}
					>
						{/* {textdecode(props.message.payload || "")} */}
					</div>
					{props.isVipMessage && !props.user ? (
						<Img
							src={DIAMOND_COLOR}
							width={12}
							className={`vip_chat_icon`}
							alt="Vip message icon"
						/>
					) : (
						<></>
					)}
				</div>
			</div>

			<style jsx="true">
				{`
					.chat-time {
						white-space: nowrap;
						font-size: 0.6rem;
						width: fit-content;
						margin-left: auto;
						font-weight: 500;
						margin-top: 5px;
						// color: #dedee1;
					}
					.chat-block {
						width: fit-content;
						max-width: 60%;
					}

					.chat-text {
						background-color: ${props.user
						? theme.palette.l_input_bg
						: theme.palette.l_base};
						color: ${!props.user ? WHITE : theme.palette.l_app_text};
						border-radius: 8px;
						font-weight: 500;
						border-top-left-radius: ${props.user ? "8px" : "0px"};
						border-top-right-radius: ${props.user ? "0px" : "8px"};
						padding: 7px 17px;
						font-size: 0.75rem;
						white-space: pre-wrap;
						word-break: break-word;
					}
				`}
			</style>
		</Wrapper>
	);
};

export default Text;
