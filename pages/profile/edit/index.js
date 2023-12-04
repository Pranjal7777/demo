import React, { useState, useEffect, useRef } from "react";
import Route from "next/router";
import Head from 'next/head';
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";

import useProfileData from "../../../hooks/useProfileData";
import useLang from "../../../hooks/language";
import * as config from "../../../lib/config";
import {
	open_drawer,
} from "../../../lib/global";
import { phoneNumber, updateProfile } from "../../../services/auth";
import {
	startLoader,
	stopLoader,
	Toast,
} from "../../../lib/global";
import { updateReduxProfile } from "../../../redux/actions/index";
// import ImagePicker from "../../../components/formControl/imagePicker";
import EditProfileHeader from "../../../containers/profile/edit-profile/edit-profile-header";
import EditProfileCoverImageHeader from "../../../containers/profile/edit-profile/edit-profile-CoverImage-header";
import InputField from "../../../containers/profile/edit-profile/label-input-field";
// import DatePicker from "../../../components/formControl/datePicker";
// import { inValidDate } from "../../../lib/validation/validation";
import {
	getCurrentAge,
	formatDateOrder,
} from "../../../lib/date-operation/date-operation";
import EditPhoneNumber from "../../../containers/profile/edit-profile/edit-phone-number";
import EditEmailId from "../../../containers/profile/edit-profile/edit-email";
import ChangePassword from "../../../containers/profile/edit-profile/change-password";
import PhoneNoInput from "../../../components/formControl/phoneNoInput";
// import { OfflinePin } from "@material-ui/icons";
import { getCookie, setCookie } from "../../../lib/session";
import FigureCloudinayImage from "../../../components/cloudinayImage/cloudinaryImage";
import useForm from "../../../hooks/useForm";
import isMobile from "../../../hooks/isMobile";
import Wrapper from "../../../hoc/Wrapper";
import DvMyAccountLayout from "../../../containers/DvMyAccountLayout/DvMyAccountLayout";
// import EditBio from "../../../containers/profile/edit-profile/edit-bio";
import { palette } from "../../../lib/palette";
import fileUploaderAWS from "../../../lib/UploadAWS/uploadAWS";
import { getCognitoToken } from "../../../services/userCognitoAWS";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { TIMEZONE_LIST, TIME_ZONE_KEY_LABEL } from "../../../lib/timezones";
import Switch from "../../../components/formControl/switch";
import { getProfile } from "../../../services/profile";
import { isAgency } from "../../../lib/config/creds";
import { ValidatePhoneNoPayload } from "../../../lib/data-modeling";
import { handleContextMenu } from "../../../lib/helper";
import RouterContext from "../../../context/RouterContext";

