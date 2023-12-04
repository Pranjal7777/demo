import React, { useEffect, useState } from "react";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import InputText from "../../components/formControl/inputText";
import { updateEmail, validateEmail } from "../../services/auth";
import {
	close_dialog,
	focus,
	open_dialog,
	startLoader,
	stopLoader,
	Toast,
} from "../../lib/global";
import { getCookie } from "../../lib/session";
import useForm from "../../hooks/useForm";
import { VerifyEmail } from "../../lib/data-modeling";
import { useTheme } from "react-jss";
import Button from "../../components/button/button";
import InputField from "../profile/edit-profile/label-input-field";
import FigureImage from "../../components/image/figure-image";
import { SMILE_FACE } from "../../lib/config";
import isMobile from "../../hooks/isMobile";
import Icon from "../../components/image/icon";
import { CLOSE_ICON_WHITE } from "../../lib/config/logo";

export default function DvEditBio(props) {
	const theme = useTheme();
	const [lang] = useLang();
	const [value, setValue] = useState(props.value || "");
	const [mobileView] = isMobile();

	const handleSubmit = () => {
		props.onChange(value);
		props.onClose();
	};

	const handleEmojiValue = (postEmoji) => {
		setValue(postEmoji);
	}

	return (
		<Wrapper>
			<div>
				<div className="p-4 text-center">
					<div className="text-right">
						<Icon
							icon={`${CLOSE_ICON_WHITE}#close-white`}
							color={"var(--l_app_text)"}
							size={16}
							onClick={() => props.onClose()}
							alt="back_arrow"
							class="cursorPtr"
							viewBox="0 0 16 16"
						/>
					</div>
					<h4 className="mb-4">{lang.changeBio}</h4>
					{mobileView ? <InputField
						// edit
						// key={props.bioValue}
						id="bio"
						// label={`${lang.bio}`}
						name="bio"
						value={value}
						placeholder={props.placeholder}
						error={props.error}
						onChange={setValue}
						onBlur={props.onBlur}
						maxLength="900"
						textarea={true}
						rows={6}
						bioInput={true}
						style={{
							cursor: "pointer",
							backgroundColor: "#f1f2f6",
						}}
					/> : <textarea
						type="text"
						id="bio"
						name="bio"
						value={value}
						placeholder={props.placeholder}
						onChange={(e) => setValue(e.target.value)}
						maxLength="900"
						rows={6}
						className="radius_8 borderStroke w-100 card_bg py-2 px-3 text-app"
					/>}



					{!mobileView &&
						<Icon
							icon={`${SMILE_FACE}#Icon_material-tag-faces`}
							color={`${theme.type === "light" ? theme.palette.l_app_text : theme.palette.l_app_bg}`}
							width={20}
							height={20}
							alt="emoji picker"
							viewBox="0 0 16.472 16.472"
							class="mb-0 pointer emojiIcon mr-2"
							onClick={() =>
								open_dialog(
									"emojiDialog",
									{
										onChange: handleEmojiValue,
										value: value
									},
									"bottom"
								)
							}
						/>}
					<p className="light_app_text text-right">
						{value?.length || "0"} of 900 characters
					</p>
					<Button
						type="submit"
						fclassname="my-3 btnGradient_bg rounded-pill py-2"
						onClick={handleSubmit}
					>
						{lang.save || "Save"}
					</Button>
				</div>
			</div>

			<style jsx>
				{`
					:global(.MuiDialog-paper) {
						max-width: 550px;
						width: 100%;
					}
					:global(.MuiDrawer-paper) {
						color: inherit;
					}

					:global(.emojiIcon){
						position: absolute;
						right: 30px;
						bottom: 140px;
					}
				`}
			</style>
		</Wrapper>
	);
}
