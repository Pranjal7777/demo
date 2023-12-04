import React, { Component } from "react";
import {
	withGoogleMap,
	GoogleMap,
	withScriptjs,
	InfoWindow,
	Marker,
	Circle,
} from "react-google-maps";
import Geocode from "react-geocode";
import * as env from "../../lib/config";
import {
	getCity,
	getState,
	getPostalCode,
	getArea,
	getCountry,
	getGeoLocation,
	getAddressLine1,
	getAddressLine2,
	getStreet,
} from "../../lib/global";
import { getCookie } from "../../lib/session";
Geocode.setApiKey(env.MAP_KEY);
import MyLocationIcon from "@material-ui/icons/MyLocation";
import { PRIMARY_COLOR } from "../../lib/color";

class Map extends Component {
	constructor(props) {
		super(props);
		this.state = {
			address: "",
			city: "",
			area: "",
			state: "",
			mapPosition: {
				lat: this.props.center.lat,
				lng: this.props.center.lng,
			},
			markerPosition: {
				lat: this.props.center.lat,
				lng: this.props.center.lng,
			},
		};

		if (props.childRef) {
			props.childRef(this);
		}
	}
	/**
	 * Get the current address from the default map position and set those values in the state
	 */

	componentDidMount() {
		if (this.props.center.lat == 0.0) {
			let latitude = getCookie("latitude");
			let longitude = getCookie("longitude");
			// getGeoLocation()
			//   .then((data) => {
			let stateObject = { ...this.state };

			stateObject.mapPosition.lat = parseFloat(latitude);
			stateObject.mapPosition.lng = parseFloat(longitude);
			stateObject.markerPosition.lat = parseFloat(latitude);
			stateObject.markerPosition.lng = parseFloat(longitude);
			this.setState(stateObject);
		}

		//getLatLong
	}

	// getLatLong

	getAddressByUsingLatLong = (lat, long) => {
		Geocode.fromLatLng(lat, long).then(
			(response) => {
				const address = response.results[0].formatted_address,
					addressArray = response.results[0].address_components,
					city = getCity(addressArray),
					area = getArea(addressArray),
					state = getState(addressArray),
					country = getCountry(addressArray),
					postalCode = getPostalCode(addressArray);
					const addressLine1 = getAddressLine1(addressArray);
					const addressLine2 = getAddressLine2(addressArray);
					const street = getStreet(addressArray);

				if (this.props.updateMapData) {
					this.props.updateMapData({
						address,
						city,
						area,
						state,
						country,
						postalCode,
						addressLine1,
						addressLine2,
						street,
						lat: this.state.mapPosition.lat,
						lng: this.state.mapPosition.lng,
					});
				}

				this.setState({
					address: address ? address : "",
					area: area ? area : "",
					city: city ? city : "",
					state: state ? state : "",
					country: country ? country : "",
					postalCode: postalCode ? postalCode : "",
				});
			},
			(error) => {
				console.error("location errororororo", error);
			}
		);
	};
	static getDerivedStateFromProps(props, state) {
		if (
			props.center.lat != state.mapPosition.lat ||
			props.center.lng != state.mapPosition.lng
		) {
			return {
				...state,
				mapPosition: {
					lat: props.center.lat,
					lng: props.center.lng,
				},
				markerPosition: {
					lat: props.center.lat,
					lng: props.center.lng,
				},
			};
		}

		// Return null if the state hasn't changed
		return null;
	}
	shouldComponentUpdate(nextProps, nextState) {
		if (
			this.state.mapPosition.lng !== nextState.mapPosition.lng ||
			this.state.mapPosition.lng !== nextState.mapPosition.lng
		) {
			return true;
		}
		return false;
	}

	onChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	onInfoWindowClose = (event) => {};

	onMarkerDragEnd = (event) => {
		let newLat = event.latLng.lat(),
			newLng = event.latLng.lng();

		Geocode.fromLatLng(newLat, newLng).then(
			(response) => {
				const address = response.results[0].formatted_address,
					addressArray = response.results[0].address_components,
					city = getCity(addressArray),
					area = getArea(addressArray),
					state = getState(addressArray),
					country = getCountry(addressArray),
					postalCode = getPostalCode(addressArray);
					const addressLine1 = getAddressLine1(addressArray);
					const addressLine2 = getAddressLine2(addressArray);
					const street = getStreet(addressArray);

				const checkedAddress = [area, city, state, country, postalCode];
				// const fullAddress = addressArray.map((item) => item.long_name);
				// const addressLine1 = address
				// 	?.split(", ")
				// 	.filter((item) => !checkedAddress.includes(item))
				// 	?.join(", ");
				// console.log("addressArray", addressArray);
				if (this.props.updateMapData) {
					this.props.updateMapData({
						address,
						city,
						area,
						state,
						country,
						postalCode,
						lat: newLat,
						lng: newLng,
						addressLine1,
						addressLine2,
						street
					});
				}

				this.setState({
					address: address ? address : "",
					area: area ? area : "",
					city: city ? city : "",
					state: state ? state : "",
					country: country ? country : "",
					postalCode: postalCode ? postalCode : "",
					markerPosition: {
						lat: newLat,
						lng: newLng,
					},
					mapPosition: {
						lat: newLat,
						lng: newLng,
					},
					addressLine1,
				});
			},
			(error) => {
				console.error(error);
			}
		);
	};

