import { getUserWallet } from "../../../services/payments";
import { getCards, getWallet, getWalletSuccess } from "../../actions/index";
import { put } from "redux-saga/effects";
import { handleCreateWallet } from "../../../lib/global/handleCreateWallet";
import { getNotificationCount } from "../../actions/chat/action";
import { notificationUnreadCount } from "../../../services/notification";

export function* getWalletData() {
  try {
    let response = yield getUserWallet();
    // console.log("response-->", response);
    if (
      response &&
      response.data &&
      response.data.data &&
      response.data.data.walletData &&
      response.data.data.walletData.length == 0
    ) {
      handleCreateWallet();
      put(getWallet());
      let response = yield getUserWallet();
      yield put(
        getWalletSuccess({
          status: 200,
          wallet: response.data.data,
        })
      );
    } else {
      yield put(
        getWalletSuccess({
          status: 200,
          wallet: response.data.data,
        })
      );
    }

    yield put(getCards());
    yield put(getAddress());

    let res = yield notificationUnreadCount();

    put(getNotificationCount(res?.data?.unreadCount))

  } catch (e) {
    // console.log("response", e, e.response);
    if (e.response) {
      getWalletSuccess({
        status: e.response.status,
        wallet: {},
      });
    }
  }
}
