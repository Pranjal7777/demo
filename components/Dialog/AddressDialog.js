import find from "lodash/find";
import React, { useEffect, useState } from "react";
import Head from 'next/head';
import Geocode from "react-geocode";
import { useDispatch } from "react-redux";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import useAddressData from "../../hooks/useAddressList";

import * as env from "../../lib/config";
import {
	backNavMenu,
	close_dialog,
	getGeoLocation,
	open_dialog,
	open_drawer,
	startLoader,
	stopLoader,
	Toast,
} from "../../lib/global";
import { deleteAddress } from "../../redux/actions/address";
import { setDefault } from "../../services/address";
import { Drawer } from "@material-ui/core";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
const AddAddress = dynamic(() => import("../Drawer/AddAddress"), {
	ssr: false,
});
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
const DeleteCardConfirm = dynamic(() => import("../Drawer/DeleteCardConfirm"), {
	ssr: false,
});
const AddressTile = dynamic(() => import("../Drawer/AddressTile"), {
	ssr: false,
});
Geocode.setApiKey(env.MAP_KEY);
import { useTheme } from "react-jss";
const Button = dynamic(() => import("../button/button"), { ssr: false });

const AddressDialog = (props) => {
	const theme = useTheme();
	const { radio = false } = props;
	const [lang] = useLang();
	const [selectAddress, setAddress] = useState("");
	const [address] = useAddressData();
	const [toggleaddAddressDrawer, setToggleAddAddressDrawer] = useState(false);
	const [toggledeleteCardDrawer, setToggleDeleteCardDrawer] = useState(false);
	const [selectedAddress, setAddressData] = useState({});
	const [selectedEditAddress, setEditAddressData] = useState({});
	const [editAddress, setEditAddress] = useState(false);
	const dispatch = useDispatch();
	const [mobileView] = isMobile();

	useEffect(() => {
		if (radio && !selectAddress) {
			const addressId =
				(address &&
					address.length > 0 &&
					address.filter((data) => {
						return data.isDefault;
					})[0]._id) ||
				"";

			setAddress(props.selectedAddress || addressId);
		}
	}, [address]);

	const handleAddAddress = async () => {
		let addressData = await getGeoLocation();

		setAddressData({});

		setEditAddressData(addressData);
		setEditAddress(false);
		mobileView
			? setToggleAddAddressDrawer(true)
			: open_dialog("addAddress", {
					getAddress: props.getAddress,
					mobileView: mobileView,
					selectedEditAddress: addressData,
					editAddress: false,
					handleSetMyLocation: handleSetMyLocation,
					theme: theme,
			  });
	};

	const handleSetMyLocation = async (addr) => {
		if (addr) {
			setEditAddressData(addressData);
			return;
		}
		let addressData = await getGeoLocation();
		setAddressData({});
		setEditAddressData(addressData);
	};

	const handleCloseDrawer = () => {
		setToggleAddAddressDrawer(false);
	};

	const openConfirmModel = (data) => {
		setAddressData(data);
		// if (data.isDefault) {
		// 	Toast("can't delete default address", "error");
		// } 
		if (data) {
			mobileView
				? setToggleDeleteCardDrawer(true)
				: open_dialog("confirmDeleteAddress", {
						title: lang.addressDeleteConfirmation,
						selectedCard: data,
						handleDeleteCard: handleDeleteAddress,
				  });
		}
	};

	const closeConfirmModel = () => {
		setToggleDeleteCardDrawer(false);
	};

	const handleEditAddress = (data) => {
		setEditAddressData(data);
		setEditAddress(true);
		mobileView
			? setToggleAddAddressDrawer(true)
			: open_dialog("addAddress", {
					getAddress: props.getAddress,
					mobileView: mobileView,
					selectedEditAddress: data,
					editAddress: true,
					handleSetMyLocation: handleSetMyLocation,
					theme: theme,
			  });
	};

	const handleDeleteAddress = (addressData) => {
		startLoader();
		dispatch(deleteAddress(addressData._id));
		setTimeout(() => {
			stopLoader();
			setAddressData({});
			mobileView ? closeConfirmModel() : close_dialog("confirmDeleteAddress");
		}, 2000);
	};

	const handleSetDefaultAddress = async (selectedData) => {
		startLoader();
		try {
			const response = await setDefault(selectedData._id);
			if (response.status == 200) {
				props.getAddress();
				stopLoader();
			}
		} catch (e) {
			stopLoader();
			console.error("handleSetDefaultAddress", e);
			// Toast(e.response.data.message, "error");
		}
	};
	return (
		<Wrapper>
			<Head>
				<script src={`https://maps.googleapis.com/maps/api/js?key=${env.MAP_KEY}&libraries=places`} />
        	</Head>
			<div className="py-3 px-5">
				<div className="text-center pb-3">
					<h5 className="txt-black dv__fnt34">{lang.selectBillingAddress}</h5>
				</div>
				<button
					type="button"
					className="close dv_modal_close"
					data-dismiss="modal"
					onClick={() => props.onClose()}
				>
					{lang.btnX}
				</button>

				<Button
					type="button"
					cssStyles={theme.blueBorderButton}
					data-dismiss="modal"
					data-toggle="modal"
					onClick={() => {
						handleAddAddress();
					}}
				>
					{lang.addAddress}
				</Button>

				<div className="overflow-auto pt-3">
					{address && address.length ? (
						<div className="col-12">
							<div className="d-flex flex-wrap my-3">
								{address.map((data, index) => (
									<AddressTile
										selectAddress={selectAddress}
										onChange={setAddress}
										radio={radio}
										addressData={data}
										key={index}
										openConfirmModel={openConfirmModel}
										handleEditAddress={handleEditAddress}
										handleSetDefaultAddress={handleSetDefaultAddress}
									/>
								))}
							</div>
						</div>
					) : !address ? (
						""
					) : (
						<div className="h-50 d-flex align-items-center justify-content-center">
							<div className="text-center">
								<Img src={env.No_Address} alt="no address" />
								<p className="m-0 mt-3">{lang.noAddressFound}</p>
							</div>
						</div>
					)}
				</div>

				{radio && (
					<div className="my-4">
						<Button
							disabled={!selectAddress}
							type="button"
							cssStyles={theme.blueButton}
							data-dismiss="modal"
							data-toggle="modal"
							onClick={() => {
								props.onConfirm
									? props.onConfirm(
											find(address, {
												_id: selectAddress,
											})
									  )
									: mobileView
									? open_drawer(
											"checkout",
											{
												checkoutProps: props.checkoutProps || {},
												selectAddress: selectAddress, // note: note,
												checkout: props.checkout,
											},
											"right"
									  )
									: open_dialog("checkout", {
											checkoutProps: props.checkoutProps || {},
											selectAddress: selectAddress,
											checkout: props.checkout,
									  });
							}}
						>
							{lang.confirm}
						</Button>
					</div>
				)}

				{/* Add Address Model */}
				<Drawer
					open={toggleaddAddressDrawer}
					anchor="right"
					onClose={() => handleCloseDrawer()}
				>
					<AddAddress
						onClose={() => handleCloseDrawer()}
						getAddress={props.getAddress}
						selectedEditAddress={selectedEditAddress}
						editAddress={editAddress}
						handleSetMyLocation={handleSetMyLocation}
						mobileView={mobileView}
						theme={theme}
					/>
				</Drawer>

				{/* Delete Confirmation Model */}
				<Drawer
					open={toggledeleteCardDrawer}
					anchor="bottom"
					onClose={closeConfirmModel}
				>
					<DeleteCardConfirm
						title={lang.addressDeleteConfirmation}
						selectedCard={selectedAddress}
						handleDeleteCard={handleDeleteAddress}
						onClose={closeConfirmModel}
					/>
				</Drawer>
				<style jsx>
					{`
						:global(.MuiDrawer-paper) {
							color: inherit;
						}
					`}
				</style>
			</div>
		</Wrapper>
	);
};

export default AddressDialog;
