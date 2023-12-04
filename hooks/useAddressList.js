import { useSelector } from "react-redux";

const useAddressData = () => {
  const address = useSelector((state) => state.address);
  return [address];
};
export default useAddressData;
