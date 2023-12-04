import { put } from "redux-saga/effects";
import { startLoader, stopLoader } from "../../../lib/global/loader";
import { getCookie } from "../../../lib/session";
import { getAddresService, deleteAddress } from "../../../services/address";
import { addressSuccess, getAddress } from "../../actions/address";

export function* getAddressSaga({ payload }) {

  const loader = payload.loader;
  loader && startLoader();
  try {
    let userId = getCookie("uid");
    let address = yield getAddresService(userId);
    let addressData = address.data.data;
    const getDefaultAddress = (address) => {
      return address.find(address => address.isDefault === true)
    }
    // console.log("get location", addressData);
    yield put(addressSuccess(addressData));
    yield put({
      status: 200,
      defaultAddress: getDefaultAddress(address)
    })
    loader && stopLoader();
  } catch (ex) {
    loader && stopLoader();

    // console.log("GET Address  SAGA -->", ex);
  }
}

export function* deleteAddressSaga({ payload }) {
  try {
    let x = yield deleteAddress(payload.id);
    // console.log("delete location", x);

    yield put(getAddress());
  } catch (ex) {
    console.error("delete address  SAGA -->", ex);
  }
}
