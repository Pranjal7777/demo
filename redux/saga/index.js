/* eslint-disable require-jsdoc */
import { takeEvery, all } from "redux-saga/effects";

import * as actionTypes from "../actions/actionTypes";
import { deleteAddressSaga, getAddressSaga } from "./address/address";

import { serverLogin } from "./saga";
import { getUserCard } from "./cards/cards";
import { getWalletData } from "./wallet/wallet";
import chatSaga from "./chat/chatRoot";
import liveStreamSaga from "./liveStream/liveStreamRoot";
import dashboardRootSaga from "./dashboard/dashboardSaga";
import videoCallSaga from "./videoCall/videoCallRoot";

export function* watchAuth() {
  yield takeEvery(actionTypes.DEMO_ACTION_TYPE, serverLogin);
}

export function* getCardList() {
  yield takeEvery(actionTypes.GET_CARDS, getUserCard);
}

export function* getAddressList() {
  yield takeEvery(actionTypes.GETADDRESS, getAddressSaga);
}

export function* deleteAddress() {
  yield takeEvery(actionTypes.DELETE_ADDRESS, deleteAddressSaga);
}

export function* getWallet() {
  yield takeEvery(actionTypes.GET_WALLETS, getWalletData);
}

export function* rootSaga() {
  yield all([
    watchAuth(),
    getCardList(),
    getAddressList(),
    deleteAddress(),
    getWallet(),
    ...chatSaga(),
    ...liveStreamSaga(),
    ...videoCallSaga(),
    ...dashboardRootSaga()
  ]);
}
