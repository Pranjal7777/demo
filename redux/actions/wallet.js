import * as actionTypes from "./actionTypes";

export const getWallet = (data) => {
  return {
    type: actionTypes.GET_WALLETS,
    payload: data,
  };
};

export const getWalletSuccess = (data) => {
  return {
    type: actionTypes.GET_WALLET_SUCCESS,
    payload: data,
  };
};

export const rechargeSuccess = (AddedCoins) => {
  return {
    type: actionTypes.RECHARGE_SUCCESS,
    payload: AddedCoins,
  };
};

export const purchaseSuccessFromWallet = (AddedCoins) => {
  return {
    type: actionTypes.PURCHASE_SUCCESS_FROM_WALLET,
    payload: AddedCoins,
  };
};
