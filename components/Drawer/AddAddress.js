import React, { Component } from "react";
import dynamic from "next/dynamic";
import { connect } from "react-redux";
import Head from 'next/head';
import { LanguageSet } from "../../translations/LanguageSet";
import { address, updateAddress } from "../../services/address";
import { startLoader, stopLoader, Toast } from "../../lib/global";
import Wrapper from "../../hoc/Wrapper";
import { MAP_KEY } from "../../lib/config";
import { getCityStateWithZipCode } from "../../lib/url/fetchCityState";
const Header = dynamic(() => import("../header/header"), { ssr: false });
const Map = dynamic(() => import("../../containers/location/map"), {
  ssr: false,
});
const InputField = dynamic(
  () => import("../../containers/profile/edit-profile/label-input-field"),
  { ssr: false }
);
const LocationAutocomplete = dynamic(
  () => import("../../containers/location/location-autocomplete"),
  { ssr: false }
);
const Button = dynamic(() => import("../button/button"), { ssr: false });

class AddAddress extends Component {
  state = {
    loader: false,
    isValidate: false,
    fullAddress: this.props.selectedEditAddress.address || "",
    formData: {
      // address: {
      //   type: "text",
      //   inputType: "text",
      //   name: "address",
      //   label: "address*",
      //   placeholder: this.props.mobileView ? "" : "area*",
      //   value:
      //     this.props.selectedEditAddress.address ||
      //     "",
      //   errorr: false,
      //   validate: [
      //     {
      //       validate: "required",
      //       error: "address required",
      //     },
      //   ],
      // },
      // street: {
      //   type: "text",
      //   inputType: "text",
      //   name: "street",
      //   label: "street name / door number*",
      //   placeholder: this.props.mobileView ? "" : "street name / door number*",
      //   value:
      //   this.props.selectedEditAddress.street ||
      //   "",
      //   errorr: false,
      //   validate: [
      //     {
      //       validate: "required",
      //       error: "address required",
      //     },
      //   ],
      // },
      addressLine1: {
        type: "text",
        inputType: "text",
        name: "addressLine1",
        label: "Address*",
        placeholder: "Address Line*",
        value: this.props.selectedEditAddress.address ||
          "",
        errorr: false,
        validate: [
          {
            validate: "required",
            error: "address line 1 required",
          },
        ],
      },
      // addressLine2: {
      //   type: "text",
      //   inputType: "text",
      //   name: "addressLine2",
      //   label: "Address Line 2",
      //   placeholder: this.props.mobileView
      //     ? ""
      //     : "Address Line 2",
      //   value:"",
      //   errorr: false,
      // },
      // area: {
      //   type: "text",
      //   inputType: "text",
      //   name: "area",
      //   label: "Area*",
      //   placeholder: this.props.mobileView ? "" : "Area*",
      //   value: this.props.selectedEditAddress.area || "",
      //   errorr: false,
      //   validate: [
      //     {
      //       validate: "required",
      //       error: "Area required",
      //     },
      //   ],
      // },
      pincode: {
        type: "text",
        inputType: "text",
        name: "pincode",
        label: "Zipcode / Postalcode*",
        pattern: "[a-zA-z0-9]{0,8}",
        placeholder: "Zipcode / Postalcode",
        value: this.props.selectedEditAddress.zipCode || "",
        errorr: false,
        validate: [
          {
            validate: "required",
            error: "Zipcode / Postalcode required*",
          },
        ],
      },
      city: {
        type: "text",
        inputType: "text",
        name: "city",
        label: "City*",
        placeholder: "City*",
        value: this.props.selectedEditAddress.city || "",
        errorr: false,
        validate: [
          {
            validate: "required",
            error: "City required",
          },
        ],
      },
      state: {
        type: "text",
        inputType: "text",
        name: "state",
        label: "State*",
        placeholder: "State*",
        value: this.props.selectedEditAddress.state || "",
        errorr: false,
        validate: [
          {
            validate: "required",
            error: "state required",
          },
        ],
      },
      country: {
        type: "text",
        inputType: "text",
        name: "country",
        label: "Country*",
        placeholder: "Country*",
        value: this.props.selectedEditAddress.country || "",
        errorr: false,
        validate: [
          {
            validate: "required",
            error: "Country required",
          },
        ],
      },

      // landMark: {
      //   lable: "Land mark",
      //   type: "text",
      //   inputType: "text",
      //   value: "",
      //   errorr: false,
      //   name: "landMark"
      // }
    },
    // addressLine1: this.props.line1 || "",
    // addressLine2: this.props.line1 || "",
    center: {
      lat:
        this.props.selectedEditAddress.latitude ||
        this.props.selectedEditAddress.lat ||
        "12.9716",
      long:
        this.props.selectedEditAddress.longitude ||
        this.props.selectedEditAddress.long ||
        "77.5946",
    },
  };

