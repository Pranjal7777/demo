import find from "lodash/find";
import dynamic from "next/dynamic";
import Head from 'next/head';
import React, { useEffect, useState } from "react";
import Geocode from "react-geocode";
import { useDispatch } from "react-redux";
import CustomDataLoader from "../loader/custom-data-loading";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import useAddressData from "../../hooks/useAddressList";
import * as env from "../../lib/config";
import { deleteAddress, getAddress } from "../../redux/actions/address";
import { setDefault } from "../../services/address";
import {
  backNavMenu,
  close_dialog,
  close_drawer,
  getGeoLocation,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import Wrapper from "../../hoc/Wrapper";
const Header = dynamic(() => import("../header/header"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
const AddAddress = dynamic(() => import("./AddAddress"), { ssr: false });
const AddressTile = dynamic(() => import("./AddressTile"), { ssr: false });
const DeleteCardConfirm = dynamic(() => import("./DeleteCardConfirm"), {
  ssr: false,
});
const Drawer = dynamic(() => import("./Drawer"), { ssr: false });
Geocode.setApiKey(env.MAP_KEY);
import { useTheme } from "react-jss";
const Button = dynamic(() => import("../button/button"), { ssr: false });

export default function AddressList(props) {
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
  const [showLoader, setShowLoader] = useState(false);


  useEffect(() => {
    if (!mobileView) {
      setShowLoader(true);
      setTimeout(() => {
        setShowLoader(false);
      }, 1000);
    }
  }, [])

  useEffect(() => {
    props.homePageref && props.homePageref.current.scrollTo(0, 0);
    if (radio && !selectAddress) {
      const addressId =
        (address &&
          address.length > 0 &&
          address.filter((data) => {
            return data.isDefault;
          })?.[0]?._id) ||
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
      ? open_drawer(
        "addAddress",
        {
          getAddress: handleGetAddress,
          mobileView: mobileView,
          selectedEditAddress: addressData,
          editAddress: false,
          handleSetMyLocation: handleSetMyLocation,
          theme: theme,
          close: () => close_drawer("addAddress"),
        },
        "right"
      )
      : open_dialog("addAddress", {
        getAddress: props.getAddress,
        mobileView: mobileView,
        selectedEditAddress: addressData,
        editAddress: false,
        handleSetMyLocation: handleSetMyLocation,
        theme: theme,
        close: () => close_dialog("addAddress"),
      });
  };

  const handleSetMyLocation = async () => {
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
    //   Toast("can't delete default address", "error");
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
      ? open_drawer(
        "addAddress",
        {
          getAddress: handleGetAddress,
          mobileView: mobileView,
          selectedEditAddress: data,
          editAddress: true,
          handleSetMyLocation: handleSetMyLocation,
          theme: theme,
          close: () => close_drawer("addAddress"),
        },
        "right"
      )
      : open_dialog("addAddress", {
        getAddress: props.getAddress,
        mobileView: mobileView,
        selectedEditAddress: data,
        editAddress: true,
        handleSetMyLocation: handleSetMyLocation,
        theme: theme,
        close: () => close_dialog("addAddress"),
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
        handleGetAddress();
        stopLoader();
      }
    } catch (e) {
      stopLoader();
      console.error(e);
      // Toast(e.response.data.message, "error");
    }
  };
  const handleGetAddress = () => {
    dispatch(getAddress({ loader: true }));
  };

  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

  // console.log("wjdi", props);
  return (
    <Wrapper>
      <Head>
        <script src={`https://maps.googleapis.com/maps/api/js?key=${env.MAP_KEY}&libraries=places`} />
      </Head>
      {mobileView || props.profileView ? (
        <>
          <div
            className={
              props.profileView
                ? "d-flex justify-content-between align-items-center myAccount_sticky__section_header"
                : "d-flex flex-column "
            }
          >
            <div className="col-auto">
              {props.profileView ? (
                <h5 className="content_heading px-1 m-0">
                  {lang.manageAddress}
                </h5>
              ) : (
                <Header
                    title={lang.manageAddress}
                  back={() => {
                    backNavMenu(props);
                  }}
                />
              )}
            </div>

            <div
              className={props.profileView ? "col-4" : "col-12 card_bg"}
              style={props.profileView ? {} : { paddingTop: "80px" }}
            >
              <Button
                type="button"
                // cssStyles={props.profileView ? "" : theme.blueButton}
                cssStyles={theme.blueBorderButton}
                onClick={() => {
                  handleAddAddress();
                }}
              >
                {lang.addAddress}
              </Button>
            </div>
          </div>

          <div
            className={
              props.profileView
                ? "overflow-auto pt-3 pt-md-5 pt-lg-3"
                : " drawerBgCss pt-3 dynamicHeight"
            }
          >
            {address && address.length ? (
              <div className="col-12" style={{ height: "100vh" }}>
                <div className={props.profileView ? "d-flex flex-wrap justify-content-between" : "mobOverHandle"}>
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
              <>
                {!showLoader && <div className=" d-flex align-items-center justify-content-center" style={{ height: "50vh" }}>
                  <div className="text-center">
                    <Img src={env.No_Address} alt="no address" />
                    <p
                      className={`m-0 mt-3 ${!mobileView && "text-app dv__fnt20 font-weight-bold"
                        }`}
                    >
                      {lang.noAddressFound}
                    </p>
                  </div>
                </div>}

              </>

            )}
            {showLoader && !mobileView ? (
              <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
                <CustomDataLoader type="ClipLoader" loading={true} size={60} />
              </div>
            ) : ""}
          </div>

          {props.profileView
            ? ""
            : radio &&
              <div
                className="py-4 px-3 pb-4"
              >
                <Button
                  className="posBtm confirmButton mv_border_radius border-0"
                  // disabled={!selectAddress}
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
                      : open_drawer(
                        "checkout",
                        {
                          // amount: props.amount,
                          checkoutProps: props.checkoutProps || {},
                          selectAddress: selectAddress, // note: note,
                          checkout: props.checkout,
                          address: address,
                          handlePurchase: props.handlePurchase,
                          applyOn: props.applyOn,
                          title: props.title,
                          desc: props.desc,
                          price: props.price,
                          isApplyPromo: props.isApplyPromo,
                          creatorId: props.creatorId,
                          subscriptionPlanId: props.subscriptionPlanId
                        },
                        "right"
                      );
                    // handleAddAddress();
                  }}
                >
                  {address && address.length ? lang.confirm : lang.skip}
                </Button>
              </div>

          }

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
        </>
      ) : (
        <div className="py-3 px-5" style={{ backgroundColor: 'var(--l_upload_bg)' }}>
          <div className="text-center pb-3">
            <h5 className="txt-black dv__fnt34" style={{ maxWidth: 'unset' }}>{lang.selectBillingAddress}</h5>
          </div>

          <button
            type="button"
            className="close dv_modal_close"
            data-dismiss="modal"
            onClick={() => close_dialog("Address")}
          >
            {lang.btnX}
          </button>

          {address && (
            <Button
              type="button"
              fclassname="mb-2"
              cssStyles={theme.blueBorderButton}
              onClick={() => {
                handleAddAddress();
              }}
            >
              {lang.addAddress}
            </Button>
          )}

          <div className="overflow-auto pt-3">
            {address && address.length ? (
              <div className="col-12">
                <div className="d-flex flex-wrap justify-content-center">
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
            ) : (
              <div className="h-50 d-flex align-items-center justify-content-center mb-3">
                <div className="text-center">
                  <Img src={env.No_Address} alt="no address" />
                  <p className="m-0 mt-3 font-weight-bold">
                    {lang.noAddressFound}
                  </p>
                </div>
              </div>
            )}
          </div>

          {!address && (
            <Button
              type="button"
              cssStyles={theme.blueButton}
              onClick={() => {
                handleAddAddress();
              }}
            >
              {lang.addAddress}
            </Button>
          )}

            <div className="my-4">
              <Button
                // disabled={!selectAddress}
                type="button"
                cssStyles={theme.blueButton}
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
                          address: address,
                          handlePurchase: props.handlePurchase,
                          applyOn: props.applyOn,
                          title: props.title,
                          desc: props.desc,
                          price: props.price,
                          isApplyPromo: props.isApplyPromo,
                          creatorId: props.creatorId,
                          subscriptionPlanId: props.subscriptionPlanId
                        },
                        "right"
                      )
                      : open_dialog("checkout", {
                        checkoutProps: props.checkoutProps || {},
                        selectAddress: selectAddress,
                        checkout: props.checkout,
                        address: address,
                        handlePurchase: props.handlePurchase,
                        applyOn: props.applyOn,
                        title: props.title,
                        desc: props.desc,
                        price: props.price,
                        isApplyPromo: props.isApplyPromo,
                        creatorId: props.creatorId,
                        subscriptionPlanId: props.subscriptionPlanId
                      });
                }}
              >
                {address && radio && selectAddress ? lang.confirm : lang.skip}
              </Button>
            </div>


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
        </div>
      )}

      <style jsx>
        {`
        .mobOverHandle {
          overflow-y: auto;
          height: 68%!important;
        }
          :global(.MuiDrawer-paper) {
            color: inherit;
            // background-color: ${mobileView ? "#242a37" : "#ffffff"};
          }
          :global(.confirmButton) {
            height: 40px;
            background: ${theme.appColor};
          }
          .dv_modal_close{
            color: var(--l_app_text);
          }
          .dynamicHeight {
						height: calc(var(--vhCustom, 1vh) * 100) !important;
					  }
        `}
      </style>
    </Wrapper>
  );
}