function EditProfile(props) {
	const [Register, value, error, isValid] = useForm({ emptyAllow: true });
	const { query } = props;
	const { type = "edit" } = query;
	const { tab = "profile" } = query;
	const [lang] = useLang();
	const [profile] = useProfileData();
	const [mobileView] = isMobile();
	const homePageref = useRef(null);

	const dispatch = useDispatch();

	const [socialLinks, setSocialLinks] = useState(profile?.socialMediaLink);
	const [reduxSocialLinks, setReduxSocialLinks] = useState(profile?.socialMediaLink);
	const [activeNavigationTab, setActiveNavigationTab] = useState(tab);
	const [gender, selectGender] = useState({});
	const [bioLen, setBioLen] = useState(profile.bio && profile.bio.length);
	const [bioValue, setBio] = useState(profile && profile.bio);
	const [shoutoutPrice, setShoutoutPrice] = useState(profile?.shoutoutPrice?.price);
	const [currency, setCurrency] = useState(profile?.shoutoutPrice?.currencyCode || "dollar")
	const [isNSFWAllow, setIsNSFWAllow] = useState(profile?.isNSFWAllow);
	const [timeZone, setTimeZone] = useState(TIME_ZONE_KEY_LABEL[profile.timezone?.toLowerCase() || config.defaultTimeZone().toLowerCase()]);
	const [activeState, setActiveState] = useState(type);
	const [isEnable, setIsEnable] = useState(profile?.shoutoutPrice?.isEnable || false);
	const [inputDisabled, setInputDisabled] = useState(false);
	const initialValueSelectCat = Object.keys(profile).length ? [...profile?.categoryData?.map(date => date?._id)] : [];
	const [selectedCategory, setSelectedCategory] = useState(null);
	const initialValueCategoryData = profile?.categoryData?.map(date => date?.title)
	const [selectedCategoryinputValue, setSelectedCategoryInputValue] = useState(null);
	const [availabelCategories, setAvailabelCategories] = useState([]);
	const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
	const [phoneInput, setPhoneInput] = useState({
		phoneNo: profile?.phoneNumber || "",
		countryCode: profile?.countryCode || "",
		error: true,
	});

	useEffect(() => {
		setSelectedCategory(initialValueSelectCat)
		setSelectedCategoryInputValue(initialValueCategoryData)
	}, [profile])

	useEffect(() => {
		const categoryLabel = [];
		availabelCategories?.forEach((cat, index) => {
			if (selectedCategory.includes(cat?._id)) {
				categoryLabel.push(cat?.title)
			}
		})
		categoryLabel?.length && setSelectedCategoryInputValue(categoryLabel?.toString())
		selectedCategory?.length < 1 && setSelectedCategoryInputValue(categoryLabel?.toString())
	}, [selectedCategory])

	const [file, setFile] = useState({
		url: "",
	});
	const [file1, setFile1] = useState({
		url: "",
	});

	useEffect(() => {
		if (!mobileView) {
			startLoader();
			setTimeout(() => {
				stopLoader();
			}, 2000);
		}
		if (profile && [5, 6].includes(profile.statusCode)) {
			setInputDisabled(true);
		}
	}, []);

	const handleChangeBio = (value) => {
		profileData.bio = value;
		setBio(value);
		setBioLen(value && value.length);
	};

	const handleShoutoutPrice = (value) => {
		profileData.shoutoutPrice = value;
		setShoutoutPrice(value);
	};
	const handleShoutOutEnable = (isUserNotActive) => {
		if (isUserNotActive) return
		setIsEnable(!isEnable);
	}
	const handleNSFWChanges = (value) => {
		profileData.isNSFWAllow = value;
		setIsNSFWAllow(value);
	}

	const handleTimeZoneChange = (value) => {
		setTimeZone(value);
	}

	const handleCurrencyChange = (event) => {
		setCurrency(event.target.value);
		return value;
	};

	let profileData = {
		firstName: profile.firstName,
		lastName: profile.lastName,
		profilePic: profile.profilePic,
		//dateOfBirth: profile.dateOfBirth,
		bio: profile.bio ? profile.bio : "",
		bannerImage: profile.bannerImage ? profile.bannerImage : undefined,
		socialMediaLink: profile.socialMediaLink,
		groupIds: selectedCategory?.length < 1 ? [] : selectedCategory,
	};
	if (isAgency()) {
		profileData["userId"] = selectedCreatorId;
	}
	if (getCookie("userType") != 1 && shoutoutPrice) {
		profileData["shoutoutPrice"] = {
			"price": `${shoutoutPrice}`,
			"currencyCode": `${currency}`,
			"currencySymbol": `${currency.toLowerCase() === 'dollar' ? '$' : currency.toLowerCase() === 'euro' ? '€' : '₹'}`,
			"isEnable": `${isEnable}`
		}
	}
	const onBannerImageChange = async (fil, url) => {
		setFile({
			fil,
			url,
		});
	};

	const onProfileImageChange = async (fil, url) => {
		setFile1({
			fil,
			url,
		});
	};

	const dispatchPayload = () => {
		let data = { ...profile };

		(data.firstName = profileData.firstName),
			(data.lastName = profileData.lastName),
			(data.profilePic = profileData.profilePic),
			(data.bannerImage = profileData.bannerImage),
			(data.socialMediaLink = profileData.socialMediaLink);
		(data.bio = bioValue);
		(data.shoutoutPrice = profileData.shoutoutPrice);
		(data.currency = profileData.currency);
		data.gender = gender.value || profile.gender;
		data.isNSFWAllow = isNSFWAllow;
		data.timezone = timeZone.value;
		data.categoryData = selectedCategory;
		return data;
	};

	//On Save
	const saveProfileDetails = async () => {
		//check for banner image change
		// const userType = getCookie("userType");
		// const folderPath = `users/profiles`;
		const userId = getCookie("uid");
		const folderNameBanner = `${userId}/${config.FOLDER_NAME_IMAGES.profileBanner}`;
		const folderNameProfile = `${userId}/${config.FOLDER_NAME_IMAGES.profile}`;
		let tokenData = null;
		if (file.fil || file1.fil) {
			const cognitoToken = await getCognitoToken();
			tokenData = cognitoToken?.data?.data;
		}
		// const folderPath =
		if (file.fil) {
			startLoader();
			let res = await await fileUploaderAWS(file.fil[0], tokenData, file.fil[0].name, false, folderNameBanner, false, false);;
			stopLoader();
			profileData.bannerImage = res;
		}

		//check for profile image change
		if (file1.fil) {
			startLoader();
			let res = await fileUploaderAWS(file1.fil[0], tokenData, file1.fil[0].name, false, folderNameProfile, false, true);
			stopLoader();
			profileData.profilePic = res;
		}

		//calling patch profile api
		startLoader();
		if (!profileData.socialMediaLink) {
			delete profileData.socialMediaLink;
		}
		if (gender.value) {
			profileData.gender = gender.value;
		}

		if (timeZone.value) {
			profileData.timezone = timeZone.value;
		}

		await updateProfile(profileData)
			.then(async (res) => {
				stopLoader();
				if (res.status === 200) {
					Toast(res.data.message);
					const uid = isAgency() ? selectedCreatorId : getCookie("uid");
					const token = getCookie("token");
					if (profileData.timezone) setCookie('zone', profileData.timezone);
					if (profileData.groupIds) setCookie('categoryData', profileData.groupIds);
					dispatch(updateReduxProfile(dispatchPayload()));
					setCookie("profileData", JSON.stringify(dispatchPayload()))
					getProfile(uid, token, getCookie('selectedCreatorId')).then((res) => {
						const profileresponse = res.data.data
						dispatch(updateReduxProfile({ ...profile, ...profileresponse }));
						setCookie("profileData", JSON.stringify({ ...profile, ...profileresponse }))
						setCookie("categoryData", JSON.stringify([...profileresponse.categoryData]))
					})
					Route.push("/profile");
				}
			})
			.catch(async (err) => {
				stopLoader();
				if (err?.response) {
					Toast(err.response.data.message, "error");
				}
				if (err?.response?.status === 429) {
					Toast(lang.manyRequests, "error")
				}
				console.error(err);
			});
	};

	const dispatchPhnNUmPayload = () => {
		let data = { ...profile };

		(data.phoneNumber = phoneInput.phoneNo)
		return data;
	};

	const savePhoneNumberDetail = async () => {
		dispatch(updateReduxProfile(dispatchPhnNUmPayload()));
		setCookie("profileData", JSON.stringify({ ...profile, phoneNumber: phoneInput.phoneNo }))
	};

	// validate phone no
	const ValidatePhoneNo = () => {
		return new Promise(async (res, rej) => {
			try {
				await savePhoneNumberDetail()
				ValidatePhoneNoPayload.phoneNumber = phoneInput.phoneNo;
				ValidatePhoneNoPayload.countryCode = phoneInput.countryCode;
				const response = await phoneNumber(ValidatePhoneNoPayload);
				setPhoneInput(response);
				res();
			} catch (e) {
				;
				setError(phoneInput.errorMessage);
				rej();
			}
		});
	};

	// const onFrontDocumentImageChange = async (fil, url) => {
	//   if (fil) {
	//     startLoader();
	//     let res = await UploadImage(fil[0]);
	//     stopLoader();
	//     let payload = {};
	//     //profileData.bannerImage = res;
	//   }
	// };

	const handelSocialLinksBundle = (socialLinkObj) => {
		setSocialLinks(socialLinkObj)
	}

	const getSocialLink = () => {
		let linksArray = [];
		linksArray[0] = { label: "instagram", logo: socialLinks?.instagram ? config.instagram_social : config.instagram_social_disble };
		linksArray[1] = { label: "facebook", logo: socialLinks?.facebook ? config.facebook_social : config.facebook_social_disble };
		linksArray[2] = { label: "twitter", logo: socialLinks?.twitter ? config.twitter_social : config.twitter_social_disble };
		linksArray[3] = { label: "youtube", logo: socialLinks?.youtube ? config.youtube_social : config.youtube_social_disble };
		linksArray[4] = { label: "tiktok", logo: socialLinks?.tiktok ? config.onlyfans_social : config.onlyfans_social_disble };
		linksArray[5] = { label: "snapchat", logo: socialLinks?.snapchat ? config.snapchat_social : config.snapchat_social_disble };
		return linksArray;
	}

	return (
		<RouterContext forLogin={true} forUser={true} forCreator={true} forAgency={false} {...props}>
		<Wrapper>
			<Head>
				<script defer={true} src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" />
			</Head>
			{!mobileView
				? <div className="mv_wrap_home" ref={homePageref} id="home-page">
					<DvMyAccountLayout
						key={selectedCategoryinputValue}
						setActiveState={(props) => {
							setActiveNavigationTab(props);
						}}
						homePageref={homePageref}
						activeLink="profile/edit"
						bannerImage={file.url}
						onBannerImageChange={onBannerImageChange}
						profileImage={file1.url}
						onProfileImageChange={onProfileImageChange}
						initialValues={{
							firstName: `${profileData.firstName}`,
							lastName: `${profileData.lastName}`,
							bio: `${profileData.bio}`,
							shoutoutPrice: `${profileData.shoutoutPrice}`,
							link: `${profileData.socialMediaLink || ""}`,
						}}
						onSubmit={(values, { setSubmitting }) => {
							profileData.firstName = values.firstName;
							profileData.lastName = values.lastName;
							profileData.bio = bioValue;
							profileData.isNSFWAllow = isNSFWAllow;
							profileData.socialMediaLink = socialLinks;
							saveProfileDetails();
						}}
						//here we will deefine validation
						validationSchema={Yup.object().shape({
							firstName: Yup.string().required(`${lang.required}`),
							lastName: Yup.string().required(`${lang.required}`),
							// link: Yup.string().matches(
							// 	/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
							// 	"Enter valid link"
							// ),
						})}
						handleChangeBio={handleChangeBio}
						handleShoutoutPrice={handleShoutoutPrice}
						bioValue={bioValue}
						shoutoutPrice={shoutoutPrice}
						bioLen={bioLen}
						gender={gender}
						handleCurrencyChange={handleCurrencyChange}
						handelSocialLinksBundle={handelSocialLinksBundle}
						currency={currency}
						handleNSFWChanges={handleNSFWChanges}
						isNSFWAllow={isNSFWAllow}
						handleTimeZoneChange={handleTimeZoneChange}
						timeZone={timeZone}
						reduxSocialLinks={reduxSocialLinks}
						socialLinks={socialLinks}
						isEnable={isEnable}
						handleShoutOutEnable={handleShoutOutEnable}
						saveProfileDetails={saveProfileDetails}
						selectedCategory={selectedCategory}
						setSelectedCategory={setSelectedCategory}
						selectedCategoryinputValue={selectedCategoryinputValue}
						setSelectedCategoryInputValue={setSelectedCategoryInputValue}
						availabelCategories={availabelCategories}
						setAvailabelCategories={setAvailabelCategories}
						profile={profile}
						{...props}
					/>
				</div>
				: <div className="wrap">
					{type === "edit" && (
						<Formik
							initialValues={{
								firstName: `${profileData.firstName}`,
								lastName: `${profileData.lastName}`,
								bio: `${profileData.bio}`,
								link: `${profileData.socialMediaLink || ""}`,
								isNSFWAllow: `${profileData.isNSFWAllow}`,
							}}
							onSubmit={(values, { setSubmitting }) => {
								profileData.firstName = values.firstName;
								profileData.lastName = values.lastName;
								profileData.bio = bioValue;
								profileData.socialMediaLink = socialLinks;
								profileData.isNSFWAllow = isNSFWAllow;
								saveProfileDetails();
							}}
							//here we will deefine validation
							validationSchema={Yup.object().shape({
								firstName: Yup.string().required(`${lang.required}`),
								lastName: Yup.string().required(`${lang.required}`),
								// link: Yup.string().matches(
								// 	/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
								// 	"Enter valid link"
								// ),
							})}
						>
							{(props) => {
								const {
									values,
									touched,
									errors,
									isSubmitting,
									handleChange,
									handleBlur,
									handleSubmit,
								} = props;

								return (
									<div className="scr wrap-scr bg-dark-custom">
										<div className="col-12">
											<EditProfileHeader
												title={lang.editProfile}
												saveButton={true}
												onSave={() => {
													if (phoneInput?.error && (profile?.phoneNumber !== phoneInput?.phoneNo)) {
														ValidatePhoneNo();
													}
													if (phoneInput?.error && values.firstName && values.lastName) {
														handleSubmit();
													} else {
														Toast(`${lang.fieldsCantBlank}`, "error");
													}
												}}
											/>
										</div>
										<div className="col-12 mb-4">
											<EditProfileCoverImageHeader
												bannerImage={file.url}
												onBannerImageChange={onBannerImageChange}
												profileImage={file1.url}
												onProfileImageChange={onProfileImageChange}
												profileName={profile.firstName[0] + (profile.lastName ? profile.lastName[0] : '')}
											/>
										</div>
										<div className="col-12 py-5">
											<form onSubmit={handleSubmit} autoComplete="off">
												{/* Username */}
												<div
												// onClick={() => {
												// 	setActiveState("email");
												// 	Route.push("/profile/edit/email?username=true");
												// }}
												>
													<InputField
														label={`${lang.userNamePlaceHolder}*`}
														value={profile.username}
														placeholder={lang.userNamePlaceHolder}
														disabled={true}
														lock
														className={"mv_form_control_Input"}
													/>
												</div>

												{/* FirstName */}
												<InputField
													id="firstName"
													label={`${lang.firstNamePlaceholder}`}
													name="firstName"
													value={values.firstName}
													placeholder={lang.enterFirstName}
													edit
													error={
														errors.firstName && touched.firstName
															? errors.firstName
															: ""
													}
													onChange={handleChange}
													onBlur={handleBlur}
													className="mv_form_control_Input"
												//disabled={true}
												/>

												{/* LastName */}
												<InputField
													edit
													id="lastName"
													label={`${lang.lastNamePlaceholder}`}
													name="lastName"
													value={values.lastName}
													placeholder={lang.enterLastName}
													error={
														errors.lastName && touched.lastName
															? errors.lastName
															: ""
													}
													onChange={handleChange}
													onBlur={handleBlur}
													className="mv_form_control_Input"
												/>


												{profile && profile.userTypeCode != 1 && (
													<>
														{/* Phone Number */}
														{/* <div
															onClick={() => {
																setActiveState("phone");
																Route.push("/profile/edit/phone");
															}}
														> */}
														<PhoneNoInput
															key={profile?.phoneNumber}
															// edit
															label={`${lang.phone}`}
															name={lang?.phone}
															value={phoneInput?.phoneNo}
															className="mv_form_control_Input"
															iso2={"IN"}
															countryCode={profile.countryCode}
															disabled={isAgency()}
															phoneNo={
																profile.countryCode + profile.phoneNumber
															}
															onChange={(data) => setPhoneInput(data)}
														></PhoneNoInput>
														{/* </div> */}
													</>
												)}

												{/* Bio */}
												<div
													onClick={() => {
														setActiveState("bio");
														open_drawer(
															"EDIT_BIO",
															{
																value: bioValue,
																onChange: handleChangeBio,
																onBlur: handleBlur,
																// set
															},
															"right"
														);
													}}
												>
													<InputField
														edit
														id="bio_"
														label={`${lang.bio}`}
														name="bio"
														placeholder={bioValue || lang.enterBio}
														error={errors.bio && touched.bio ? errors.bio : ""}
														maxLength="900"
														textarea={true}
														rows={3}
														disabled={false}
														readOnly={true}
													/>
													{/* <p className="fontgreyClr m-0 fntSz13 mt-2 text-right">
														{bioLen} of 900 characters
													</p> */}
												</div>

												{/* Email */}
												<div
													onClick={() => {
														setActiveState("email");
														Route.push("/profile/edit/email");
													}}
												>
													<InputField
														edit
														label={`${lang.emailId}`}
														value={profile.email}
														placeholder={lang.search}
														disabled={false}
														className="mv_form_control_Input"
													/>
												</div>

												{/* NSFW Icon */}
												{/* <div
													onClick={() => {
														// setActiveState("email");
														// Route.push("/profile/edit/email");
														open_drawer("NSFW", {
															isNSFWAllow,
															handleNSFWChanges,
														}, "right")
													}}
												>
													<InputField
														icon={isNSFWAllow ? config.TICK : config.CROSS}
														iconId={isNSFWAllow ? "#tick" : "#cross"}
														color={isNSFWAllow ? palette.l_green : palette.l_red}
														value={"NSFW Content"}
														disabled={false}
														readOnly={true}
														className="mv_form_control_Input"
													/>
												</div> */}

												{/* Timezone */}
												<div>
													<label
														className={"mv_label_profile_input"}
													>
														{lang.selectTimeZone}
													</label>
													<Select
														menuPlacement="top"
														styles={{
															control: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", borderColor: "var(--l_input_bg)", color: "var(--l_light_grey)", borderRadius: '20px', minHeight: "44px" }),
															placeholder: (provided) => ({ ...provided, color: "var(--l_app_text)", fontSize: "15px", fontFamily: "Roboto" }),
															option: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", color: "var(--l_app_text)", fontFamily: "Roboto", fontSize: "15px", fontWeight: "400" }),
															singleValue: (provided) => ({ ...provided, color: "var(--l_app_text)" }),
															menuList: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", color: "var(--l_app_text)" }),
														}}
														value={timeZone}
														placeholder={lang.selectTimeZone}
														options={TIMEZONE_LIST}
														onChange={handleTimeZoneChange}
													/>
												</div>

												{profile && profile.userTypeCode != 1 && (
													<>
														{/* Gender */}
														<div
															edit
														// onClick={() => {
														//   open_drawer(
														//     "radioSelectore",
														//     {
														//       value: gender.value || profile.gender,
														//       data: genderArray,
														//       onSelect: (type) => {
														//         selectGender(
														//           _.find(genderArray, { value: type })
														//         );
														//       },
														//     },
														//     "bottom"
														//   );
														// }}
														>
															<InputField
																lock
																label={lang.gender}
																value={gender.value || profile.gender}
																placeholder={lang.gender}
																disabled={true}
																readOnly={true}
																className="mv_form_control_Input"
															/>
														</div>
													</>
												)}

												{profile && profile.userTypeCode != 1 && (
													<>
														{/* Category */}
														<div >
															<InputField
																key={selectedCategoryinputValue}
																edit
																onClick={() =>
																	open_drawer("category", {
																		setSelectedCategoryState: (data) => setSelectedCategory(data),
																		selectedCategoryState: selectedCategory,
																		setAvailabelCategories: (data) => setAvailabelCategories(data)
																	})}
																label={lang.categories}
																value={selectedCategoryinputValue}
																placeholder={lang.chooseCategory}
																className="mv_form_control_Input pr-5"
															/>
														</div>
													</>
												)}


												{profile && profile.userTypeCode != 1 && (
													<>
														{/* D-O-B */}
														<InputField
															lock
															id="dob"
															label={`${lang.dob}`}
															name="dob"
															value={formatDateOrder(profile.dateOfBirth)}
															placeholder={lang.dob}
															disabled={true}
															readOnly={true}
															className="mv_form_control_Input"
														// error={errors.bio && touched.bio ? errors.bio : ""}
														// onChange={handleChange}
														// onBlur={handleBlur}
														/>
														{/* ShoutOut Price */}
														<div className="d-flex flex-column align-item-right">
															<div className="position-absolute" style={{ right: "7vw", zIndex: 1 }}>
																<Switch
																	checked={isEnable}
																	onChange={() => { handleShoutOutEnable(inputDisabled) }}
																/>
															</div>
															<div
																onClick={() => {
																	setActiveState("shoutoutPrice");
																	isEnable ? open_drawer("EDIT_SHOUTOUT_PRICE", {
																		value: shoutoutPrice,
																		currency: currency,
																		onChange: handleShoutoutPrice,
																		handleCurrencyChange: handleCurrencyChange,
																		onBlur: handleBlur,
																	}, "right"
																	) : "";
																}}
															>

																<InputField
																	type='number'
																	id="shoutoutPrice"
																	label={`${lang.shououtAmount}`}
																	name="shoutoutPrice"
																	placeholder={`${currency.toLowerCase() === 'dollar' ? '$' : currency.toLowerCase() === 'euro' ? '€' : '₹'} ${shoutoutPrice || lang.enterPrice}`}
																	error={errors.shoutoutPrice && touched.shoutoutPrice ? errors.shoutoutPrice : ""}
																	disabled={false}
																	readOnly={true}
																	className="mv_form_control_Input shoutoutPriceInput"
																/>
															</div>
														</div>

														{/* Social Media Link */}
														<div
															onClick={() => open_drawer(
																"ADDSocialMediaLinks",
																{
																	handelSocialLinksBundle,
																	socialLinks
																},
																"right"
															)}
														>
															<div className="form-group">
																<div className="mv_label_profile_input pb-2">{lang.soclMediaLink}</div>
																<div className="py-1 d-flex align-items-center position-relative socialMediaLinkSection mv_form_control_Input">
																	{getSocialLink().length > 0 && getSocialLink().map((link, index) => (
																		<img src={link.logo} height="45" width="45" className="pl-3" />
																	))}
																	<div className="goForwardIcon"> <ChevronRightIcon style={{ color: "#6c6c6c" }} />
																	</div>
																</div>
															</div>
														</div>
													</>
												)}


												<div className="form-group">
													{profile && profile?.document && profile.userTypeCode != 1 && (
														<>
															<label className="mv_label_profile_input">
																{lang.idVerificationDocuments}
															</label>
															<label className="mv_label_document_change d-flex justify-content-end"
																onClick={() => open_drawer('chnageDocument', { doc: profile.document.documentTypeId })}
															>
																{lang.changeDocuments}
															</label>
															<div className="txt-book fntSz16 mb-2">
																{profile?.document?.name}
															</div>
															<div className="row callout-none" onContextMenu={handleContextMenu} >
																{profile.document &&
																	profile.document.frontImage && (
																		<div className="col-4">
																			<figure>
																				<button
																					type="button"
																					className="btn btn-default p-0"
																					data-toggle="modal"
																				>
																					<FigureCloudinayImage
																						ratio={1}
																						width={100}
																						publicId={
																							profile.document.frontImage
																						}
																						className="img-box"
																						editPage={true}
																					/>
																					<div className="dv_appTxtClr txt-trans">
																						{lang.front}
																					</div>
																				</button>
																			</figure>
																		</div>
																	)}
																{profile.document &&
																	profile.document.backImage && (
																		<div className="col-4">
																			<figure>
																				<button
																					type="button"
																					className="btn btn-default p-0"
																					data-toggle="modal"
																				//data-target="#bottomModal"
																				>
																					<FigureCloudinayImage
																						ratio={1}
																						width={100}
																						publicId={
																							profile.document.backImage
																						}
																						className="img-box"
																						editPage={true}
																					/>
																					<div className="dv_appTxtClr txt-trans">
																						{lang.back}
																					</div>
																				</button>
																			</figure>
																		</div>
																	)}
															</div>
														</>
													)}{" "}
													<div
														className={`row mx-0 flex-column ${profile.userTypeCode != 2 ? "mt-4 pt-1" : "mt-3"
															}`}
													>
														<p
															className="txt-heavy fntSz15 dv_base_color cursorPtr"
															onClick={() => {
																setActiveState("change-password");
																Route.push("/profile/edit/change-password");
															}}
														>
															{lang.changePassword}
														</p>

														<p
															className="txt-heavy fntSz15 base_reject_clr"
															onClick={() => {
																Route.push("/blocked-users");
															}}
														>
															{lang.blockedUser}
														</p>
														<p
															className="m-0 txt-heavy fntSz15 base_reject_clr"
															onClick={() => {
																open_drawer("DeactivateAcc", {}, "bottom");
															}}
														>
															{lang.deactivateAccount}
														</p>
													</div>
												</div>
											</form>
										</div>
										<style jsx>{`
										:global(.mv_create_post_switch_toggler){
											float:right!important;
										}
										:global(#bio_::placeholder){
											color:var(--l_app_text) !important;
										}
										:global(#shoutoutPrice::placeholder){
											color: ${shoutoutPrice && ' var(--l_app_text)'} !important;
											opacity: ${shoutoutPrice && '1'} !important;
										}
										`}</style>
									</div>
								);
							}}
						</Formik>
					)}
					{type === "phone" && <EditPhoneNumber saveProfileDetails={saveProfileDetails} />}
					{type === "email" && <EditEmailId />}
					{type === "change-password" && <ChangePassword />}
				</div>
			}
		</Wrapper>
		</RouterContext>
	);
}

EditProfile.getInitialProps = async ({ ctx }) => {
	let { query = {}, req, res } = ctx;
	// returnLogin();
	return { query: query };
};
export default EditProfile;
