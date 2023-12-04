import React from "react";
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
} from "react-places-autocomplete";
import * as env from "../../lib/config";
import Geocode from "react-geocode";
import { connect } from "react-redux";
import Img from "../../components/ui/Img/Img";
Geocode.setApiKey(env.MAP_KEY);
class LocationSearchInput extends React.Component {
	state = {
		address: this.props.addresss,
		isLoaded: false,
	};

	handleSelect = (address) => {
		this.setState({ address });

		if (this.props.updateAddress) {
			this.props.updateAddress(address);
		} else {
			geocodeByAddress(address)
				.then((results) => getLatLng(results[0]))
				.then((latLng) =>
					this.props.updateLatLong(latLng.lat, latLng.lng, address)
				)
				.catch((error) => console.error("Error", error));
		}
	};

	componentDidMount() {
		this.setState({
			isLoaded: true,
		});
	}

	getLocationInput = (option = {}) => {
		return (
			<PlacesAutocomplete
				value={this.props.address}
				onChange={this.props.handleAddressChange}
				onSelect={this.handleSelect}
				searchOptions={option}
			>
				{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
					return (
						<div className="custom-dropdown-box w-100">
							<input
								autoComplete="off"
								type="text"
								onChange={this.props.checkAdd}
								{...getInputProps({
									placeholder: this.props.placeholder || "Search Places ",
									className: `form-input ${this.props.className ? this.props.className : ""
										}`,
								})}
							/>
							{suggestions.length != 0 && (
								<div className="autocomplete-dropdown-container custom-dropdown-items">
									{suggestions.map((suggestion, index) => {
										const className = suggestion.active
											? "custom-dropdown-selected cursorPtr"
											: "custom-dropdown-item cursorPtr";
										// inline style for demonstration purpose

										return (
											<div
												key={index}
												{...getSuggestionItemProps(suggestion, {
													className,
												})}
											>
												<span>{suggestion.description}</span>
											</div>
										);
									})}
									<Img
										src={env.Powered_By_Google_Icon}
										className="float-right"
									/>
								</div>
							)}
						</div>
					);
				}}
			</PlacesAutocomplete>
		);
	};
	render() {
		let extra = this.props.extraOptions ? { ...this.props.extraOptions } : {};
		return this.state.isLoaded
			? this.getLocationInput({
				...extra,
				// bounds: new google.maps.LatLngBounds(
				//   new google.maps.LatLng(
				//     this.props.userData.location.latitude,
				//     this.props.userData.location.longitude
				//   ),
				//   new google.maps.LatLng(
				//     this.props.userData.location.latitude,
				//     this.props.userData.location.longitude
				//   )
				// ),
			})
			: this.getLocationInput();
	}
}

let mapStateToProps = (state) => {
	return {
		userData: state.userData,
	};
};
export default connect(mapStateToProps, null)(LocationSearchInput);