  changeInput = async (event, field) => {
    let inputControl = event.target;
    let stateObject = { ...this.state };
    if (inputControl.name == "pincode") {
      let re = /^[a-zA-Z0-9]+$/i;
      if (!inputControl.value.length) {
        stateObject.formData[inputControl.name].errorr = false;
        stateObject.formData[inputControl.name].value = inputControl.value;
      } else {
        const found = re.test(inputControl.value);
        found ? stateObject.formData[inputControl.name].errorr = false : stateObject.formData[inputControl.name].errorr = true;
        stateObject.formData[inputControl.name].value = inputControl.value;
      }
    } else {
      stateObject.formData[inputControl.name].value = inputControl.value;
    }

    // Dynamic Country, State and City from Google API
    if (field === "city" && inputControl.name === "city") {
      const cityStateObj = await getCityStateWithZipCode(stateObject.formData.city.value);

      if (stateObject.formData.city.value.length === 0) {
        stateObject.formData.country.value = ""
        stateObject.formData.state.value = ""
      }

      if (cityStateObj) {
        stateObject.formData.country.value = cityStateObj.find(country => country.types[0] === "country")?.long_name;
        // stateObject.formData.city.value = cityStateObj.find(city => city.types[0] === "locality" || city.types[0] === "postal_town")?.long_name;
        stateObject.formData.state.value = cityStateObj.find(state => state.types[0] === "administrative_area_level_1")?.long_name;
      }
    }

    // if (field === "pincode") {
    //   const cityStateObj = await getCityStateWithZipCode(inputControl.value);

    //   if (cityStateObj) {
    //     stateObject.formData.country.value = cityStateObj.find(country => country.types[0] === "country")?.long_name;
    //     stateObject.formData.city.value = cityStateObj.find(city => city.types[0] === "locality" || city.types[0] === "postal_town")?.long_name;
    //     stateObject.formData.state.value = cityStateObj.find(state => state.types[0] === "administrative_area_level_1")?.long_name;
    //   }
    // }

    stateObject.isValidate = this.validate();
    this.setState(stateObject, () => {
      // console.log("state object", stateObject);
    });
  };

  handlerChange = (addressData) => {
    let stateObject = { ...this.state };
    stateObject.isValidate = this.validate();

    if (addressData == "") {
      stateObject.formData.address["errorr"] = true;
    } else {
      stateObject.formData.address["errorr"] = false;
    }

    this.setState(stateObject);
  };

  locationData = (address) => {
    let stateObject = { ...this.state };
    stateObject.isValidate = this.validate();

    if (address.city) {
      stateObject.formData.city.errorr = false;
      stateObject.formData.city.value = address.city;
    }
    // if (address.area) {
    //   stateObject.formData.area.errorr = false;
    //   stateObject.formData.area.value = address.area;
    // }
    if (address.state) {
      stateObject.formData.state.errorr = false;
      stateObject.formData.state.value = address.state;
    }
    if (address.country) {
      stateObject.formData.country.errorr = false;
      stateObject.formData.country.value = address.country;
    }

    if (address.postalCode) {
      stateObject.formData.pincode.errorr = false;
      stateObject.formData.pincode.value = address.postalCode;
    }
    // if (address.addressLine2 || address.area) {
    //   stateObject.formData.addressLine2.errorr = false;
    //   stateObject.formData.addressLine2.value = address.area || address.addressLine2 || "";
    // }
    // if (address.addressLine1 || address.address) {
    //   stateObject.formData.addressLine1.value =
    //     address.addressLine1 || address.address;
    //   stateObject.formData.address.errorr = false;
    // }
    if (address.street || address.address) {
      stateObject.formData.address.value =
        address.address;
      stateObject.formData.address.errorr = false;
    }
    // if (address.street || address.address) {
    //   stateObject.formData.street.value =
    //     address.street || "";
    //   stateObject.formData.street.errorr = false;
    // }
    if (address.address) {
      stateObject.fullAddress = address.address;
    }

    // stateObject.addressLine1 = address.line;
    // stateObject.addressLine2 = address.line2;
    stateObject.center.lat = address.geometry.location.lat;
    stateObject.center.long = address.geometry.location.lng;

    this.setState(stateObject, () => {
      // console.log("location data", stateObject);
    });
  };

