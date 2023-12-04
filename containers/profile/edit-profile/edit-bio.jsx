import React, { useState } from "react";
import EditProfileHeader from "./edit-profile-header";
import useLang from "../../../hooks/language";
import { useTheme } from "react-jss";
import Button from "../../../components/button/button";
import InputField from "./label-input-field";
import Router from "next/router";

export default function EditBio(props) {
	const theme = useTheme();
	const [lang] = useLang();
	const [value, setValue] = useState(props.value || "");

	const handleSubmit = () => {
		props.onChange?.(value);
		props.onClose();
	};

	// console.log("sadasdsadsa", signUpdata, isValid);
	return (
		<div className="wrap">
			<div className="scr wrap-scr bg-dark-custom">
				<div className="col-12">
					<EditProfileHeader back={props.onClose} title={lang.changeBio} />
				</div>
				<div className="col-12 py-4">
					<InputField
						// edit
						// key={props.bioValue}
						id="bio"
						// label={`${lang.bio}`}
						name="bio"
						value={value}
						placeholder={lang.enterBio}
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
					/>
					<p className="fontgreyClr m-0 fntSz13 mt-2 text-right">
						{value?.length || "0"} of 900 characters
					</p>
					<Button
						type="submit"
						cssStyles={theme.blueButton}
						fclassname="my-3"
						onClick={handleSubmit}
					>
						{lang.save || "Save"}
					</Button>
				</div>
			</div>
		</div>
	);
}
