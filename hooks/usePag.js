import { useSelector } from "react-redux";

const usePg = () => {
  const paymentGetway = useSelector((state) => state.paymentGetway);
  return [paymentGetway];
};
export default usePg;
