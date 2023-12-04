import React, { useState, useEffect } from "react";
import Header from "../header/header";
import {
	backNavMenu,
	close_drawer,
	sleep,
	Toast,
} from "../../lib/global";
import { getCookie, setCookie } from "../../lib/session";
import useLang from "../../hooks/language";
import { useRouter } from "next/router";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
import { updateProfile } from "../../services/auth";

const SelectoreDrawer = dynamic(
	() => import("../../containers/drawer/selectore-drawer/selectore-drawer"),
	{ ssr: false }
);
const Button = dynamic(() => import("../button/button"), { ssr: false });
import { useTheme } from "react-jss";
import CustomDataLoader from "../loader/custom-data-loading";

export default function ChangeLanguage(props) {
	const theme = useTheme();
	const auth = getCookie("auth");
	const selectedLang = getCookie("language");
	const [selectedLanguage, setLanguageSelected] = useState(
		selectedLang || "en"
	);
	const [lang] = useLang();
	const router = useRouter();
	const [mobileView] = isMobile();
	const [showLoader, setShowLoader] = useState(false)

	const handleChangeLanguage = async () => {
		setShowLoader(true)
		if (auth) {
			const data = {
				defaultLan: selectedLanguage,
			};
			await updateProfile(data);
		} else {
			await sleep(2000);
		}
		setCookie("language", selectedLanguage);
		Toast(lang.langUpdated, "success");
		router.reload();
		setShowLoader(false)
	};

	useEffect(() => {
		if (!mobileView) {
			setShowLoader(true);
			setTimeout(() => {
				setShowLoader(false);
			}, 1000);
		}
		const defLang = props.languages?.find?.((item) => item.isDefaultLan);
		if (defLang) {
			setLanguageSelected(defLang);
		}
		props.homePageref && props.homePageref.current.scrollTo(0, 0);
		// close_drawer();
	}, []);

	return (
		<Wrapper>
			<div className={mobileView ? "drawerBgCss h-100" : "h-100"}>
				{mobileView
					? <Header
						title={lang.language}
						back={() => {
							backNavMenu(props);
						}}
					/>
					: <div className="row m-0 d-flex align-items-center justify-content-between myAccount_sticky__section_header">
						<h5 className="content_heading px-1 m-0 content_heading__dt">{lang.language}</h5>
						<div>
							<button
								type="button"
								disabled={
									!selectedLanguage || selectedLanguage === selectedLang
								}
								className="btn btn-default dv__blueBgBtn"
								onClick={() => handleChangeLanguage()}
							>
								{lang.setLang}
							</button>
						</div>
					</div>
				}
				<div
					className={mobileView ? "col-12 px-0 vh-100" : "col-5 px-0"}
					style={
						mobileView
							? {
								paddingTop: "70px",
							}
							: {}
					}
				>
					{props.languages && props.languages.length ? (
						<SelectoreDrawer
							darkgreyBg={mobileView ? true : false}
							title=""
							labelPlacement="right"
							value={selectedLanguage}
							data={props.languages
								.map((data) => ({
									name: "changeLanguage",
									value: data.languageCode,
									label: data.language,
								}))
								.map((option) => {
									return option;
									``;
								})}
							onSelect={(selectedLanguage) =>
								setLanguageSelected(selectedLanguage)
							}
						/>
					) : (
						""
					)}
				</div>
				{mobileView ? (
					<div className="bottomBtn px-3">
						<Button
							type="button"
							disabled={!selectedLanguage || selectedLanguage === selectedLang}
							cssStyles={theme.blueButton}
							onClick={() => handleChangeLanguage()}
						>
							{lang.confirm}
						</Button>
					</div>
				) : (
					""
				)}
			</div>

			{showLoader || (props?.languages?.length == 0) ? (
				<div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
					<CustomDataLoader type="ClipLoader" loading={true} size={60} />
				</div>
			) : ""}

			<style jsx>
				{`
					:global(.MuiDrawer-paper) {
						color: inherit;
					}
				`}
			</style>
		</Wrapper>
	);
}
