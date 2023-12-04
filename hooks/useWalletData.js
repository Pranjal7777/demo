import { useSelector } from "react-redux";

const useWalletData = () => {
  const walletList = useSelector((state) => state.wallet);
  return [walletList];
};

export const useUserWalletBalance = () => {
  const getWalletBalance = useSelector((state) => Number(state?.wallet?.walletData?.[0]?.balance) || 0)
  return [getWalletBalance]
}

export default useWalletData;
