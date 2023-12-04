import React, { Component } from "react";
import Wrapper from "../../hoc/Wrapper";
import {
	getArea,
	getCity,
	getCountry,
	getPostalCode,
	getState,
	getStreet,
	getAddressLine1,
	getAddressLine2
} from "../../lib/global";
import LocationSearchInput from "./location-search-input";
import Geocode from "react-geocode";

class LocationAutocomplete extends Component {
	state = {
		responseData: { lat: "", long: "", address: this.props.value },
	};

	componentDidUpdate = (prevProps) => {
		if (prevProps.value !== this.props.value) {
			let tempresponseData = { ...this.state.responseData };
			tempresponseData.address = this.props.value;
			this.setState({ responseData: tempresponseData });
		}
	};

	handleAddressChange = (address) => {
		var a = false;
		if (address.address == "") {
			a = true;
		}
		this.setState({
			...this.state,
			addressErr: a,
			responseData: {
				...this.state.responseData,
				address: address,
			},
		});

		this.props.handlerChange(address);
	};
	// get location
	updateLatLong = (address) => {
		this.setState({
			...this.state,
			responseData: {
				...this.state.responseData,
				address: address,
			},
		});

		Geocode.fromAddress(address).then((response) => {
			// console.log("address geocode", response);
			const addressArray = response.results[0].address_components;
			const city = getCity(addressArray);
			const street = getStreet(addressArray);
			const area = getArea(addressArray);
			const state = getState(addressArray);
			const country = getCountry(addressArray);
			const postalCode = getPostalCode(addressArray);
			const addressLine1 = getAddressLine1(addressArray);
			const addressLine2 = getAddressLine2(addressArray);
			const checkedAddress = [area, city, state, country, postalCode];
			const fullAddress = addressArray.map((item) => item.long_name);
			// const addressLine1 = fullAddress
			// 	.filter((item) => !checkedAddress.includes(item))
			// 	?.join(", ");
			if (this.props.locationData) {
				this.props.locationData({
					address,
					city,
					area,
					state,
					country,
					postalCode,
					addressLine1,
					street,
					addressLine2,
					geometry: response.results[0].geometry,
				});
			}
		});

		(error) => {
			console.error(error);
		};
	};

	render() {
		const { mobileView } = this.props;
		return (
			<Wrapper>
				<div className="form-group">
					<label className="mv_label_profile_input" style={{ width: "100%", textAlign: "left" }}>{this.props.label}</label>
					<LocationSearchInput
						// value={this.state.address}
						extraOptions={{
							types: ["establishment"],
						}}
						disabled={this.props.disable}
						className={
							mobileView
								? `form-control mv_form_control_profile_input ${this.props.error ? "input-error" : ""
								}`
								: `form-control dv__border_bottom_profile_input ${this.props.error ? "input-error" : ""
								}`
						}
						updateAddress={this.updateLatLong}
						placeholder={this.props.placeholder}
						address={this.state.responseData.address}
						handleAddressChange={this.handleAddressChange}
					/>
				</div>
			</Wrapper>
		);
	}
}

export default LocationAutocomplete;