	/**
	 * When the user types an address in the search box
	 * @param place
	 */
	onPlaceSelected = (place) => {
		// console.log("plc", place);
		const address = place.formatted_address,
			addressArray = place.address_components,
			city = getCity(addressArray),
			area = getArea(addressArray),
			state = getState(addressArray),
			latValue = place.geometry.location.lat(),
			lngValue = place.geometry.location.lng();
			const addressLine1 = getAddressLine1(addressArray);
			const addressLine2 = getAddressLine2(addressArray);
			const street = getStreet(addressArray);

		if (this.props.updateMapData) {
			this.props.updateMapData({
				address,
				city,
				area,
				state,
				country,
				postalCode,
				lat: newLat,
				lng: newLng,
				addressLine1,
				addressLine2,
				street
			});
		}

		// Set these values in the state.
		this.setState({
			address: address ? address : "",
			area: area ? area : "",
			city: city ? city : "",
			state: state ? state : "",
			markerPosition: {
				lat: latValue,
				lng: lngValue,
			},
			mapPosition: {
				lat: latValue,
				lng: lngValue,
			},
		});
	};

	handleMyLocation = async () => {
		document.getElementById("myLocation").style.color = PRIMARY_COLOR;
		let addressData = await getGeoLocation();
		this.props.updateMapData({
			address: addressData.address,
			city: addressData.city,
			area: addressData.area,
			state: addressData.state,
			country: addressData.country,
			postalCode: addressData.zipCode,
			lat: addressData.latitude,
			lng: addressData.longitude,
			addressLine1: addressData.addressLine1,
		});
	};

	render() {
		let propOption = this.props.propOption ? this.props.propOption : {};
		const AsyncMap = withScriptjs(
			withGoogleMap((props) => (
				<GoogleMap
					options={{
						...propOption,
						disableDefaultUI: this.props.disableDefaultUI
							? this.props.disableDefaultUI
							: false,
						fullscreenControl: false,
						streetViewControl: false,
					}}
					google={this.props.google}
					defaultZoom={this.props.zoom}
					defaultCenter={{
						lat: this.state.mapPosition.lat || 0.0,
						lng: this.state.mapPosition.lng || 0.0,
					}}
				>
					{/* InfoWindow on top of marker */}
					{/* <InfoWindow
            onClose={this.onInfoWindowClose}
            position={{
              lat: this.state.markerPosition.lat + 0.0018,
              lng: this.state.markerPosition.lng
            }}
          >
            <div>
              <span style={{ padding: 0, margin: 0 }}>
                {this.state.address}
              </span>
            </div>
          </InfoWindow> */}
					{/*Marker*/}
					{!this.props.radius && (
						<Marker
							google={this.props.google}
							draggable={
								this.props.draggable == false ? this.props.draggable : true
							}
							onDragEnd={this.onMarkerDragEnd}
							onPositionChanged={this.positionChnage}
							position={{
								lat: this.state.markerPosition.lat || 0.0,
								lng: this.state.markerPosition.lng || 0.0,
							}}
						/>
					)}
					<MyLocationIcon
						className="mylocationIcon"
						id="myLocation"
						onClick={() => this.handleMyLocation()}
					></MyLocationIcon>
					{this.props.radius && (
						<Circle
							defaultCenter={{
								lat: parseFloat(this.state.markerPosition.lat) || 0.0,
								lng: parseFloat(this.state.markerPosition.lng) || 0.0,
							}}
							radius={this.props.radius.radius}
							options={this.props.radius.options}
						></Circle>
					)}

					{/* For Auto complete Search Box */}
					{/* <Autocomplete
            style={{
              width: "100%",
              height: "40px",
              paddingLeft: "16px",
              marginTop: "2px",
              marginBottom: "500px"
            }}
            onPlaceSelected={this.onPlaceSelected}
            types={["(regions)"]}
          /> */}
				</GoogleMap>
			))
		);
		let map;
		if (this.props.center.lat !== undefined) {
			map = (
				<div className="col-12 p-0">
					<div>
						<div className="form-group">
							<AsyncMap
								googleMapURL=" "
								loadingElement={
									<div style={{ height: this.props.height || `100%` }} />
								}
								containerElement={<div style={{ height: this.props.height }} />}
								mapElement={
									<div style={{ height: this.props.height || `100%` }} />
								}
							/>
						</div>
					</div>
				</div>
			);
		} else {
			map = <div style={{ height: this.props.height }} />;
		}
		return map;
	}
}
export default Map;