  validate = () => {
    let validate = true;

    for (let i in this.state.formData) {
      if (this.state.formData[i].validate) {
        if (i == "address" && this.state.formData[i]["value"].length == 0) {
          break;
        } else {
          if (
            !this.state.formData[i]["value"] ||
            this.state.formData[i]["value"] == "" ||
            this.state.formData[i]["errorr"]
          ) {
            validate = false;
            break;
          }
        }
      }
    }
    // console.log("validte", validate);

    return validate;
  };

  addAddress = (type) => {
    startLoader();

    let reqObject = {
      address: this.state.formData.addressLine1.value,
      state: this.state.formData.state.value,
      // area: this.state.formData.area.value,
      city: this.state.formData.city.value,
      zipCode: this.state.formData.pincode.value,
      country: this.state.formData.country.value,
      lat: this.state.center.lat,
      long: this.state.center.long,
      note: this.state.fullAddress || this.state.formData.addressLine1.value,
    };

    // if (
    //   this.state.formData &&
    //   this.state.formData.addressLine2 &&
    //   this.state.formData.addressLine2.value
    // ) {
    //   reqObject["line1"] = this.state.formData.addressLine2.value;
    // }

    if (type == 1) {
      // console.log("address type", type, reqObject);
      reqObject["addressId"] = this.props.selectedEditAddress._id;
      updateAddress(reqObject)
        .then((data) => {
          this.props.getAddress();

          setTimeout(() => {
            stopLoader();
            Toast("Address Updated", "success");
            this.handleBack();
          }, 500);
        })
        .catch((e) => {
          stopLoader();
          console.error("update error", e);
          Toast(e?.response?.data?.message, "error");
        });
    } else {
      address(reqObject)
        .then((data) => {
          this.props.getAddress();

          setTimeout(() => {
            stopLoader();
            Toast("Address Added", "success");
            this.handleBack();
          }, 500);
        })
        .catch((e) => {
          stopLoader();
          Toast(e?.response?.data?.message, "error");
        });
    }
  };

  handleBack = () => {
    this.props.close && this.props.close();
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.selectedEditAddress !== this.props.selectedEditAddress) {
      let stateObject = { ...this.state };
      if (this.props.selectedEditAddress.city) {
        stateObject.formData.city.errorr = false;
        stateObject.formData.city.value = this.props.selectedEditAddress.city;
      }
      // if (this.props.selectedEditAddress.area) {
      //   stateObject.formData.area.errorr = false;
      //   stateObject.formData.area.value = this.props.selectedEditAddress.area;
      // }
      // if (this.props.selectedEditAddress.area) {
      //   stateObject.formData.addressLine2.errorr = false;
      //   stateObject.formData.addressLine2.value = this.props.selectedEditAddress.area;
      // }
      if (this.props.selectedEditAddress.state) {
        stateObject.formData.state.errorr = false;
        stateObject.formData.state.value = this.props.selectedEditAddress.state;
      }
      if (this.props.selectedEditAddress.country) {
        stateObject.formData.country.errorr = false;
        stateObject.formData.country.value =
          this.props.selectedEditAddress.country;
      }

      if (this.props.selectedEditAddress.zipCode) {
        stateObject.formData.pincode.errorr = false;
        stateObject.formData.pincode.value =
          this.props.selectedEditAddress.zipCode;
      }
      if (this.props.selectedEditAddress.address) {
        stateObject.fullAddress = this.props.selectedEditAddress.address;
        stateObject.formData.address.value =
          this.props.selectedEditAddress.address;
        stateObject.formData.address.errorr = false;
      }
      stateObject.center.lat = this.props.selectedEditAddress.latitude;
      stateObject.center.long = this.props.selectedEditAddress.longitude;

      this.setState({
        stateObject,
      });
    }
  };

  handleUpdateMapData = (data) => {
    let stateObject = { ...this.state };
    stateObject.formData.address.value = data.address;
    // stateObject.formData.street.value = data.street;
    // stateObject.formData.addressLine1.value = data.addressLine1 || data.area;
    // stateObject.formData.addressLine2.value = data.area || data.addressLine2 || "";
    // stateObject.formData.area.value = data.area;
    stateObject.formData.city.value = data.city;
    stateObject.formData.state.value = data.state;
    stateObject.formData.country.value = data.country;
    stateObject.formData.pincode.value = data.postalCode;
    stateObject.center.lat = data.lat;
    stateObject.center.long = data.lng;
    stateObject.fullAddress = data.address;
    this.setState({
      stateObject,
    });
  };

  render() {
    const { mobileView, editAddress, theme, langCode = "en" } = this.props;
    const lang = LanguageSet[langCode];
    // console.log("address /////",this.props.selectedEditAddress);

    return (
      <Wrapper>
        <Head>
          <script src={`https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}&libraries=places`} />
        </Head>
        {!mobileView && (
          <button
            type="button"
            className="close dv__modal_close"
            data-dismiss="modal"
            onClick={() => this.props.close()}
          >
            {lang.btnX}
          </button>
        )}
        <div
          className={
            mobileView ? "drawerBgCss h-100" : "col-12 pt-3 text-center"
          }
        >
          {mobileView ? (
            <Header
              title={editAddress ? lang.editAddress : lang.addAddress}
              Data={editAddress ? lang.editAddress : lang.addAddress}
              back={() => {
                this.handleBack();
              }}
              right={() => {
                return (
                  <div
                    className={`txtPrm ${!this.validate() ? "disabled-button" : ""
                      }`}
                    onClick={() => {
                      {
                        !this.validate() ? "" : this.props.editAddress
                          ? this.addAddress(1)
                          : this.addAddress();
                      }
                    }}
                  >
                    {this.props.editAddress ? "Update" : "Save"}
                  </div>
                );
              }}
            />
          ) : (
            <h5 className="dialogTextColor px-1 py-3 m-0">
              {editAddress ? lang.editAddress : lang.addAddress}
            </h5>
          )}
          <div
            className="col-12 px-0"
            style={mobileView
              ? { paddingTop: "70px" }
              : {}
            }
          >
            {/* <Map
              center={{
                lat: parseFloat(this.state.center.lat),
                lng: parseFloat(this.state.center.long),
              }}
              draggable={true}
              height={mobileView ? "230px" : "200px"}
              zoom={15}
              handleSetMyLocation={this.props.handleSetMyLocation}
              updateMapData={this.handleUpdateMapData}
            /> */}

            {/* <div className="col-12">
              <LocationAutocomplete
                placeholder=" "
                mobileView={mobileView}
                {...this.state.formData.address}
                handlerChange={this.handlerChange}
                onChange={this.changeInput}
                locationData={this.locationData}
              />
            </div> */}

            {/* Removed Address Line 2 on 9th March 2021 */}

            {/* <div className="col-12">
                    <InputField
                      {...this.state.formData.street}
                      autoComplete="off"
                      onChange={this.changeInput}
                      className={
                        mobileView
                          ? ""
                          : "dv__border_bottom_profile_input"
                      }
                    />
                  </div> */}

            <div className="col-12">
              <InputField
                {...this.state.formData.addressLine1}
                autoComplete="off"
                onChange={this.changeInput}
                style={{ display: "inline-block", whiteSpace: "nowrap", textOverflow: "ellipsis", paddingRight: "15px" }}
                className={
                  mobileView
                    ? "text-capitalize"
                    : "dv__border_bottom_profile_input"
                }
              />
            </div>

            {/* <div className="col-12">
                    <InputField
                      {...this.state.formData.addressLine2}
                      autoComplete="off"
                      onChange={this.changeInput}
                      className={
                        mobileView
                          ? ""
                          : "dv__border_bottom_profile_input"
                      }
                    />
                  </div> */}
            {/* <div className="col-12">
                    <InputField
                      {...this.state.formData.area}
                      onChange={this.changeInput}
                      className={
                        mobileView ? "" : "dv__border_bottom_profile_input"
                      }
                    />
                  </div> */}

            {!mobileView ?
              <div className="row px-3">
                <div className="col-6">
                  <InputField
                    {...this.state.formData.city}
                    onChange={(e) => this.changeInput(e, "city")}
                    className={
                      mobileView ? "text-capitalize" : "dv__border_bottom_profile_input text-capitalize"
                    }
                  />
                </div>

                <div className="col-6">
                  <InputField
                    {...this.state.formData.state}
                    onChange={this.changeInput}
                    className={
                      mobileView ? "text-capitalize" : "dv__border_bottom_profile_input text-capitalize"
                    }
                  />
                </div>

                <div className="col-6">
                  <InputField
                    {...this.state.formData.country}
                    onChange={this.changeInput}
                    className={
                      mobileView ? "text-capitalize" : "dv__border_bottom_profile_input text-capitalize"
                    }
                  />
                </div>
                <div className="col-6">
                  <InputField
                    {...this.state.formData.pincode}
                    onChange={(e) => this.changeInput(e, "pincode")}
                    className={
                      mobileView ? "" : "dv__border_bottom_profile_input"
                    }
                  />
                </div>
              </div>
              :
              <div>
                <div className="col-12">
                  <InputField
                    {...this.state.formData.city}
                    onChange={(e) => this.changeInput(e, "city")}
                    className={
                      mobileView ? "text-capitalize" : "dv__border_bottom_profile_input text-capitalize"
                    }
                  />
                </div>

                <div className="col-12">
                  <InputField
                    {...this.state.formData.state}
                    onChange={this.changeInput}
                    className={
                      mobileView ? "text-capitalize" : "dv__border_bottom_profile_input text-capitalize"
                    }
                  />
                </div>
                <div className="col-12">
                  <InputField
                    {...this.state.formData.country}
                    onChange={this.changeInput}
                    className={
                      mobileView ? "text-capitalize" : "dv__border_bottom_profile_input text-capitalize"
                    }
                  />
                </div>
                <div className="col-12">
                  <InputField
                    {...this.state.formData.pincode}
                    onChange={(e) => this.changeInput(e, "pincode")}
                    className={
                      mobileView ? "" : "dv__border_bottom_profile_input"
                    }
                  />
                </div>
              </div>}


            {/* Tester want to have Save/Update Address Button on Header Itself.
                  So, Below code commented on 5th April by Bhavleen     */}
            {!mobileView && (
              <div className="col-11 py-4 mx-auto">
                {this.props.editAddress ? (
                  <Button
                    type="button"
                    cssStyles={
                      !this.validate()
                        ? theme.greyBorderButton
                        : theme.dv_blueButton
                    }
                    data-dismiss="modal"
                    data-toggle="modal"
                    onClick={() => {
                      this.addAddress(1);
                    }}
                    disabled={!this.validate()}
                  >
                    {"Update"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    cssStyles={
                      !this.validate()
                        ? theme.greyBorderButton
                        : theme.dv_blueButton
                    }
                    onClick={() => {
                      this.addAddress();
                    }}
                    disabled={!this.validate()}
                  >
                    {"Save"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        <style jsx>
          {`
                  :global(.MuiDrawer-paper) {
                    width: 100% !important;
                    max-width: 100% !important;
                    color: inherit;
                    overflow-y: auto !important;
                  }
                  :global(.MuiDrawer-paper > div) {
                    width: 100% !important;
                    max-width: 100% !important;
                  }
                  .addCardSec {
                    height: 89.7vh;
                  }
                `}
        </style>
      </Wrapper>
    );
  }
}
const mapStateToProps = (store) => {
  return {
    langCode: store?.language,
  };
};

export default connect(mapStateToProps)(AddAddress);
